import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, Empty, ErrorNote, Kpi, Panel } from "./shared";
import { num, post, useOps, when, type OpsAction } from "./opsUtils";

interface Post { _id: string; publishAt: string; language: string; topic: string; caption: string; imageUrl?: string; design?: { headline?: string; kicker?: string }; platforms: string[]; status: string; error?: string }

/** Organic posts: next week's plan and what went out. */
export const OrganicView = () => {
  const { data, error, reload } = useOps<{ posts: Post[] }>("/manage/ops/organic");
  const [busy, setBusy] = useState(false);
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  const upcoming = data.posts.filter((p) => new Date(p.publishAt) > new Date());
  const past = data.posts.filter((p) => new Date(p.publishAt) <= new Date()).reverse();
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
        <p className="text-xs text-muted-foreground">{p.language} · {p.topic} · {p.platforms.join(" + ")}</p>
        {p.design?.headline && <p className="mt-1 text-sm font-semibold">{p.design.headline}</p>}
        <p className="mt-1 line-clamp-3 text-xs">{p.caption}</p>
        <p className={cn("mt-1 text-[11px] font-semibold uppercase", p.status === "failed" ? "text-destructive" : p.status === "design" ? "text-muted-foreground" : "text-success")}>{p.status === "design" ? "waiting for image" : p.status}</p>
      </div>
    </div>
  );
  return (
    <div className="space-y-4">
      <Panel
        title="Organic posts"
        sub="Every Thursday the agent writes next week's posts and designs their images in each language (one a day at 7:30 pm), then schedules them. Nothing to upload. Never boosted."
        actions={
          <Button size="sm" variant="outline" disabled={busy} onClick={async () => { setBusy(true); try { await post("/manage/ops/run/organicPlan"); reload(); } finally { setBusy(false); } }}>
            {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Plan next week now
          </Button>
        }
      >
        {upcoming.length ? <div className="grid gap-3 lg:grid-cols-2">{upcoming.map((p) => <Card key={p._id} p={p} />)}</div> : <Empty>Nothing scheduled yet.</Empty>}
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
