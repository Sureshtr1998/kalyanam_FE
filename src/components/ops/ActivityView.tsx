import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/utils/api";
import { cn } from "@/lib/utils";
import { errorMessage } from "@/lib/errors";
import { ActionCard, Empty, ErrorNote, Panel } from "./shared";
import { MODULE_LABEL, when, type ActionStatus, type ModuleId, type OpsAction } from "./opsUtils";

interface ActivityPage {
  items: OpsAction[];
  total: number;
  page: number;
  pages: number;
  byStatus: Partial<Record<ActionStatus, number>>;
}

const STATUSES: { id: ActionStatus; label: string }[] = [
  { id: "done", label: "Done" },
  { id: "scheduled", label: "Scheduled" },
  { id: "needs_you", label: "Needs you" },
  { id: "failed", label: "Failed" },
  { id: "cancelled", label: "Cancelled / undone" },
  { id: "shadow", label: "Shadow" },
  { id: "idea", label: "Ideas" },
  { id: "info", label: "Alerts" },
];

const selectCls = "h-9 rounded-md border border-input bg-card px-2 text-sm";

/**
 * The complete history of everything the agent did, planned or proposed,
 * newest first. Filter by section, status, dates and text (names, emails,
 * member IDs); "Load more" pages back through all of it.
 */
export const ActivityView = () => {
  const [module, setModule] = useState<ModuleId | "">("");
  const [statuses, setStatuses] = useState<ActionStatus[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [text, setText] = useState("");
  const [q, setQ] = useState("");
  const [data, setData] = useState<ActivityPage | null>(null);
  const [items, setItems] = useState<OpsAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search waits for a pause in typing.
  useEffect(() => {
    const id = window.setTimeout(() => setQ(text.trim()), 350);
    return () => window.clearTimeout(id);
  }, [text]);

  const load = useCallback(
    (page = 1) => {
      setLoading(true);
      setError(null);
      const params: Record<string, string | number> = { page, limit: 30 };
      if (module) params.module = module;
      if (statuses.length) params.status = statuses.join(",");
      if (from) params.from = from;
      if (to) params.to = to;
      if (q) params.q = q;
      api
        .get<ActivityPage>("/manage/ops/activity", { params })
        .then((r) => {
          setData(r.data);
          setItems((prev) => (page === 1 ? r.data.items : [...prev, ...r.data.items]));
        })
        .catch((e) => setError(errorMessage(e)))
        .finally(() => setLoading(false));
    },
    [module, statuses, from, to, q]
  );

  useEffect(() => load(1), [load]);

  const toggle = (s: ActionStatus) => setStatuses((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  const filtered = !!(module || statuses.length || from || to || q);
  const clear = () => {
    setModule("");
    setStatuses([]);
    setFrom("");
    setTo("");
    setText("");
  };

  return (
    <div className="space-y-4">
      <Panel title="Activity log" sub="Everything the agent did, scheduled or proposed, kept forever. Newest first.">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search names, emails, member IDs, topics…" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select className={selectCls} value={module} onChange={(e) => setModule(e.target.value as ModuleId | "")} aria-label="Section">
            <option value="">All sections</option>
            {(Object.keys(MODULE_LABEL) as ModuleId[]).map((m) => (
              <option key={m} value={m}>{MODULE_LABEL[m]}</option>
            ))}
          </select>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            From <input type="date" className={selectCls} value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="flex items-center gap-1 text-xs text-muted-foreground">
            To <input type="date" className={selectCls} value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          {filtered && (
            <Button size="sm" variant="ghost" onClick={clear}><X /> Clear</Button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STATUSES.map((s) => {
            const on = statuses.includes(s.id);
            const n = data?.byStatus?.[s.id];
            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:bg-accent"
                )}
              >
                {s.label}{n != null && !on ? ` · ${n}` : ""}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {data ? `${data.total} item${data.total === 1 ? "" : "s"}${filtered ? " match" : " in total"}` : ""}
        </p>
      </Panel>

      {error && <ErrorNote>{error}</ErrorNote>}
      {!loading && data && items.length === 0 && <Empty>Nothing matches these filters.</Empty>}

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a._id}>
            <ActionCard action={a} onChanged={() => load(1)} />
            <p className="mt-1 px-2 text-[11px] text-muted-foreground">
              Created {when(a.createdAt)}
              {a.ranAt ? ` · ran ${when(a.ranAt)}` : ""}
              {a.decidedBy ? ` · by ${a.decidedBy === "agent" ? "the agent" : a.decidedBy}` : ""}
            </p>
          </div>
        ))}
      </div>

      {data && data.page < data.pages && (
        <div className="flex justify-center">
          <Button variant="outline" disabled={loading} onClick={() => load(data.page + 1)}>
            {loading ? <Loader2 className="animate-spin" /> : null} Load more ({data.total - items.length} older)
          </Button>
        </div>
      )}
      {loading && !items.length && <p className="text-center text-sm text-muted-foreground">Loading…</p>}
    </div>
  );
};
