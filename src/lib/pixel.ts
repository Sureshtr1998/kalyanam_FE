/** Meta Pixel standard events we report. The pixel itself is injected by vite.config.ts. */
export type PixelEvent = "Lead" | "CompleteRegistration" | "Purchase" | "SubmitApplication";

type Fbq = (command: "track", event: PixelEvent, params?: Record<string, unknown>, options?: { eventID: string }) => void;

/**
 * Reports an event to the Meta Pixel. Does nothing when the pixel isn't loaded (dev, e2e, blockers).
 * `eventId` matches the server's Conversions API copy of the same event, so Meta counts it once.
 */
export const trackPixel = (event: PixelEvent, params?: Record<string, unknown>, eventId?: string) => {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== "function") return;
  try {
    if (eventId) fbq("track", event, params, { eventID: eventId });
    else fbq("track", event, params);
  } catch {
    // Tracking must never break the page.
  }
};
