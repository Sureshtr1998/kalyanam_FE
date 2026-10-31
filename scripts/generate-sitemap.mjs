// Regenerates public/sitemap.xml from the app's public routes, blog posts and
// community pages. Runs before every build (see package.json "build").
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { publicPages, root } from "./routes.mjs";

// Same files Vite reads for a production build (.env, .env.production, real env vars).
const env = loadEnv("production", root, "VITE_");
const SITE = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
if (!SITE) throw new Error("VITE_SITE_URL is not set; see .env.example");

const pages = publicPages();

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    ([path, freq, priority]) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(root, "public/sitemap.xml"), xml);
console.log(`sitemap.xml: ${pages.length} URLs`);
