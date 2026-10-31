import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Bookmark,
  Check,
  Copy,
  CircleHelp,
  Download,
  Heart,
  LoaderCircle,
  KeyRound,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PhotoGallery } from "./PhotoGallery";
import { AboutSections, ContactCard, FamilySection, PreferencesSection } from "./ProfileDetails";
import { optionLabel } from "@/utils/utils";
import { ProfileMoreMenu } from "./ProfileActions";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import type { UserDetails } from "@/utils/interfaces";
import { CONTACT_COST, INTEREST_COST, heightOptions, qualificationOptions } from "@/utils/constants";
import { ageFromFloating } from "@/lib/dates";
import { activityLabel, checkPreferences, matchScore, type PreferenceCheck } from "@/lib/matching";
import { errorMessage } from "@/lib/errors";
import { isBroker } from "@/lib/session";
import { cn } from "@/lib/utils";
import { downloadProfilePdf } from "@/lib/profilePdf";

interface Props {
  user: UserDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Contact is already visible (accepted interest / already unlocked). */
  contactUnlocked?: boolean;
  remaining?: number;
  /** Show "send interest" (fresh matches only). */
  canSendInterest?: boolean;
  /** The profile left the current list (interest sent, blocked, reported, unlocked). */
  onRemoved?: (id: string, usedInterests?: number) => void;
  onContactViewed?: () => void;
}

interface ActionButtonsProps {
  firstName: string;
  /** Desktop footer: options side by side instead of stacked. */
  horizontal?: boolean;
  canSendInterest?: boolean;
  contactUnlocked?: boolean;
  remaining: number;
  busy: boolean;
  onInterest: () => void;
  onUnlock: () => void;
}

const CostPill = ({ credits, inverted }: { credits: number; inverted?: boolean }) => (
  <span
    className={cn(
      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
      inverted ? "bg-primary-foreground/20 text-primary-foreground" : "bg-gold/20 text-gold-foreground"
    )}>
    {credits} credit{credits === 1 ? "" : "s"}
  </span>
);

const ConnectOption = ({
  icon,
  title,
  text,
  credits,
  primary,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  credits: number;
  primary?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    title={text}
    className={cn(
      "flex h-10 w-full items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
      primary
        ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
        : "border-gold/60 bg-card text-primary hover:border-gold hover:bg-accent"
    )}>
    {icon}
    <span className="truncate">{title}</span>
    <span className="ml-auto">
      <CostPill credits={credits} inverted={primary} />
    </span>
  </button>
);

/** Desktop: the two ways to connect, each with its cost and what happens next. */
const ConnectOptions = ({
  firstName,
  horizontal,
  canSendInterest,
  contactUnlocked,
  remaining,
  busy,
  onInterest,
  onUnlock,
}: ActionButtonsProps) => (
  <div className={cn(horizontal ? "flex min-w-0 flex-1 flex-wrap items-center gap-2 [&>button]:flex-1" : "space-y-2")}>
    {canSendInterest && (
      <ConnectOption
        primary
        icon={<Heart className="fill-current" />}
        title="Send interest"
        credits={INTEREST_COST}
        text={`Contact is shared free if ${firstName} accepts`}
        disabled={busy || remaining < INTEREST_COST}
        onClick={onInterest}
      />
    )}
    {canSendInterest && !contactUnlocked && (
      <div
        className={cn(
          "flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
          horizontal ? "justify-center" : "px-2"
        )}>
        {!horizontal && <span className="h-px flex-1 bg-border" />}
        or
        {!horizontal && <span className="h-px flex-1 bg-border" />}
      </div>
    )}
    {!contactUnlocked && (
      <ConnectOption
        icon={<KeyRound />}
        title="See contact now"
        credits={CONTACT_COST}
        text="See phone and email right away"
        disabled={busy || remaining < CONTACT_COST}
        onClick={onUnlock}
      />
    )}
    {!contactUnlocked && remaining < CONTACT_COST && (
      <p className={cn("px-1 text-xs text-muted-foreground", horizontal && "basis-full")}>
        You have {remaining} credit{remaining === 1 ? "" : "s"}.{" "}
        <Link to="/account" className="font-semibold text-primary hover:underline">
          Get more
        </Link>
      </p>
    )}
  </div>
);

/** Mobile bottom bar: compact buttons, each showing its cost. */
const ActionButtons = ({
  canSendInterest,
  contactUnlocked,
  remaining,
  busy,
  onInterest,
  onUnlock,
}: ActionButtonsProps) => (
  <div className="flex items-center gap-2">
    {canSendInterest && (
      <Button
        className="min-w-0 flex-1 gap-1.5 rounded-full px-2.5 has-[>svg]:px-2.5"
        disabled={busy || remaining < INTEREST_COST}
        onClick={onInterest}>
        <Heart className="fill-current" />
        <span className="truncate">Interest</span>
        <CostPill credits={INTEREST_COST} inverted />
      </Button>
    )}
    {!contactUnlocked && (
      <Button
        variant="outline"
        className="min-w-0 flex-1 gap-1.5 rounded-full border-gold/60 bg-card px-2.5 has-[>svg]:px-2.5"
        disabled={remaining < CONTACT_COST || busy}
        onClick={onUnlock}>
        <KeyRound />
        <span className="truncate">Contact</span>
        <CostPill credits={CONTACT_COST} />
      </Button>
    )}
  </div>
);

const RING_RADIUS = 52;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Desktop photo column: match ring under the photos, sized to never need scrolling. */
const MatchPanel = ({
  score,
  checks,
  firstName,
}: {
  score: number | null;
  checks: PreferenceCheck[];
  firstName: string;
}) => {
  const met = checks.filter((c) => c.ok === true).length;
  const missed = checks.filter((c) => c.ok === false).length;
  const unknown = checks.filter((c) => c.ok === null).length;

  return (
    <section className="hidden shrink-0 rounded-2xl border border-gold/40 bg-card/80 p-4 text-center md:block">
      <p className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Sparkles className="size-3.5 text-gold" /> Match
      </p>
      {score === null ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {checks.length ? `${firstName} hasn't shared enough to score yet.` : "Set your partner preferences to see how you match."}
          {!checks.length && (
            <Link to="/profile" className="mt-1 block font-semibold text-primary hover:underline">
              Set preferences
            </Link>
          )}
        </p>
      ) : (
        <>
          <div className="relative mx-auto mt-2 size-28">
            <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
              <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--saffron-100)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r={RING_RADIUS}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                strokeDashoffset={RING_LENGTH * (1 - score / 100)}
                className="transition-[stroke-dashoffset] duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold leading-none text-primary">{score}%</span>
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold">
            Meets {met} of {met + missed} preferences
          </p>
          <div className="mt-2 flex justify-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-success" /> {met} met
            </span>
            {missed > 0 && (
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-muted-foreground/50" /> {missed} not
              </span>
            )}
            {unknown > 0 && (
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-secondary ring-1 ring-gold/50" /> {unknown} unknown
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export const ProfileDialog = ({
  user: profile,
  open,
  onOpenChange,
  contactUnlocked,
  remaining = 0,
  canSendInterest,
  onRemoved,
  onContactViewed,
}: Props) => {
  const navigate = useNavigate();
  const { user: me } = useUser();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const broker = isBroker();
  const actions = useProfileActions(profile, (id, used) => {
    onRemoved?.(id, used);
    onOpenChange(false);
  });

  const { basic, personal = {} } = profile;
  const age = ageFromFloating(basic.dob);
  const active = activityLabel(profile.lastActiveAt);
  const checks = broker ? [] : checkPreferences(me.partner, profile);
  const score = broker ? null : matchScore(me, profile);
  const firstName = basic.fullName.split(" ")[0];

  // Lets the member see who looked at their profile.
  useEffect(() => {
    if (open && profile._id && !broker) {
      void api.post("/profile-view", { userId: profile._id }).catch(() => undefined);
    }
  }, [open, profile._id, broker]);

  const unlock = async () => {
    setUnlocking(true);
    try {
      await api.post("/view-contact", { receiverId: profile._id });
      toast.success("Contact details ready", { description: "Saved under Activity, Contacts." });
      onContactViewed?.();
      onRemoved?.(actions.id, CONTACT_COST);
      // Replaces the open-profile history entry, which also closes this dialog.
      navigate("/activity", { state: { tab: "viewed" }, replace: true });
    } catch (err) {
      toast.error("Couldn't unlock contact", { description: errorMessage(err) });
    } finally {
      setUnlocking(false);
      setConfirmOpen(false);
    }
  };

  const copyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      toast.success("User ID copied", { description: id });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the user ID");
    }
  };

  const download = async () => {
    setDownloading(true);
    try {
      // Contact details go in only when they're visible here too.
      await downloadProfilePdf(profile, { showContact: !!contactUnlocked });
    } catch (err) {
      toast.error("Couldn't create the PDF", { description: errorMessage(err) });
    } finally {
      setDownloading(false);
    }
  };

  const downloadButton = (className?: string) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full", className)}
          aria-label="Download profile as PDF"
          disabled={downloading}
          onClick={() => void download()}>
          {downloading ? <LoaderCircle className="animate-spin" /> : <Download />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{downloading ? "Preparing PDF…" : "Download profile as PDF"}</TooltipContent>
    </Tooltip>
  );

  const shortlistButton = (className?: string) =>
    broker ? null : (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", className, actions.saved && "bg-gold/20 hover:bg-gold/30")}
            aria-pressed={actions.saved}
            aria-label={actions.saved ? "Remove from shortlist" : "Add to shortlist"}
            disabled={actions.busy}
            onClick={actions.toggleShortlist}>
            <Bookmark className={cn(actions.saved && "fill-gold text-gold-foreground")} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{actions.saved ? "Shortlisted" : "Shortlist"}</TooltipContent>
      </Tooltip>
    );

  const quickFacts = [
    age !== null ? `${age} yrs` : null,
    optionLabel(heightOptions, personal.height)?.split(" (")[0],
    optionLabel(qualificationOptions, basic.qualification),
    personal.employedIn,
    personal.workCity || personal.country,
  ].filter((f): f is string => !!f);

  const actionProps = {
    firstName,
    canSendInterest,
    contactUnlocked,
    remaining,
    busy: actions.busy || unlocking,
    onInterest: actions.sendInterest,
    onUnlock: () => setConfirmOpen(true),
  };

  const moreMenu = (triggerClassName?: string) =>
    broker ? null : (
      <ProfileMoreMenu
        name={firstName}
        busy={actions.busy}
        onBlock={actions.block}
        onReport={actions.report}
        triggerClassName={triggerClassName}
      />
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex h-dvh max-h-dvh w-full max-w-full flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:max-w-full md:h-[min(92dvh,56rem)] md:max-w-5xl md:rounded-3xl md:border">
        <DialogTitle className="sr-only">{basic.fullName}</DialogTitle>
        <DialogDescription className="sr-only">Profile of {basic.fullName}</DialogDescription>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
          {/* Photos only, kept at portrait size instead of stretching to the column height */}
          <aside className="relative shrink-0 bg-gradient-to-b from-accent to-background p-4 md:flex md:w-[18rem] md:flex-col md:gap-4 md:overflow-hidden md:border-r md:border-border md:p-5">
            <div className="-mt-1 mb-3 flex justify-end gap-1 md:hidden">
              {shortlistButton("bg-card/90 shadow")}
              {downloadButton("bg-card/90 shadow")}
              {moreMenu("bg-card/90 shadow")}
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-card/90 shadow" aria-label="Close">
                  <X />
                </Button>
              </DialogClose>
            </div>
            <div className="mx-auto max-w-[13rem] md:mx-0 md:flex md:min-h-0 md:max-w-none md:flex-col">
              <PhotoGallery fill images={basic.images ?? []} name={basic.fullName} seed={profile._id ?? basic.uniqueId} />
            </div>
            {!broker && <MatchPanel score={score} checks={checks} firstName={firstName} />}
          </aside>

          {/* Details + desktop actions */}
          <div className="min-h-0 flex-1 md:flex md:flex-col">
          <div className="md:min-h-0 md:flex-1 md:overflow-y-auto">
            <header className="border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:px-6 md:sticky md:top-0 md:z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-3xl font-bold leading-tight">{basic.fullName}</h2>
                    {profile.isVerified && <BadgeCheck className="size-6 shrink-0 text-success" aria-label="Verified" />}
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    {basic.uniqueId && (
                      <span className="inline-flex items-center gap-1">
                        <span className="font-mono font-semibold text-foreground/80">{basic.uniqueId}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-6 rounded-full"
                              aria-label="Copy user ID"
                              onClick={() => void copyId(basic.uniqueId!)}>
                              {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{copied ? "Copied" : "Copy user ID"}</TooltipContent>
                        </Tooltip>
                      </span>
                    )}
                    {active && (
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-success" />
                        {active}
                      </span>
                    )}
                  </p>
                </div>
                <div className="hidden items-center gap-1 md:flex">
                  {shortlistButton()}
                  {downloadButton()}
                  {moreMenu()}
                  <DialogClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Close">
                      <X />
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {quickFacts.map((f) => (
                  <span key={f} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                    {f}
                  </span>
                ))}
              </div>
            </header>

            <div className="space-y-4 px-4 py-5 sm:px-6">
              {contactUnlocked && <ContactCard user={profile} />}

              {!broker && (checks.length > 0 || canSendInterest) && (
                <section className="overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-accent via-card to-card">
                  <div className="flex items-center gap-4 p-4">
                    {/* On desktop the big ring sits in the photo column instead */}
                    {score !== null && (
                      <div
                        className="flex size-16 shrink-0 items-center justify-center rounded-full md:hidden"
                        style={{ background: `conic-gradient(var(--primary) ${score * 3.6}deg, var(--saffron-100) 0deg)` }}>
                        <span className="flex size-12 items-center justify-center rounded-full bg-card font-display text-lg font-bold text-primary">
                          {score}%
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="flex items-center gap-1.5 font-display text-xl font-bold">
                        <Sparkles className="size-5 text-gold" /> How you match
                      </p>
                      {canSendInterest && (
                        <p className="text-sm text-muted-foreground">You also fit what {firstName} is looking for.</p>
                      )}
                    </div>
                  </div>
                  {checks.length > 0 && (
                    <ul className="grid gap-x-6 gap-y-2.5 border-t border-gold/30 p-4 sm:grid-cols-2">
                      {checks.map((c) => (
                        <li key={c.label} className="flex items-start gap-2.5 text-sm">
                          <span
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full [&_svg]:size-3",
                              c.ok === true && "bg-success text-success-foreground",
                              c.ok === false && "bg-muted text-muted-foreground",
                              c.ok === null && "bg-secondary text-secondary-foreground"
                            )}>
                            {c.ok === true ? <Check /> : c.ok === false ? <X /> : <CircleHelp />}
                          </span>
                          <span className="min-w-0">
                            <span className="font-semibold">{c.label}</span>
                            <span className="block truncate text-xs text-muted-foreground">You want: {c.wanted}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              <Tabs defaultValue="about">
                <TabsList className="grid w-full grid-cols-3 bg-muted">
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="family">Family</TabsTrigger>
                  <TabsTrigger value="prefs">Preferences</TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-4 space-y-4">
                  <AboutSections user={profile} />
                </TabsContent>
                <TabsContent value="family" className="mt-4">
                  <FamilySection user={profile} />
                </TabsContent>
                <TabsContent value="prefs" className="mt-4">
                  <PreferencesSection user={profile} />
                </TabsContent>
              </Tabs>

              {!contactUnlocked && !broker && (
                <div className="space-y-1 rounded-2xl bg-muted px-4 py-3 text-xs text-muted-foreground md:hidden">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Phone className="size-4 shrink-0 text-primary" />
                    Get {firstName}'s contact
                  </p>
                  {canSendInterest && (
                    <p>
                      <b className="text-foreground">Interest:</b> shared free if {firstName} accepts
                    </p>
                  )}
                  <p>
                    <b className="text-foreground">Contact:</b> see phone and email right away
                  </p>
                </div>
              )}
            </div>
          </div>

          {!broker && (
            <div className="hidden shrink-0 items-center gap-2 border-t border-border bg-card px-5 py-2.5 md:flex">
              <ConnectOptions horizontal {...actionProps} />
            </div>
          )}
          </div>
        </div>

        {!broker && (
          <div className="border-t border-border bg-card px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
            <ActionButtons {...actionProps} />
          </div>
        )}

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>See {firstName}'s contact now?</AlertDialogTitle>
              <AlertDialogDescription>
                This uses {CONTACT_COST} of your {remaining} credits and shows {firstName}'s phone and email right away.
                {canSendInterest &&
                  ` Prefer to wait? Sending an interest uses only ${INTEREST_COST} credit, and contact details are shared free if ${firstName} accepts.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={unlocking}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={unlocking}
                onClick={(e) => {
                  e.preventDefault();
                  void unlock();
                }}>
                {unlocking ? "Opening…" : `Yes, use ${CONTACT_COST} credits`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
