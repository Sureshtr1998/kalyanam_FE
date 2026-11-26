// Internal links between the SEO landing pages (communities, languages, cities) and from blog posts to them.
// Related pages are worked out from the data files, so new communities, languages or cities link in automatically.
import { communities } from "@/screens/communities/seoComm";
import { languages } from "@/screens/languages/seoLanguages";
import { cities } from "@/screens/cities/seoCities";

export interface PageLink {
  to: string;
  label: string;
}

const cityLabel = (c: (typeof cities)[number]) => (c.slug === "nri" ? "NRI Hindu Matrimony" : `${c.name} Matrimony`);

/** The language pages that list this community. */
export const languagesForCommunity = (slug: string): PageLink[] =>
  languages
    .filter((l) => l.communities.includes(slug))
    .map((l) => ({ to: `/languages/${l.slug}`, label: `${l.name} Matrimony` }));

/** The city pages that list this community, or the cities of its language pages when no city lists it. */
export const citiesForCommunity = (slug: string): PageLink[] => {
  const direct = cities.filter((c) => c.communities.includes(slug));
  const viaLanguage = languages.filter((l) => l.communities.includes(slug)).flatMap((l) => l.cities);
  const picked = direct.length ? direct : cities.filter((c) => viaLanguage.includes(c.slug));
  return picked.slice(0, 6).map((c) => ({ to: `/matrimony/${c.slug}`, label: cityLabel(c) }));
};

/**
 * Communities that share a language page or city with this one, most shared first,
 * topped up with others so every page links to `count` communities.
 */
export const relatedCommunities = (slug: string, count = 8) => {
  const score = new Map<string, number>();
  const bump = (list: string[]) =>
    list.includes(slug) && list.forEach((s) => s !== slug && score.set(s, (score.get(s) ?? 0) + 1));
  languages.forEach((l) => bump(l.communities));
  cities.forEach((c) => bump(c.communities));
  const ranked = communities
    .filter((c) => c.slug !== slug)
    .sort((a, b) => (score.get(b.slug) ?? 0) - (score.get(a.slug) ?? 0) || a.name.localeCompare(b.name));
  return ranked.slice(0, count);
};

// Words that point a blog post at a page, beyond the page's own name. Kept specific to avoid false matches.
const COMMUNITY_ALIASES: Record<string, string[]> = {
  "brahmin-matrimony": ["iyer", "iyengar", "smartha", "madhwa", "namboothiri"],
  "lingayat-matrimony": ["veerashaiva", "panchamasali"],
  "vysya-matrimony": ["arya vysya", "komati"],
  "kamma-matrimony": ["chowdary"],
  "nair-matrimony": ["menon"],
  "ezhava-matrimony": ["thiyya", "billava"],
  "gounder-matrimony": ["kongu"],
  "patel-matrimony": ["patidar"],
  "yadav-matrimony": ["ahir"],
};
const LANGUAGE_ALIASES: Record<string, string[]> = {
  "kannada-matrimony": ["karnataka", "kannadiga"],
  "telugu-matrimony": ["andhra", "telangana"],
  "tamil-matrimony": ["tamil nadu"],
  "marathi-matrimony": ["maharashtra"],
  "malayalam-matrimony": ["kerala", "malayali"],
  "gujarati-matrimony": ["gujarat"],
  "punjabi-matrimony": ["punjab"],
  "bengali-matrimony": ["bengal"],
  "odia-matrimony": ["odisha"],
};
const CITY_ALIASES: Record<string, string[]> = {
  bengaluru: ["bangalore"],
  "delhi-ncr": ["delhi", "gurgaon", "gurugram", "noida"],
  nri: ["nri", "abroad", "overseas"],
};

const hit = (text: string, terms: string[]) =>
  terms.some((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));

/** Landing pages a blog post is about, from its title, slug and keywords. Falls back to the three hubs. */
export const pagesForPost = (post: { title: string; slug: string; keywords: string }, max = 6): PageLink[] => {
  const text = `${post.title} ${post.slug.replace(/-/g, " ")} ${post.keywords}`;
  const found: PageLink[] = [
    ...communities
      .filter((c) => hit(text, [c.name, ...(COMMUNITY_ALIASES[c.slug] ?? [])]))
      .map((c) => ({ to: `/communities/${c.slug}`, label: `${c.name} Matrimony` })),
    ...languages
      .filter((l) => hit(text, [l.name, ...(LANGUAGE_ALIASES[l.slug] ?? [])]))
      .map((l) => ({ to: `/languages/${l.slug}`, label: `${l.name} Matrimony` })),
    ...cities
      .filter((c) => hit(text, [c.name, ...(CITY_ALIASES[c.slug] ?? [])]))
      .map((c) => ({ to: `/matrimony/${c.slug}`, label: cityLabel(c) })),
  ].slice(0, max);
  const hubs: PageLink[] = [
    { to: "/communities", label: "Matrimony by community" },
    { to: "/languages", label: "Matrimony by language" },
    { to: "/matrimony", label: "Matrimony by city" },
  ];
  return found.length >= 3 ? found : [...found, ...hubs].slice(0, Math.max(found.length + 2, 3));
};
