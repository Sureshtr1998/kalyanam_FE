import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, EyeOff, HeartHandshake, RefreshCw, Sparkles, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BlockingLoader } from "@/components/common/Loaders";
import { useUser } from "@/context/UserContext";
import { useCheckout, type PaidOrder } from "@/hooks/useCheckout";
import { formatDay, needsRenewal, refreshMembership, useMembership, type Membership } from "@/hooks/useMembership";
import api from "@/utils/api";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";

/** Starts a renewal: Razorpay when there's a fee, straight through when it's free. */
const useRenew = () => {
  const { setUser, refresh } = useUser();
  const [applying, setApplying] = useState(false);

  const onPaid = useCallback(
    async (order: PaidOrder) => {
      setApplying(true);
      try {
        const res = await api.post("/renew-membership", order);
        setUser(res.data.profile);
        await refreshMembership(true);
        toast.success("Membership renewed", { description: "Thank you! Your profile is active for another year." });
      } catch (err) {
        toast.error("Payment received, but we couldn't renew yet", {
          description: `${errorMessage(err)}. It will be applied automatically within a few minutes. Payment ID: ${order.paymentId}`,
          duration: 15000,
        });
      } finally {
        setApplying(false);
      }
    },
    [setUser]
  );

  const { start, isStarting } = useCheckout({ description: "Membership renewal", onPaid });

  const renew = async (m: Membership) => {
    if (m.renewalFee > 0) return void start({ purpose: "renewal" });
    setApplying(true);
    try {
      await api.post("/membership/renew-free");
      await Promise.all([refreshMembership(true), refresh()]);
      toast.success("Membership renewed", { description: "Your profile is active for another year." });
    } catch (err) {
      toast.error("Couldn't renew", { description: errorMessage(err) });
    } finally {
      setApplying(false);
    }
  };

  return { renew, busy: isStarting || applying, applying };
};

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many);

const renewLabel = (m: Membership) =>
  m.renewalFee > 0 ? `Renew for ₹${m.renewalFee}` : "Renew free";

const STAGE_TEXT: Record<"renewal" | "grace" | "paused", (m: Membership) => string> = {
  renewal: (m) =>
    `Your membership ends on ${formatDay(m.endsAt)}${m.daysLeft > 1 ? ` (${m.daysLeft} days left)` : ""}. Renew now and your new year starts from that date, so you lose no days.`,
  grace: (m) =>
    `Your membership ended on ${formatDay(m.endsAt)}. Your profile stays visible until ${formatDay(m.graceEndsAt)}, and you can still reply to interests you received. Renew to send interests again.`,
  paused: () => "Your membership has ended, so your profile is hidden from everyone. Renew to show it again.",
};

/** Thin strip above every member page while renewal is due. */
export const MembershipBanner = () => {
  const m = useMembership();
  if (!m || !needsRenewal(m)) return null;
  const stage = m.stage as keyof typeof STAGE_TEXT;
  const urgent = stage !== "renewal";
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        urgent ? "border-destructive/30 bg-destructive/5" : "border-gold/40 bg-accent"
      )}>
      <p className="flex items-start gap-2 text-sm">
        <CalendarClock className={cn("mt-0.5 size-4 shrink-0", urgent ? "text-destructive" : "text-primary")} />
        {STAGE_TEXT[stage](m)}
      </p>
      <Button asChild size="sm" className="shrink-0">
        <Link to="/account#membership">
          <RefreshCw />
          Renew
        </Link>
      </Button>
    </div>
  );
};

/** Account page: end date, renewal, and what an ended membership is missing. */
export const MembershipCard = () => {
  const m = useMembership();
  const { renew, busy, applying } = useRenew();
  if (!m?.launched || m.stage === "closed") return null;

  const ended = m.stage === "grace" || m.stage === "paused";
  return (
    <Card id="membership" className={cn("mb-6 scroll-mt-24", ended ? "border-destructive/30" : "border-gold/30")}>
      <BlockingLoader show={applying} message="Renewing your membership…" />
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2 font-display text-2xl">
          Membership
          {m.stage === "active" && <Badge variant="secondary">Active</Badge>}
          {m.stage === "renewal" && <Badge className="bg-gold text-gold-foreground">Ending soon</Badge>}
          {m.stage === "grace" && <Badge variant="destructive">Ended</Badge>}
          {m.stage === "paused" && <Badge variant="destructive">Profile hidden</Badge>}
        </CardTitle>
        <CardDescription>
          {m.stage === "active"
            ? `Valid until ${formatDay(m.endsAt)}. Renewal opens 30 days before that.`
            : STAGE_TEXT[m.stage](m)}
        </CardDescription>
      </CardHeader>
      {m.canRenew && (
        <CardContent className="space-y-4">
          {ended && (m.newMatches || m.pendingInterests) ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="font-display text-3xl font-bold">{m.newMatches ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  {plural(m.newMatches ?? 0, "new match", "new matches")} joined since {formatDay(m.endsAt)}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="font-display text-3xl font-bold">{m.pendingInterests ?? 0}</p>
                <p className="text-xs text-muted-foreground">
                  {plural(m.pendingInterests ?? 0, "interest", "interests")} waiting for your reply
                </p>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled={busy} onClick={() => renew(m)}>
              <Sparkles />
              {busy ? "Please wait…" : renewLabel(m)}
            </Button>
            <p className="text-sm text-muted-foreground">
              12 more months{m.renewalInterests ? ` + ${m.renewalInterests} credits` : ""}. Unused credits carry over.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

/** Shown on Matches instead of the list when the member can't browse. */
export const MembershipPaused = ({ m }: { m: Membership }) => {
  const { renew, busy, applying } = useRenew();
  if (m.stage === "closed") {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Congratulations on your marriage!</CardTitle>
          <CardDescription>
            You closed your profile, so matches are switched off. Changed plans? Reopen it from Account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/account#marriage">Go to Account</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mx-auto max-w-xl text-center">
      <BlockingLoader show={applying} message="Renewing your membership…" />
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 font-display text-2xl">
          <EyeOff className="size-6 text-primary" /> Your profile is hidden
        </CardTitle>
        <CardDescription>
          Your membership ended on {formatDay(m.endsAt)}. Your profile, photos, interests and credits are all safe.
          Renew to show your profile again and continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {m.newMatches || m.pendingInterests ? (
          <p className="text-sm">
            {m.newMatches ? (
              <>
                <span className="font-bold text-primary">{m.newMatches}</span>{" "}
                {plural(m.newMatches, "new member who matches you has", "new members who match you have")} joined since
                then.{" "}
              </>
            ) : null}
            {m.pendingInterests ? (
              <>
                <span className="font-bold text-primary">{m.pendingInterests}</span>{" "}
                {plural(m.pendingInterests, "interest is", "interests are")} waiting for your reply under Activity.
              </>
            ) : null}
          </p>
        ) : null}
        <Button disabled={busy} onClick={() => renew(m)}>
          <Sparkles />
          {busy ? "Please wait…" : renewLabel(m)}
        </Button>
      </CardContent>
    </Card>
  );
};

/** Account page: "Marriage fixed" closes the profile; reopen undoes it. */
export const MarriageCard = () => {
  const m = useMembership();
  const { refresh } = useUser();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const closed = m?.stage === "closed";

  const act = async (path: "/membership/close" | "/membership/reopen") => {
    setBusy(true);
    try {
      const res = await api.post<{ msg: string }>(path, path === "/membership/close" ? { note } : {});
      toast.success(res.data.msg);
      await Promise.all([refreshMembership(true), refresh()]);
    } catch (err) {
      toast.error("Something went wrong", { description: errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  if (!m) return null;
  return (
    <Card id="marriage" className="scroll-mt-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartHandshake className="size-5 text-primary" /> {closed ? "Profile closed" : "Marriage fixed?"}
        </CardTitle>
        <CardDescription>
          {closed
            ? `You closed your profile on ${formatDay(m.marriedAt)}. It's hidden from everyone and we won't send renewal reminders. Plans changed? Reopen it any time.`
            : "Congratulations! Close your profile so nobody sends you new interests, and we'll stop all renewal reminders. You can reopen it any time."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {closed ? (
          <Button variant="outline" disabled={busy} onClick={() => act("/membership/reopen")}>
            <Undo2 />
            Reopen my profile
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={busy}>
                <HeartHandshake />
                Marriage fixed
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Close your profile?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your profile will be hidden from everyone and reminders stop. Nothing is deleted, and you can
                  reopen it from this page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 1000))}
                placeholder="Optional: did you meet through Seetha Rama Kalyana? We'd love to hear your story."
                rows={3}
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => act("/membership/close")}>Close my profile</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};
