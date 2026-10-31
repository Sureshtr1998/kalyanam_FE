/** Meta Pixel standard events we report. The pixel itself is injected by vite.config.ts. */
export type PixelEvent = "Lead" | "CompleteRegistration" | "Purchase" | "SubmitApplication";

type Fbq = (command: "track", event: PixelEvent, params?: Record<string, unknown>) => void;

/** Reports an event to the Meta Pixel. Does nothing when the pixel isn't loaded (dev, e2e, blockers). */
export const trackPixel = (event: PixelEvent, params?: Record<string, unknown>) => {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  try {
    fbq("track", event, params);
  } catch {
    // Tracking must never break the page.
  }
};
