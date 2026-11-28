import { useState } from "react";
import { CheckCircle2, Circle, Loader2, MessageCircle, Play, Power, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Panel } from "./shared";
import { MODULE_LABEL, inr, post, relative, type AdsSettings, type Mode, type ModuleId, type Overview } from "./opsUtils";

const CONNECTIONS: { key: keyof Overview["connections"]; label: string; how: string }[] = [
  { key: "claude", label: "Claude API", how: "ANTHROPIC_API_KEY on the backend (Vercel → Settings → Environment Variables)." },
  { key: "meta", label: "Meta ads", how: "META_ADS_TOKEN: system-user token with ads_read + ads_management." },
  { key: "page", label: "Facebook Page", how: "Found automatically once the Meta token has the Page assigned and the pages_* permissions." },
  { key: "instagram", label: "Instagram", how: "Found automatically from the Page; the token needs instagram_basic, instagram_manage_comments, instagram_content_publish." },
  { key: "mail", label: "Support mailbox", how: "OPS_MAIL_PASSWORD for contactus@seetharamakalyana.in (GoDaddy)." },
  { key: "seo", label: "Search Console", how: "GSC_SERVICE_ACCOUNT_JSON, and add the service account email as a user in Search Console." },
  { key: "github", label: "GitHub (Developer tab + post images)", how: "GITHUB_TOKEN on the server, and repo secret ANTHROPIC_API_KEY in both repos." },
  { key: "qstash", label: "QStash (payments' safety net; the agent's timer is Vercel Cron)", how: "QSTASH_TOKEN, BASE_URL and INTERNAL_ROUTE_SECRET (used for payments)." },
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
  { key: "losingCostPerMember", label: "Real cost per member that counts as losing (7 & 14 days)", unit: "₹" },
  { key: "adNoticeHours", label: "Notice before ad changes", unit: "h" },
  { key: "supportDelayHours", label: "Wait before replies & verification", unit: "h" },
  { key: "commentDeleteHours", label: "Delete hidden comments after", unit: "h" },
  { key: "claudeMonthlyUsd", label: "Claude budget per month", unit: "$" },
];

const JOB_LABEL: Record<string, string> = {
  membership: "Membership: reminders & hiding",
  adsSnapshot: "Ads snapshot",
  adsWeekly: "Ads budgets (Mondays)",
  adsMidweek: "Ads raises (Thursdays)",
  algorithmReview: "Algorithm review (monthly)",
  adsPlan: "Ads batch: pauses & new ads",
  ideasAuto: "Plan waiting ideas",
  weeklyReview: "Weekly review",
  organicPlan: "Plan next week's posts",
  organicStats: "Post results",
  storyStats: "Story results",
  seoWeekly: "Search Console",
  tools: "Tools reading",
  support: "Check inbox",
  comments: "Check comments",
  reminders: "Reminders (unpaid & verify)",
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
  const [ads, setAds] = useState<AdsSettings | undefined>(overview.ads);
  const [planEvenings, setPlanEvenings] = useState(!!overview.organic?.planEvenings);
  const [ownerUntil, setOwnerUntil] = useState(overview.organic?.ownerUntil ? overview.organic.ownerUntil.slice(0, 10) : "");
  const [brief, setBrief] = useState(overview.brief);
  const [targets, setTargets] = useState(() =>
    nextMonths().map((m) => overview.targets.find((t) => t.month === m) ?? { month: m, members: 0, revenue: 0, spend: 0 })
  );
  const [busy, setBusy] = useState<string | null>(null);
  const alerts = overview.alerts;
  const [whatsapp, setWhatsapp] = useState(alerts?.whatsapp ? alerts.whatsapp.replace(/^91/, "") : "");
  const savedWhatsapp = alerts?.whatsapp ? alerts.whatsapp.replace(/^91/, "") : "";

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
            <span className={cn("size-2.5 rounded-full", auto?.healthy ? "bg-success" : auto?.stalled || !auto?.ready ? "bg-destructive" : "bg-gold")} />
            Automation: {auto?.healthy ? "on" : auto?.stalled ? "not running" : auto?.ready ? "starting" : "off"}
          </span>
        }
        sub={
          !auto?.ready
            ? auto?.error || "Needs CRON_SECRET on the server"
            : auto?.stalled
              ? `Last run ${auto.lastTickMinutes} min ago, but it should run every 15 minutes. Press Run now; if it stays stopped, check Vercel → kalyanam-be → Settings → Cron Jobs.`
              : auto?.lastTickMinutes != null
                ? `Last run ${auto.lastTickMinutes} min ago · Vercel Cron runs it every 15 minutes, by itself`
                : "Vercel Cron runs it every 15 minutes; the first run comes within 15 minutes of a deploy"
        }
        actions={
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => act("start", () => post("/manage/ops/automation/start"))}>
            {busy === "start" ? <Loader2 className="animate-spin" /> : <Power />} Run now
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          The agent checks mail and comments every 15 minutes, reads Meta every 3 hours (urgent problems are emailed), moves ad budgets on Mondays, batches new and paused ads every 2 weeks, plans posts on Thursdays and writes a weekly review every Monday.
        </p>
      </Panel>

      {alerts && (
        <Panel
          title={
            <span className="flex items-center gap-2">
              <MessageCircle className="size-4" />
              WhatsApp alerts: {alerts.whatsapp ? "on" : "off"}
            </span>
          }
          sub="Sent to your phone at once when something fails or breaks, when a member writes a 3rd time about a refund or a question the agent couldn't answer, for urgent mails (safety, legal, payment disputes) and anything else only you can handle. Meta and MSG91 balances are never sent: those are yours to watch. The same thing isn't sent twice within 12 hours."
        >
          <div className="space-y-2">
            <label className="block text-sm">
              <span className="font-medium">Your WhatsApp number</span>
              <span className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">+91</span>
                <Input className="h-9 w-44" inputMode="numeric" placeholder="10-digit mobile" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                <Button size="sm" disabled={!!busy || whatsapp.trim() === savedWhatsapp} onClick={() => act("whatsapp", () => post("/manage/ops/config", { alerts: { whatsapp } }))}>
                  {busy === "whatsapp" ? <Loader2 className="animate-spin" /> : null} Save
                </Button>
                <Button size="sm" variant="outline" disabled={!!busy || !alerts.whatsapp || !alerts.ready} onClick={() => act("whatsapp-test", () => post("/manage/ops/alerts/test", {}))}>
                  {busy === "whatsapp-test" ? <Loader2 className="animate-spin" /> : <Send />} Send test
                </Button>
              </span>
            </label>
            {!alerts.ready && <p className="text-xs text-destructive">MSG91 WhatsApp isn't set up on the server (MSG91_AUTHKEY, MSG91_WHATSAPP_SENDER_ID, MSG91_WHATSAPP_API).</p>}
            {alerts.lastError && (
              <p className="text-xs text-destructive">
                The last WhatsApp failed{alerts.lastErrorAt ? ` (${relative(alerts.lastErrorAt)})` : ""}: {alerts.lastError}. Alerts still go to your email.
              </p>
            )}
            {alerts.lastSentAt && !alerts.lastError && <p className="text-xs text-muted-foreground">Last handed to MSG91 {relative(alerts.lastSentAt)}. Delivery shows in MSG91 → WhatsApp → Logs.</p>}
            <details className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground">
              <summary className="cursor-pointer">The WhatsApp template behind it</summary>
              <p className="mt-1">
                WhatsApp lets a business start a chat only with a template Meta has approved. In MSG91 → WhatsApp → Templates it is <b>{alerts.template}</b> (category Utility, language English, code "{alerts.templateLanguage}") with this body:
              </p>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-2 font-sans">{alerts.templateBody}</pre>
            </details>
          </div>
        </Panel>
      )}

      {overview.reminders && (
        <Panel
          title="Reminders · last 24 hours"
          sub="Unpaid sign-ups (2 h after leaving, then every 3 days) and unverified members (1, 4 and 7 days after joining). At most 3 per person, 8 am – 9 pm."
        >
          <div className="grid gap-2 text-sm sm:grid-cols-4">
            <p><b>{overview.reminders.unpaid}</b> to unpaid sign-ups</p>
            <p><b>{overview.reminders.verify}</b> to unverified members</p>
            <p><b>{overview.reminders.whatsapp}</b> also on WhatsApp</p>
            <p><b>{overview.reminders.paidAfter}</b> paid after a reminder</p>
          </div>
          {(overview.reminders.failed > 0 || overview.reminders.bounced > 0) && (
            <p className="mt-2 text-xs text-muted-foreground">
              {overview.reminders.failed} couldn't be sent{overview.reminders.lastError ? ` (last: ${overview.reminders.lastError})` : ""} · {overview.reminders.bounced} email address(es) bounced, so those members get no more email reminders.
            </p>
          )}
        </Panel>
      )}

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

      {ads && (
        <Panel
          title="Ads rules"
          sub="How the ads agent paces itself. Budgets go up or down only on how the ads do, never on the prepaid balance. Budget moves run any Monday (steps under 20% don't reset Meta's learning); new or paused ads and new ad sets only on batch days."
        >
          <div className="space-y-2">
            {(
              [
                ["rebalance", "Move budget between languages", "From languages that cost ≥ 20% more per member to ones that cost ≥ 15% less. Total stays the same."],
                ["pauseLosingAds", "Pause ads that cost far more", "Ads costing ≥ 1.8× their campaign per member over 14 days. Never leaves an ad set with fewer than 2 ads."],
                ["newAdsets", "Create new ad sets", "Off until an ad set gets ~35+ members a week; a new one splits Meta's learning."],
                ["midweekRaises", "Raise winners on Thursdays too", "A second +10% step for a winning language, 3+ days after Monday's. The weekly +25% limit still applies."],
                ["brake", "Mid-week brake", "If a language's last 3 days cost twice its usual (₹3,000+ spent), −15% without waiting for Monday. Ramp-up languages get an alert instead."],
              ] as const
            ).map(([key, label, help]) => (
              <label key={key} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-2">
                <Checkbox className="mt-0.5" checked={key === "midweekRaises" || key === "brake" ? ads[key] !== false : !!ads[key]} onCheckedChange={(v) => setAds({ ...ads, [key]: v === true })} />
                <span className="text-sm"><b>{label}</b><span className="block text-xs text-muted-foreground">{help}</span></span>
              </label>
            ))}
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <b>Ramp-up languages</b>
              <span className="block text-xs text-muted-foreground">Newer languages that cost more for now: they never give budget away and are never cut. They can still receive money and be raised when they win.</span>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {["Kannada", "Telugu", "Tamil", "Hindi"].map((l) => {
                  const list = ads.rampUp?.languages ?? [];
                  return (
                    <label key={l} className="flex cursor-pointer items-center gap-1.5">
                      <Checkbox
                        checked={list.includes(l)}
                        onCheckedChange={(v) => setAds({ ...ads, rampUp: { until: ads.rampUp?.until ?? null, languages: v === true ? [...new Set([...list, l])] : list.filter((x) => x !== l) } })}
                      />
                      {l}
                    </label>
                  );
                })}
                <span className="flex items-center gap-1.5">
                  until
                  <Input type="date" className="h-8 w-40" value={ads.rampUp?.until ? ads.rampUp.until.slice(0, 10) : ""} onChange={(e) => setAds({ ...ads, rampUp: { languages: ads.rampUp?.languages ?? [], until: e.target.value || null } })} />
                </span>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                <span>No ad changes before</span>
                <Input type="date" className="h-8 w-40" value={ads.handsOffUntil ? ads.handsOffUntil.slice(0, 10) : ""} onChange={(e) => setAds({ ...ads, handsOffUntil: e.target.value || null })} />
              </label>
              <label className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
                <span>Days between batches</span>
                <span className="flex items-center gap-1"><Input className="h-8 w-20 text-right" inputMode="numeric" value={ads.batchEveryDays} onChange={(e) => setAds({ ...ads, batchEveryDays: Number(e.target.value) || 0 })} /><span className="w-8 text-xs text-muted-foreground">days</span></span>
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-medium">Email urgent alerts to</span>
              <span className="block text-xs text-muted-foreground">Account problems, disapproved ads, stalled delivery, a language without ads. Blank = every admin's account email.</span>
              <Input className="mt-1" type="email" placeholder="you@example.com" value={ads.alertEmail} onChange={(e) => setAds({ ...ads, alertEmail: e.target.value })} />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Your standing rules for ads</span>
              <span className="block text-xs text-muted-foreground">The agent reads these before writing ads or planning ad sets.</span>
              <Textarea rows={6} className="mt-1 text-xs" value={ads.preferences} onChange={(e) => setAds({ ...ads, preferences: e.target.value })} />
            </label>
            <Button size="sm" disabled={!!busy} onClick={() => act("ads", () => post("/manage/ops/config", { ads }))}>Save ads rules</Button>
          </div>
        </Panel>
      )}

      <Panel
        title="Organic posts"
        sub="The agent runs your organic posts: every Thursday it writes, designs and schedules next week. Meta's API can't see posts you schedule by hand in Business Suite, so days you scheduled yourself are set below and left alone."
      >
        <div className="space-y-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-2">
            <Checkbox className="mt-0.5" checked={planEvenings} onCheckedChange={(v) => setPlanEvenings(v === true)} />
            <span className="text-sm">
              <b>The agent plans and posts everything</b>
              <span className="block text-xs text-muted-foreground">Each day: a 7:30 pm post, a 12:30 pm safety post and an 8:30 am story. Reels and videos aren't made by the agent.</span>
            </span>
          </label>
          <label className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
            <span>You scheduled posts by hand up to</span>
            <Input type="date" className="h-8 w-40" value={ownerUntil} onChange={(e) => setOwnerUntil(e.target.value)} />
          </label>
          <Button size="sm" disabled={!!busy} onClick={() => act("organic", () => post("/manage/ops/config", { organic: { planEvenings, ownerUntil: ownerUntil || null } }))}>Save</Button>
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
