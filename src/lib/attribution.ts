/*
 * Which ad or post brought a visitor, kept until they sign up. Read from the
 * landing URL and remembered for 30 days (the latest click wins):
 *  - ads: their utm tags;
 *  - organic posts: ?p=<code> (e.g. fkn1127 = Facebook, Kannada, 27 Nov;
 *    "bio" = Instagram bio link), recorded as utm_medium "organic";
 *  - otherwise a Facebook or Instagram click (fbclid or referrer) as
 *    "social", only when nothing better is remembered.
 * At sign-up this goes to the server with Meta's browser cookies, so the
 * server can report the sign-up to Meta's Conversions API and save where the
 * member came from.
 */

const KEY = "srk_attribution";
const TTL_MS = 30 * 24 * 3600 * 1000;

interface Stored {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  fbclid?: string;
  landing?: string;
  at: number;
}

export interface TrackingContext extends Omit<Stored, "at"> {
  eventId?: string;
  fbp?: string;
  fbc?: string;
  sourceUrl?: string;
}

const read = (): Stored | null => {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null") as Stored | null;
    return s && Date.now() - s.at < TTL_MS ? s : null;
  } catch {
    return null;
  }
};

/** Call once on page load: remembers which ad or post brought the visitor. */
export const captureAttribution = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    const pick = (k: string) => q.get(k)?.slice(0, 150) || undefined;
    const landing = window.location.pathname.slice(0, 200);
    const fbclid = q.get("fbclid")?.slice(0, 300) || undefined;
    // Post codes start with a letter (fkn1127, ikn1127, bio, fbpage, fc); anything else isn't ours.
    const post = q.get("p")?.toLowerCase().match(/^[a-z][a-z0-9]{1,15}$/)?.[0];
    let found: Stored | null = null;
    if (pick("utm_source") || pick("utm_campaign") || pick("utm_content")) {
      found = { utmSource: pick("utm_source"), utmMedium: pick("utm_medium"), utmCampaign: pick("utm_campaign"), utmContent: pick("utm_content"), fbclid, landing, at: Date.now() };
    } else if (post) {
      const source = post === "bio" || post.startsWith("i") ? "instagram" : "facebook";
      found = { utmSource: source, utmMedium: "organic", utmCampaign: "organic", utmContent: post, fbclid, landing, at: Date.now() };
    } else {
      // A Facebook / Instagram click without tags: organic social, kept only if nothing better is remembered.
      const ref = (() => {
        try {
          return new URL(document.referrer).hostname;
        } catch {
          return "";
        }
      })();
      const social = /instagram\.com$/.test(ref) ? "instagram" : /facebook\.com$|fb\.com$/.test(ref) || fbclid ? "facebook" : null;
      if (social && !read()) found = { utmSource: social, utmMedium: "social", fbclid, landing, at: Date.now() };
    }
    if (found) localStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Storage blocked (private mode): tracking is best effort.
  }
};

const cookie = (name: string) =>
  document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`))
    ?.slice(name.length + 1);

/** A fresh id shared by the browser pixel event and the server's copy, so Meta counts the sign-up once. */
export const newEventId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** What the server needs to report a sign-up to Meta. */
export const trackingContext = (eventId?: string): TrackingContext => {
  const s = read();
  const { at, ...tags } = s ?? { at: Date.now() };
  // Meta's click cookie; built from the remembered fbclid if the pixel hasn't set it yet.
  const fbc = cookie("_fbc") || (tags.fbclid ? `fb.1.${at}.${tags.fbclid}` : undefined);
  return {
    ...tags,
    eventId,
    fbp: cookie("_fbp"),
    fbc,
    sourceUrl: `${window.location.origin}${window.location.pathname}`,
  };
};
