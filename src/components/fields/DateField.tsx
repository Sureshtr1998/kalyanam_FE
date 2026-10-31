import { useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Clock } from "lucide-react";
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

/** Calendar with month/year dropdowns. Works purely in "YYYY-MM-DD" strings. */
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
            !value && "text-muted-foreground"
          )}>
          <CalendarDays className="text-muted-foreground" />
          {value ? formatFloating(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={selected}
          defaultMonth={selected ?? maxDate}
          startMonth={new Date(minYear, 0)}
          endMonth={maxDate}
          disabled={{ after: maxDate }}
          onSelect={(d) => {
            if (d) {
              onChange(localDateToValue(d));
              setOpen(false);
            }
          }}
        />
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

const Chip = ({ active, onClick, children, className }: { active?: boolean; onClick: () => void; children: React.ReactNode; className?: string }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      "h-9 rounded-lg border border-border bg-card text-sm font-medium tabular-nums transition-colors hover:border-primary/40 hover:bg-accent",
      active && "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary",
      className
    )}>
    {children}
  </button>
);

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
