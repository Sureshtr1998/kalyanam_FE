import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  GraduationCap,
  Heart,
  Images,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProfilePlaceholder } from "@/components/common/ProfilePlaceholder";
import { Lotus } from "@/components/common/Brand";
import { ProfileDialog } from "./ProfileDialog";
import { ProfileMoreMenu } from "./ProfileActions";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useProfileParam } from "@/hooks/useProfileParam";
import { useUser } from "@/context/UserContext";
import type { UserDetails } from "@/utils/interfaces";
import { heightOptions, imageUrl, qualificationOptions } from "@/utils/constants";
import { fetchLabel, motherTongueOptions } from "@/utils/utils";
import { ageFromFloating } from "@/lib/dates";
import { activityLabel, isNewProfile, matchScore } from "@/lib/matching";
import { isBroker } from "@/lib/session";
import { cn } from "@/lib/utils";

interface Props {
  match: UserDetails;
  remaining: number;
  /** Remove the card from the grid; `usedInterest` when interests were spent. */
  onRemoved: (id: string, usedInterest?: number) => void;
}

// Frosted white disc that reads on any photo; each button adds its own colour and hover fill.
const PHOTO_BUTTON =
  "size-9 rounded-full bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-60 [&_svg]:size-[18px]";

const shortHeight = (h?: string) => {
  const label = h ? fetchLabel(heightOptions, h) : "-";
  return label === "-" ? null : label.split(" (")[0];
};

const ProfileCard = ({ match, remaining, onRemoved }: Props) => {
  const { user } = useUser();
  const { basic, personal = {} } = match;
  const actions = useProfileActions(match, onRemoved);
  const { openId, openProfile, closeProfile } = useProfileParam();
  const open = !!actions.id && openId === actions.id;
  const setOpen = (o: boolean) => (o ? openProfile(actions.id) : closeProfile());
  const broker = isBroker();
  const age = ageFromFloating(basic.dob);
  const score = broker ? null : matchScore(user, match);
  const active = activityLabel(match.lastActiveAt);
  const photos = basic.images?.length ?? 0;
  const motherTongue = basic.motherTongue ? fetchLabel(motherTongueOptions, basic.motherTongue) : null;

  const facts = [
    { icon: <GraduationCap />, text: fetchLabel(qualificationOptions, basic.qualification) },
    { icon: <Briefcase />, text: personal.employedIn },
    { icon: <Users />, text: basic.subCaste || basic.caste },
  ].filter((f) => f.text && f.text !== "-");

  const meta = [
    age !== null ? `${age} yrs` : null,
    shortHeight(personal.height),
    motherTongue && motherTongue !== "-" ? motherTongue : null,
  ].filter(Boolean);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-[0_1px_2px_rgba(67,20,7,0.06),0_8px_24px_-12px_rgba(67,20,7,0.18)] ring-1 ring-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-16px_rgba(194,65,12,0.35)]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative block aspect-[4/5] overflow-hidden bg-muted text-left"
        aria-label={`View ${basic.fullName}'s profile`}>
        {basic.images?.[0]?.url ? (
          <img
            src={imageUrl(basic.images[0].url, "card")}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <ProfilePlaceholder
            name={basic.fullName}
            seed={match._id ?? basic.uniqueId}
            className="transition-transform duration-700 group-hover:scale-105"
          />
        )}
        {/* Top scrim so the white controls stay readable on bright photos. */}
        {!broker && <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-saffron-950/70 to-transparent" />

        <div className="absolute inset-x-0 bottom-3 flex flex-wrap justify-center gap-1.5 px-3">
          {match.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-success shadow-sm">
              <BadgeCheck className="size-3.5" /> Verified
            </span>
          )}
          {isNewProfile(match.createdAt) && (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-gold-foreground shadow-sm">
              New
            </span>
          )}
          {photos > 1 && (
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
              <Images className="size-3" /> {photos}
            </span>
          )}
          {active && (
            <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {active}
            </span>
          )}
        </div>
      </button>

      {/* Photo controls sit outside the photo button so they stay clickable:
          save and more on the left, skip on the right. */}
      {!broker && (
        <>
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={actions.toggleShortlist}
                  disabled={actions.busy}
                  aria-pressed={actions.saved}
                  aria-label={actions.saved ? "Remove from shortlist" : "Add to shortlist"}
                  className={cn(
                    PHOTO_BUTTON,
                    actions.saved
                      ? "bg-gold text-gold-foreground hover:bg-gold/90 hover:text-gold-foreground"
                      : "text-gold-foreground hover:bg-gold hover:text-gold-foreground"
                  )}>
                  <Bookmark className={cn(actions.saved && "fill-current")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{actions.saved ? "Shortlisted" : "Shortlist"}</TooltipContent>
            </Tooltip>
            <ProfileMoreMenu
              name={basic.fullName}
              busy={actions.busy}
              onSkip={actions.skip}
              onBlock={actions.block}
              onReport={actions.report}
              triggerClassName={cn(
                PHOTO_BUTTON,
                "text-foreground/75 hover:bg-white hover:text-primary data-[state=open]:bg-white data-[state=open]:text-primary"
              )}
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(PHOTO_BUTTON, "absolute right-3 top-3 text-destructive hover:bg-destructive hover:text-white")}
                disabled={actions.busy}
                onClick={actions.skip}
                aria-label={`Skip ${basic.fullName}`}>
                <X />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Skip (hide from your matches)</TooltipContent>
          </Tooltip>
        </>
      )}

      <div className="flex flex-1 flex-col items-center p-4 text-center">
        <h3 className="w-full truncate font-display text-[1.7rem] font-bold leading-tight">{basic.fullName}</h3>
        {meta.length > 0 && (
          <p className="mt-0.5 flex flex-wrap items-center justify-center gap-x-2 text-sm font-medium text-muted-foreground">
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-2">
                {i > 0 && <span className="size-1 rotate-45 bg-gold" />}
                {m}
              </span>
            ))}
          </p>
        )}

        {/* Divider with the match score as its centrepiece */}
        <div className="my-3 flex w-full items-center gap-2">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
          {score !== null ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-primary ring-1 ring-gold/40">
                  <Sparkles className="size-3.5" />
                  {score}% match
                </span>
              </TooltipTrigger>
              <TooltipContent>How closely you fit each other's preferences</TooltipContent>
            </Tooltip>
          ) : (
            <Lotus className="h-3.5 w-6 text-gold" />
          )}
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
        </div>

        {facts.length > 0 && (
          <div className="flex w-full flex-wrap justify-center gap-1.5">
            {facts.map((f) => (
              <span
                key={f.text}
                className="flex max-w-full items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80 [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-primary">
                {f.icon}
                <span className="truncate">{f.text}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex w-full gap-2 pt-4">
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => setOpen(true)}>
            View profile
          </Button>
          {!broker && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className="rounded-full px-4"
                    disabled={actions.busy || remaining < 1}
                    onClick={actions.sendInterest}
                    aria-label="Send interest">
                    <Heart className="fill-current" />
                    <span className="hidden min-[400px]:inline">Interest</span>
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {remaining < 1 ? "Buy credits under Account to send" : "Send interest (uses 1 credit)"}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {open && (
        <ProfileDialog
          user={match}
          open={open}
          onOpenChange={setOpen}
          remaining={remaining}
          canSendInterest
          canSkip
          onRemoved={onRemoved}
        />
      )}
    </article>
  );
};

export default ProfileCard;
