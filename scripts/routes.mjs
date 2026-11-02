// The public, indexable pages: used for the sitemap, llms.txt and prerendering.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const read = (file) => readFileSync(resolve(root, file), "utf8");

const slugsIn = (file) => [...read(file).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

// Keep in sync with BLOG_PUBLISHED / BLOG_UPDATED in src/screens/blogs/blogsContents.tsx.
const BLOG_UPDATED = "2026-10-31";

/** Blog slugs with their last real content change (a post's own `updatedAt`, else BLOG_UPDATED). */
const blogPosts = () =>
  read("src/screens/blogs/blogsContents.tsx")
    .split(/\r?\n  \{\r?\n/)
    .slice(1)
    .map((block) => ({
      slug: block.match(/slug:\s*"([^"]+)"/)?.[1],
      updatedAt: block.match(/updatedAt:\s*"([^"]+)"/)?.[1] ?? BLOG_UPDATED,
    }))
    .filter((p) => p.slug);

// Pages with a full translation, served at /kn/…, /hi/…, /te/…, /ta/… as well as in English.
// Keep in sync with TRANSLATED_PATHS in src/lib/i18n.ts.
export const LOCALES = [
  ["en", "en-IN"],
  ["kn", "kn-IN"],
  ["hi", "hi-IN"],
  ["te", "te-IN"],
  ["ta", "ta-IN"],
];
export const TRANSLATED_PATHS = ["/", "/about-us", "/pricing", "/partner-with-us"];
export const localePath = (path, lang) => (lang === "en" ? path : `/${lang}${path === "/" ? "" : path}`);

/**
 * [path, changefreq, priority, lastmod]. Bump a lastmod only when that page's content
 * really changes: search engines stop trusting dates that move on every build.
 */
const englishPages = () => [
  ["/", "weekly", "1.0", "2026-11-02"],
  ["/about-us", "monthly", "0.8", "2026-11-02"],
  ["/pricing", "monthly", "0.8", "2026-11-02"],
  ["/communities", "monthly", "0.8", "2026-10-31"],
  ["/matrimony", "monthly", "0.8", "2026-11-02"],
  ["/blog", "weekly", "0.8", "2026-11-02"],
  ["/faq", "monthly", "0.7", "2026-11-02"],
  ["/partner-with-us", "monthly", "0.6", "2026-11-01"],
  ["/contact-us", "yearly", "0.5", "2026-10-31"],
  ["/terms", "yearly", "0.3", "2026-10-31"],
  ["/privacy", "yearly", "0.3", "2026-10-31"],
  ["/refund-policy", "yearly", "0.3", "2026-10-31"],
  ...blogPosts().map((p) => [`/blog/${p.slug}`, "monthly", "0.7", p.updatedAt]),
  ...slugsIn("src/screens/communities/seoComm.ts").map((s) => [`/communities/${s}`, "monthly", "0.7", "2026-10-31"]),
  ...slugsIn("src/screens/cities/seoCities.ts").map((s) => [`/matrimony/${s}`, "monthly", "0.7", "2026-11-02"]),
];

export const publicPages = () => {
  const en = englishPages();
  const localized = LOCALES.filter(([lang]) => lang !== "en").flatMap(([lang]) =>
    en
      .filter(([path]) => TRANSLATED_PATHS.includes(path))
      .map(([path, freq, priority, lastmod]) => [localePath(path, lang), freq, priority, lastmod])
  );
  return [...en, ...localized];
};
