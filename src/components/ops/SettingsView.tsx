import { useState } from "react";
import { CheckCircle2, Circle, Loader2, Play, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Panel } from "./shared";
import { MODULE_LABEL, inr, post, relative, type Mode, type ModuleId, type Overview } from "./opsUtils";

const CONNECTIONS: { key: keyof Overview["connections"]; label: string; how: string }[] = [
  { key: "claude", label: "Claude API", how: "ANTHROPIC_API_KEY on the backend (Vercel → Settings → Environment Variables)." },
  { key: "meta", label: "Meta ads", how: "META_ADS_TOKEN: system-user token with ads_read + ads_management." },
  { key: "page", label: "Facebook Page", how: "Found automatically once the Meta token has the Page assigned and the pages_* permissions." },
  { key: "instagram", label: "Instagram", how: "Found automatically from the Page; the token needs instagram_basic, instagram_manage_comments, instagram_content_publish." },
  { key: "mail", label: "Support mailbox", how: "OPS_MAIL_PASSWORD for contactus@seetharamakalyana.in (GoDaddy)." },
  { key: "seo", label: "Search Console", how: "GSC_SERVICE_ACCOUNT_JSON, and add the service account email as a user in Search Console." },
  { key: "github", label: "GitHub (Developer tab + post images)", how: "GITHUB_TOKEN on the server, and repo secret ANTHROPIC_API_KEY in both repos." },
  { key: "qstash", label: "Scheduler (QStash)", how: "QSTASH_TOKEN, BASE_URL and INTERNAL_ROUTE_SECRET (already used for payments)." },
];

const MODE_HELP: Record<Mode, string> = {
  off: "Does nothing",
  shadow: "Logs what it would do",
  live: "Acts on its own",
};

const LIMITS: { key: string; label: string; unit: string }[] = [
  { key: "maxDailySpend", label: "Max total daily ad budget", unit: "₹" },
  { key: "maxWeeklyIncreasePct", label: "Max budget increase per week", unit: "%" },
  { key: "stepUpPct", label: "Budget step up", unit: "%" },
  { key: "stepDownPct", label: "Budget step down", unit: "%" },
  { key: "scaleRoas", label: "Scale only at return of at least", unit: "x" },
  { key: "netRevenuePerMember", label: "Net revenue per paid member", unit: "₹" },
  { key: "losingCostPerMember", label: "Cost per member that counts as losing", unit: "₹" },
  { key: "minRunwayDays", label: "Don't scale with funds for fewer than", unit: "days" },
  { key: "adNoticeHours", label: "Notice before ad changes", unit: "h" },
  { key: "supportDelayHours", label: "Wait before replies & verification", unit: "h" },
  { key: "commentDeleteHours", label: "Delete hidden comments after", unit: "h" },
  { key: "claudeMonthlyUsd", label: "Claude budget per month", unit: "$" },
];

const JOB_LABEL: Record<string, string> = {
  adsSnapshot: "Ads snapshot",
  adsWeekly: "Ads weekly decisions",
  weeklyReview: "Weekly review",
  organicPlan: "Plan next week's posts",
  seoWeekly: "Search Console",
  tools: "Tools reading",
  support: "Check inbox",
  comments: "Check comments",
};

const TASK_LABEL: Record<string, string> = {
  "support.triage": "Sorting support mail",
  "support.reply": "Writing mail replies",
  "comments.triage": "Comments & replies",
  "organic.plan": "Weekly posts",
  "ads.creatives": "New ad creatives",
  "ads.growth": "New ad set ideas",
  "review.weekly": "Weekly review",
  "seo.weekly": "SEO read",
};

const nextMonths = () => {
  const d = new Date();
  return Array.from({ length: 6 }, (_, i) => new Date(d.getFullYear(), d.getMonth() + i, 1).toLocaleDateString("en-CA").slice(0, 7));
};

export const SettingsView = ({ overview, reload }: { overview: Overview; reload: () => void }) => {
  const auto = overview.automation;
  const [limits, setLimits] = useState(overview.limits);
  const [brief, setBrief] = useState(overview.brief);
  const [targets, setTargets] = useState(() =>
    nextMonths().map((m) => overview.targets.find((t) => t.month === m) ?? { month: m, members: 0, revenue: 0, spend: 0 })
  );
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
      reload();
    } catch {
      /* toast shown */
    } finally {
      setBusy(null);
    }
  };

  const setMode = (m: ModuleId, mode: Mode) => act(`mode-${m}`, () => post("/manage/ops/config", { modes: { [m]: mode } }));

  return (
    <div className="space-y-4">
      <Panel
        title={
          <span className="flex items-center gap-2">
            <span className={cn("size-2.5 rounded-full", auto?.healthy ? "bg-success" : auto?.scheduled ? "bg-gold" : "bg-destructive")} />
            Automation: {auto?.healthy ? "on" : auto?.scheduled ? "starting" : "off"}
          </span>
        }
        sub={
          auto?.lastTickMinutes != null
            ? `Last run ${auto.lastTickMinutes} min ago · runs every 15 minutes, starts by itself`
            : auto?.scheduled
              ? "Scheduled; the first run happens within 15 minutes"
              : auto?.error || "Needs QSTASH_TOKEN, BASE_URL and INTERNAL_ROUTE_SECRET on the server"
        }
        actions={
          <Button size="sm" variant="outline" disabled={!!busy || !overview.connections.qstash} onClick={() => act("start", () => post("/manage/ops/automation/start"))}>
            {busy === "start" ? <Loader2 className="animate-spin" /> : <Power />} Restart
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          The agent checks mail and comments every 15 minutes, reads Meta every 3 hours, decides ad budgets on Mondays, plans posts on Thursdays and writes a weekly review every Monday.
        </p>
      </Panel>

      <Panel title="What the agent may do" sub="Start in Shadow, read the Shadow log for a week or two, then switch to Live.">
        <div className="divide-y divide-border">
          {(Object.keys(MODULE_LABEL) as ModuleId[]).map((m) => (
            <div key={m} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <span className="text-sm font-medium">{MODULE_LABEL[m]}</span>
              <div className="inline-flex rounded-xl bg-muted p-1">
                {(["off", "shadow", "live"] as Mode[]).map((mode) => (
                  <button
                    key={mode}
                    title={MODE_HELP[mode]}
                    disabled={!!busy}
                    onClick={() => setMode(m, mode)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors",
                      overview.modes[m] === mode
                        ? mode === "live" ? "bg-success text-white" : mode === "shadow" ? "bg-gold text-gold-foreground" : "bg-card shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Connections">
        <ul className="space-y-2">
          {CONNECTIONS.map((c) => (
            <li key={c.key} className="flex gap-2 text-sm">
              {overview.connections[c.key] ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
              <span><b>{c.label}</b>{!overview.connections[c.key] && <span className="block text-xs text-muted-foreground">{c.how}</span>}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="xs" variant="outline" disabled={!overview.connections.mail || !!busy} onClick={() => act("tm", () => post("/manage/ops/test/mail"))}>Test mailbox</Button>
          <Button size="xs" variant="outline" disabled={!overview.connections.meta || !!busy} onClick={() => act("tmeta", () => post("/manage/ops/test/meta"))}>Test Meta</Button>
        </div>
      </Panel>

      <Panel title="Run a job now" sub="Handy after connecting something. Each shows when it last ran.">
        <div className="grid gap-2 sm:grid-cols-2">
          {overview.jobs.map((j) => {
            const last = overview.lastRuns[j];
            return (
              <div key={j} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{JOB_LABEL[j] ?? j}</p>
                  <p className={cn("truncate text-xs", last && !last.ok ? "text-destructive" : "text-muted-foreground")}>
                    {last ? `${last.ok ? "OK" : last.error} · ${relative(last.at)}` : "Never ran"}
                  </p>
                </div>
                <Button size="icon-sm" variant="outline" aria-label={`Run ${JOB_LABEL[j] ?? j}`} disabled={!!busy} onClick={() => act(`job-${j}`, () => post(`/manage/ops/run/${j}`))}>
                  {busy === `job-${j}` ? <Loader2 className="animate-spin" /> : <Play />}
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="Claude AI spend"
        sub={`At ₹${overview.claude.inrRate.toFixed(2)} per $ (updated daily). Every call is logged; the agent stops at the monthly cap.`}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">This month</p><p className="text-lg font-bold">{inr(overview.claude.monthUsd * overview.claude.inrRate)}</p></div>
          <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">All time</p><p className="text-lg font-bold">{inr(overview.claude.totalUsd * overview.claude.inrRate)}</p></div>
          <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs text-muted-foreground">Calls</p><p className="text-lg font-bold">{overview.claude.totalCalls}</p></div>
        </div>
        {overview.claude.byTask.length > 0 && (
          <ul className="mt-3 divide-y divide-border text-sm">
            {overview.claude.byTask.map((t) => (
              <li key={t.task} className="flex justify-between py-1.5">
                <span>{TASK_LABEL[t.task] ?? t.task}</span>
                <span className="text-muted-foreground">{t.calls} calls · <b className="text-foreground">{inr(t.usd * overview.claude.inrRate, 2)}</b></span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Targets" sub="Used for expected vs actual. Members = new sign-ups; revenue = net of refunds.">
        <div className="space-y-2">
          <div className="grid grid-cols-[70px_1fr_1fr_1fr] gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Month</span><span>Members</span><span>Revenue ₹</span><span>Ad spend ₹</span>
          </div>
          {targets.map((t, i) => (
            <div key={t.month} className="grid grid-cols-[70px_1fr_1fr_1fr] items-center gap-2">
              <span className="text-sm font-medium">{t.month.slice(2)}</span>
              {(["members", "revenue", "spend"] as const).map((k) => (
                <Input key={k} inputMode="numeric" value={t[k] || ""} onChange={(e) => setTargets(targets.map((x, j) => (j === i ? { ...x, [k]: Number(e.target.value.replace(/\D/g, "")) || 0 } : x)))} />
              ))}
            </div>
          ))}
          <Button size="sm" disabled={!!busy} onClick={() => act("targets", () => post("/manage/ops/config", { targets: [...overview.targets.filter((t) => !targets.some((x) => x.month === t.month)), ...targets] }))}>Save targets</Button>
        </div>
      </Panel>

      <Panel title="Limits" sub="Guard rails the agent never crosses.">
        <div className="grid gap-2 sm:grid-cols-2">
          {LIMITS.map((l) => (
            <label key={l.key} className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <span>{l.label}</span>
              <span className="flex items-center gap-1">
                <Input className="h-8 w-24 text-right" inputMode="decimal" value={limits[l.key] ?? ""} onChange={(e) => setLimits({ ...limits, [l.key]: Number(e.target.value) })} />
                <span className="w-8 text-xs text-muted-foreground">{l.unit}</span>
              </span>
            </label>
          ))}
        </div>
        <Button size="sm" className="mt-3" disabled={!!busy} onClick={() => act("limits", () => post("/manage/ops/config", { limits }))}>Save limits</Button>
      </Panel>

      <Panel title="Business brief" sub="The only facts the agent may state in replies, comments and posts. Keep it true and current.">
        <Textarea rows={12} value={brief} onChange={(e) => setBrief(e.target.value)} className="font-mono text-xs" />
        <Button size="sm" className="mt-2" disabled={!!busy} onClick={() => act("brief", () => post("/manage/ops/config", { brief }))}>Save brief</Button>
      </Panel>
    </div>
  );
};
