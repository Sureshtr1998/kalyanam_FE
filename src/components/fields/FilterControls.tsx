import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { SelectType } from "@/utils/interfaces";
import { normalizeToArray } from "@/utils/utils";

/** Titled block inside a filter panel. */
export const FilterGroup = ({
  title,
  hint,
  action,
  children,
}: {
  title: string;
  hint?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="space-y-3 border-b border-border/70 py-5 first:pt-0 last:border-0">
    <div className="flex items-baseline justify-between gap-3">
      <h4 className="text-sm font-bold">{title}</h4>
      {action}
    </div>
    {hint && <p className="-mt-2 text-xs text-muted-foreground">{hint}</p>}
    {children}
  </section>
);

/** Multi-select as tappable pills; best for short option lists. */
export const ChipGroup = ({
  options,
  value,
  onChange,
}: {
  options: SelectType[];
  value?: string | string[];
  onChange: (value: string[]) => void;
}) => {
  const selected = normalizeToArray(value);
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o.value)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
              on
                ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "border-border bg-card text-foreground/80 hover:border-gold hover:bg-accent"
            )}>
            {on && <Check className="size-3.5" />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
};

/**
 * Two-thumb slider over an ordered option list (ages, heights).
 * Empty ends mean "no limit".
 */
export const RangeField = ({
  options,
  from,
  to,
  onChange,
  format = (o) => o.label,
  explicit,
}: {
  options: SelectType[];
  from?: string;
  to?: string;
  onChange: (from: string | undefined, to: string | undefined) => void;
  format?: (o: SelectType) => string;
  /** Always emit both ends (for required preferences) instead of "no limit". */
  explicit?: boolean;
}) => {
  const last = options.length - 1;
  const fromIdx = Math.max(0, options.findIndex((o) => o.value === from));
  const toIdxRaw = options.findIndex((o) => o.value === to);
  const toIdx = toIdxRaw === -1 ? last : toIdxRaw;
  const isAny = !explicit && !from && !to;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="rounded-lg bg-muted px-2.5 py-1 font-semibold">{format(options[fromIdx])}</span>
        <span className="text-xs text-muted-foreground">{isAny ? "Any" : "to"}</span>
        <span className="rounded-lg bg-muted px-2.5 py-1 font-semibold">{format(options[toIdx])}</span>
      </div>
      <Slider
        min={0}
        max={last}
        step={1}
        minStepsBetweenThumbs={0}
        value={[fromIdx, toIdx]}
        onValueChange={([a, b]) =>
          explicit
            ? onChange(options[a].value, options[b].value)
            : onChange(a === 0 ? undefined : options[a].value, b === last ? undefined : options[b].value)
        }
        className="py-2"
      />
    </div>
  );
};
