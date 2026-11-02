// Tells Bing (which powers ChatGPT search and Copilot), Yandex, Seznam and Naver that pages
// changed, so they are recrawled within hours instead of weeks. Run after a production deploy:
//   npm run indexnow                      every URL in the sitemap
//   npm run indexnow -- /pricing /blog/x  only these paths
// The key is public by design: search engines check it at <site>/<key>.txt (public/).
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { root } from "./routes.mjs";

const KEY = "5385efc73f80afcd6506846e63e802bb";

const env = loadEnv("production", root, "VITE_");
const SITE = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
if (!SITE) throw new Error("VITE_SITE_URL is not set; see .env.example");

const paths = process.argv.slice(2);
const urlList = paths.length
  ? paths.map((p) => `${SITE}${p.startsWith("/") ? p : `/${p}`}`)
  : [...readFileSync(resolve(root, "public/sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted while the key is checked for the first time.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (!res.ok) process.exitCode = 1;
