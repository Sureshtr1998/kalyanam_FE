import { useSyncExternalStore } from "react";
import { getItem, setItem } from "@/utils/localStore";

export type Lang = "en" | "kn" | "hi" | "ta" | "te";

export const LANGUAGES: { value: Lang; label: string; locale: string }[] = [
  { value: "en", label: "English", locale: "en-IN" },
  { value: "kn", label: "ಕನ್ನಡ", locale: "kn-IN" },
  { value: "hi", label: "हिंदी", locale: "hi-IN" },
  { value: "te", label: "తెలుగు", locale: "te-IN" },
  { value: "ta", label: "தமிழ்", locale: "ta-IN" },
];

export const localeOf = (lang: Lang) => LANGUAGES.find((l) => l.value === lang)?.locale ?? "en-IN";

/** Public pages (landing, about, pricing, partner) share one choice. */
const SITE_LANG = "site_lang";
/** Logged-in members: empty matches and astrology, defaulting to their mother tongue. */
const MEMBER_LANG = "member_lang";

const isLang = (v: unknown): v is Lang => LANGUAGES.some((l) => l.value === v);

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};
const read = (key: string): Lang | null => {
  const v = getItem(key);
  return isLang(v) ? v : null;
};
const write = (key: string, lang: Lang) => {
  setItem(key, lang);
  listeners.forEach((cb) => cb());
};

// Prerendered pages are English, so hydration starts from "en" and switches after.
const serverLang = () => "en" as const;
const serverNone = () => null;

export const usePublicLang = (): [Lang, (lang: Lang) => void] => [
  useSyncExternalStore(subscribe, () => read(SITE_LANG) ?? "en", serverLang),
  (lang) => write(SITE_LANG, lang),
];

const MOTHER_TONGUE_LANG: Record<string, Lang> = {
  Kannada: "kn",
  "Havyaka Kannada": "kn",
  Hindi: "hi",
  Tamil: "ta",
  Telugu: "te",
};

export const useMemberLang = (motherTongue?: string): [Lang, (lang: Lang) => void] => {
  const chosen = useSyncExternalStore(subscribe, () => read(MEMBER_LANG), serverNone);
  return [chosen ?? MOTHER_TONGUE_LANG[motherTongue ?? ""] ?? "en", (lang) => write(MEMBER_LANG, lang)];
};
