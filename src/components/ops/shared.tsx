import { useState, type ReactNode } from "react";
import { Check, Clock, Eye, Lightbulb, Loader2, Pause, Pencil, Play, X, AlertTriangle, Info, CircleCheck, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MODULE_LABEL, inr, post, relative, when, type ActionStatus, type Mode, type OpsAction } from "./opsUtils";

/** Earlier steps of a card that carries on with a next step. */
const STEP_LABEL: Record<string, string> = {
  "comments.hide": "hidden on the Page",
  "organic.schedule": "scheduled on Facebook",
};

/* ------------------------------ small pieces ----------------------------- */

export const Panel = ({ title, sub, actions, children, className }: { title?: ReactNode; sub?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) => (
  <section className={cn("rounded-2xl border border-border bg-card p-4 shadow-sm", className)}>
    {(title || actions) && (
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 basis-60">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>
    )}
    {children}
  </section>
);

export const Empty = ({ children }: { children: ReactNode }) => (
  <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">{children}</p>
);

export const ErrorNote = ({ children }: { children: ReactNode }) => (
  <p className="flex items-start gap-2 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
    <AlertTriangle className="mt-0.5 size-4 shrink-0" /> <span>{children}</span>
  </p>
);

export const ModePill = ({ mode }: { mode: Mode }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
      mode === "live" && "bg-success/15 text-success",
      mode === "shadow" && "bg-gold/20 text-gold-foreground",
      mode === "off" && "bg-muted text-muted-foreground"
    )}
  >
    {mode}
  </span>
);

const STATUS: Record<ActionStatus, { label: string; icon: typeof Clock; cls: string }> = {
  scheduled: { label: "Scheduled", icon: Clock, cls: "text-primary bg-primary/10" },
  needs_you: { label: "Needs you", icon: AlertTriangle, cls: "text-destructive bg-destructive/10" },
  idea: { label: "Idea", icon: Lightbulb, cls: "text-gold-foreground bg-gold/20" },
  shadow: { label: "Shadow", icon: Eye, cls: "text-muted-foreground bg-muted" },
  running: { label: "Running", icon: Loader2, cls: "text-primary bg-primary/10" },
  done: { label: "Done", icon: CircleCheck, cls: "text-success bg-success/10" },
  cancelled: { label: "Cancelled", icon: X, cls: "text-muted-foreground bg-muted" },
  failed: { label: "Failed", icon: CircleX, cls: "text-destructive bg-destructive/10" },
  info: { label: "Alert", icon: Info, cls: "text-primary bg-primary/10" },
};

export const StatusChip = ({ status }: { status: ActionStatus }) => {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", s.cls)}>
      <s.icon className={cn("size-3", status === "running" && "animate-spin")} /> {s.label}
    </span>
  );
};

/**
 * One agent action: what, why, what happens if nobody acts, and the buttons.
 * Drafts (mail replies, comment replies) can be edited before they go out.
 */
/** "2 h 30 min" from a gap in ms. */
const span = (ms: number) => {
  const min = Math.round(Math.abs(ms) / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (d >= 2) return `${d} days`;
  if (h >= 1) return `${h} h${min % 60 ? ` ${min % 60} min` : ""}`;
  return `${Math.max(1, min)} min`;
};

/**
 * Exactly when a planned action runs. The agent runs every 15 minutes, so an
 * action goes out at the first run after its time. Shadow cards never run.
 */
const runLabel = (status: ActionStatus, runAt?: string) => {
  if (!runAt) return "";
  const gap = new Date(runAt).getTime() - Date.now();
  if (status === "shadow") return `Shadow: logged only, not run (planned ${when(runAt)})`;
  if (gap <= 0) return `Due now: goes out within 15 min (was due ${span(gap)} ago)`;
  return `Runs ${when(runAt)} · in ${span(gap)}`;
};

export const ActionCard = ({ action: raw, onChanged, compact }: { action: OpsAction; onChanged: () => void; compact?: boolean }) => {
  // Empty payloads are dropped by MongoDB, so never assume one exists.
  const action = { ...raw, payload: raw.payload ?? {} };
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const field = typeof action.payload.draft === "string" ? "draft" : typeof action.payload.reply === "string" ? "reply" : null;
  const [text, setText] = useState(field ? String(action.payload[field] ?? "") : "");
  const open = ["scheduled", "needs_you", "idea", "shadow"].includes(action.status);
  // Ad changes the agent made can be reversed in Meta from here.
  const undoable = action.status === "done" && ["ads.budget", "ads.creative_launch", "ads.new_adset", "support.profile_change"].includes(action.type);
  const isRefund = action.type === "support.refund";

  const run = async (key: string, fn: () => Promise<unknown>) => {
    setBusy(key);
    try {
      await fn();
      onChanged();
    } catch {
      /* toast already shown */
    } finally {
      setBusy(null);
    }
  };

  const refund = (paymentId: string) =>
    run(`refund-${paymentId}`, async () => {
      await post(`/manage/users/${action.payload.userId}/refund`, { paymentId });
      // The refund went through; send the confirmation reply and close the card.
      await post(`/manage/ops/actions/${action._id}/run`, {}, true);
    });

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-4 transition-shadow",
        action.priority === "urgent" && open ? "border-destructive/40 shadow-[0_0_0_3px] shadow-destructive/10" : "border-border"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusChip status={action.status} />
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{MODULE_LABEL[action.module]}</span>
        {action.runAt && open && action.status !== "idea" && (
          <span className="ml-auto text-right text-xs font-medium text-muted-foreground">{runLabel(action.status, action.runAt)}</span>
        )}
        {action.status === "idea" && action.runAt && <span className="ml-auto text-xs text-muted-foreground">suggested {when(action.runAt)}</span>}
        {!open && (action.ranAt || action.updatedAt) && (
          <span className="ml-auto text-xs text-muted-foreground">{relative(action.ranAt ?? action.updatedAt)}</span>
        )}
      </div>
      <h4 className="mt-2 font-semibold leading-snug">{action.title}</h4>
      {!compact && action.reason && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{action.reason}</p>}
      {(action.result?.steps ?? []).map((s, i) =>
        s.at ? (
          <p key={`${s.type}-${s.at}`} className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CircleCheck className="size-3.5 shrink-0 text-emerald-600" /> Done {relative(s.at)}: {STEP_LABEL[s.type ?? ""] ?? s.title}
          </p>
        ) : s.summary ? (
          // An idea card's planned steps: what each became (scheduled, or needs you and why).
          <p key={i} className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
            <CircleCheck className={`mt-0.5 size-3.5 shrink-0 ${s.status === "needs_you" ? "text-amber-600" : "text-emerald-600"}`} />
            <span>
              {s.summary.length > 140 ? `${s.summary.slice(0, 140)}…` : s.summary} ·{" "}
              <b>{s.status === "needs_you" ? `needs you${s.error ? `: ${s.error}` : ""}` : s.status ?? "planned"}</b>
            </span>
          </p>
        ) : null
      )}
      {action.effect && open && <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs"><span className="font-semibold">If nobody acts: </span>{action.effect}</p>}
      {action.error && <p className="mt-2 text-xs text-destructive">{action.error}</p>}
      {action.payload?.resolvedAt && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
          <CircleCheck className="size-3.5 shrink-0" /> Resolved {relative(action.payload.resolvedAt)}
        </p>
      )}

      {isRefund && open && (
        <div className="mt-3 space-y-2">
          {(action.payload.payments ?? []).length === 0 && <p className="text-sm text-muted-foreground">No refundable payment found. Check Members → Payments.</p>}
          {(action.payload.payments ?? []).map((p) => (
            <div key={p.paymentId} className="flex items-center justify-between gap-2 rounded-xl border border-border px-3 py-2">
              <div className="min-w-0 text-sm">
                <p className="font-semibold">{inr(p.amount)} · {p.note || "Payment"}</p>
                <p className="truncate font-mono text-xs text-muted-foreground">{p.paymentId}</p>
              </div>
              <Button size="sm" variant="destructive" disabled={!!busy || action.status === "shadow"} onClick={() => refund(p.paymentId)}>
                {busy === `refund-${p.paymentId}` ? <Loader2 className="animate-spin" /> : null} Refund
              </Button>
            </div>
          ))}
        </div>
      )}

      {field && (editing ? (
        <div className="mt-3 space-y-2">
          <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="text-sm" />
          <div className="flex gap-2">
            <Button size="sm" disabled={!!busy} onClick={() => run("save", async () => { await post(`/manage/ops/actions/${action._id}`, { [field]: text }); setEditing(false); })}>
              <Check /> Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Back</Button>
          </div>
        </div>
      ) : (
        !compact && text && (
          <blockquote className="mt-3 whitespace-pre-wrap rounded-xl border-l-4 border-primary/40 bg-accent/50 px-3 py-2 text-sm">{text}</blockquote>
        )
      ))}

      {undoable && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            disabled={!!busy}
            onClick={() => window.confirm(action.module === "ads" ? "Pause / undo this change in Meta?" : "Undo this profile change?") && run("undo", () => post(`/manage/ops/actions/${action._id}/undo`))}
          >
            {busy === "undo" ? <Loader2 className="animate-spin" /> : <Pause />} {action.module === "ads" ? "Pause / undo" : "Undo"}
          </Button>
        </div>
      )}

      {open && (
        <div className="mt-3 flex flex-wrap gap-2">
          {action.status === "idea" ? (
            <Button size="sm" disabled={!!busy} onClick={() => run("schedule", () => post(`/manage/ops/actions/${action._id}`, { schedule: true, runAt: action.runAt }))}>
              <Clock /> Schedule
            </Button>
          ) : !isRefund ? (
            <Button size="sm" disabled={!!busy} onClick={() => run("run", () => post(`/manage/ops/actions/${action._id}/run`))}>
              {busy === "run" ? <Loader2 className="animate-spin" /> : <Play />} {action.status === "needs_you" ? "Approve & run" : "Run now"}
            </Button>
          ) : null}
          {field && !editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Pencil /> Edit
            </Button>
          )}
          <Button size="sm" variant="ghost" disabled={!!busy} onClick={() => run("cancel", () => post(`/manage/ops/actions/${action._id}/cancel`))}>
            <X /> {isRefund ? "Ignore" : "Cancel"}
          </Button>
        </div>
      )}
    </article>
  );
};

/** Tiny bar chart: two series per day (e.g. spend vs earned). */
export const DualBars = ({ days: rows, a, b, labelA, labelB }: { days: { date: string }[]; a: string; b: string; labelA: string; labelB: string }) => {
  const days = rows as ({ date: string } & Record<string, unknown>)[];
  const max = Math.max(1, ...days.flatMap((d) => [Number(d[a]) || 0, Number(d[b]) || 0]));
  return (
    <div>
      <div className="flex h-36 items-end gap-[3px]">
        {days.map((d) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end gap-px" title={`${d.date}: ${labelA} ${inr(Number(d[a]))}, ${labelB} ${inr(Number(d[b]))}`}>
            <div className="w-1/2 rounded-t-sm bg-primary/80" style={{ height: `${((Number(d[a]) || 0) / max) * 100}%`, minHeight: 1 }} />
            <div className="w-1/2 rounded-t-sm bg-success/80" style={{ height: `${((Number(d[b]) || 0) / max) * 100}%`, minHeight: 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{days[0]?.date.slice(5)}</span>
        <span className="flex gap-3">
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-primary/80" />{labelA}</span>
          <span className="flex items-center gap-1"><i className="size-2 rounded-sm bg-success/80" />{labelB}</span>
        </span>
        <span>{days.at(-1)?.date.slice(5)}</span>
      </div>
    </div>
  );
};

export const Kpi = ({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: ReactNode; tone?: "good" | "bad" | "warn" }) => (
  <div className="rounded-2xl border border-border bg-card p-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className={cn("mt-0.5 font-display text-2xl font-bold", tone === "good" && "text-success", tone === "bad" && "text-destructive", tone === "warn" && "text-gold-foreground")}>{value}</p>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

/** Renders the agent's short markdown (bold, bullets, paragraphs) without HTML injection. */
export const Prose = ({ text }: { text: string }) => {
  const inline = (line: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : <span key={i}>{part}</span>
    );
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) blocks.push(<ul key={blocks.length} className="ml-4 list-disc space-y-1">{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
    list = [];
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (/^[-*•]\s+/.test(line)) list.push(line.replace(/^[-*•]\s+/, ""));
    else {
      flush();
      if (line) blocks.push(<p key={blocks.length}>{inline(line.replace(/^#+\s*/, ""))}</p>);
    }
  }
  flush();
  return <div className="space-y-2 text-sm leading-relaxed">{blocks}</div>;
};
