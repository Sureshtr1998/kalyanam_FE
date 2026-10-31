// The public, indexable pages: used for the sitemap and for prerendering.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const slugsIn = (file) =>
  [...readFileSync(resolve(root, file), "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

/** [path, changefreq, priority] */
export const publicPages = () => [
  ["/", "weekly", "1.0"],
  ["/about-us", "monthly", "0.8"],
  ["/pricing", "monthly", "0.8"],
  ["/communities", "monthly", "0.8"],
  ["/blog", "weekly", "0.8"],
  ["/faq", "monthly", "0.7"],
  ["/partner-with-us", "monthly", "0.6"],
  ["/contact-us", "yearly", "0.5"],
  ["/terms", "yearly", "0.3"],
  ["/privacy", "yearly", "0.3"],
  ["/refund-policy", "yearly", "0.3"],
  ...slugsIn("src/screens/blogs/blogsContents.tsx").map((s) => [`/blog/${s}`, "monthly", "0.7"]),
  ...slugsIn("src/screens/communities/seoComm.ts").map((s) => [`/communities/${s}`, "monthly", "0.7"]),
];
