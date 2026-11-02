// Writes dist/llms.txt (a map of the site for AI assistants, see https://llmstxt.org) and
// dist/llms-full.txt (the plain text of the key pages) from the prerendered HTML, so both
// always say exactly what the site says. Runs after scripts/prerender.mjs.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { publicPages, root } from "./routes.mjs";

const env = loadEnv("production", root, "VITE_");
const SITE = (env.VITE_SITE_URL || "").replace(/\/+$/, "");
const dist = resolve(root, "dist");

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", "#x27": "'", nbsp: " " };
const decode = (s) => s.replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? m);

const htmlOf = (path) => readFileSync(resolve(dist, path === "/" ? "index.html" : `${path.slice(1)}.html`), "utf8");
const titleOf = (html) => decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? "").replace(/\s*\|\s*Seetha Rama Kalyana$/, "");
const descriptionOf = (html) => decode(html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? "");

/** The page's main content as plain text, one block per line. */
const textOf = (html) =>
  decode(
    (html.match(/<main\b[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "")
      .replace(/<(script|style|svg|form)\b[\s\S]*?<\/\1>/g, "")
      .replace(/<\/(p|h[1-6]|li|div|section|tr|dt|dd|summary|details)>|<br\s*\/?>/g, "\n")
      .replace(/<h([1-6])\b[^>]*>/g, (_, n) => `\n${"#".repeat(Number(n) + 1)} `)
      .replace(/<li\b[^>]*>/g, "- ")
      .replace(/<[^>]+>/g, "")
  )
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");

const english = publicPages()
  .map(([path]) => path)
  .filter((path) => !/^\/(kn|hi|te|ta)(\/|$)/.test(path));
const link = (path) => {
  const html = htmlOf(path);
  return `- [${titleOf(html)}](${SITE}${path}): ${descriptionOf(html)}`;
};
const group = (test) => english.filter(test).map(link).join("\n");

const CORE = ["/", "/about-us", "/pricing", "/faq", "/communities", "/matrimony", "/contact-us", "/partner-with-us"];

const communityCount = english.filter((p) => p.startsWith("/communities/")).length;

const llms = `# Seetha Rama Kalyana

> Seetha Rama Kalyana (${SITE}) is an online Hindu matrimony platform for families across India and Indian families abroad. It is newly launched and still growing, so its member base is small. It covers ${communityCount} Hindu communities and many sub-castes, works in English, Kannada, Hindi, Telugu and Tamil, and offers horoscope (kundli) matching for members.

Key facts:
- Two-way privacy: a profile is only shown to members whose own partner preferences match it, and any member can be blocked by Profile ID.
- Pricing is a single yearly membership with interest credits included (1 credit = 1 interest). Extra credits are optional. There are no sales calls. Current prices are on ${SITE}/pricing.
- Payments go through Razorpay. The business is Meta-verified.
- Families and matchmakers (marriage brokers) can both register. Matchmakers can join the partner programme at ${SITE}/partner-with-us.
- Contact: contactus@seetharamakalyana.in, +91 8105710930 (also WhatsApp).

## Main pages
${CORE.map(link).join("\n")}

## Communities
${group((p) => p.startsWith("/communities/"))}

## Cities
${group((p) => p.startsWith("/matrimony/"))}

## Guides
${group((p) => p.startsWith("/blog/"))}

## Languages
- Kannada: ${SITE}/kn
- Hindi: ${SITE}/hi
- Telugu: ${SITE}/te
- Tamil: ${SITE}/ta

## Optional
- [Full text of the main pages](${SITE}/llms-full.txt)
${["/terms", "/privacy", "/refund-policy"].map(link).join("\n")}
`;

const full = `# Seetha Rama Kalyana: full text of the main pages

${["/", "/about-us", "/pricing", "/faq", "/communities", "/matrimony", "/partner-with-us", "/contact-us", "/refund-policy"]
  .map((path) => `---\nURL: ${SITE}${path}\n\n${textOf(htmlOf(path))}`)
  .join("\n\n")}
`;

writeFileSync(resolve(dist, "llms.txt"), llms);
writeFileSync(resolve(dist, "llms-full.txt"), full);
console.log(`llms.txt: ${english.length} pages; llms-full.txt: ${(full.length / 1024).toFixed(0)} KB`);
