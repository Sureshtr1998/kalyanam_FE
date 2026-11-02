// Regenerates public/sitemap.xml from the app's public routes, blog posts, community
// and city pages. Runs before every build (see package.json "build").
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { LOCALES, TRANSLATED_PATHS, localePath, publicPages, root } from "./routes.mjs";

// Same files Vite reads for a production build (.env, .env.production, real env vars).
const env = loadEnv("production", root, "VITE_");
const SITE = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
if (!SITE) throw new Error("VITE_SITE_URL is not set; see .env.example");

const pages = publicPages();

/** The English path a localized URL translates, e.g. /kn/pricing -> /pricing. */
const basePath = (path) => {
  const [, first, ...rest] = path.split("/");
  const isLocale = LOCALES.some(([lang]) => lang !== "en" && lang === first);
  return isLocale ? `/${rest.join("/")}` : path;
};

// Every language version lists all its alternates, itself included (Google's hreflang rule).
const alternates = (path) => {
  const base = basePath(path);
  if (!TRANSLATED_PATHS.includes(base)) return "";
  return [
    ...LOCALES.map(
      ([lang, hreflang]) =>
        `\n    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${SITE}${localePath(base, lang)}" />`
    ),
    `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${base}" />`,
  ].join("");
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    ([path, freq, priority, lastmod]) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>${alternates(path)}
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${pages.length} URLs`);
