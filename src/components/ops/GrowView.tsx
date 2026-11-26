import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, Empty, ErrorNote, Kpi, Panel } from "./shared";
import { num, post, useOps, when, type OpsAction } from "./opsUtils";

interface Post {
  _id: string;
  publishAt: string;
  language: string;
  topic: string;
  angle?: string;
  format?: "card" | "join";
  code?: string;
  caption: string;
  cta?: string;
  imageUrl?: string;
  design?: { headline?: string; kicker?: string };
  platforms: string[];
  status: string;
  error?: string;
}
interface PostStat {
  id: string;
  platform: "facebook" | "instagram";
  at: string;
  text: string;
  code: string | null;
  reach: number | null;
  engagement: number;
  linkClicks?: number | null;
  profileVisits?: number | null;
  signups: number | null;
}
interface Story {
  _id: string;
  plannedAt?: string;
  at?: string;
  language?: string;
  concept?: string;
  permalink?: string;
  reach?: number | null;
  replies?: number | null;
  profileVisits?: number | null;
  follows?: number | null;
  navigation?: { exited?: number | null };
}
interface StoryConcept {
  concept: string;
  stories: number;
  avgReach: number;
  profileVisitsPer100: number;
  repliesPer100: number;
  follows: number;
  exitRate: number | null;
}
interface OrganicData {
  posts: Post[];
  stories?: Story[];
  storyConcepts?: StoryConcept[];
  stats: { period: string; posts: PostStat[]; totals: { facebook: number; instagram: number; bio: number; total: number }; insightsErrors?: Record<string, string> } | null;
  storyInsightsErrors?: Record<string, string> | null;
  signups: Record<string, number>;
}

/** Organic posts: next week's plan and what went out. */
export const OrganicView = () => {
  const { data, error, reload } = useOps<OrganicData>("/manage/ops/organic");
  const [busy, setBusy] = useState(false);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  const upcoming = data.posts.filter((p) => new Date(p.publishAt) > new Date());
  const past = data.posts.filter((p) => new Date(p.publishAt) <= new Date()).reverse();
  const signupsFor = (p: Post) => (p.code ? (data.signups[`f${p.code}`] ?? 0) + (data.signups[`i${p.code}`] ?? 0) : null);
  const codes = Object.entries(data.signups);
  const total = codes.reduce((t, [, n]) => t + n, 0);
  const fromInstagram = codes.filter(([c]) => c === "bio" || c.startsWith("i")).reduce((t, [, n]) => t + n, 0);
  const ranked = [...(data.stats?.posts ?? [])].sort(
    (a, b) => (b.signups ?? -1) - (a.signups ?? -1) || (b.linkClicks ?? b.profileVisits ?? -1) - (a.linkClicks ?? a.profileVisits ?? -1) || b.engagement - a.engagement
  );
  const Card = ({ p }: { p: Post }) => (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
      {p.imageUrl ? (
        <a href={p.imageUrl} target="_blank" rel="noreferrer" className="shrink-0"><img src={p.imageUrl} alt={p.design?.headline ?? ""} className="h-30 w-24 rounded-xl object-cover" loading="lazy" /></a>
      ) : (
        <div className="flex h-30 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl bg-accent px-2 text-center text-[10px] text-muted-foreground">
          {p.status === "design" ? <><Loader2 className="size-4 animate-spin" /> Designing image</> : p.status === "cancelled" ? "Cancelled" : "Posted · image now on Facebook/Instagram"}
        </div>
      )}
      <div className="min-w-0 text-sm">
        <p className="font-semibold">{when(p.publishAt)}</p>
        <p className="text-xs text-muted-foreground">
          {p.language} · {p.topic} · {p.platforms.join(" + ")}
          {p.format === "join" && <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">Join post</span>}
        </p>
        {p.angle && <p className="mt-0.5 text-[11px] italic text-muted-foreground">{p.angle}</p>}
        {p.design?.headline && <p className="mt-1 text-sm font-semibold">{p.design.headline}</p>}
        <p className="mt-1 line-clamp-3 text-xs">{p.caption}</p>
        <p className={cn("mt-1 text-[11px] font-semibold uppercase", p.status === "failed" ? "text-destructive" : p.status === "design" ? "text-muted-foreground" : "text-success")}>
          {p.status === "design" ? "waiting for image" : p.status}
          {signupsFor(p) != null && p.status === "published" && <span className="ml-2 normal-case text-foreground">{signupsFor(p)} sign-ups</span>}
        </p>
      </div>
    </div>
  );
  return (
    <div className="space-y-4">
      <Panel
        title="Organic posts"
        sub="Your /weekly-posts fill the evenings. The agent's own planner (Settings → Organic posts) is for weeks you skip them: it writes, designs and schedules 7:30 pm posts. Goal: sign-ups. Facebook posts carry a tracked link to the post's language page; Instagram says link in bio. Never boosted."
        actions={
          <Button size="sm" variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await post("/manage/ops/run/organicPlan"); reload(); } finally { setBusy(false); } }}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Plan next week now
          </Button>
        }
      >
        {upcoming.length ? <div className="grid gap-3 lg:grid-cols-2">{upcoming.map((p) => <Card key={p._id} p={p} />)}</div> : <Empty>Nothing scheduled yet.</Empty>}
      </Panel>
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Sign-ups from posts · 28 d" value={num(total)} hint="Joined through a post link, bio or comment reply" />
        <Kpi label="From Facebook" value={num(total - fromInstagram)} hint="Post links and comment replies" />
        <Kpi label="From Instagram" value={num(fromInstagram)} hint={`${num(data.signups.bio ?? 0)} via the bio link`} />
      </div>

      {Object.keys({ ...(data.stats?.insightsErrors ?? {}), ...(data.storyInsightsErrors ?? {}) }).length > 0 && (
        <ErrorNote>
          Meta didn't share some numbers (reach, clicks, profile visits), so posts and stories are ranked on sign-ups and likes only.{" "}
          {Object.entries({ ...(data.stats?.insightsErrors ?? {}), ...(data.storyInsightsErrors ?? {}) })
            .slice(0, 3)
            .map(([k, v]) => `${k}: ${v}`)
            .join(" · ")}
        </ErrorNote>
      )}

      {ranked.length > 0 && (
        <Panel title="What brought sign-ups · 28 days" sub={`All Page and Instagram posts, yours and the agent's, ranked by sign-ups, then clicks. Updated ${data.stats?.period ?? ""}. Posts without a ?p= code can't be traced to sign-ups.`}>
          <ul className="divide-y divide-border text-sm">
            {ranked.slice(0, 12).map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate">{r.text || "(no caption)"}</span>
                  <span className="block text-xs text-muted-foreground">
                    {r.platform === "facebook" ? "Facebook" : "Instagram"} · {when(r.at)}
                    {r.code ? ` · ${r.code}` : ""}
                  </span>
                </span>
                <span className="shrink-0 text-right text-xs">
                  <span className="block font-semibold">{r.signups != null ? `${r.signups} sign-ups` : "not traced"}</span>
                  <span className="block text-muted-foreground">
                    {num(r.reach)} reach · {r.platform === "facebook" ? `${num(r.linkClicks)} clicks` : `${num(r.profileVisits)} profile visits`}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel
        title="Stories · 5 weeks"
        sub="Instagram stories, read every 3 hours while they're live (the API shows a story for 24 hours only). Concepts are ranked by profile visits per 100 reached, the closest a story gets to a sign-up. /weekly-posts tags each story with its language and concept."
      >
        {(data.storyConcepts ?? []).length ? (
          <ul className="mb-3 divide-y divide-border text-sm">
            {(data.storyConcepts ?? []).map((c) => (
              <li key={c.concept} className="flex items-start justify-between gap-3 py-2">
                <span className="min-w-0">
                  <span className="block font-medium">{c.concept}</span>
                  <span className="block text-xs text-muted-foreground">{c.stories} stor{c.stories === 1 ? "y" : "ies"} · {num(c.avgReach)} reach on average</span>
                </span>
                <span className="shrink-0 text-right text-xs">
                  <span className="block font-semibold">{c.profileVisitsPer100} profile visits / 100</span>
                  <span className="block text-muted-foreground">
                    {c.repliesPer100} replies / 100{c.exitRate != null ? ` · ${c.exitRate}% left` : ""}{c.follows ? ` · ${c.follows} follows` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No story results yet. They appear a few hours after a story goes live.</Empty>
        )}
        {(data.stories ?? []).length > 0 && (
          <ul className="divide-y divide-border border-t border-border text-xs">
            {(data.stories ?? []).slice(0, 14).map((s) => (
              <li key={s._id} className="flex items-center justify-between gap-3 py-1.5">
                <span className="min-w-0 truncate">
                  {when(s.at ?? s.plannedAt ?? "")} · {s.language || "?"} · {s.concept || "not tagged"}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {s.reach != null ? `${num(s.reach)} reach · ${num(s.profileVisits ?? 0)} visits · ${num(s.replies ?? 0)} replies` : "planned"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {past.length > 0 && (
        <Panel title="Published">
          <div className="grid gap-3 lg:grid-cols-2">{past.map((p) => <Card key={p._id} p={p} />)}</div>
        </Panel>
      )}
    </div>
  );
};

interface SeoRow { key: string; clicks: number; impressions: number; ctr: number; position: number }
interface SeoData {
  configured: boolean;
  report: { createdAt: string; data: { range: { startDate: string; endDate: string }; total: { clicks: number; impressions: number }; previous: { clicks: number; impressions: number }; queries: SeoRow[]; pages: SeoRow[] } } | null;
  ideas: OpsAction[];
}

export const SeoView = () => {
  const { data, error, reload } = useOps<SeoData>("/manage/ops/seo");
  const [busy, setBusy] = useState(false);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  if (!data.configured) return <Empty>Search Console isn't connected. Add the service account (GSC_SERVICE_ACCOUNT_JSON) on the server and add its email as a user in Search Console.</Empty>;
  const r = data.report?.data;
  const change = (a: number, b: number) => (b ? `${a >= b ? "▲" : "▼"} ${Math.abs(Math.round(((a - b) / b) * 100))}% vs previous 28 days` : "");
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await post("/manage/ops/run/seoWeekly"); reload(); } finally { setBusy(false); } }}>
          {busy ? <Loader2 className="animate-spin" /> : null} Read Search Console now
        </Button>
      </div>
      {!r ? <Empty>No Search Console read yet. It runs every Monday.</Empty> : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <Kpi label="Clicks · 28 days" value={num(r.total.clicks)} hint={change(r.total.clicks, r.previous.clicks)} />
            <Kpi label="Impressions · 28 days" value={num(r.total.impressions)} hint={change(r.total.impressions, r.previous.impressions)} />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[{ t: "Top searches", rows: r.queries }, { t: "Top pages", rows: r.pages }].map((s) => (
              <Panel key={s.t} title={s.t} sub={`${r.range.startDate} → ${r.range.endDate}`}>
                <ul className="divide-y divide-border text-sm">
                  {s.rows.slice(0, 12).map((q) => (
                    <li key={q.key} className="flex justify-between gap-2 py-1.5">
                      <span className="min-w-0 truncate">{q.key.replace("https://www.seetharamakalyana.in", "")}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{q.clicks} · {num(q.impressions)} · #{q.position.toFixed(1)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </>
      )}
      <Panel title="SEO ideas" sub="Schedule one and the Developer agent makes the change on a branch for you to preview.">
        {data.ideas.length ? <div className="space-y-3">{data.ideas.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}</div> : <Empty>No ideas yet.</Empty>}
      </Panel>
    </div>
  );
};
