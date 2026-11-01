import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownUp,
  CalendarHeart,
  EyeOff,
  Leaf,
  MailCheck,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProfileCard from "@/components/profile/ProfileCard";
import { MatchFilterPanel } from "@/components/profile/MatchFilterPanel";
import { EmptyState } from "@/components/common/PageHeader";
import SEO from "@/components/misc/SEO";
import { useUser } from "@/context/UserContext";
import api from "@/utils/api";
import type { MatchFilters, UserDetails } from "@/utils/interfaces";
import { errorMessage } from "@/lib/errors";
import { isBroker } from "@/lib/session";
import { cn } from "@/lib/utils";
import { normalizeToArray } from "@/utils/utils";
import { MEMBERSHIP_START } from "@/utils/constants";
import { localeOf, useMemberLang, type Lang } from "@/lib/i18n";
import { LanguageSelect } from "@/components/common/LanguageSelect";
import ganesh from "@/assets/ganesh.webp";
import { homeText } from "./lang";

const PAGE_SIZE = 10;

interface ProfilesResponse {
  profiles: UserDetails[];
  totalProfiles: number;
}

const pageList = (page: number, total: number): (number | "…")[] => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
};

const activeFilterCount = (f: MatchFilters | null) => {
  if (!f) return 0;
  const p = f.partner;
  return [
    p.ageFrom || p.ageTo,
    p.heightFrom || p.heightTo,
    ...(
      [
        "caste",
        "employedIn",
        "motherTongue",
        "qualification",
        "martialStatus",
        "country",
      ] as const
    ).map((k) => normalizeToArray(p[k]).length),
    normalizeToArray(f.diet).length,
  ].filter(Boolean).length;
};

const membershipStart = new Date(`1 ${MEMBERSHIP_START}`);

/** Shown when there are no matches (with or without filters): sets expectations for an early-stage platform. */
const LaunchNote = ({ filtered, lang }: { filtered?: boolean; lang: Lang }) => {
  const t = homeText[lang];
  const locale = localeOf(lang);
  const start = Number.isNaN(membershipStart.getTime())
    ? MEMBERSHIP_START
    : membershipStart.toLocaleString(locale, { month: "long", year: "numeric" });
  const now = new Date().toLocaleString(locale, { month: "long" });
  return (
    <div className="space-y-4">
      <p>
        {filtered ? `${t.filteredTip} ` : ""}
        {t.newLead}{" "}
        <span className="font-semibold text-primary">{t.patience}</span>
        {t.patienceRest}
      </p>
      <ul className="mx-auto grid max-w-2xl gap-2 text-left sm:grid-cols-2">
        <li className="flex gap-3 rounded-xl bg-accent p-3 text-accent-foreground">
          <CalendarHeart className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <b>{t.membershipBold(start)}</b>
            {t.membershipRest(now)}
          </span>
        </li>
        <li className="flex gap-3 rounded-xl bg-accent p-3 text-accent-foreground">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <span>
            <b>{t.noCheckBold}</b> {t.noCheckRest}
          </span>
        </li>
      </ul>
      <p>{t.completeTip}</p>
    </div>
  );
};

const fetchProfiles = (filters: MatchFilters, page: number, limit: number) =>
  api.post<ProfilesResponse>("/fetch-profiles", { page, limit, filters });

const Home = () => {
  const { user, loaded, filters, setFilters, remaining, refresh } = useUser();
  const [matches, setMatches] = useState<UserDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<MatchFilters>({ partner: {} });
  const [draftCount, setDraftCount] = useState<number | null>(null);
  const broker = isBroker();
  // Members see the empty state in their mother tongue; partners stay in English.
  const [memberLang, setMemberLang] = useMemberLang(user.basic?.motherTongue);
  const lang = broker ? "en" : memberLang;
  const t = homeText[lang];

  useEffect(() => {
    if (!loaded || !user._id || !filters) return;
    let cancelled = false;
    setLoading(true);
    fetchProfiles(filters, page, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        setMatches(res.data.profiles);
        setTotal(res.data.totalProfiles);
      })
      .catch((err) => {
        if (!cancelled)
          toast.error("Couldn't load matches", {
            description: errorMessage(err),
          });
      })
      .finally(() => !cancelled && setLoading(false));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      cancelled = true;
    };
  }, [loaded, user._id, filters, page]);

  // Live "Show N matches" count while the filter sheet is open.
  useEffect(() => {
    if (!sheetOpen) return;
    setDraftCount(null);
    const t = setTimeout(() => {
      fetchProfiles(draft, 1, 1)
        .then((res) => setDraftCount(res.data.totalProfiles))
        .catch(() => setDraftCount(null));
    }, 400);
    return () => clearTimeout(t);
  }, [draft, sheetOpen]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Removing cards can shrink the result set below the current page.
  useEffect(() => {
    if (!loading && page > totalPages) setPage(totalPages);
  }, [loading, page, totalPages]);
  const filterCount = activeFilterCount(filters);
  const defaults: MatchFilters = {
    partner: user.partner ?? {},
    sort: filters?.sort ?? "best",
  };
  const filtersChanged =
    JSON.stringify(filters ?? {}) !== JSON.stringify(defaults);

  const apply = (next: MatchFilters) => {
    setPage(1);
    setFilters(next);
    setSheetOpen(false);
  };

  const openFilters = () => {
    setDraft(filters ?? defaults);
    setSheetOpen(true);
  };

  const quick = (patch: Partial<MatchFilters>) =>
    apply({ ...(filters ?? defaults), ...patch });

  const onRemoved = (id: string, used?: number) => {
    setMatches((prev) => prev.filter((m) => m._id !== id));
    setTotal((t) => Math.max(0, t - 1));
    if (used) void refresh();
  };

  const vegOnly = normalizeToArray(filters?.diet).join() === "Vegetarian";
  const quickChips = [
    {
      key: "veg",
      label: "Vegetarian",
      icon: <Leaf />,
      on: vegOnly,
      toggle: () => quick({ diet: vegOnly ? [] : ["Vegetarian"] }),
    },
  ];

  return (
    <>
      <SEO
        title="Your matches | Seetha Rama Kalyana"
        description="Matches for your profile."
        noindex
      />
      <div className="mb-2 flex items-baseline gap-2">
        <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          {broker ? "Referred profiles" : "Your matches"}
        </h1>
        {!loading && (
          <span className="text-xs text-muted-foreground sm:text-sm">
            {total} {broker ? "" : "mutual "}
            {total === 1 ? "match" : "matches"}

          </span>
        )}
      </div>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-4 mb-6 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-2">
          <Button onClick={openFilters} className="shrink-0 rounded-full">
            <SlidersHorizontal />
            Filters
            {filterCount > 0 && (
              <Badge className="ml-0.5 h-5 min-w-5 bg-primary-foreground px-1.5 text-primary">
                {filterCount}
              </Badge>
            )}
          </Button>
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
            {quickChips.map((c) => (
              <button
                key={c.key}
                type="button"
                aria-pressed={c.on}
                onClick={c.toggle}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition [&_svg]:size-4",
                  c.on
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground/75 hover:border-gold",
                )}>
                {c.icon}
                {c.label}
                {c.on && <X />}
              </button>
            ))}
            {filtersChanged && (
              <Button
                variant="ghost"
                className="shrink-0 rounded-full"
                onClick={() => apply(defaults)}>
                <RotateCcw />
                Reset
              </Button>
            )}
          </div>
          <Select
            value={filters?.sort ?? "best"}
            onValueChange={(v) => quick({ sort: v as MatchFilters["sort"] })}>
            <SelectTrigger
              className="hidden h-10 w-44 shrink-0 rounded-full bg-card sm:flex"
              aria-label="Sort">
              <ArrowDownUp className="size-4 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="best">Recommended</SelectItem>
              <SelectItem value="newest">Newest members</SelectItem>
              <SelectItem value="active">Recently active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <Skeleton className="aspect-[4/5] rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : matches.length ? (
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {matches.map((m) => (
            <ProfileCard
              key={m._id}
              match={m}
              remaining={remaining}
              onRemoved={onRemoved}
            />
          ))}
        </div>
      ) : (
        <div>
          {!broker && (
            <div className="mb-2 flex justify-end">
              <LanguageSelect value={memberLang} onChange={setMemberLang} />
            </div>
          )}
          <EmptyState
            image={ganesh}
            title={
              broker
                ? "No referred profiles yet"
                : filterCount
                  ? t.noMatches
                  : t.justStarted
            }
            description={
              broker ? (
                "Profiles you refer appear here. Share your referral ID with families to get started."
              ) : (
                <LaunchNote filtered={!!filterCount} lang={lang} />
              )
            }
            action={
              filterCount ? (
                <Button variant="outline" onClick={openFilters}>
                  <SlidersHorizontal />
                  {t.adjustFilters}
                </Button>
              ) : broker ? null : (
                <div className="flex flex-wrap justify-center gap-2">
                  <Button asChild>
                    <Link to="/profile">{t.completeProfile}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/astrology">{t.exploreAstro}</Link>
                  </Button>
                </div>
              )
            }
          />
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination className="mt-10 flex-col items-center gap-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {pageList(page, totalPages).map((p, i) =>
              p === "…" ? (
                <PaginationItem key={`e${i}`}>
                  <PaginationEllipsis className="w-6 sm:size-9" />
                </PaginationItem>
              ) : (
                <PaginationItem
                  key={p}
                  className={
                    p === page || p === 1 || p === totalPages
                      ? ""
                      : "hidden sm:block"
                  }>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}>
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
          {totalPages > 5 && (
            <Select
              value={String(page)}
              onValueChange={(v) => setPage(Number(v))}>
              <SelectTrigger
                size="sm"
                className="rounded-full bg-card text-xs"
                aria-label="Go to page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    Page {i + 1} of {totalPages}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Pagination>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full gap-0 bg-background sm:max-w-md">
          <SheetHeader className="border-b border-border bg-card">
            <SheetTitle className="font-display text-2xl">
              Refine matches
            </SheetTitle>
            <SheetDescription>
              Starts from your{" "}
              <Link
                to="/profile?tab=partner"
                className="font-semibold text-primary underline-offset-2 hover:underline">
                partner preferences
              </Link>
              . Changes here only affect what you see right now.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="mb-5 flex gap-2.5 rounded-xl bg-accent p-3 text-xs leading-relaxed text-accent-foreground">
              <EyeOff className="mt-0.5 size-4 shrink-0" />
              You'll only ever see families whose own preferences include you,
              and blocked members stay hidden on both sides.
            </div>
            <MatchFilterPanel value={draft} onChange={setDraft} />
          </div>
          <SheetFooter className="flex-row gap-2 border-t border-border bg-card">
            <Button
              variant="ghost"
              onClick={() => setDraft({ partner: {}, sort: draft.sort })}>
              Clear all
            </Button>
            <Button
              className="flex-1 rounded-full"
              onClick={() => apply(draft)}>
              {draftCount === null
                ? "Show matches"
                : `Show ${draftCount} match${draftCount === 1 ? "" : "es"}`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Home;
