import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Summary } from "./staffTypes";

export const Stat = ({ label, value, hint, accent }: { label: string; value: ReactNode; hint?: ReactNode; accent?: boolean }) => (
  <div className={cn("rounded-2xl border p-4", accent ? "border-primary/20 bg-primary text-primary-foreground" : "border-border bg-card")}>
    <p className={cn("text-xs font-semibold uppercase tracking-wide", accent ? "text-primary-foreground/75" : "text-muted-foreground")}>
      {label}
    </p>
    <p className="mt-1 font-display text-3xl font-bold">{value}</p>
    {hint && <p className={cn("text-xs", accent ? "text-primary-foreground/75" : "text-muted-foreground")}>{hint}</p>}
  </div>
);

/** Sign-ups per day for the last two weeks. */
export const SignupBars = ({ signups }: { signups: Summary["signups"] }) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    const key = d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    return { key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), n: signups.find((s) => s._id === key)?.n ?? 0 };
  });
  const max = Math.max(1, ...days.map((d) => d.n));
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="mb-3 text-sm font-semibold">New sign-ups · last 14 days</p>
      <div className="flex h-32 items-end gap-1">
        {days.map((d) => (
          <div key={d.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-1" title={`${d.label}: ${d.n}`}>
            <span className="text-[10px] font-semibold text-muted-foreground opacity-0 group-hover:opacity-100">{d.n}</span>
            <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${(d.n / max) * 85}%`, minHeight: d.n ? 4 : 1 }} />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>{days[0].label}</span>
        <span>Today</span>
      </div>
    </div>
  );
};
