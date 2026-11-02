import { useSyncExternalStore } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

/**
 * Public pages with a full translation. Each also has its own URL per language
 * (/kn, /hi/pricing …) so search engines index every version.
 * Keep in sync with TRANSLATED_PATHS in scripts/routes.mjs.
 */
export const TRANSLATED_PATHS = ["/", "/about-us", "/pricing", "/partner-with-us"];
export const PATH_LANGS: Lang[] = LANGUAGES.map((l) => l.value).filter((l) => l !== "en");

/** Splits a URL into its language prefix and the English path: /kn/pricing -> kn, /pricing. */
export const splitLocalePath = (pathname: string): { lang: Lang | null; path: string } => {
  const [, first, ...rest] = pathname.split("/");
  return PATH_LANGS.includes(first as Lang)
    ? { lang: first as Lang, path: `/${rest.join("/")}` }
    : { lang: null, path: pathname };
};

/** The URL of `path` in `lang`; pages without a translation keep their English URL. */
export const localePath = (path: string, lang: Lang) =>
  lang === "en" || !TRANSLATED_PATHS.includes(path) ? path : `/${lang}${path === "/" ? "" : path}`;

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

// Unprefixed pages are prerendered in English, so hydration starts from "en" and switches after.
const serverLang = () => "en" as const;
const serverNone = () => null;

/**
 * A language prefix in the URL (/kn/about-us) wins over the saved choice. Choosing a
 * language on a translated page moves to that language's URL.
 */
export const usePublicLang = (): [Lang, (lang: Lang) => void] => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const saved = useSyncExternalStore(subscribe, () => read(SITE_LANG) ?? "en", serverLang);
  const { lang: urlLang, path } = splitLocalePath(pathname);
  return [
    urlLang ?? saved,
    (lang) => {
      write(SITE_LANG, lang);
      if (TRANSLATED_PATHS.includes(path)) navigate(localePath(path, lang) + search + hash, { replace: true });
    },
  ];
};

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
