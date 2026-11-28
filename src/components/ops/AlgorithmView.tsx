import { useState } from "react";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, ErrorNote, Panel } from "./shared";
import { post, relative, useOps, type OpsAction } from "./opsUtils";

interface Rule {
  key: string;
  group: string;
  label: string;
  unit: string;
  value: number;
  default: number;
  min: number;
  max: number;
  changedIn: number | null;
}
interface Change {
  key: string;
  label: string;
  unit: string;
  from: number;
  to: number;
  reason?: string;
}
interface HistoryRow {
  version: number;
  at: string;
  kind: "update" | "undo";
  ofVersion?: number | null;
  changes: Change[];
  reverted?: boolean;
  verdict?: "kept" | "worse";
  judgedAt?: string;
}
interface AlgorithmState {
  version: number;
  everyDays: number;
  lastReviewAt: string | null;
  nextReviewAt: string | null;
  lastSummary: string;
  rules: Rule[];
  ownerRules: string[];
  safetyDefaults: string[];
  history: HistoryRow[];
  pending: OpsAction[];
}

const fmt = (v: number, unit: string) =>
  unit === "₹" ? `₹${Math.round(v).toLocaleString("en-IN")}` : unit === "%" ? `${v}%` : unit === "x" || unit === "×" ? `${v}×` : `${v}${unit ? ` ${unit}` : ""}`;
const day = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "–";

/**
 * Ops → Algorithm: the ads engine's current numbers (and the bounds the
 * monthly review can never cross), the owner's fixed rules, the next review,
 * any update waiting, and the history of updates with their 14-day results.
 */
export const AlgorithmView = () => {
  const { data, error, loading, reload } = useOps<AlgorithmState>("/manage/ops/algorithm");
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

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return loading ? <p className="text-sm text-muted-foreground">Loading…</p> : null;

  const groups = [...new Set(data.rules.map((r) => r.group))];

  return (
    <div className="space-y-4">
      <Panel
        title={`Ads algorithm · version ${data.version}`}
        sub={`Every ${data.everyDays} days the agent reviews what its ad decisions did and may change up to 3 of the numbers below, always inside their range. You get a WhatsApp; the update applies by itself after 2 days unless you cancel it. 14 days later it checks the cost per real member and undoes its own update if it got 15%+ worse.`}
        actions={
          <Button size="sm" variant="outline" disabled={!!busy} onClick={() => act("review", () => post("/manage/ops/algorithm/review", {}, false, 120000))}>
            {busy === "review" ? <Loader2 className="animate-spin" /> : <Sparkles />} Review now
          </Button>
        }
      >
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <p>
            <span className="block text-xs text-muted-foreground">Last review</span>
            {data.lastReviewAt ? `${day(data.lastReviewAt)} (${relative(data.lastReviewAt)})` : "Not yet"}
          </p>
          <p>
            <span className="block text-xs text-muted-foreground">Next review</span>
            {day(data.nextReviewAt)}
          </p>
          <div>
            <span className="block text-xs text-muted-foreground">Review every</span>
            <div className="mt-1 inline-flex rounded-xl bg-muted p-1">
              {[14, 30].map((d) => (
                <button
                  key={d}
                  disabled={!!busy}
                  onClick={() => act(`every-${d}`, () => post("/manage/ops/algorithm", { everyDays: d }))}
                  className={cn("rounded-lg px-3 py-1 text-xs font-semibold", data.everyDays === d ? "bg-card shadow-sm" : "text-muted-foreground")}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
        </div>
        {data.lastSummary && <p className="mt-3 whitespace-pre-line rounded-lg bg-muted px-3 py-2 text-xs">{data.lastSummary}</p>}
      </Panel>

      {data.pending.length > 0 && (
        <Panel title="Update waiting" sub="Applies by itself at the time shown; Cancel keeps the current numbers.">
          <div className="space-y-3">
            {data.pending.map((a) => (
              <ActionCard key={a._id} action={a} onChanged={reload} />
            ))}
          </div>
        </Panel>
      )}

      <Panel title="The numbers the review may tune" sub="Current value, the value it shipped with, and the range it can never leave.">
        <div className="space-y-4">
          {groups.map((g) => (
            <div key={g}>
              <h4 className="mb-1 text-sm font-semibold">{g}</h4>
              <div className="divide-y divide-border rounded-xl border border-border">
                {data.rules
                  .filter((r) => r.group === g)
                  .map((r) => (
                    <div key={r.key} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                      <span className="min-w-0 flex-1">{r.label}</span>
                      <span className="flex items-center gap-2 text-xs">
                        <b className={cn("text-sm", r.value !== r.default && "text-primary")}>{fmt(r.value, r.unit)}</b>
                        {r.value !== r.default && <span className="text-muted-foreground">was {fmt(r.default, r.unit)}</span>}
                        <span className="text-muted-foreground">
                          range {fmt(r.min, r.unit)}–{fmt(r.max, r.unit)}
                        </span>
                        {r.changedIn && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">v{r.changedIn}</span>}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Your rules" sub="What you told the agent, and what you set in Settings. The review never changes these; you can.">
        <ul className="space-y-1.5 text-sm">
          {data.ownerRules.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Lock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /> {f}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Safety defaults" sub="Added by the agent to protect the account and Meta's learning. Not tuned by the review either.">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {data.safetyDefaults.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Lock className="mt-0.5 size-3.5 shrink-0" /> {f}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="History" sub="Each update and what it did.">
        {data.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No updates yet: version 1 is the algorithm as built.</p>
        ) : (
          <div className="space-y-2">
            {data.history.map((h) => (
              <div key={`${h.version}-${h.at}`} className="rounded-xl border border-border px-3 py-2 text-sm">
                <p className="font-semibold">
                  v{h.version} · {day(h.at)} · {h.kind === "undo" ? `undid v${h.ofVersion ?? "?"}` : h.reverted ? "undone" : h.verdict === "kept" ? "kept after 14 days" : "applied"}
                </p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {h.changes.map((c) => (
                    <li key={c.key}>
                      {c.label}: {fmt(c.from, c.unit)} → {fmt(c.to, c.unit)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};
