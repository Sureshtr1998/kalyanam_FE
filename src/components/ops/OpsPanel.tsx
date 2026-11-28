import { useEffect, useState } from "react";
import { BrainCircuit, CalendarDays, Code2, Cog, Gauge, History, Inbox, Megaphone, RefreshCw, Search, Sprout, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ErrorNote, ModePill } from "./shared";
import { useOps, type ModuleId, type Overview } from "./opsUtils";
import { TodayView } from "./TodayView";
import { CalendarView } from "./CalendarView";
import { AdsView } from "./AdsView";
import { InboxView } from "./InboxView";
import { OrganicView, SeoView } from "./GrowView";
import { ToolsView } from "./ToolsView";
import { DevView } from "./DevView";
import { SettingsView } from "./SettingsView";
import { ActivityView } from "./ActivityView";
import { AlgorithmView } from "./AlgorithmView";

type View = "today" | "activity" | "calendar" | "ads" | "algorithm" | "inbox" | "organic" | "seo" | "tools" | "dev" | "settings";

const VIEWS: { id: View; label: string; icon: typeof Gauge; module?: ModuleId }[] = [
  { id: "today", label: "Today", icon: Gauge },
  { id: "activity", label: "Activity", icon: History },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "ads", label: "Ads", icon: Megaphone, module: "ads" },
  { id: "algorithm", label: "Algorithm", icon: BrainCircuit, module: "ads" },
  { id: "inbox", label: "Inbox", icon: Inbox, module: "support" },
  { id: "organic", label: "Organic", icon: Sprout, module: "organic" },
  { id: "seo", label: "SEO", icon: Search, module: "seo" },
  { id: "tools", label: "Tools", icon: Wrench, module: "tools" },
  { id: "dev", label: "Developer", icon: Code2, module: "dev" },
  { id: "settings", label: "Settings", icon: Cog },
];

const remember = (v: View) => {
  try {
    localStorage.setItem("ops:view", v);
  } catch {
    /* private mode */
  }
};
const recalled = (): View => {
  try {
    const v = localStorage.getItem("ops:view") as View | null;
    return v && VIEWS.some((x) => x.id === v) ? v : "today";
  } catch {
    return "today";
  }
};

/**
 * The Ops control centre: everything the agent is doing and planning, with a
 * cancel button on all of it. Built phone-first: a sticky, scrollable
 * section bar on top and cards that stack.
 */
export const OpsPanel = () => {
  const { data, error, loading, reload } = useOps<Overview>("/manage/ops/overview");
  const [view, setView] = useState<View>(recalled);

  // Keep the Today feed fresh while the tab is open.
  useEffect(() => {
    const id = window.setInterval(() => document.visibilityState === "visible" && reload(), 120000);
    return () => window.clearInterval(id);
  }, [reload]);

  const go = (v: View) => {
    setView(v);
    remember(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const needs = data?.counts.needs_you ?? 0;
  const inboxNeeds = data?.feed.filter((a) => a.status === "needs_you" && (a.module === "support" || a.module === "comments")).length ?? 0;

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/95 px-4 py-2 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border">
        <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none]" aria-label="Ops sections">
          {VIEWS.map((v) => {
            const badge = v.id === "today" ? needs : v.id === "inbox" ? inboxNeeds : 0;
            return (
              <button
                key={v.id}
                onClick={() => go(v.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  view === v.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
                )}
              >
                <v.icon className="size-4" /> {v.label}
                {badge > 0 && <span className="ml-0.5 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white">{badge}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-2xl font-bold">{VIEWS.find((v) => v.id === view)?.label}</h2>
          {data && VIEWS.find((v) => v.id === view)?.module && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Agent mode <ModePill mode={data.modes[VIEWS.find((v) => v.id === view)!.module!]} />
            </p>
          )}
        </div>
        <Button size="icon-sm" variant="ghost" aria-label="Refresh" onClick={reload}>
          <RefreshCw className={cn(loading && "animate-spin")} />
        </Button>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}
      {!data && !error && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      )}

      {data && (
        <>
          {view === "today" && <TodayView overview={data} reload={reload} onOpenActivity={() => go("activity")} />}
          {view === "activity" && <ActivityView />}
          {view === "calendar" && <CalendarView />}
          {view === "ads" && <AdsView />}
          {view === "algorithm" && <AlgorithmView />}
          {view === "inbox" && <InboxView />}
          {view === "organic" && <OrganicView />}
          {view === "seo" && <SeoView />}
          {view === "tools" && <ToolsView />}
          {view === "dev" && <DevView />}
          {view === "settings" && <SettingsView overview={data} reload={reload} />}
        </>
      )}
    </div>
  );
};

export default OpsPanel;
