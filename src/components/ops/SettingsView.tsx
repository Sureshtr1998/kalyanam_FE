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
  seoIndex: "Blog indexing (Google)",
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

export const SettingsView = ({ overview, reload }: { overview: Overview; reload: () => void }) => {
  const auto = overview.automation;
  const [limits, setLimits] = useState(overview.limits);
  const [ads, setAds] = useState<AdsSettings | undefined>(overview.ads);
  const [brief, setBrief] = useState(overview.brief);
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

      <Panel
        title="Budget"
        sub="The only money numbers that are yours. Everything else (raises, cuts, moving money between languages, ramp-up of newer languages, new ads, the losing line, step sizes) the agent decides, and the algorithm review tunes it; see Ops → Algorithm. Organic posts run by themselves."
      >
        <div className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <span>Daily ad budget ceiling</span>
              <span className="flex items-center gap-1">
                <Input className="h-8 w-24 text-right" inputMode="numeric" value={limits.maxDailySpend ?? ""} onChange={(e) => setLimits({ ...limits, maxDailySpend: Number(e.target.value.replace(/\D/g, "")) || 0 })} />
                <span className="w-8 text-xs text-muted-foreground">₹</span>
              </span>
            </label>
            <label className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2 text-sm">
              <span>Claude AI budget per month</span>
              <span className="flex items-center gap-1">
                <Input className="h-8 w-24 text-right" inputMode="decimal" value={limits.claudeMonthlyUsd ?? ""} onChange={(e) => setLimits({ ...limits, claudeMonthlyUsd: Number(e.target.value) || 0 })} />
                <span className="w-8 text-xs text-muted-foreground">$</span>
              </span>
            </label>
          </div>
          {ads && (
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-2">
              <Checkbox className="mt-0.5" checked={ads.autoCeiling !== false} onCheckedChange={(v) => setAds({ ...ads, autoCeiling: v === true })} />
              <span className="text-sm">
                <b>Raise the ceiling by itself</b>
                <span className="block text-xs text-muted-foreground">When budgets reach 90% of the ceiling and the ads earn their target return over 14 days: +25%, with a WhatsApp. Turn off to stop at a fixed number.</span>
              </span>
            </label>
          )}
          <Button
            size="sm"
            disabled={!!busy}
            onClick={() =>
              act("budget", async () => {
                await post("/manage/ops/config", { limits: { maxDailySpend: limits.maxDailySpend, claudeMonthlyUsd: limits.claudeMonthlyUsd } });
                if (ads) await post("/manage/ops/config", { ads: { autoCeiling: ads.autoCeiling !== false } });
              })
            }
          >
            Save
          </Button>
        </div>
      </Panel>

      <Panel title="Business brief" sub="The only facts the agent may state in replies, comments and posts. Keep it true and current.">
        <Textarea rows={12} value={brief} onChange={(e) => setBrief(e.target.value)} className="font-mono text-xs" />
        <Button size="sm" className="mt-2" disabled={!!busy} onClick={() => act("brief", () => post("/manage/ops/config", { brief }))}>Save brief</Button>
      </Panel>
    </div>
  );
};
