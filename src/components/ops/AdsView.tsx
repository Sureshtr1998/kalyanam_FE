import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, DualBars, Empty, ErrorNote, Kpi, Panel } from "./shared";
import { inr, num, post, useOps, type AccountDay, type OpsAction } from "./opsUtils";

interface Unit {
  id: string;
  name: string;
  level: "campaign" | "adset";
  dailyBudget: number | null;
  state: "learning" | "winning" | "healthy" | "tired" | "losing";
  notes: string[];
  metrics: { spend7: number; paid7: number; leads7: number; roas7: number; cpp7: number; frequency7: number };
}
interface AdRow { _id: string; name: string; campaignName?: string; spend: number; paid: number; leads: number; clicks: number }
interface AdsData {
  configured: boolean;
  latestDate: string | null;
  account: AccountDay[];
  units: Unit[];
  bestAds: AdRow[];
  worstAds: AdRow[];
  placements: { _id: string; spend: number; paid: number; leads: number }[];
  actions: OpsAction[];
}

const STATE: Record<Unit["state"], { label: string; cls: string; tip: string }> = {
  winning: { label: "Winning", cls: "bg-success/15 text-success", tip: "Return ≥ target and steady: gets +10% once a week" },
  healthy: { label: "Healthy", cls: "bg-accent text-accent-foreground", tip: "Paying its way: left alone" },
  learning: { label: "Learning", cls: "bg-muted text-muted-foreground", tip: "Changed in the last 3 days: not judged yet" },
  tired: { label: "Tired", cls: "bg-gold/20 text-gold-foreground", tip: "Same people see it too often: fresh creatives next change day" },
  losing: { label: "Losing", cls: "bg-destructive/10 text-destructive", tip: "Cost per member over the limit: −15% once a week" },
};

const cpp = (spend: number, paid: number) => (paid ? inr(spend / paid) : spend ? "No joins" : "–");

export const AdsView = () => {
  const { data, error, loading, reload } = useOps<AdsData>("/manage/ops/ads?days=30");
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      await post("/manage/ops/run/adsSnapshot");
      reload();
    } finally {
      setRefreshing(false);
    }
  };

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <p className="text-sm text-muted-foreground">{loading ? "Loading…" : ""}</p>;
  if (!data.configured) {
    return <Empty>Meta isn't connected. Set META_ADS_TOKEN (with ads_management) on the server, then press Refresh.</Empty>;
  }

  const days = data.account;
  const done = days.slice(0, -1);
  const last = (n: number) => done.slice(-n);
  const sum = (rows: AccountDay[], k: keyof AccountDay) => rows.reduce((t, r) => t + (Number(r[k]) || 0), 0);
  const w1 = last(7);
  const w0 = done.slice(-14, -7);
  const funds = [...days].reverse().find((d) => d.funds != null)?.funds;
  const avg = w1.length ? sum(w1, "spend") / w1.length : 0;
  const placementTotal = data.placements.reduce((t, p) => t + p.spend, 0);
  const openActions = data.actions.filter((a) => ["scheduled", "needs_you", "shadow"].includes(a.status));
  const trend = (a: number, b: number) => (b ? `${a >= b ? "▲" : "▼"} ${Math.abs(Math.round(((a - b) / b) * 100))}% vs last week` : "");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Numbers up to {data.latestDate ?? "–"} · snapshots every 3 hours, kept forever</p>
        <Button size="sm" variant="outline" disabled={refreshing} onClick={refresh}>
          {refreshing ? <Loader2 className="animate-spin" /> : <RefreshCw />} Refresh from Meta
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Kpi label="Prepaid funds" value={inr(funds)} hint={avg && funds != null ? `~${(funds / avg).toFixed(1)} days at ${inr(avg)}/day` : "–"} tone={avg && funds != null && funds / avg < 3 ? "bad" : undefined} />
        <Kpi label="Spend · 7 days" value={inr(sum(w1, "spend"))} hint={trend(sum(w1, "spend"), sum(w0, "spend"))} />
        <Kpi label="Real joins · 7 days" value={num(sum(w1, "joined"))} hint={`${cpp(sum(w1, "spend"), sum(w1, "joined"))} each · Meta says ${num(sum(w1, "paid"))}`} />
        <Kpi
          label="Earned vs spent · 7 d"
          value={`${sum(w1, "spend") ? (sum(w1, "earned") / sum(w1, "spend")).toFixed(2) : "–"}x`}
          hint={`${inr(sum(w1, "earned"))} earned`}
          tone={sum(w1, "earned") >= sum(w1, "spend") * 1.5 ? "good" : sum(w1, "earned") < sum(w1, "spend") ? "bad" : "warn"}
        />
      </div>

      {days.length > 1 && (
        <Panel title="Daily spend vs earned · 30 days" sub="Earned = all payments that day, net of refunds.">
          <DualBars days={days} a="spend" b="earned" labelA="Spend" labelB="Earned" />
        </Panel>
      )}

      {openActions.length > 0 && (
        <Panel title="Planned ad changes" sub="Each runs after its notice period unless you cancel. In Shadow mode they're only logged.">
          <div className="space-y-3">{openActions.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}</div>
        </Panel>
      )}

      <Panel title="Campaigns & ad sets" sub="How the agent sees each budget right now.">
        {data.units.length === 0 ? (
          <Empty>No active campaigns in the latest snapshot.</Empty>
        ) : (
          <div className="space-y-2">
            {data.units.map((u) => (
              <div key={u.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATE[u.state].cls)} title={STATE[u.state].tip}>{STATE[u.state].label}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{u.name}</span>
                  <span className="text-sm font-semibold">{u.dailyBudget ? `${inr(u.dailyBudget)}/day` : ""}</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs">
                  <div><p className="text-muted-foreground">Spend 7d</p><p className="font-semibold">{inr(u.metrics.spend7)}</p></div>
                  <div><p className="text-muted-foreground">Paid 7d</p><p className="font-semibold">{u.metrics.paid7}</p></div>
                  <div><p className="text-muted-foreground">Per member</p><p className="font-semibold">{cpp(u.metrics.spend7, u.metrics.paid7)}</p></div>
                  <div><p className="text-muted-foreground">Return</p><p className={cn("font-semibold", u.metrics.roas7 >= 1.5 ? "text-success" : u.metrics.roas7 < 1 ? "text-destructive" : "")}>{u.metrics.roas7.toFixed(2)}x</p></div>
                </div>
                {u.notes.length > 0 && <p className="mt-2 text-xs text-muted-foreground">{u.notes.join(" ")}</p>}
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        {[{ title: "Best ads · 7 days", rows: data.bestAds }, { title: "Weakest ads · 7 days", rows: data.worstAds }].map((t) => (
          <Panel key={t.title} title={t.title} sub="Ads with over ₹300 spend, by cost per paid member.">
            {t.rows.length === 0 ? <Empty>Not enough data yet.</Empty> : (
              <ul className="divide-y divide-border text-sm">
                {t.rows.map((r) => (
                  <li key={r._id} className="flex items-center justify-between gap-2 py-2">
                    <span className="min-w-0"><span className="block truncate font-medium">{r.name}</span><span className="block truncate text-xs text-muted-foreground">{r.campaignName}</span></span>
                    <span className="shrink-0 text-right"><span className="block font-semibold">{cpp(r.spend, r.paid)}</span><span className="block text-xs text-muted-foreground">{inr(r.spend)} · {r.paid} paid</span></span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        ))}
      </div>

      {data.placements.length > 0 && (
        <Panel title="Where the money went · 7 days">
          <div className="space-y-2">
            {[...data.placements].sort((a, b) => b.spend - a.spend).map((p) => (
              <div key={p._id}>
                <div className="flex justify-between text-sm"><span className="font-medium capitalize">{p._id.replace(/_/g, " ")}</span><span>{inr(p.spend)} · {p.paid} paid · {cpp(p.spend, p.paid)}</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary/70" style={{ width: `${(p.spend / placementTotal) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
};
