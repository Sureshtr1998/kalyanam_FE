import { useState } from "react";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Panel } from "./shared";
import { post, remove, useOps } from "./opsUtils";

type Where = "once" | "organic" | "ads" | "both";
const WHERE: { id: Where; label: string; help: string }[] = [
  { id: "once", label: "Once, on dates", help: "Turned into posts, ads, ad sets or budget changes on the dates you mention." },
  { id: "organic", label: "Organic posts", help: "Kept in the weekly organic mix: at least one post a week uses it, scored on sign-ups like the other ideas." },
  { id: "ads", label: "Meta ads", help: "Tested first in the next batch of fresh ads, then kept or dropped on cost per member." },
  { id: "both", label: "Both", help: "In the weekly organic mix and tested in the next batch of fresh ads." },
];

interface StandingIdea {
  key: string;
  label: string;
  hint: string;
  target: "organic" | "ads" | "both";
  text: string;
}

interface PlannedStep {
  kind: "organic_post" | "ad_creatives" | "new_adset" | "budget" | "unsupported";
  summary: string;
  date: string;
  status: string;
  error?: string;
}

const KIND: Record<PlannedStep["kind"], string> = {
  organic_post: "Post",
  ad_creatives: "New ads",
  new_adset: "New ad set",
  budget: "Budget",
  unsupported: "Not possible",
};

const EXAMPLES = [
  "Diwali posts in Kannada, Telugu, Tamil and Hindi from 1 to 5 Nov",
  "Try an ad for second marriages, ages 35–50, in Bengaluru with ₹500/day",
  "Push Telugu harder this weekend",
];

/** Type an idea; the agent turns it into scheduled posts, ads, ad sets or budget changes. */
export const IdeaBox = ({ onPlanned }: { onPlanned: () => void }) => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ title: string; steps: PlannedStep[] } | null>(null);
  const [where, setWhere] = useState<Where>("once");
  const standing = useOps<{ ideas: StandingIdea[]; builtIn: { key: string; label: string }[] }>("/manage/ops/ideas/standing");

  const plan = async () => {
    setBusy(true);
    setResult(null);
    if (where !== "once") {
      try {
        await post("/manage/ops/ideas/standing", { text, target: where });
        setText("");
        standing.reload();
      } catch {
        /* toast shown */
      } finally {
        setBusy(false);
      }
      return;
    }
    try {
      const r = await post<{ title: string; steps: PlannedStep[] }>("/manage/ops/ideas", { text });
      setResult(r);
      setText("");
      onPlanned();
    } catch {
      /* toast shown */
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title={<span className="flex items-center gap-2"><Lightbulb className="size-4 text-gold" /> Plan an idea</span>}
      sub="Write it in your own words and choose where it goes. Once: turned into scheduled posts or ads on the dates you mention. Organic posts / Meta ads / Both: added to the agent's regular idea mix and used every week until you remove it."
    >
      <div className="mb-2 flex flex-wrap gap-1.5">
        {WHERE.map((w) => (
          <button
            key={w.id}
            onClick={() => setWhere(w.id)}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium", where === w.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent")}
          >
            {w.label}
          </button>
        ))}
      </div>
      <p className="mb-2 text-xs text-muted-foreground">{WHERE.find((w) => w.id === where)?.help}</p>
      <Textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={`e.g. ${EXAMPLES[0]}`} disabled={busy} />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button disabled={busy || text.trim().length < 8} onClick={plan}>
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} {busy ? "Planning…" : where === "once" ? "Plan it" : "Add to the mix"}
        </Button>
        {!text && !busy && (
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.slice(1).map((e) => (
              <button key={e} onClick={() => setText(e)} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent">
                {e}
              </button>
            ))}
          </div>
        )}
      </div>
      {result && (
        <div className="mt-4 rounded-xl bg-muted/60 p-3">
          <p className="text-sm font-semibold">{result.title}</p>
          <ul className="mt-2 space-y-1.5">
            {result.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0 rounded-md bg-card px-1.5 text-[11px] font-semibold">{KIND[s.kind]}</span>
                <span className="min-w-0 flex-1">
                  {s.summary} <span className="text-xs text-muted-foreground">· {s.date}</span>
                  {s.error && <span className="block text-xs text-destructive">{s.error}</span>}
                </span>
                <span className={cn("shrink-0 text-[11px] font-semibold uppercase", s.status === "needs_you" ? "text-destructive" : "text-success")}>
                  {s.status === "needs_you" ? "needs you" : s.status}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Everything scheduled is on the Calendar and in Activity.</p>
        </div>
      )}
      {standing.data && (
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your ideas in the regular mix</p>
          {standing.data.ideas.length ? (
            <ul className="mt-2 space-y-1.5">
              {standing.data.ideas.map((i) => (
                <li key={i.key} className="flex items-start justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <b>{i.label}</b> <span className="text-xs text-muted-foreground">· {i.target === "both" ? "organic + ads" : i.target === "ads" ? "Meta ads" : "organic"}</span>
                    <span className="block text-xs text-muted-foreground">{i.hint}</span>
                  </span>
                  <Button size="sm" variant="ghost" onClick={async () => { await remove(`/manage/ops/ideas/standing/${i.key}`); standing.reload(); }}>Remove</Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">None yet.</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Built in: {standing.data.builtIn.map((b) => b.label).join(" · ")}</p>
        </div>
      )}
    </Panel>
  );
};
