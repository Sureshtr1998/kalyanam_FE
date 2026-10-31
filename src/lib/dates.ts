/*
 * Birth dates/times are "floating" wall-clock values. The server stores the
 * digits the user typed as if they were UTC (10:30 entered → "…T10:30:00.000Z"),
 * so we must never run them through `new Date()` + local getters, which would
 * shift them by the viewer's timezone (that was the "time changes after
 * refresh" bug). Work with the string digits only.
 */

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export interface FloatingParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export const floatingParts = (
  value?: string | Date | null
): FloatingParts | null => {
  if (!value) return null;
  const str = value instanceof Date ? value.toISOString() : String(value);
  const m = str.match(ISO_RE);
  if (!m) return null;
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: m[4] ? Number(m[4]) : 0,
    minute: m[5] ? Number(m[5]) : 0,
  };
};

const pad = (n: number) => String(n).padStart(2, "0");

/** "YYYY-MM-DD" for a floating value. */
export const toDateValue = (value?: string | Date | null) => {
  const p = floatingParts(value);
  return p ? `${p.year}-${pad(p.month)}-${pad(p.day)}` : "";
};

/** Combines a date ("YYYY-MM-DD") and optional time ("HH:mm") for the API. */
export const toFloatingString = (date: string, time?: string) =>
  date ? (time ? `${date}T${time}` : date) : "";

/** "10 Mar 1995" or "10 Mar 1995, 10:30 AM". */
export const formatFloating = (
  value?: string | Date | null,
  withTime = false
) => {
  const p = floatingParts(value);
  if (!p) return "-";
  const date = `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
  if (!withTime) return date;
  const h12 = p.hour % 12 || 12;
  const ampm = p.hour < 12 ? "AM" : "PM";
  return `${date}, ${h12}:${pad(p.minute)} ${ampm}`;
};

export const ageFromFloating = (value?: string | Date | null) => {
  const p = floatingParts(value);
  if (!p) return null;
  const now = new Date();
  let age = now.getFullYear() - p.year;
  const m = now.getMonth() + 1;
  if (m < p.month || (m === p.month && now.getDate() < p.day)) age -= 1;
  return age;
};

/** A real instant (e.g. a transaction time) shown in the viewer's timezone. */
export const formatInstant = (value?: string | Date | null, withTime = false) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
};

/** Local calendar date → "YYYY-MM-DD" (no UTC conversion). */
export const localDateToValue = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "YYYY-MM-DD" → local Date at midnight (for the calendar widget). */
export const valueToLocalDate = (value?: string) => {
  const p = floatingParts(value);
  return p ? new Date(p.year, p.month - 1, p.day) : undefined;
};
