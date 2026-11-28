# SEO plan for the blogs

The Ops SEO agent reads this file every week before it picks a change, and the Developer agent reads it before it writes one. It lives inside `src/screens/blogs/` so the agent may update it. Keep the **Log** at the bottom current, and change the plan when the data says so.

## The hard rule

- Change files under `src/screens/blogs/` only. A change touching any other file is refused and never goes live.
- That means:
  - no new image files: reuse an image already imported at the top of `blogsContents.tsx`;
  - no edits to `scripts/`, `public/`, routes, the sitemap or shared components;
  - new posts reach the sitemap, llms.txt and the prerender by themselves at build time.
- Be honest. This app is new:
  - no invented success stories, member counts, testimonials, ratings or review schema;
  - no promises such as "guaranteed match";
  - facts about Seetha Rama Kalyana come only from the business brief: ₹351/year, 36 interest credits, OTP-verified email and WhatsApp, contacts shared only after both sides accept, Hindu families across India.
- Competitor prices only if you can see them on that company's own page today. Write "as listed on their site in <month year>". If you can't check, don't give numbers.

## Goal

Registrations, not just visits. Rank in this order:

1. **High intent:** people choosing a matrimony site or service (Tamil, Kannada, Telugu or Hindi matrimony, "thirumana thagaval maiyam", price questions, "is it genuine").
2. **Family research:** rituals, horoscope matching and customs. These build trust and topical authority, and link to (1).
3. **Wedding planning:** budget and destination weddings. Good traffic but few registrations, so they come last.

## Where we stand (Search Console, last 28 days to 26 Nov 2026)

- 327 clicks, 2,220 impressions, average position 15. 122 pages indexed; 35 more are discovered or crawled but not indexed.
- Clicks come mostly from searches for our own name. Non-brand topics get impressions but almost no clicks.

## Priorities, in order

### 1. Tamil matrimony (high intent; Tamil is also a paid-ads language, so free traffic lowers its cost)

- **Queries:**
  - "tamil matrimony" (position 14)
  - "tamil matrimonial" (27)
  - "best tamil matrimony" (59)
  - "tamil matrimony free search" (58)
  - "thirumana thagaval maiyam (near me)" (44–69)
  - "இலவச திருமண தகவல் மையம்"
  - "matrimony in tamil" (12)
  - "tamil matrimonial sites" (5)
- **Posts:**
  - an honest guide: how to choose a Tamil matrimony site (free vs paid, what to check, safety), linking `/languages/tamil-matrimony` and `/ta`;
  - thirumana thagaval maiyam (marriage information centre) vs online matrimony, written **in Tamil script**, with an English summary;
  - the existing Iyer/Iyengar post: link it from the new posts.
- **Then repeat for Kannada, Telugu and Hindi:** one native-script guide each, plus "how to choose a <language> matrimony site".
  - For native-script posts, add an optional `lang` field to `BlogPost`. Have `BlogPostDetail.tsx` use it for `inLanguage` and a `lang` attribute on the article; both files are inside the blogs folder.

### 2. Quick wins: ritual posts that rank but get no clicks

- **Queries:**
  - "sacred steps meaning" (position 4, 0 clicks)
  - "saptapadi" (10)
  - "saptapadi meaning of each step" (11)
  - "sakha saptapadi bhava (meaning)" (2)
  - "saptapadi vows in sanskrit with meaning" (1)
  - "7 vows of marriage in sanskrit with meaning" (1)
  - "what is saptapadi in hindu marriage" (8)
- **Fix `meaning-of-saptapadi-seven-vows`:**
  - a title that matches these searches (≤ 60 characters, in `SHORT_TITLES`);
  - a summary that answers the question in one line;
  - a table of the 7 steps: Sanskrit line, transliteration, meaning;
  - "Sakha saptapadi bhava" explained;
  - FAQs in `postFaqs.ts`.
- **Then build the cluster, each post linking to the others:** 7 pheras vs saptapadi, kanyadaan meaning, mangalya dharanam / mangalsutra, wedding mantras with meaning, Vivaha Panchami (that post exists; link to it).

### 3. Matrimony prices compared

- **Queries:** "elite matrimony fees/charges/price", "vip shaadi price/cost", "shaadi.com price/premium cost", "matrimony price", "matrimony fees", "telugu matrimony premium cost".
- **One honest comparison post:**
  - what each type of service charges (apps vs bureaus vs elite services);
  - what you get for the money, and what to watch for (auto-renewal, contact limits);
  - where ₹351/year fits.
- Follow the competitor-price rule above.

### 4. "Is Seetha Rama Kalyana genuine?"

- People ask Google's AI questions such as "is it trusted", "genuine or fake", "who is promoter", "when was this started" and "what is the subscription amount". We already show at position 1.
- **One plain post covering:**
  - how profiles are checked (OTP for email and WhatsApp);
  - how contacts are shared;
  - what membership costs and includes;
  - how to reach support (Contact us).
- Use facts from the brief only; if the brief doesn't say it, leave it out.

### 5. Kannada communities

- **Queries:** "kunchitiga matrimony" (8), "kunchitiga vokkaliga matrimony" (11), "gangadikara (caste)" (11–16).
- **Post:** Vokkaliga sub-communities and their marriage customs: Kunchitiga, Gangadikara, Morasu, Sarpa and others. Practice varies, so say so.
- Link `/communities/vokkaliga-matrimony` and `/languages/kannada-matrimony`.

### 6. Punjabi matrimony (lower priority)

- **Queries:** "punjabi matrimony" (43), "punjabi matrimonial bureau" (5), "punjabi matrimony profiles" (5), "best punjabi matrimonial sites in india" (7).
- **Post:** a Punjabi Hindu matrimony and customs guide, linking `/languages/punjabi-matrimony`.

### 7. Budget destination weddings (traffic, few registrations)

- **Queries:** about 150 impressions across "low budget / cheapest / under 5 lakhs / affordable destination wedding (in India)", all at positions 24–40, plus Hindi versions.
- **Refresh `budget-destination-weddings-india`:**
  - a table of destinations with honest cost ranges, marked as rough guides;
  - an "under ₹5 lakh" section;
  - FAQs.
- Don't write more posts on this topic until 1–6 are done.

### 8. Older posts Google skipped

- These were crawled but not indexed (last crawled Jul–Sep, before the 8 Nov rewrite):
  - `kerala-brahmin-matrimony-namboothiri-traditions`
  - `yadav-matrimony-heritage-lineage`
  - `telugu-brahmin-matrimony-traditions`
  - `top-matrimony-site-global-indians`
- Add links to them from posts that rank (saptapadi, kundli matching, budget weddings), and make sure each has FAQs and a direct `answer`.
- The weekly data lists which blog URLs Google hasn't indexed. Use it.

## How every post is written

- **Search intent first.** `answer` holds a 2–3 sentence direct answer, and `keyFacts` 3–5 facts. AI assistants and snippets quote these.
- **Headings are the questions people search** (`sections`), with short paragraphs and lists. Aim for 800–1,500 words of real substance, not padding.
- **Title** ≤ 60 characters with the main query near the front (`SHORT_TITLES` for rewrites). The `summary` is the meta description: ≤ 155 characters and answers the query.
- **3–5 FAQs** in `postFaqs.ts`, written the way people ask.
- **Links:**
  - 2–4 links to related posts with `BlogLink`;
  - 1–2 to hub pages: `/languages/<lang>-matrimony`, `/communities/<community>-matrimony`, `/matrimony/<city>`, `/pricing`, `/ta` `/kn` `/te` `/hi`.
  - Only link pages that exist (check `scripts/routes.mjs` for the list); reading it is fine, editing it is not.
- **New post:**
  - add it to `blogPosts` in `blogsContents.tsx`: next unused `id`, a unique kebab-case `slug`, `publishedAt` and `updatedAt` set to today, an existing image;
  - put long content in `guidePosts.tsx`, `longPosts.tsx` or `communityPosts.tsx`.
- **Changed post:** set its `updatedAt` in `blogsContents.tsx` to today. That date is the sitemap's lastmod, which tells search engines to re-read the page.
- Never change `BLOG_UPDATED` (it must match `scripts/routes.mjs`).
- Run `npm run build` before finishing; a failed preview build means the change is refused.

## Pace and measuring

- At most one change a week: one new post, or one rewrite plus title fixes.
- After each change goes live:
  - Bing, ChatGPT search and Copilot are pinged by themselves;
  - Google indexing is checked at 3, 7 and 14 days;
  - a post not indexed after 14 days gets more internal links.
- Judge a change on its pages' impressions, position and clicks after 2, 4 and 8 weeks. Do more of what moved; rethink what didn't.
- Not for the blogs, so not the agent's job: the home page ("sita rama kalyana" and "seetharama kalyana" sit at position 11 with no clicks), community, city and language pages. Note ideas for those in the Log for the owner.

## Log

Newest first. One line per change: date, what changed, pages, and later what it did.

- 2026-11-28: new post how-to-choose-tamil-matrimony-site, targeting tamil matrimony queries (about 70 impressions, 0 clicks, positions 12-62); check indexing at 3, 7 and 14 days and impressions at 2, 4 and 8 weeks. Linked from tamil-matrimony-iyer-iyengar-weddings and marriage-bureau-vs-matrimony-apps (updatedAt bumped on both). The requested link to high-cost-of-matrimony-subscriptions-exposed was skipped because that post does not exist; linked reasons-to-choose-trusted-hindu-matrimony instead. Note for the owner (not blog work): the home page is stuck at position 11 for "sita rama kalyana" and "seetharama kalyana", and /matrimony has 143 impressions at position 54.
- 2026-11-28: plan written from Search Console data (28 days to 26 Nov). No changes yet.
