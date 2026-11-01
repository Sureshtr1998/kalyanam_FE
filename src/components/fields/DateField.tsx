import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatFloating, localDateToValue, valueToLocalDate } from "@/lib/dates";

interface DateFieldProps {
  id?: string;
  /** "YYYY-MM-DD" */
  value?: string;
  onChange: (value: string) => void;
  maxDate?: Date;
  minYear?: number;
  placeholder?: string;
  invalid?: boolean;
}

const Chip = ({ active, className, ...props }: React.ComponentProps<"button"> & { active?: boolean }) => (
  <button
    type="button"
    aria-pressed={active}
    className={cn(
      "h-9 rounded-lg border border-border bg-card text-sm font-medium tabular-nums transition-colors hover:border-primary/40 hover:bg-accent disabled:pointer-events-none disabled:opacity-35",
      active && "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary",
      className
    )}
    {...props}
  />
);

type DateView = "days" | "months" | "years";

const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString("default", { month: "short" }));

/** Day cells: round, roomy tap targets with a saffron selected state and a ringed "today". */
const DAY_CLASSES = {
  root: "w-full",
  month_caption: "hidden",
  weekdays: "flex",
  weekday: "flex-1 pb-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground select-none",
  week: "mt-1 flex w-full",
  day: "group/day relative flex-1 p-0 text-center select-none",
  today: "[&>button]:ring-1 [&>button]:ring-primary/50 [&>button]:font-semibold [&>button]:text-primary",
  outside: "[&>button]:text-muted-foreground/50",
  disabled: "[&>button]:opacity-30 [&>button]:pointer-events-none",
};

/**
 * Date picker with a "selected date" header and drill-down views: tap the month/year
 * caption to jump years → months → days. Works purely in "YYYY-MM-DD" strings.
 */
export const DateField = ({
  id,
  value,
  onChange,
  maxDate = new Date(),
  minYear = 1940,
  placeholder = "Pick a date",
  invalid,
}: DateFieldProps) => {
  const [open, setOpen] = useState(false);
  const selected = valueToLocalDate(value);
  const [month, setMonth] = useState<Date>(selected ?? maxDate);
  const [view, setView] = useState<DateView>("days");
  const yearListRef = useRef<HTMLDivElement>(null);

  const maxYear = maxDate.getFullYear();
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  const atStart = month.getFullYear() === minYear && month.getMonth() === 0;
  const atEnd = month.getFullYear() === maxYear && month.getMonth() === maxDate.getMonth();
  const shiftMonth = (delta: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setMonth(selected ?? maxDate);
      // No date yet (e.g. date of birth) — start at the year list, it's the biggest jump.
      setView(selected ? "days" : "years");
    }
  };

  // Keep the active year in view when the year list opens.
  useEffect(() => {
    if (view !== "years") return;
    yearListRef.current?.querySelector<HTMLElement>("[data-active=true]")?.scrollIntoView({ block: "center" });
  }, [view]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid || undefined}
          className={cn(
            "h-10 w-full justify-start bg-card px-3 font-normal",
            !value && "text-muted-foreground"
          )}>
          <CalendarDays className="text-muted-foreground" />
          {value ? formatFloating(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[19rem] overflow-hidden p-0" align="start">
        {/* Selected date */}
        <div className="border-b border-border bg-accent/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {selected ? selected.toLocaleString("default", { weekday: "long" }) : "Select a date"}
          </p>
          <p className={cn("font-display text-2xl font-bold leading-tight", !selected && "text-muted-foreground")}>
            {selected
              ? selected.toLocaleString("default", { day: "numeric", month: "long", year: "numeric" })
              : "— — —"}
          </p>
        </div>

        {/* Caption: drill-down toggle + month nav */}
        <div className="flex items-center justify-between gap-2 px-3 pt-3">
          <button
            type="button"
            onClick={() => setView(view === "days" ? "years" : "days")}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold transition-colors hover:bg-accent">
            {view === "months" ? month.getFullYear() : `${MONTHS[month.getMonth()]} ${month.getFullYear()}`}
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", view !== "days" && "rotate-180")} />
          </button>
          {view === "days" && (
            <div className="flex gap-1">
              <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full" aria-label="Previous month" disabled={atStart} onClick={() => shiftMonth(-1)}>
                <ChevronLeft />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="size-8 rounded-full" aria-label="Next month" disabled={atEnd} onClick={() => shiftMonth(1)}>
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>

        <div className="p-3">
          {view === "years" && (
            <div ref={yearListRef} className="grid max-h-64 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
              {years.map((y) => (
                <Chip
                  key={y}
                  data-active={y === month.getFullYear()}
                  active={y === month.getFullYear()}
                  onClick={() => {
                    setMonth(new Date(y, Math.min(month.getMonth(), y === maxYear ? maxDate.getMonth() : 11), 1));
                    setView("months");
                  }}>
                  {y}
                </Chip>
              ))}
            </div>
          )}

          {view === "months" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((label, i) => {
                const beyondMax = month.getFullYear() === maxYear && i > maxDate.getMonth();
                return (
                  <Chip
                    key={label}
                    active={i === month.getMonth()}
                    disabled={beyondMax}
                    className="h-11"
                    onClick={() => {
                      setMonth(new Date(month.getFullYear(), i, 1));
                      setView("days");
                    }}>
                    {label}
                  </Chip>
                );
              })}
            </div>
          )}

          {view === "days" && (
            <Calendar
              mode="single"
              hideNavigation
              className="w-full p-0 [--cell-size:--spacing(9)]"
              classNames={DAY_CLASSES}
              selected={selected}
              month={month}
              onMonthChange={setMonth}
              startMonth={new Date(minYear, 0)}
              endMonth={maxDate}
              disabled={{ after: maxDate }}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                DayButton: ({ day, modifiers, className, ...props }) => (
                  <button
                    {...props}
                    type="button"
                    className={cn(
                      "mx-auto flex size-(--cell-size) items-center justify-center rounded-full text-sm tabular-nums transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      modifiers.selected && "bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary",
                      className
                    )}
                  />
                ),
              }}
              onSelect={(d) => {
                if (d) {
                  onChange(localDateToValue(d));
                  setOpen(false);
                }
              }}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface TimeFieldProps {
  id?: string;
  /** "HH:mm" (24h) */
  value?: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTE_STEPS = Array.from({ length: 12 }, (_, i) => i * 5);
const pad = (n: number) => String(n).padStart(2, "0");

const parseTime = (value?: string) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
  if (!m) return null;
  const h24 = Number(m[1]);
  return { hour: h24 % 12 || 12, minute: Number(m[2]), pm: h24 >= 12 };
};


/** Hour / minute / AM-PM picker with tap targets instead of scrolling lists. Stores "HH:mm" (24h). */
export const TimeField = ({ id, value, onChange, invalid }: TimeFieldProps) => {
  const [open, setOpen] = useState(false);
  const parsed = parseTime(value);
  const t = { hour: 12, minute: 0, pm: false, ...parsed };

  const commit = (next: Partial<typeof t>) => {
    const n = { ...t, ...next };
    onChange(`${pad((n.hour % 12) + (n.pm ? 12 : 0))}:${pad(n.minute)}`);
  };
  const nudgeMinute = (delta: number) => commit({ minute: (t.minute + delta + 60) % 60 });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-invalid={invalid || undefined}
          className={cn(
            "h-10 w-full justify-start bg-card px-3 font-normal",
            !parsed && "text-muted-foreground"
          )}>
          <Clock className="text-muted-foreground" />
          {parsed ? `${pad(parsed.hour)}:${pad(parsed.minute)} ${parsed.pm ? "PM" : "AM"}` : "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[19rem] p-0" align="start">
        {/* Selected time + AM/PM */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-accent/40 px-4 py-3">
          <div className="flex items-center gap-1 font-display text-3xl font-bold tabular-nums">
            <span className={cn(!parsed && "text-muted-foreground")}>{pad(t.hour)}</span>
            <span className="text-muted-foreground">:</span>
            <span className="flex items-center gap-1">
              <span className={cn(!parsed && "text-muted-foreground")}>{pad(t.minute)}</span>
              <span className="flex flex-col">
                <button type="button" aria-label="One minute later" onClick={() => nudgeMinute(1)} className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <ChevronUp className="size-3.5" />
                </button>
                <button type="button" aria-label="One minute earlier" onClick={() => nudgeMinute(-1)} className="rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                  <ChevronDown className="size-3.5" />
                </button>
              </span>
            </span>
          </div>
          <div className="flex rounded-lg border border-border bg-card p-0.5" role="group" aria-label="AM or PM">
            {(["AM", "PM"] as const).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={parsed ? (v === "PM") === parsed.pm : false}
                onClick={() => commit({ pm: v === "PM" })}
                className={cn(
                  "rounded-md px-3 py-1 text-sm font-semibold transition-colors",
                  parsed && (v === "PM") === parsed.pm ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hour</p>
            <div className="grid grid-cols-6 gap-1.5">
              {HOURS.map((h) => (
                <Chip key={h} active={parsed?.hour === h} onClick={() => commit({ hour: h })}>
                  {h}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Minute <span className="font-normal normal-case tracking-normal">(use the arrows for an exact minute)</span>
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {MINUTE_STEPS.map((m) => (
                <Chip key={m} active={parsed?.minute === m} onClick={() => commit({ minute: m })}>
                  {pad(m)}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-border p-2">
          <Button type="button" size="sm" onClick={() => setOpen(false)} disabled={!parsed}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
