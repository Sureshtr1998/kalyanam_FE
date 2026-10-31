// Writes a real HTML file for every public page after `vite build`, so crawlers that don't
// run JavaScript (most AI search bots, social link previews) see the page's content and
// its own title, description and structured data. Runs as part of `npm run build`.
//
// Output (served by Vercel with cleanUrls, see vercel.json):
//   dist/index.html, dist/about-us.html, dist/blog/<slug>.html …  prerendered pages
//   dist/404.html        the not-found page, served with a 404 status
//   dist/app-shell.html  the empty app, for logged-in pages such as /home
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { publicPages, root } from "./routes.mjs";

const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");
const { render } = await import(pathToFileURL(resolve(ssrDir, "prerender.js")).href);

// index.html is the empty app until this script overwrites it; a re-run reuses the copy.
const shellFile = resolve(dist, "app-shell.html");
const shell = readFileSync(existsSync(shellFile) ? shellFile : resolve(dist, "index.html"), "utf8");
writeFileSync(shellFile, shell);
// The home page's hero image is preloaded by index.html; other pages don't show it.
const HERO_PRELOAD = /\s*<link rel="preload" as="image" href="\/assets\/hero\.webp" \/>/;

// React renders a page's <title>, <meta> and <link> tags first; they belong in <head>.
const HEAD_TAGS = /^(?:<(?:link|meta)\b[^>]*>|<title>[^<]*<\/title>)+/;
// The template's own title and default tags are replaced by the page's.
const DEFAULT_TAGS = /\s*<title>[^<]*<\/title>|\s*<meta data-default[^>]*\/>/g;

const page = async (url, marker) => {
  const html = await render(url);
  const head = html.match(HEAD_TAGS)?.[0] ?? "";
  const body = html.slice(head.length);
  if (!head.includes("<title>")) throw new Error(`${url}: no <title> rendered`);
  // data-default: main.tsx removes these before React adds its own, so none are duplicated.
  const headTags = head.replace(/<(link|meta|title)\b/g, "<$1 data-default");
  return (url === "/" ? shell : shell.replace(HERO_PRELOAD, ""))
    .replace(DEFAULT_TAGS, "")
    .replace("</head>", () => `    ${headTags}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="${marker}">${body}</div>`);
};

const write = (file, html) => {
  const path = resolve(dist, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
};

const pages = publicPages();
for (const [path] of pages) {
  write(path === "/" ? "index.html" : `${path.slice(1)}.html`, await page(path, path));
}
write("404.html", await page("/404-not-found", "*"));

rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerendered ${pages.length} pages + 404.html`);
