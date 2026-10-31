/**
 * Every value the app reads from the environment, in one place. Production
 * builds fail when a required one is missing (see vite.config.ts), so these
 * are only ever empty in a misconfigured dev setup.
 * Copy .env.example to .env to configure local development.
 */
const trimSlash = (url: string) => url.replace(/\/+$/, "");

export const env = {
  apiBaseUrl: trimSlash(import.meta.env.VITE_API_BASE_URL ?? ""),
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID ?? "",
  /** Canonical public origin, used for SEO tags and absolute links. */
  siteUrl: trimSlash(import.meta.env.VITE_SITE_URL || window.location.origin),
};

if (import.meta.env.DEV) {
  for (const [key, value] of Object.entries({
    VITE_API_BASE_URL: env.apiBaseUrl,
    VITE_RAZORPAY_KEY_ID: env.razorpayKeyId,
  })) {
    if (!value) console.warn(`[env] ${key} is not set; see .env.example`);
  }
}
