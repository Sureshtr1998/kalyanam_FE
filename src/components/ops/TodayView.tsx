import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, DualBars, Empty, Kpi, Panel, Prose } from "./shared";
import { IdeaBox } from "./IdeaBox";
import { inr, num, useOps, type OpsAction, type Overview } from "./opsUtils";

interface Growth {
  months: { month: string; actual: { members: number; revenue: number; spend: number } | null; projected: { members: number; revenue: number; spend: number } | null; target: { members: number | null; revenue: number | null } }[];
  quarter: { label: string; members: number; revenue: number; spend: number; targetMembers: number; targetRevenue: number };
  year: { label: string; members: number; revenue: number; spend: number; targetMembers: number; targetRevenue: number };
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : null);

/** Expected vs actual for month, quarter and year. */
export const GrowthPanel = () => {
  const { data } = useOps<Growth>("/manage/ops/growth");
  if (!data) return null;
  const month = data.months.find((m) => m.projected);
  const rows = [
    { label: "This month (projected)", members: month?.projected?.members ?? 0, revenue: month?.projected?.revenue ?? 0, tm: month?.target.members ?? 0, tr: month?.target.revenue ?? 0 },
    { label: data.quarter.label, members: data.quarter.members, revenue: data.quarter.revenue, tm: data.quarter.targetMembers, tr: data.quarter.targetRevenue },
    { label: data.year.label, members: data.year.members, revenue: data.year.revenue, tm: data.year.targetMembers, tr: data.year.targetRevenue },
  ];
  const last6 = data.months.filter((m) => m.actual).slice(-6);
  const max = Math.max(1, ...last6.map((m) => Math.max(m.actual?.revenue ?? 0, m.target.revenue ?? 0, m.projected?.revenue ?? 0)));
  return (
    <Panel title="Growth: expected vs actual" sub="Set targets in Settings. Current month is projected from its run rate.">
      <div className="grid gap-2 sm:grid-cols-3">
        {rows.map((r) => {
          const p = pct(r.revenue, r.tr);
          return (
            <div key={r.label} className="rounded-xl bg-muted/60 p-3">
              <p className="text-xs font-semibold text-muted-foreground">{r.label}</p>
              <p className="mt-1 text-lg font-bold">{inr(r.revenue)}</p>
              <p className="text-xs text-muted-foreground">{num(r.members)} members{r.tm ? ` · target ${num(r.tm)}` : ""}</p>
              {p != null && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className={cn("h-full rounded-full", p >= 100 ? "bg-success" : p >= 75 ? "bg-gold" : "bg-destructive")} style={{ width: `${Math.min(100, p)}%` }} />
                </div>
              )}
              {p != null && <p className="mt-1 text-[11px] text-muted-foreground">{p}% of {inr(r.tr)} target</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex h-24 items-end gap-2">
        {last6.map((m) => {
          const v = m.projected?.revenue ?? m.actual?.revenue ?? 0;
          return (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <div className="relative w-full flex-1">
                {m.target.revenue ? <div className="absolute inset-x-0 border-t-2 border-dashed border-gold" style={{ bottom: `${(m.target.revenue / max) * 100}%` }} /> : null}
                <div className={cn("absolute inset-x-1 bottom-0 rounded-t-md", m.projected ? "bg-primary/40" : "bg-primary/80")} style={{ height: `${(v / max) * 100}%` }} title={`${m.month}: ${inr(v)}`} />
              </div>
              <span className="text-[10px] text-muted-foreground">{m.month.slice(5)}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">Bars: revenue (light = projected). Dashed line: target.</p>
    </Panel>
  );
};

export const TodayView = ({ overview, reload, onOpenActivity }: { overview: Overview; reload: () => void; onOpenActivity?: () => void }) => {
  const [showShadow, setShowShadow] = useState(false);
  const feed = overview.feed;
  const needsYou = feed.filter((a) => a.status === "needs_you");
  const soon = feed
    .filter((a) => a.status === "scheduled" && a.runAt)
    .sort((a, b) => Date.parse(a.runAt!) - Date.parse(b.runAt!));
  const alerts = feed.filter((a) => a.status === "info" && Date.now() - Date.parse(a.createdAt) < 3 * 86400000);
  const ideas = feed.filter((a) => a.status === "idea");
  const shadow = feed.filter((a) => a.status === "shadow");
  const recent = feed.filter((a) => ["done", "failed"].includes(a.status)).slice(0, 6);

  const days = overview.accountDays;
  const kpi = useMemo(() => {
    const last7 = days.slice(-8, -1);
    const spend = last7.reduce((t, d) => t + d.spend, 0);
    const joined = last7.reduce((t, d) => t + (d.joined ?? 0), 0);
    const earned = last7.reduce((t, d) => t + (d.earned ?? 0), 0);
    const funds = [...days].reverse().find((d) => d.funds != null)?.funds;
    const avg = last7.length ? spend / last7.length : 0;
    return { spend, joined, earned, funds, runway: funds != null && avg ? funds / avg : null, cpm: joined ? spend / joined : null };
  }, [days]);

  const List = ({ items, empty }: { items: OpsAction[]; empty: string }) =>
    items.length ? <div className="space-y-3">{items.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}</div> : <Empty>{empty}</Empty>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Kpi
          label="Meta funds"
          value={inr(kpi.funds)}
          hint={kpi.runway != null ? `~${kpi.runway.toFixed(1)} days left` : "Not read yet"}
          tone={kpi.runway != null && kpi.runway < 3 ? "bad" : kpi.runway != null && kpi.runway < 5 ? "warn" : undefined}
        />
        <Kpi label="Spend · 7 days" value={inr(kpi.spend)} hint={kpi.cpm ? `${inr(kpi.cpm)} per new member` : "–"} />
        <Kpi label="Earned · 7 days" value={inr(kpi.earned)} hint={`${num(kpi.joined)} joined`} tone={kpi.earned >= kpi.spend ? "good" : "bad"} />
        <Kpi
          label="Claude AI this month"
          value={inr(overview.claude.monthUsd * overview.claude.inrRate)}
          hint={`${inr(overview.claude.totalUsd * overview.claude.inrRate)} all time · cap ${inr(overview.claude.budgetUsd * overview.claude.inrRate)}/mo`}
          tone={overview.claude.monthUsd > overview.claude.budgetUsd * 0.8 ? "warn" : undefined}
        />
      </div>

      <IdeaBox onPlanned={reload} />

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a._id} className={cn("rounded-2xl px-4 py-3 text-sm", a.priority === "urgent" ? "bg-destructive text-white" : "bg-accent")}>
              <p className="font-semibold">{a.title}</p>
              <p className={cn("text-xs", a.priority === "urgent" ? "text-white/85" : "text-muted-foreground")}>{a.reason}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title={`Needs you${needsYou.length ? ` · ${needsYou.length}` : ""}`} sub="Refunds and anything the agent won't decide alone.">
          <List items={needsYou} empty="Nothing waiting for you." />
        </Panel>
        <Panel title="Coming up" sub="Runs automatically at the time shown unless you cancel.">
          <List items={soon.slice(0, 8)} empty="Nothing scheduled." />
        </Panel>
      </div>

      {days.length > 1 && (
        <Panel title="Spend vs earned · 15 days">
          <DualBars days={days} a="spend" b="earned" labelA="Ad spend" labelB="Earned" />
        </Panel>
      )}

      <GrowthPanel />

      {overview.weekly && (
        <Panel title={<span className="flex items-center gap-2"><Sparkles className="size-4 text-gold" /> Weekly review</span>} sub={`Week of ${overview.weekly.period}`}>
          <Prose text={overview.weekly.body} />
        </Panel>
      )}

      {ideas.length > 0 && (
        <Panel title="What we could do next" sub="Ideas from the weekly review. Schedule or cancel them; any you leave for 48 hours are planned and scheduled automatically.">
          <List items={ideas} empty="" />
        </Panel>
      )}

      {shadow.length > 0 && (
        <Panel
          title={`Shadow log · ${shadow.length}`}
          sub="What the agent would have done in modules set to Shadow. Use it to judge the agent before going Live."
          actions={<Button size="xs" variant="outline" onClick={() => setShowShadow((v) => !v)}>{showShadow ? "Hide" : "Show"}</Button>}
        >
          {showShadow ? <List items={shadow} empty="" /> : <p className="text-sm text-muted-foreground">{shadow[0]?.title}{shadow.length > 1 ? ` and ${shadow.length - 1} more` : ""}</p>}
        </Panel>
      )}

      {recent.length > 0 && (
        <Panel
          title="Recently done"
          actions={onOpenActivity && <Button size="xs" variant="outline" onClick={onOpenActivity}>See all activity</Button>}
        >
          <div className="space-y-2">{recent.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} compact />)}</div>
        </Panel>
      )}
    </div>
  );
};
