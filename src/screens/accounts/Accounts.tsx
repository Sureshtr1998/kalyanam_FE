import { useCallback, useState } from "react";
import { Ban, Copy, EyeOff, Heart, LogOut, Sparkles, Trash2, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from "@/components/misc/SEO";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/common/PageHeader";
import { BlockingLoader } from "@/components/common/Loaders";
import { useUser } from "@/context/UserContext";
import { useCheckout, type PaidOrder } from "@/hooks/useCheckout";
import api from "@/utils/api";
import { INTEREST_PACKS } from "@/utils/constants";
import type { TransactionsIn } from "@/utils/interfaces";
import { formatInstant } from "@/lib/dates";
import { errorMessage } from "@/lib/errors";
import { signOut } from "@/lib/session";
import { cn } from "@/lib/utils";

const inr = (n?: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n ?? 0);

const CopyId = ({ value }: { value?: string }) =>
  value ? (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        toast.success("Copied");
      }}
      className="inline-flex max-w-full items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary"
      title="Copy">
      <span className="truncate">{value}</span>
      <Copy className="size-3 shrink-0" />
    </button>
  ) : (
    <span className="text-xs text-muted-foreground">-</span>
  );

const Accounts = () => {
  const { user, setUser, remaining } = useUser();
  const [applying, setApplying] = useState(false);
  const [pack, setPack] = useState<keyof typeof INTEREST_PACKS | null>(null);
  const [blockId, setBlockId] = useState("");
  const [blocking, setBlocking] = useState(false);

  const blockById = async () => {
    setBlocking(true);
    try {
      const res = await api.post<{ msg: string }>("/block-by-id", { uniqueId: blockId });
      toast.success("Blocked", { description: res.data.msg });
      setBlockId("");
    } catch (err) {
      toast.error("Couldn't block", { description: errorMessage(err) });
    } finally {
      setBlocking(false);
    }
  };

  const total = user.interests?.totalNoOfInterest ?? 0;
  const used = (user.interests?.sent?.length ?? 0) + (user.interests?.viewed?.length ?? 0) * 5;
  const transactions: TransactionsIn[] = user.transactions ?? [];

  const onPaid = useCallback(
    async (order: PaidOrder) => {
      setApplying(true);
      try {
        const res = await api.post("/buy-interest", order);
        setUser(res.data.profile);
        toast.success("Credits added", { description: "Thank you! Your new credits are ready to use." });
      } catch (err) {
        toast.error("Payment received, but we couldn't add credits yet", {
          description: `${errorMessage(err)}. They'll be added automatically within a few minutes. Payment ID: ${order.paymentId}`,
          duration: 15000,
        });
      } finally {
        setApplying(false);
        setPack(null);
      }
    },
    [setUser]
  );

  const { start, isStarting } = useCheckout({ description: "Interest pack", onPaid });

  const buy = async (key: keyof typeof INTEREST_PACKS) => {
    setPack(key);
    const ok = await start({ purpose: "interest", pack: key });
    if (!ok) setPack(null);
  };

  const hideProfile = async () => {
    try {
      const res = await api.post("/hide-profile");
      toast.success(res.data.msg || "Your profile is hidden");
      signOut();
    } catch (err) {
      toast.error("Couldn't hide profile", { description: errorMessage(err) });
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/delete-account");
      toast.success("Account deleted");
      signOut();
    } catch (err) {
      toast.error("Couldn't delete account", { description: errorMessage(err) });
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <SEO title="Account | Seetha Rama Kalyana" description="Your account." noindex />
      <BlockingLoader show={applying} message="Confirming your payment…" />
      <PageHeader title="Account" description="Your credits, payments and privacy settings." />

      {/* Balance */}
      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Available", value: remaining, accent: true },
          { label: "Used", value: used },
          { label: "Total", value: total },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border p-4 sm:p-5",
              s.accent ? "border-primary/20 bg-primary text-primary-foreground" : "border-border bg-card"
            )}>
            <p className={cn("text-xs font-semibold uppercase tracking-wide", s.accent ? "text-primary-foreground/75" : "text-muted-foreground")}>
              {s.label}
            </p>
            <p className="mt-1 font-display text-3xl font-bold sm:text-4xl">{s.value}</p>
            <p className={cn("text-xs", s.accent ? "text-primary-foreground/75" : "text-muted-foreground")}>credits</p>
          </div>
        ))}
      </div>

      {/* Packs */}
      <Card className="mb-6 border-gold/30">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Buy more credits</CardTitle>
          <CardDescription>
            1 credit sends one interest (contact is shared free if they accept). 5 credits show a contact straight away.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(INTEREST_PACKS) as (keyof typeof INTEREST_PACKS)[]).map((key) => {
            const p = INTEREST_PACKS[key];
            const best = key === "premium";
            return (
              <div
                key={key}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-5",
                  best ? "border-primary bg-gradient-to-br from-accent to-card shadow-md" : "border-border bg-card"
                )}>
                {best && (
                  <Badge className="absolute -top-2.5 right-4 bg-gold text-gold-foreground">Best value</Badge>
                )}
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  {best ? <Zap className="size-4 text-primary" /> : <Heart className="size-4 text-primary" />}
                  {p.title}
                </div>
                <p className="mt-2 font-display text-4xl font-bold">{inr(p.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {p.interests} credits · ≈ ₹{(p.amount / p.interests).toFixed(1)} each
                </p>
                <Button
                  className="mt-4"
                  variant={best ? "default" : "outline"}
                  disabled={isStarting || applying}
                  onClick={() => buy(key)}>
                  <Sparkles />
                  {isStarting && pack === key ? "Opening checkout…" : `Buy ${p.interests} credits`}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Payment history</CardTitle>
          <CardDescription>Keep your payment ID handy if you contact support.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t, i) => (
                      <TableRow key={t.orderId ?? i}>
                        <TableCell className="whitespace-nowrap">{formatInstant(t.dateOfTrans)}</TableCell>
                        <TableCell className="font-medium">{t.note?.replace("Astro_", "Astrology · ")}</TableCell>
                        <TableCell className="font-semibold">{inr(t.amountPaid)}</TableCell>
                        <TableCell>{t.noOfInterest ? `+${t.noOfInterest}` : "-"}</TableCell>
                        <TableCell className="max-w-40"><CopyId value={t.paymentId} /></TableCell>
                        <TableCell className="max-w-40"><CopyId value={t.orderId} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ul className="space-y-3 md:hidden">
                {transactions.map((t, i) => (
                  <li key={t.orderId ?? i} className="rounded-xl border border-border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{t.note?.replace("Astro_", "Astrology · ")}</p>
                        <p className="text-xs text-muted-foreground">{formatInstant(t.dateOfTrans)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{inr(t.amountPaid)}</p>
                        {t.noOfInterest ? <p className="text-xs text-success">+{t.noOfInterest} credits</p> : null}
                      </div>
                    </div>
                    <div className="mt-2 grid gap-1">
                      <CopyId value={t.paymentId} />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Ban className="size-5 text-primary" /> Block someone you know
          </CardTitle>
          <CardDescription>
            Don't want a relative, colleague or someone else to see your profile? Enter their Profile ID. Blocking
            works both ways: they won't be able to find or view your profile, and you won't see theirs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              void blockById();
            }}>
            <Input
              value={blockId}
              onChange={(e) => setBlockId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))}
              placeholder="Profile ID, e.g. SRK7Q2"
              className="h-10 font-mono uppercase sm:max-w-60"
              aria-label="Profile ID to block"
            />
            <Button type="submit" variant="outline" disabled={blockId.length < 4 || blocking}>
              <Ban />
              {blocking ? "Blocking…" : "Block"}
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">Manage blocked members under Activity, Blocked.</p>
        </CardContent>
      </Card>

      {/* Privacy & danger zone */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <EyeOff className="size-5 text-primary" /> Take a break
            </CardTitle>
            <CardDescription>
              Hide your profile from everyone and sign out. It becomes visible again the next time you log in.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <EyeOff />
                  Hide my profile
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hide your profile?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Nobody will see you in their matches and you'll be signed out. Logging in again makes your
                    profile visible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={hideProfile}>Hide & sign out</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="ghost" onClick={signOut}>
              <LogOut />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Trash2 className="size-5" /> Delete account
            </CardTitle>
            <CardDescription>
              Permanently removes your profile, photos and history. Payments are not refundable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 />
                  Delete permanently
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete your account forever?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This cannot be undone. Your profile, photos, interests and remaining credits will be erased.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep my account</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={deleteAccount}>
                    Yes, delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Accounts;
