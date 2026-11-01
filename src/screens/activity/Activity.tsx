import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Ban, Bookmark, Check, Eye, Footprints, Heart, Phone, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfilePlaceholder } from "@/components/common/ProfilePlaceholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, PageHeader } from "@/components/common/PageHeader";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { useUser } from "@/context/UserContext";
import { useProfileParam } from "@/hooks/useProfileParam";
import api from "@/utils/api";
import type { UserDetails } from "@/utils/interfaces";
import { imageUrl } from "@/utils/constants";
import { ageFromFloating, formatInstant } from "@/lib/dates";
import SEO from "@/components/misc/SEO";
import { errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import { getStatusLabel, type InvitationStatus } from "./helper";

type TabId = "interests" | "shortlist" | "visitors" | "viewed" | "hidden";

const ENDPOINT: Record<TabId, string> = {
  interests: "/fetch-invitation-status",
  shortlist: "/shortlist",
  visitors: "/profile-views",
  viewed: "/view-contact",
  hidden: "/hidden-profiles",
};

const TABS: { id: TabId; label: string; short?: string; icon: React.ReactNode; empty: string; emptyText: string }[] = [
  { id: "interests", label: "Interests", icon: <Heart />, empty: "No interests yet", emptyText: "Send an interest from your Matches page. Replies will show up here." },
  { id: "shortlist", label: "Shortlisted", short: "Shortlist", icon: <Bookmark />, empty: "Your shortlist is empty", emptyText: "Tap the bookmark on any profile to save it here and decide later." },
  { id: "visitors", label: "Viewed you", short: "Visitors", icon: <Footprints />, empty: "No visitors yet", emptyText: "Members who open your profile appear here. A complete profile with clear photos gets more visits." },
  { id: "viewed", label: "Contacts", icon: <Phone />, empty: "No contacts unlocked", emptyText: "Unlocked contact details are saved here so you can find them again." },
  { id: "hidden", label: "Blocked", icon: <Ban />, empty: "No one is blocked", emptyText: "Members you block can't see your profile, and you won't see theirs." },
];

const TAB_IDS = TABS.map((t) => t.id);

const STATUS_STYLE: Record<InvitationStatus, string> = {
  accept: "bg-success/12 text-success border-success/30",
  decline: "bg-destructive/10 text-destructive border-destructive/30",
  sent: "bg-gold/15 text-accent-foreground border-gold/40",
  received: "bg-primary/10 text-primary border-primary/30",
};

const STATUS_FILTERS: { id: InvitationStatus; label: string }[] = [
  { id: "received", label: "Action required" },
  { id: "sent", label: "Awaiting reply" },
  { id: "accept", label: "Accepted" },
  { id: "decline", label: "Declined" },
];

const ACTED_LABEL: Record<InvitationStatus, string> = {
  received: "Received",
  sent: "Sent",
  accept: "Accepted",
  decline: "Declined",
};

const PAGE = 10;

const Activity = () => {
  const location = useLocation();
  const { user, remaining, refresh } = useUser();
  const requested = (location.state as { tab?: TabId } | null)?.tab;
  const initialTab: TabId = requested && TAB_IDS.includes(requested) ? requested : "interests";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [rows, setRows] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);
  // Empty means every status is shown.
  const [statuses, setStatuses] = useState<InvitationStatus[]>([]);

  const toggleStatus = (s: InvitationStatus) => {
    setShown(PAGE);
    setStatuses((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const load = async (which: TabId) => {
    setLoading(true);
    try {
      const res = await api.get(ENDPOINT[which]);
      setRows(res.data?.activities ?? []);
    } catch (err) {
      toast.error("Couldn't load activity", { description: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuery("");
    setShown(PAGE);
    void load(tab);
  }, [tab]);

  const { openId, openProfile, closeProfile } = useProfileParam();
  const selected = openId ? rows.find((r) => r._id === openId) ?? null : null;
  const setSelected = (row: UserDetails | null) => (row?._id ? openProfile(row._id) : closeProfile());

  const statusCounts = useMemo(() => {
    const counts: Partial<Record<InvitationStatus, number>> = {};
    if (tab !== "interests") return counts;
    for (const r of rows) {
      const s = r.interests?.invitationStatus as InvitationStatus | undefined;
      if (s) counts[s] = (counts[s] ?? 0) + 1;
    }
    return counts;
  }, [rows, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byStatus = tab === "interests" && statuses.length > 0;
    if (!q && !byStatus) return rows;
    return rows.filter(
      (r) =>
        (!byStatus || statuses.includes(r.interests?.invitationStatus as InvitationStatus)) &&
        (!q || r.basic?.fullName?.toLowerCase().includes(q) || r.basic?.uniqueId?.toLowerCase().includes(q))
    );
  }, [rows, query, tab, statuses]);

  const respond = async (id: string, action: "accept" | "decline") => {
    setBusyId(id);
    try {
      const res = await api.post("/interest-action", { userId: id, action });
      toast.success(res.data.msg);
      await load("interests");
    } catch (err) {
      toast.error("Couldn't update", { description: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  const unhide = async (id: string) => {
    setBusyId(id);
    try {
      const res = await api.post("/unhide-profile", { userId: id });
      toast.success("Unblocked", { description: res.data.msg });
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Couldn't unblock", { description: errorMessage(err) });
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount =
    tab === "interests" ? rows.filter((r) => r.interests?.invitationStatus === "received").length : 0;

  return (
    <>
      <SEO title="Activity | Seetha Rama Kalyana" description="Your interests and activity." noindex />
      <PageHeader
        title="Activity"
        description="Interests, your shortlist, who viewed you, unlocked contacts and blocked members."
      />

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)} className="min-w-0">
          {/* Phones: all five tabs fit in one grid row (icon over label) so none hide off-screen. */}
          <TabsList className="grid h-auto w-full grid-cols-5 gap-0.5 bg-card p-1 shadow-sm ring-1 ring-border sm:inline-flex sm:w-max sm:gap-0">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="min-w-0 flex-col gap-1 rounded-md px-1 py-2 text-[11px] leading-tight data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:flex-row sm:gap-1.5 sm:px-3 sm:text-sm [&_svg]:size-4">
                {t.icon}
                <span className="max-w-full truncate sm:hidden">{t.short ?? t.label}</span>
                <span className="hidden sm:inline">{t.label}</span>
                {t.id === "interests" && pendingCount > 0 && (
                  <span className="absolute right-1 top-1 rounded-full bg-gold px-1.5 text-[10px] font-bold text-gold-foreground sm:static sm:ml-1">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ID"
            className="h-10 bg-card pl-9"
          />
        </div>
      </div>

      {tab === "interests" && rows.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter interests by status">
          <button
            type="button"
            aria-pressed={statuses.length === 0}
            onClick={() => {
              setShown(PAGE);
              setStatuses([]);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm",
              statuses.length === 0
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground/80 hover:bg-muted"
            )}>
            All ({rows.length})
          </button>
          {STATUS_FILTERS.map((f) => {
            const active = statuses.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleStatus(f.id)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors sm:text-sm",
                  active ? STATUS_STYLE[f.id] : "border-border bg-card text-foreground/80 hover:bg-muted"
                )}>
                {active && <Check className="size-3.5" />}
                {f.label} ({statusCounts[f.id] ?? 0})
              </button>
            );
          })}
        </div>
      )}

      {tab === "hidden" && (
        <p className="mb-4 flex gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground/80">
          <Ban className="mt-0.5 size-4 shrink-0 text-primary" />
          Blocking works both ways: these members can't find or view your profile, and you won't see theirs. You
          can also block someone by Profile ID from Account, Privacy.
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={TABS.find((t) => t.id === tab)?.icon}
          title={query || rows.length > 0 ? "No results" : TABS.find((t) => t.id === tab)?.empty}
          description={
            query
              ? "Try a different name or profile ID."
              : rows.length > 0
                ? "No interests match the selected filters."
                : TABS.find((t) => t.id === tab)?.emptyText
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.slice(0, shown).map((row) => {
            const id = row._id ?? "";
            const status = row.interests?.invitationStatus as InvitationStatus | undefined;
            const age = ageFromFloating(row.basic?.dob);
            return (
              <li
                key={id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
                <button
                  type="button"
                  onClick={() => setSelected(row)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <Avatar className="size-14 rounded-xl ring-1 ring-gold/30">
                    {row.basic?.images?.[0]?.url && (
                      <AvatarImage src={imageUrl(row.basic.images[0].url, "thumb")} className="object-cover" />
                    )}
                    <AvatarFallback className="rounded-xl p-0">
                      <ProfilePlaceholder size="thumb" name={row.basic?.fullName} seed={id || row.basic?.uniqueId} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{row.basic?.fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      <span className="font-mono">{row.basic?.uniqueId}</span>
                      {age !== null && ` · ${age} yrs`}
                      {row.basic?.caste && ` · ${row.basic.caste}`}
                    </p>
                    {tab === "visitors" && row.viewedAt && (
                      <p className="mt-1 text-xs font-medium text-primary">Viewed you on {formatInstant(row.viewedAt, true)}</p>
                    )}
                    {tab === "interests" && status && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <Badge variant="outline" className={STATUS_STYLE[status]}>
                          {status === "sent" ? "Awaiting reply" : getStatusLabel(status)}
                        </Badge>
                        {row.interests?.actedAt && (
                          <span className="text-xs text-muted-foreground">
                            {ACTED_LABEL[status]} {formatInstant(row.interests.actedAt)}
                          </span>
                        )}
                      </div>
                    )}
                    {status === "accept" && row.basic?.mobile && (
                      <p className="mt-1 text-xs font-semibold text-success">
                        <Phone className="mr-1 inline size-3" />+91 {row.basic.mobile}
                      </p>
                    )}
                  </div>
                </button>

                <div className="flex gap-2 sm:shrink-0">
                  <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => setSelected(row)}>
                    <Eye />
                    View
                  </Button>
                  {tab === "interests" && status === "received" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 bg-success text-success-foreground hover:bg-success/90 sm:flex-none"
                        disabled={busyId === id}
                        onClick={() => respond(id, "accept")}>
                        <Check />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:flex-none"
                        disabled={busyId === id}
                        onClick={() => respond(id, "decline")}>
                        <X />
                        Decline
                      </Button>
                    </>
                  )}
                  {tab === "hidden" && (
                    <Button size="sm" variant="secondary" className="flex-1 sm:flex-none" disabled={busyId === id} onClick={() => unhide(id)}>
                      <Eye />
                      Unblock
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {!loading && filtered.length > shown && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setShown((s) => s + PAGE)}>
            Show more ({filtered.length - shown} left)
          </Button>
        </div>
      )}

      {selected && (
        <ProfileDialog
          user={selected}
          open={!!selected}
          onOpenChange={(o) => !o && setSelected(null)}
          remaining={remaining}
          contactUnlocked={
            selected.interests?.invitationStatus === "accept" ||
            tab === "viewed" ||
            !!user.interests?.viewed?.some((id) => String(id) === selected._id)
          }
          canSendInterest={tab === "shortlist" || tab === "visitors"}
          onContactViewed={() => void refresh()}
          onRemoved={(id) => {
            setRows((prev) => prev.filter((r) => r._id !== id));
            void refresh();
          }}
        />
      )}
    </>
  );
};

export default Activity;
