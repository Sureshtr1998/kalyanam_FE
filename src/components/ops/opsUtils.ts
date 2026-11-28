import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/utils/api";
import { errorMessage } from "@/lib/errors";

/* --------------------------------- types --------------------------------- */

export type Mode = "off" | "shadow" | "live";
export type ModuleId = "ads" | "organic" | "support" | "comments" | "seo" | "dev" | "tools";
export type ActionStatus = "scheduled" | "needs_you" | "idea" | "shadow" | "running" | "done" | "cancelled" | "failed" | "info";

export interface OpsAction {
  _id: string;
  module: ModuleId;
  type: string;
  status: ActionStatus;
  priority: "low" | "normal" | "urgent";
  title: string;
  reason: string;
  effect: string;
  payload: Record<string, unknown> & {
    draft?: string;
    reply?: string;
    userId?: string | null;
    /** source "razorpay": found in Razorpay by the person's email or mobile (no payment on an account). */
    payments?: { paymentId: string; amount: number; note?: string; date?: string; source?: "razorpay"; matchedBy?: "email" | "mobile"; refunded?: boolean; refundId?: string }[];
    to?: string;
    from?: number;
    mode?: Mode;
    /** Set by the agent when the problem an alert reported has cleared. */
    resolvedAt?: string;
  };
  runAt?: string;
  ranAt?: string;
  error?: string;
  /** Steps already done on this card (e.g. hidden, then waits to delete). */
  /**
   * Steps already done on this card (`type`/`title`/`at`), or, on an idea card,
   * the steps it planned (`kind`/`summary`/`status`/`error`).
   */
  result?: {
    steps?: { type?: string; title?: string; at?: string; kind?: string; summary?: string; status?: string; error?: string }[];
  } & Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  decidedBy?: string;
}

export interface AccountDay {
  date: string;
  spend: number;
  paid: number;
  leads: number;
  joined?: number;
  earned?: number;
  funds?: number;
}

/** Ops → Settings → Ads rules (OpsConfig.ads on the server). */
export interface AdsSettings {
  handsOffUntil: string | null;
  batchEveryDays: number;
  rebalance: boolean;
  pauseLosingAds: boolean;
  newAdsets: boolean;
  /** Languages that never give budget away or get cut, until the date. */
  rampUp?: { languages: string[]; until: string | null; base?: Record<string, number> };
  /** A second raise on Thursdays for winners. */
  midweekRaises?: boolean;
  /** The mid-week brake (−step when the last 3 days cost twice the usual). */
  brake?: boolean;
  /** The daily budget ceiling raises itself when budgets earn their target. */
  autoCeiling?: boolean;
  alertEmail: string;
  preferences: string;
}

/** Ops → Settings → WhatsApp alerts (OpsConfig.alerts on the server). */
export interface AlertSettings {
  /** "91XXXXXXXXXX", or "" when off. */
  whatsapp: string;
  lastSentAt: string | null;
  lastError: string;
  lastErrorAt: string | null;
  /** MSG91 WhatsApp is set up on the server. */
  ready: boolean;
  template: string;
  templateLanguage: string;
  templateBody: string;
}

export interface Overview {
  modes: Record<ModuleId, Mode>;
  limits: Record<string, number>;
  ads?: AdsSettings;
  alerts?: AlertSettings;
  /** Reminders in the last 24 hours (src/ops/reminders.js). */
  reminders?: { unpaid: number; verify: number; whatsapp: number; failed: number; lastError: string | null; bounced: number; paidAfter: number } | null;
  organic?: { planEvenings: boolean; ownerUntil?: string | null };
  targets: { month: string; members: number; revenue: number; spend: number }[];
  brief: string;
  lastRuns: Record<string, { at: string; ok: boolean; error?: string; ms?: number; result?: unknown }>;
  connections: Record<"claude" | "meta" | "page" | "instagram" | "mail" | "seo" | "github" | "qstash", boolean>;
  counts: Partial<Record<ActionStatus, number>>;
  feed: OpsAction[];
  claude: {
    monthUsd: number;
    totalUsd: number;
    totalCalls: number;
    budgetUsd: number;
    inrRate: number;
    byTask: { task: string; usd: number; calls: number }[];
  };
  accountDays: AccountDay[];
  automation?: { ready: boolean; scheduled: boolean; error: string | null; lastTickMinutes: number | null; healthy: boolean; stalled?: boolean; source?: string | null };
  weekly?: { body: string; period: string; createdAt: string; data?: { nextSteps?: unknown[] } } | null;
  jobs: string[];
}

/* -------------------------------- helpers -------------------------------- */

export const inr = (n?: number | null, digits = 0) =>
  n == null || !Number.isFinite(n)
    ? "–"
    : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: digits }).format(n);

export const num = (n?: number | null) => (n == null || !Number.isFinite(n) ? "–" : new Intl.NumberFormat("en-IN").format(Math.round(n)));

export const MODULE_LABEL: Record<ModuleId, string> = {
  ads: "Meta ads",
  organic: "Organic posts",
  support: "Support mail",
  comments: "Comments",
  seo: "SEO",
  dev: "Developer",
  tools: "Tools",
};

/** "in 7 h", "in 3 d", "5 min ago". */
export const relative = (iso?: string) => {
  if (!iso) return "";
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const unit = abs < 3600000 ? [Math.round(abs / 60000), "min"] : abs < 172800000 ? [Math.round(abs / 3600000), "h"] : [Math.round(abs / 86400000), "d"];
  return diff >= 0 ? `in ${unit[0]} ${unit[1]}` : `${unit[0]} ${unit[1]} ago`;
};

export const when = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" })
    : "";

/** GET with loading/error state and a reload function. */
export function useOps<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const load = useCallback(() => {
    if (!path) return;
    setLoading(true);
    setError(null);
    api
      .get<T>(path)
      .then((r) => setData(r.data))
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [path]);
  useEffect(() => load(), [load]);
  return { data, error, loading, reload: load, setData };
}

/** DELETE with a toast for the server's message. */
export const remove = async (path: string) => {
  try {
    const r = await api.delete<{ msg?: string }>(path);
    if (r.data?.msg) toast.success(r.data.msg);
    return r.data;
  } catch (e) {
    toast.error(errorMessage(e));
    throw e;
  }
};

/** POST with a toast for the server's message. */
export const post = async <T = { msg?: string },>(path: string, body?: unknown, quiet = false, timeoutMs?: number) => {
  try {
    const r = await api.post<T & { msg?: string }>(path, body ?? {}, timeoutMs ? { timeout: timeoutMs } : undefined);
    if (!quiet && r.data?.msg) toast.success(r.data.msg);
    return r.data;
  } catch (e) {
    toast.error(errorMessage(e));
    throw e;
  }
};

