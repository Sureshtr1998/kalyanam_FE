import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, DualBars, Empty, ErrorNote, Kpi, Panel } from "./shared";
import { inr, num, post, useOps, type AccountDay, type AdsSettings, type OpsAction } from "./opsUtils";

interface Unit {
  id: string;
  name: string;
  language?: string;
  level: "campaign" | "adset";
  dailyBudget: number | null;
  state: "learning" | "low_data" | "winning" | "healthy" | "losing";
  flags?: { tired?: boolean };
  notes: string[];
  metrics: {
    spend7: number;
    paid7: number;
    leads7: number;
    roas7: number;
    roas14?: number;
    cpp7: number;
    cpp14?: number;
    frequency7: number;
    real7?: number | null;
    spendRate7?: number | null;
    calib?: number;
  };
}
interface AdRow { _id: string; name: string; campaignName?: string; spend: number; paid: number; leads: number; clicks: number }
interface IdeaRow { idea: string; label: string; language: string; audience: string; spend: number; paid: number; cpp: number | null; ads: number }
interface Creative {
  _id: string;
  idea?: string;
  ideaLabel?: string;
  role?: "proven" | "test";
  angle?: string;
  review?: string;
  verdict?: "win" | "even" | "lose" | "unclear";
  results?: { note?: string };
  campaignName?: string;
  adsetName?: string;
  language: string;
  status: "design" | "ready" | "live" | "cancelled" | "failed";
  imageUrl?: string;
  design?: { kicker?: string; headline?: string; highlight?: string };
  primaryText?: string;
  translation?: string;
  utmContent?: string;
  /** e.g. "/kn/pricing"; null when the ad keeps the copied ad's link. */
  linkPage?: string | null;
  /** When its launch card runs (scheduled ads). */
  launchAt?: string | null;
  liveAt?: string | null;
  createdAt: string;
}
interface AdsData {
  configured: boolean;
  latestDate: string | null;
  account: AccountDay[];
  units: Unit[];
  bestAds: AdRow[];
  worstAds: AdRow[];
  placements: { _id: string; spend: number; paid: number; leads: number }[];
  actions: OpsAction[];
  settings?: AdsSettings;
  creatives?: Creative[];
  ideas?: IdeaRow[];
}

const LANGS = ["Kannada", "Telugu", "Tamil", "Hindi", "English"];
/** "28 Nov, 8:31 am" in IST. */
const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
const VERDICT: Record<NonNullable<Creative["verdict"]>, { label: string; cls: string }> = {
  win: { label: "Won", cls: "bg-success/15 text-success" },
  even: { label: "Even", cls: "bg-accent text-accent-foreground" },
  lose: { label: "Lost", cls: "bg-destructive/10 text-destructive" },
  unclear: { label: "Too little delivery", cls: "bg-muted text-muted-foreground" },
};

/** Idea × language table for one audience: cost per member, blank where untested. */
const IdeaTable = ({ rows, audience }: { rows: IdeaRow[]; audience: string }) => {
  const mine = rows.filter((r) => r.audience === audience);
  const ideas = [...new Set(mine.map((r) => r.idea))];
  const langs = LANGS.filter((l) => mine.some((r) => r.language === l));
  if (!ideas.length) return null;
  const cell = (idea: string, lang: string) => mine.find((r) => r.idea === idea && r.language === lang);
  const best = Math.min(...mine.filter((r) => r.paid >= 5 && r.cpp).map((r) => r.cpp as number));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] text-xs">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1.5 pr-2 font-medium">Idea</th>
            {langs.map((l) => <th key={l} className="px-2 py-1.5 text-right font-medium">{l}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {ideas.map((idea) => (
            <tr key={idea}>
              <td className="py-1.5 pr-2 font-medium">{mine.find((r) => r.idea === idea)?.label}</td>
              {langs.map((l) => {
                const c = cell(idea, l);
                return (
                  <td key={l} className={cn("px-2 py-1.5 text-right", c?.cpp === best && "font-bold text-success")} title={c ? `${inr(c.spend)} · ${c.paid} members · ${c.ads} ad(s)` : "Not tried"}>
                    {!c ? <span className="text-muted-foreground">–</span> : c.spend < 1500 ? <span className="text-muted-foreground">testing</span> : c.cpp ? inr(c.cpp) : "no joins"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const STATE: Record<Unit["state"], { label: string; cls: string; tip: string }> = {
  winning: { label: "Winning", cls: "bg-success/15 text-success", tip: "Return at or above target over 7 and 14 days: +10% (or +15%) once a week, if it spends its budget" },
  healthy: { label: "Healthy", cls: "bg-accent text-accent-foreground", tip: "Paying its way: budget may move to or from it on Mondays" },
  learning: { label: "Learning", cls: "bg-muted text-muted-foreground", tip: "Changed recently: not judged until Meta has re-learned" },
  low_data: { label: "Too early", cls: "bg-muted text-muted-foreground", tip: "Not enough spend or members in 7 days to judge" },
  losing: { label: "Losing", cls: "bg-destructive/10 text-destructive", tip: "Real cost per member over the limit for 7 and 14 days: money moves to a cheaper language, or -15%" },
};

const CREATIVE_STATUS: Record<Creative["status"], string> = {
  design: "Being drawn",
  ready: "Ready, waiting for its day",
  live: "Live",
  cancelled: "Cancelled",
  failed: "Failed",
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
  const runwayDays = avg && funds != null ? funds / avg : null;
  const calib = data.units.find((u) => u.metrics.calib)?.metrics.calib ?? 1;
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
        <Kpi
          label="Prepaid funds"
          value={inr(funds)}
          hint={runwayDays == null ? "–" : `~${runwayDays.toFixed(1)} days at ${inr(avg)}/day · for reference; never used for ad decisions`}
        />
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

      <Panel
        title="Campaigns & ad sets"
        sub={`How the agent sees each budget right now, judged on 7 days and confirmed on 14. Real return counts Meta's members ×${calib.toFixed(2)}, because Meta misses some joins (our joins ÷ Meta's, last 14 days).`}
      >
        {data.units.length === 0 ? (
          <Empty>No active campaigns in the latest snapshot.</Empty>
        ) : (
          <div className="space-y-2">
            {data.units.map((u) => (
              <div key={u.id} className="rounded-xl border border-border p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", (STATE[u.state] ?? STATE.healthy).cls)} title={(STATE[u.state] ?? STATE.healthy).tip}>
                    {(STATE[u.state] ?? STATE.healthy).label}
                  </span>
                  {u.flags?.tired && (
                    <span
                      className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-semibold text-gold-foreground"
                      title="Same people see these ads too often, or clicks fell while cost rose: fresh ads on the next batch day"
                    >
                      Tired ads
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate font-semibold">{u.name}</span>
                  <span className="text-sm font-semibold">{u.dailyBudget ? `${inr(u.dailyBudget)}/day` : ""}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-5">
                  <div><p className="text-muted-foreground">Spend 7d</p><p className="font-semibold">{inr(u.metrics.spend7)}</p></div>
                  <div>
                    <p className="text-muted-foreground">Members 7d</p>
                    <p className="font-semibold">
                      {u.metrics.paid7}
                      {u.metrics.real7 != null && <span className="font-normal text-muted-foreground"> · {u.metrics.real7} {u.language ?? ""} joined</span>}
                    </p>
                  </div>
                  <div><p className="text-muted-foreground">Per member 7d</p><p className="font-semibold">{cpp(u.metrics.spend7, u.metrics.paid7)}</p></div>
                  <div><p className="text-muted-foreground">Per member 14d</p><p className="font-semibold">{u.metrics.cpp14 != null && Number.isFinite(u.metrics.cpp14) ? inr(u.metrics.cpp14) : "–"}</p></div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-muted-foreground">Real return</p>
                    <p className={cn("font-semibold", u.metrics.roas7 >= 1.5 ? "text-success" : u.metrics.roas7 < 1 ? "text-destructive" : "")}>
                      {u.metrics.roas7.toFixed(2)}x
                      {u.metrics.spendRate7 != null && <span className="font-normal text-muted-foreground"> · spends {Math.round(u.metrics.spendRate7 * 100)}%</span>}
                    </p>
                  </div>
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

      {(data.ideas?.length ?? 0) > 0 && (
        <Panel
          title="Idea library · 60 days"
          sub="Cost per member for each idea, by language. Fresh ads repeat the best proven idea and test the most promising untried one. “testing” = under ₹1,500 spent so far."
        >
          <div className="space-y-4">
            {["parents", "young"].map((a) => (
              <div key={a}>
                <p className="mb-1 text-sm font-semibold">{a === "parents" ? "Parents 45–65" : "Young 24–34"}</p>
                <IdeaTable rows={data.ideas!} audience={a} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      {(data.creatives?.length ?? 0) > 0 && (
        <Panel title="Ads the agent made" sub="Drawn in your winning ads' layout. Each has its own utm_content, so its joins show separately. Check the English version.">
          {(() => {
            const all = data.creatives!;
            const groups: { key: string; title: string; items: Creative[]; folded?: boolean }[] = [
              {
                key: "scheduled",
                title: "Scheduled",
                items: all
                  .filter((c) => c.status === "design" || c.status === "ready")
                  .sort((a, b) => new Date(a.launchAt ?? "9999").getTime() - new Date(b.launchAt ?? "9999").getTime()),
              },
              { key: "live", title: "Live", items: all.filter((c) => c.status === "live") },
              { key: "old", title: "Old / cancelled", items: all.filter((c) => c.status === "cancelled" || c.status === "failed"), folded: true },
            ];
            const grid = (items: Creative[]) => (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
              <div key={c._id} className="overflow-hidden rounded-xl border border-border">
                {c.imageUrl ? (
                  <img src={c.imageUrl} alt={c.design?.headline ?? "Ad"} className="aspect-[4/5] w-full bg-muted object-cover" loading="lazy" />
                ) : (
                  <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-1 bg-muted/60 p-4 text-center">
                    <span className="text-xs font-semibold text-primary">{c.design?.kicker}</span>
                    <span className="font-semibold">{c.design?.headline}</span>
                    <span className="font-semibold text-primary">{c.design?.highlight}</span>
                  </div>
                )}
                <div className="space-y-1 p-3 text-xs">
                  <p className="font-semibold">
                    {c.campaignName}
                    {c.adsetName ? ` › ${c.adsetName}` : ""}
                  </p>
                  {(c.status === "design" || c.status === "ready") && c.launchAt && (
                    <p className="font-semibold text-primary">Goes live {when(c.launchAt)}</p>
                  )}
                  {c.status === "live" && c.liveAt && <p className="font-semibold text-emerald-700">Live since {when(c.liveAt)}</p>}
                  <p className="text-muted-foreground">
                    {CREATIVE_STATUS[c.status]}
                    {c.utmContent ? ` · ${c.utmContent}` : ""}
                  </p>
                  {c.linkPage && <p className="text-muted-foreground">Links to seetharamakalyana.in{c.linkPage}</p>}
                  {c.ideaLabel && (
                    <p className="flex flex-wrap items-center gap-1">
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{c.role === "proven" ? "Proven" : "Test"}: {c.ideaLabel}</span>
                      {c.verdict && <span className={cn("rounded-full px-1.5 py-0.5 font-semibold", VERDICT[c.verdict].cls)}>{VERDICT[c.verdict].label}</span>}
                    </p>
                  )}
                  {c.results?.note && <p className="text-muted-foreground">{c.results.note}</p>}
                  {c.angle && <p className="italic text-muted-foreground">{c.angle}</p>}
                  {c.translation && (
                    <details>
                      <summary className="cursor-pointer font-medium text-primary">In English</summary>
                      <p className="mt-1 whitespace-pre-line text-muted-foreground">{c.translation}</p>
                    </details>
                  )}
                </div>
              </div>
                ))}
              </div>
            );
            return (
              <div className="space-y-4">
                {groups.map((g) =>
                  g.folded ? (
                    g.items.length > 0 && (
                      <details key={g.key}>
                        <summary className="cursor-pointer text-sm font-semibold">{g.title} · {g.items.length}</summary>
                        <div className="mt-2">{grid(g.items)}</div>
                      </details>
                    )
                  ) : (
                    <div key={g.key} className="space-y-2">
                      <h4 className="text-sm font-semibold">{g.title} · {g.items.length}</h4>
                      {g.items.length ? grid(g.items) : <p className="text-xs text-muted-foreground">None.</p>}
                    </div>
                  )
                )}
              </div>
            );
          })()}
        </Panel>
      )}

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
