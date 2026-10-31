import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Static meta tags in index.html (defaults, or the prerendered page's own) give way to the
// ones <SEO> renders, so they are not duplicated.
document.head.querySelectorAll("[data-default]").forEach((el) => el.remove());

const root = document.getElementById("root")!;
// Public pages are prerendered at build time (scripts/prerender.mjs). Hydrate only when the
// HTML is for this URL: the service worker can serve another page's HTML, e.g. for /home.
const prerendered = root.dataset.prerendered;
const path = window.location.pathname.replace(/\/+$/, "") || "/";
if (prerendered === "*" || prerendered === path) {
  hydrateRoot(root, <App />);
} else {
  root.replaceChildren();
  createRoot(root).render(<App />);
}
