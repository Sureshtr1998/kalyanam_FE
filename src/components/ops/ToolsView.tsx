import { useState } from "react";
import { Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ErrorNote, Panel } from "./shared";
import { post, relative, useOps } from "./opsUtils";

interface Tool {
  id: string;
  name: string;
  purpose: string;
  metric: string;
  unit: string;
  source: "auto" | "manual";
  hint?: string;
  plan: string;
  notes: string;
  renewsOn: string | null;
  limit: number | null;
  current: number | null;
  pct: number | null;
  hitsLimitOn: string | null;
  status: "ok" | "watch" | "upgrade" | "unknown" | "error";
  error: string | null;
  readAt: string | null;
}

const STATUS = {
  ok: ["OK", "bg-success/15 text-success"],
  watch: ["Watch", "bg-gold/20 text-gold-foreground"],
  upgrade: ["Upgrade soon", "bg-destructive/10 text-destructive"],
  unknown: ["No data", "bg-muted text-muted-foreground"],
  error: ["Error", "bg-destructive/10 text-destructive"],
} as const;

const fmt = (v: number | null, unit: string) =>
  v == null ? "–" : unit === "₹" ? `₹${Math.round(v).toLocaleString("en-IN")}` : unit === "$" ? `$${v.toFixed(2)}` : `${Math.round(v * 100) / 100} ${unit}`;

const ToolCard = ({ t, onSaved }: { t: Tool; onSaved: (tools: Tool[]) => void }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ plan: t.plan, limit: t.limit?.toString() ?? "", current: "", renewsOn: t.renewsOn ?? "", notes: t.notes });
  const [label, cls] = STATUS[t.status];
  const save = async () => {
    const r = await post<{ tools: Tool[] }>(`/manage/ops/tools/${t.id}`, t.source === "auto" ? { ...form, current: "" } : form);
    onSaved(r.tools);
    setEdit(false);
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t.name}</p>
          <p className="text-xs text-muted-foreground">{t.purpose}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", cls)}>{label}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2 text-sm">
        <span className="text-muted-foreground">{t.metric}</span>
        <span className="font-semibold">{fmt(t.current, t.unit)}{t.limit ? <span className="font-normal text-muted-foreground"> / {fmt(t.limit, t.unit)}</span> : null}</span>
      </div>
      {t.pct != null && (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", t.pct >= 80 ? "bg-destructive" : t.pct >= 60 ? "bg-gold" : "bg-success")} style={{ width: `${Math.min(100, t.pct)}%` }} />
        </div>
      )}
      <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
        {t.hitsLimitOn && <p className="font-medium text-foreground">At this growth, hits the limit around {new Date(t.hitsLimitOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.</p>}
        {t.plan && <p>Plan: {t.plan}</p>}
        {t.renewsOn && <p>Renews: {t.renewsOn}</p>}
        {t.hint && <p>{t.hint}</p>}
        {t.error && <p className="text-destructive">{t.error}</p>}
        <p>{t.source === "auto" ? `Read automatically${t.readAt ? ` ${relative(t.readAt)}` : ""}` : "Entered by hand"}</p>
      </div>
      {edit ? (
        <div className="mt-3 grid gap-2">
          <Input placeholder="Plan (e.g. Free M0, Pro)" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder={`Limit (${t.unit || "value"})`} inputMode="decimal" value={form.limit} onChange={(e) => setForm({ ...form, limit: e.target.value })} />
            {t.source === "manual" && <Input placeholder={`Now (${t.unit || "value"})`} inputMode="decimal" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />}
          </div>
          <Input placeholder="Renews on" value={form.renewsOn} onChange={(e) => setForm({ ...form, renewsOn: e.target.value })} />
          <Input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2"><Button size="sm" onClick={save}><Check /> Save</Button><Button size="sm" variant="ghost" onClick={() => setEdit(false)}>Back</Button></div>
        </div>
      ) : (
        <Button size="xs" variant="ghost" className="mt-2" onClick={() => setEdit(true)}><Pencil /> Update</Button>
      )}
    </div>
  );
};

export const ToolsView = () => {
  const { data, error, setData } = useOps<{ tools: Tool[] }>("/manage/ops/tools");
  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return null;
  const order = { upgrade: 0, error: 1, watch: 2, unknown: 3, ok: 4 };
  const tools = [...data.tools].sort((a, b) => order[a.status] - order[b.status]);
  const flagged = tools.filter((t) => t.status === "upgrade" || t.status === "watch");
  return (
    <div className="space-y-4">
      <Panel title="Third-party tools" sub={`${tools.length} services found in the code. Auto ones are read daily; update the others when you check their dashboards.`}>
        <p className="text-sm">
          {flagged.length ? <><b>{flagged.length}</b> need attention: {flagged.map((t) => t.name).join(", ")}.</> : "Nothing near its limit right now."}
        </p>
      </Panel>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((t) => <ToolCard key={t.id} t={t} onSaved={(tools) => setData({ tools })} />)}
      </div>
    </div>
  );
};
