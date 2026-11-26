import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ActionCard, ErrorNote, Panel } from "./shared";
import { MODULE_LABEL, useOps, type ModuleId, type OpsAction } from "./opsUtils";

interface CalendarData {
  actions: OpsAction[];
  posts: { _id: string; publishAt: string; language: string; topic: string; caption: string; imageUrl: string; status: string }[];
  recurring: { at: string; module: ModuleId; title: string }[];
}

const DOT: Record<ModuleId, string> = {
  ads: "bg-primary",
  organic: "bg-success",
  support: "bg-gold",
  comments: "bg-saffron-300",
  seo: "bg-chart-4",
  dev: "bg-deep",
  tools: "bg-muted-foreground",
};

const istDay = (iso: string) => new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
const time = (iso: string) => new Date(iso).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

/**
 * Month grid with coloured dots (tap a day) and the agenda for the chosen
 * day: scheduled actions, ideas, organic posts and the weekly rhythm.
 */
export const CalendarView = () => {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selected, setSelected] = useState(() => istDay(new Date().toISOString()));
  const from = new Date(cursor.getFullYear(), cursor.getMonth(), 1 - 7).toISOString();
  const to = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 7).toISOString();
  const { data, error, reload } = useOps<CalendarData>(`/manage/ops/calendar?from=${from}&to=${to}`);

  const byDay = useMemo(() => {
    const m = new Map<string, { modules: Set<ModuleId>; count: number }>();
    const add = (iso: string, mod: ModuleId) => {
      const k = istDay(iso);
      const row = m.get(k) ?? { modules: new Set(), count: 0 };
      row.modules.add(mod);
      row.count++;
      m.set(k, row);
    };
    data?.actions.filter((a) => a.runAt && a.status !== "cancelled").forEach((a) => add(a.runAt!, a.module));
    data?.posts.filter((p) => p.status !== "cancelled").forEach((p) => add(p.publishAt, "organic"));
    data?.recurring.forEach((r) => add(r.at, r.module));
    return m;
  }, [data]);

  const cells = useMemo(() => {
    const first = new Date(cursor);
    const lead = (first.getDay() + 6) % 7; // Monday first
    return Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), 1 - lead + i));
  }, [cursor]);

  const dayActions = (data?.actions ?? []).filter((a) => a.runAt && istDay(a.runAt) === selected);
  const dayPosts = (data?.posts ?? []).filter((p) => istDay(p.publishAt) === selected);
  const dayRecurring = (data?.recurring ?? []).filter((r) => istDay(r.at) === selected);
  const today = istDay(new Date().toISOString());

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_1fr]">
      <Panel
        title={cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        actions={
          <>
            <Button size="icon-sm" variant="outline" aria-label="Previous month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft /></Button>
            <Button size="icon-sm" variant="outline" aria-label="Next month" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight /></Button>
          </>
        }
      >
        {error && <ErrorNote>{error}</ErrorNote>}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted-foreground">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d) => {
            const k = d.toLocaleDateString("en-CA");
            const info = byDay.get(k);
            const inMonth = d.getMonth() === cursor.getMonth();
            return (
              <button
                key={k}
                onClick={() => setSelected(k)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition-colors",
                  !inMonth && "text-muted-foreground/50",
                  k === selected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
                  k === today && k !== selected && "ring-2 ring-gold"
                )}
              >
                {d.getDate()}
                <span className="flex h-1.5 gap-0.5">
                  {[...(info?.modules ?? [])].slice(0, 4).map((m) => <i key={m} className={cn("size-1.5 rounded-full", k === selected ? "bg-primary-foreground" : DOT[m])} />)}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {(Object.keys(DOT) as ModuleId[]).map((m) => <span key={m} className="flex items-center gap-1"><i className={cn("size-2 rounded-full", DOT[m])} />{MODULE_LABEL[m]}</span>)}
        </div>
      </Panel>

      <div className="space-y-3">
        <h3 className="font-display text-xl font-bold">
          {new Date(`${selected}T12:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </h3>
        {dayRecurring.map((r) => (
          <div key={r.title} className="flex items-center gap-3 rounded-2xl border border-dashed border-border px-4 py-3 text-sm">
            <Repeat className="size-4 text-muted-foreground" />
            <span className="font-medium">{r.title}</span>
            <span className="ml-auto text-xs text-muted-foreground">{time(r.at)} · every week</span>
          </div>
        ))}
        {dayPosts.map((p) => (
          <div key={p._id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
            {p.imageUrl ? <img src={p.imageUrl} alt="" className="h-24 w-20 shrink-0 rounded-xl object-cover" loading="lazy" /> : <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-xl bg-accent text-center text-[10px] text-muted-foreground">{p.status === "design" ? "Designing image" : p.status === "cancelled" ? "Cancelled" : "Posted"}</div>}
            <div className="min-w-0 text-sm">
              <p className="font-semibold">{time(p.publishAt)} · {p.language} · {p.topic}</p>
              <p className="line-clamp-3 text-xs text-muted-foreground">{p.caption}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-success">{p.status}</p>
            </div>
          </div>
        ))}
        {dayActions.map((a) => <ActionCard key={a._id} action={a} onChanged={reload} />)}
        {!dayActions.length && !dayPosts.length && !dayRecurring.length && (
          <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Nothing on this day.</p>
        )}
      </div>
    </div>
  );
};
