import path from "path";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const REQUIRED_IN_PRODUCTION = ["VITE_API_BASE_URL", "VITE_RAZORPAY_KEY_ID", "VITE_SITE_URL"];

// Meta Pixel, only when VITE_META_PIXEL_ID is set (so dev and e2e runs don't report page views).
// Meta's standard snippet, except that fbevents.js (about 275 KB with its config) loads once the
// page has loaded or the visitor first taps, scrolls or types, whichever comes first, so it
// doesn't compete with the page on a slow phone. Events (PageView, and trackPixel() calls in
// src/lib/pixel.ts) wait in fbq.queue until then.
const metaPixel = (id: string) => `
    <script>
      !(function (f, b, e, v, n) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        var done = 0,
          kinds = ["pointerdown", "keydown", "scroll", "touchstart"],
          load = function () {
            if (done++) return;
            kinds.forEach(function (k) {
              f.removeEventListener(k, load, true);
            });
            var t = b.createElement(e);
            t.async = !0;
            t.src = v;
            b.head.appendChild(t);
          };
        kinds.forEach(function (k) {
          f.addEventListener(k, load, { capture: true, passive: true });
        });
        // After the load event, so the pixel doesn't hold it back.
        if (b.readyState === "complete") setTimeout(load);
        else f.addEventListener("load", function () { setTimeout(load); });
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", "${id}");
      fbq("track", "PageView");
    </script>`;
const metaPixelNoscript = (id: string) =>
  `<noscript><img height="1" width="1" style="display: none" src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1" /></noscript>`;

// Search Console / Bing Webmaster Tools ownership tags, only when their codes are set.
const siteVerification = (env: Record<string, string>) =>
  [
    env.VITE_GOOGLE_SITE_VERIFICATION &&
      `<meta name="google-site-verification" content="${env.VITE_GOOGLE_SITE_VERIFICATION}" />`,
    env.VITE_BING_SITE_VERIFICATION && `<meta name="msvalidate.01" content="${env.VITE_BING_SITE_VERIFICATION}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");

const htmlEnv = (env: Record<string, string>): Plugin => ({
  name: "html-env",
  transformIndexHtml: (html) =>
    html
      .replaceAll("%SITE_URL%", (env.VITE_SITE_URL || "").replace(/\/+$/, ""))
      .replace("<!-- %SITE_VERIFICATION% -->", siteVerification(env))
      .replace("<!-- %META_PIXEL% -->", env.VITE_META_PIXEL_ID ? metaPixel(env.VITE_META_PIXEL_ID) : "")
      .replace("<!-- %META_PIXEL_NOSCRIPT% -->", env.VITE_META_PIXEL_ID ? metaPixelNoscript(env.VITE_META_PIXEL_ID) : ""),
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  if (mode === "production") {
    const missing = REQUIRED_IN_PRODUCTION.filter((key) => !env[key]);
    if (missing.length) {
      throw new Error(`Missing environment variables for production build: ${missing.join(", ")}. See .env.example.`);
    }
    if (process.env.VERCEL_ENV === "production" && env.VITE_RAZORPAY_KEY_ID.startsWith("rzp_test_")) {
      throw new Error("VITE_RAZORPAY_KEY_ID is a test key, but this is a Vercel production deployment.");
    }
  }

  return {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      htmlEnv(env),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["robots.txt"],
        // The service worker installs right after a first visit, often on mobile data, so it
        // skips the big icons (fetched on their own when needed).
        includeManifestIcons: false,
        workbox: {
          // The profile-PDF libraries (jspdf, html2canvas, core-js via canvg, dompurify), about
          // 240 KB gzipped, load only when someone downloads a PDF.
          // The first three entries are the plugin's defaults, which this list replaces.
          globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js", "**/jspdf*.js", "**/html2canvas*.js", "**/index.es-*.js", "**/purify*.js"],
          // Offline/repeat navigations get the empty app, not the prerendered home page
          // (scripts/prerender.mjs writes app-shell.html after this build).
          navigateFallback: "app-shell.html",
          // Plain files opened in a tab (robots.txt, sitemap.xml, llms.txt, the IndexNow key) stay files.
          navigateFallbackDenylist: [/\.(txt|xml)$/],
          additionalManifestEntries: [{ url: "app-shell.html", revision: String(Date.now()) }],
        },
        manifest: {
          name: "Seetha Rama Kalyana",
          short_name: "Seetha Rama",
          description: "Seetha Rama Kalyana Matrimony",
          theme_color: "#c2410c",
          background_color: "#fffaf3",
          display: "standalone",
          id: "/",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "pwa-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "logo.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  };
});
