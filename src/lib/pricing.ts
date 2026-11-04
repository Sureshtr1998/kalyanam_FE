import { useSyncExternalStore } from "react";
import api from "@/utils/api";
import { getItem, setItem } from "@/utils/localStore";
import type { Lang } from "./i18n";

/**
 * Live prices from GET /pricing. An admin picks the pricing level in the panel;
 * the server (kalyanam_BE/src/utils/pricing.js) holds the tables and decides
 * what is charged. These are for display only.
 */
export interface Pricing {
  level: number;
  registrationFee: number;
  /** Struck-through "was" price; null when registration is free. */
  registrationFeeOriginal: number | null;
  registrationInterests: number;
  referralFee: number;
  /** Refer & earn: what a member gets back when a friend registers with their code. */
  memberReferralReward: number;
  brokerCommission: number;
  interestPacks: Record<PackKey, { amount: number; interests: number }>;
  astroFees: Record<AstroMode, number>;
  brokerRegistrationFee: number;
}

export type PackKey = "basic" | "premium";
export type AstroMode = "Overview" | "Personalized" | "Kundli Matching";

export const PACK_TITLES: Record<PackKey, string> = { basic: "Basic Pack", premium: "Premium Pack" };

/** Level 3, the server's default. Prerendered pages are built with it. */
export const DEFAULT_PRICING: Pricing = {
  level: 3,
  registrationFee: 351,
  registrationFeeOriginal: 999,
  registrationInterests: 36,
  referralFee: 301,
  memberReferralReward: 71,
  brokerCommission: 101,
  interestPacks: {
    basic: { amount: 101, interests: 21 },
    premium: { amount: 251, interests: 56 },
  },
  astroFees: { Overview: 51, Personalized: 251, "Kundli Matching": 201 },
  brokerRegistrationFee: 501,
};

export const isFreeRegistration = (p: Pricing) => p.registrationFee <= 0;

const CACHE_KEY = "pricing";

const isPricing = (v: unknown): v is Pricing =>
  !!v && typeof v === "object" && typeof (v as Pricing).registrationFee === "number" && !!(v as Pricing).interestPacks;

let current: Pricing = (() => {
  const cached = getItem(CACHE_KEY);
  return isPricing(cached) ? cached : DEFAULT_PRICING;
})();
let fetched: Promise<void> | null = null;
const listeners = new Set<() => void>();

/** Fetches the live prices (once per page load unless forced, e.g. after an admin change). */
export const refreshPricing = (force = false) => {
  if (fetched && !force) return fetched;
  fetched = api
    .get("/pricing")
    .then(({ data }) => {
      if (!isPricing(data)) return;
      current = data;
      try {
        setItem(CACHE_KEY, data);
      } catch {
        // Storage full or blocked: the in-memory copy is enough.
      }
      listeners.forEach((cb) => cb());
    })
    .catch(() => {
      // Keep showing the cached / default prices; the server still decides the charge.
      fetched = null;
    });
  return fetched;
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  void refreshPricing();
  return () => listeners.delete(cb);
};

export const usePricing = () => useSyncExternalStore(subscribe, () => current, () => DEFAULT_PRICING);

const FREE: Record<Lang, string> = { en: "Free", kn: "ಉಚಿತ", hi: "निःशुल्क", ta: "இலவசம்", te: "ఉచితం" };
const PER_YEAR: Record<Lang, string> = { en: "year", kn: "ವರ್ಷ", hi: "वर्ष", ta: "ஆண்டு", te: "సంవత్సరం" };

export const freeLabel = (lang: Lang) => FREE[lang];

/** "₹351", or "Free" in the reader's language. */
export const feeLabel = (amount: number, lang: Lang = "en") => (amount > 0 ? `₹${amount}` : FREE[lang]);

/**
 * Fills price placeholders in translated text: {fee}, {feeYear}, {credits},
 * {astroFrom}, {brokerFee}, {pack1Fee}, {pack1Credits}, {pack2Fee}, {pack2Credits}.
 * Works on strings, arrays and plain objects; anything else is returned as is.
 */
export const fillPrices = <T,>(value: T, p: Pricing, lang: Lang = "en"): T => {
  const vars: Record<string, string> = {
    fee: feeLabel(p.registrationFee, lang),
    feeYear: p.registrationFee > 0 ? `₹${p.registrationFee}/${PER_YEAR[lang]}` : FREE[lang],
    credits: String(p.registrationInterests),
    off: p.registrationFeeOriginal
      ? `${Math.round((1 - p.registrationFee / p.registrationFeeOriginal) * 100)}%`
      : "",
    astroFrom: `₹${Math.min(...Object.values(p.astroFees))}`,
    brokerFee: `₹${p.brokerRegistrationFee}`,
    pack1Fee: `₹${p.interestPacks.basic.amount}`,
    pack1Credits: String(p.interestPacks.basic.interests),
    pack2Fee: `₹${p.interestPacks.premium.amount}`,
    pack2Credits: String(p.interestPacks.premium.interests),
  };
  const fill = (v: unknown): unknown => {
    if (typeof v === "string") return v.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);
    if (Array.isArray(v)) return v.map(fill);
    // Plain objects only: React elements (which carry $$typeof) are left alone.
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype && !("$$typeof" in v)) {
      return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]));
    }
    return v;
  };
  return fill(value) as T;
};
