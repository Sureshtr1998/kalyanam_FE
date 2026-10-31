import { useCallback, useEffect, useState } from "react";
import { Clock, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/misc/SEO";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MemberManager } from "@/components/staff/MemberManager";
import { SignupBars, Stat } from "@/components/staff/StaffStats";
import { inr, type Summary } from "@/components/staff/staffTypes";
import api from "@/utils/api";
import { REFERRAL_REGISTRATION_FEE, REGISTRATION_FEE } from "@/utils/constants";
import { errorMessage } from "@/lib/errors";

/** A partner's home: their referral ID, commission and the members they brought in. */
const PartnerDashboard = () => {
  const [summary, setSummary] = useState<Summary | null>(null);

  const load = useCallback(() => {
    api
      .get<Summary>("/manage/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => toast.error("Couldn't load your dashboard", { description: errorMessage(err) }));
  }, []);
  useEffect(load, [load]);

  const code = summary?.broker?.referralId;
  const shareText = code
    ? `Register on Seetha Rama Kalyana with my referral ID ${code} and pay ₹${REFERRAL_REGISTRATION_FEE} instead of ₹${REGISTRATION_FEE}: ${window.location.origin}`
    : "";

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "Seetha Rama Kalyana", text: shareText });
      else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Invite message copied");
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <SEO title="Partner dashboard | Seetha Rama Kalyana" description="Partner dashboard." noindex />
      <PageHeader
        title={summary?.broker ? `Namaste, ${summary.broker.name.split(" ")[0]}` : "Partner dashboard"}
        description="Members who registered with your referral ID, and what you've earned."
      />

      {!summary ? (
        <Skeleton className="h-64 w-full rounded-3xl" />
      ) : !code ? (
        <Alert className="mb-6 border-gold/50 bg-accent">
          <Clock />
          <AlertTitle>Your account is awaiting approval</AlertTitle>
          <AlertDescription>
            Our team verifies every partner within 24–48 hours. Once approved, your referral ID appears here and members
            who use it are listed below.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-gold/30 bg-gradient-to-r from-primary/10 via-accent to-gold/20 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your referral ID</p>
              <p className="font-mono text-4xl font-bold tracking-wider text-primary">{code}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Members pay {inr(REFERRAL_REGISTRATION_FEE)} instead of {inr(REGISTRATION_FEE)}; you earn{" "}
                {inr(summary.commission.perMember)} for each.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  void navigator.clipboard.writeText(code);
                  toast.success("Referral ID copied");
                }}>
                <Copy /> Copy ID
              </Button>
              <Button onClick={() => void share()}>
                <Share2 /> Share invite
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {/* Commission counts everyone who registered with the code, even members removed from the list. */}
            <Stat
              label="Members referred"
              value={summary.commission.referred}
              hint={
                summary.commission.referred !== summary.members.total
                  ? `${summary.members.total} on your list · ${summary.members.new30} in the last 30 days`
                  : `${summary.members.new30} in the last 30 days`
              }
              accent
            />
            <Stat label="Earned" value={inr(summary.commission.earned)} hint={`${inr(summary.commission.perMember)} per member`} />
            <Stat label="Paid to you" value={inr(summary.commission.paid)} />
            <Stat label="Due to you" value={inr(summary.commission.due)} hint="Paid out by our team" />
            <Stat label="Complete profiles" value={summary.members.complete} hint={`${summary.members.incomplete} still incomplete`} />
            <Stat label="Verified" value={summary.members.verified} hint={`${summary.members.total - summary.members.verified} not verified`} />
            <Stat label="Active this week" value={summary.members.active7} />
            <Stat label="Hidden" value={summary.members.hidden} />
          </div>
          <SignupBars signups={summary.signups} />
        </div>
      )}

      {code && (
        <section>
          <h2 className="mb-3 font-display text-2xl font-bold">Your members</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Tap a member to verify them, hide or show their profile, or update their details. You can't delete accounts,
            but you can remove a member from your list.
          </p>
          <MemberManager kind="broker" onChanged={load} />
        </section>
      )}
    </div>
  );
};

export default PartnerDashboard;
