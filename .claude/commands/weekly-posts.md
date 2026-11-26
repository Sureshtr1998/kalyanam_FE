---
description: Create next week's organic Facebook and Instagram posts, reels/videos and stories, and schedule them after approval
---

Do next week's organic posts for Seetha Rama Kalyana. Follow the memory note `weekly-organic-social-workflow` and the **`organic-playbook` skill** (tracked links, angles, writing rules, measuring). **Goal: bring more sign-ups**, not just likes. Every piece should make a family want to register.

**0. Look back first (read only):**
- **Start with sign-ups per post:** call the Ops API `GET /api/manage/ops/organic` from the logged-in admin tab (see the organic-playbook skill, section 6). Rank last month's pieces by sign-ups, then link clicks or profile visits, then engagement. Do more of the winners' angle, language and format.
- **Stories:** the same call returns `storyConcepts` (profile visits and replies per 100 reached, exit rate). Plan the 7 stories from the playbook's story concepts (section 2b): the top concept gets 2, keep 1 test, at least one per language.
- Read the previous week's `APPROVAL_SHEET` in `C:\Users\Suresh\Downloads\SRK_social_week_*` so themes don't repeat.
- Check Business Suite → Insights → Content (asset_id 914182555118025) for last week's top post and reel. Do more of what worked.
- Check the `meta-ads-campaign-status` memory for the current best ad messages (e.g. Communities, For parents, Brand). Turn one into an organic post each week.
- Check the Hindu calendar for the next 7–10 days (Ekadashi, Kartika, Tulasi Vivaha, Vivah Panchami, Sankranti, Ugadi, wedding muhurtha seasons). Plan one post around any festival. Avoid a "register today" push on Amavasya.

**The weekly set:**

| What | How many | When (IST) | Format |
|---|---|---|---|
| Feed posts | 3 | Mon, Wed, Fri at 7:30 pm | 4:5 image, 1080×1350 |
| **Ramayana series videos** | **3** | **Tue, Thu, Sun at 7:30 pm** | 9:16 MP4, 1080×1920, **~30 s**, under 10 MB |
| Reel B (why join) | 1 | Sat at 7:30 pm | 9:16 MP4, 1080×1920, 15–25 s, under 10 MB |
| Stories | 7 (daily) | 8:30 am | 9:16 image |
| **"Safe for daughters" posts** | **7 (daily)** | **12:30 pm** | 4:5 image, 1080×1350, text-led (no Gemini art needed) |

**Ramayana series: "Unknown Heroes of Ramayana" (replaces the old devotional Reel A, from week of 24 Nov 2026):**
- **Source of truth:** `C:\Users\Suresh\Downloads\SRK_marketing\ramayana_series\series.json`.
  - Each run makes **only the next week-theme** whose parts are `pending`. That's 3 people, one fact each.
  - The 5 themes are: Ravana's family → Forgotten women → Devotees → Brave birds & animals → Loyal hearts.
  - Mark the parts `scheduled` with their date after posting.
  - When all 15 parts are done, propose 2–3 new themes or series to the user and let them pick.
- **Goal:** follows (people come back for the next part), with a soft push to register.
- **Video design** (45–56 s with narration, English on screen, posted to FB + IG). The scene order is below; the timings shown are the old silent ones, and with narration each scene lasts as long as its voice clip:

  | Time | Scene |
  |---|---|
  | 0–2 s | Hook card (`card`, `tag` "Unknown Heroes of Ramayana · Part X/15", `h` = the hook question) |
  | 2–18 s | 3–4 Gemini scenes with Ken Burns, plus short English fact overlays (`bg` + `ovl`) |
  | 18–24 s | `shloka` card: Devanagari + IAST + English meaning + source |
  | 24–27 s | `meaning` card: the shloka's meaning in Kannada, Telugu, Tamil and Hindi |
  | 27–30 s | `end` card: logo, `cta` "Register · ₹351/year", `foot` seetharamakalyana.in, `next` "Follow for Part X+1: <name> · <day>" |

  - All cards need `"layer": true` so they land in layers/ for reel2.js.
  - **Audio (user's choice, 14 Nov 2026): voiceover + soft drone.**
    - Narration uses edge-tts neural voices (`pip install edge-tts mutagen`):
      - **Women's voices (user's choice, 14 Nov):**
        - English: **en-IN-NeerjaExpressiveNeural** at +3%.
        - Regional voices (if ever needed for organic videos): kn-IN-SapnaNeural, te-IN-ShrutiNeural, ta-IN-PallaviNeural, hi-IN-SwaraNeural, at +5%.
        - The Sanskrit shloka is read by hi-IN-SwaraNeural.
      - **Pronunciation (user-approved respellings, used in the English voice only; on-screen text stays normal):**
        - "Seetha Rama Kalyana" → "Seetha Raama Kalyaana" (otherwise it sounds like "Kalyan")
        - "seetharamakalyana dot in" → "Seetha Raama Kalyaana dot in"
        - Sanskrit words take long vowels, e.g. "Indrasana" → "Indraasana", "Nidrasana" → "Nidraasana"
        - These live in `SAY_EN` in make_series.py; add new names there.
      - Before a new week, make a 10-second test clip of any new Sanskrit names and ask the user to listen.
    - Speak the hook, each scene's main sentence (not the heading), the shloka, its meaning, and an end line ("Follow Seetha Rama Kalyana for Part X+1 … Register at seetharamakalyana dot in").
    - Each scene lasts as long as its clip needs. A reel's `audio: [{src, at}]` cues plus `drone: true` make reel2.html mix the voice with an original, code-made tanpura drone. Never use film songs or copyrighted music.
    - The week's `make_series.py` (see `SRK_social_week_2026-11-16`) does all of this and sets the bitrate so each video stays under 10 MB, about 1.0–1.3 Mbps at 45–56 s.
    - Check the audio with imageio-ffmpeg: extract a wav and look at loudness per second.
- **Facts:**
  - Use the fact and source in series.json. Every fact carries its source tag in the APPROVAL_SHEET.
  - A fact that is not in Valmiki is said as "As told in …", never as scripture.
  - Don't add new facts without a source.
- **Shlokas:**
  - Use only `shloka_bank` entries; add new ones only if they are real and citable (kanda + sarga).
  - Fill in any missing kn/te/ta/hi meaning lines, and flag them in the APPROVAL_SHEET for a native-speaker check.
- **Caption:**
  1. English hook and fact in 2 lines.
  2. One short line each in Kannada, Telugu, Tamil and Hindi.
  3. "Part X/15 · Follow for Part X+1 on <day>".
  4. "Register: seetharamakalyana.in · ₹351/year" (IG: "link in bio").
  5. Hashtags: #Ramayana #UnknownRamayana #SeethaRamaKalyana plus 2–3 language tags.
  6. The AI line.
- **Teasers:** each part teases the next. Part 3 teases next week's theme.
- **Organic only: the series is never added to Meta paid ads** (user's rule, 15 Nov 2026). Don't make ad cuts of it and don't propose it as an ad.

**Weekly topics: the same core topics EVERY week, a fresh angle each time (user's rule, 20 Nov 2026)**

The user wants the same core messages every week, each told differently, not one-off posts. Each week has these topics:

| Topic | Where it runs each week | Fresh every week |
|---|---|---|
| **Pricing** ("every price, on one page") | Feed post 1 | A new angle and a new design |
| **Why ₹351, not free?** (serious families only) | Feed post 2 | A new angle and a new design |
| **Safe for daughters** (women's safety) | The daily 12:30 pm post (see below) | A new theme every day |
| **Ramayana series** | Tue, Thu and Sun videos (see above) | The next 3 parts |
| **Rotating topic**: tips for parents, how it works, a festival or tradition, or a community | Feed post 3 | Pick by the calendar and last week's best post |

**How to keep each topic fresh:**
- **Angle log:** keep one at `C:\Users\Suresh\Downloads\SRK_marketing\weekly_topics_log.md`. Create it if it's missing. Each week, add one line per topic: the week, the angle, the lead language, the design style, and the post's results once known.
- **No repeats:** don't repeat an angle within 4 weeks, or a design style within 2 weeks.
- **Use what works:** check last week's numbers for each topic in Business Suite, and lean towards the angles that got the most reach and saves.
- **Change the format too,** not just the words. Rotate between:
  - a price list;
  - a question and answer;
  - myth vs fact;
  - "a mother asks…";
  - a simple sum ("₹351 ÷ 12 months");
  - a checklist;
  - a carousel;
  - a story slide set.

**Pricing: angle bank** (re-read https://www.seetharamakalyana.in/pricing each week; if a price changed, use the page's):
1. Every price on one page, before you register (used 24–30 Nov).
2. What ₹351 gets you: 36 credits, and 1 credit = 1 interest.
3. The monthly sum: ₹351 a year is about ₹29 a month.
4. How credits work: contact details are shared free when they accept; to see a contact straight away, it's 5 credits.
5. Top up only if you need more: ₹101 for 21 credits, or ₹251 for 56 credits.
6. "How much does it really cost?" as a question and answer.
7. Nobody calls to sell you a plan.
8. Pay securely online through Razorpay.

**Why ₹351: angle bank:**
1. Marriage isn't time-pass (used 25 Nov).
2. A small fee shows a family is serious.
3. Less than ₹1 a day.
4. "Why not free?" as a question and answer.
5. A mother's view: "I want families who are as serious as we are."
6. What the fee helps pay for: OTP verification, and every report reviewed within 24 hours.
7. Paid sign-up keeps casual browsers away.

**Allowed claims, for both topics:**
- every price is shown on one page, before you register;
- registration is paid: ₹351 a year, less than ₹1 a day;
- OTP-verified profiles;
- no agents, no sales calls;
- every report is reviewed within 24 hours;
- only members who fit your preferences can see your profile.

**Never:**
- name or describe other matrimony sites, or say "others hide their prices" or "free sites…";
- say "no hidden charges", "100% genuine" or "no fake profiles";
- show the ₹999 crossed-out price;
- use invented testimonials or member counts.

**Links:**
- Pricing posts go to the lead language's pricing page, written in that language: Kannada `seetharamakalyana.in/kn/pricing`, Telugu `/te/pricing`, Tamil `/ta/pricing`, Hindi `/hi/pricing`, English `seetharamakalyana.in/pricing`.
- Why ₹351 posts go to the lead language's register page.
- On IG, also add "Link in bio".

**Design:**
- Every week is a new organic design.
- Never reuse the paid images in `Downloads\SRK_marketing\meta-ads\` (why351, pricing, safety and so on). Paid and organic stay separate (organic-never-paid rule).
- The weekly topics are organic; this command never touches paid ads.

**Lead languages:** the 3 feed posts and Reel B follow the language balance rule below (one each for Kannada, Telugu, Tamil and Hindi, rotating days). An English lead is fine for an extra piece.

**"Safe for daughters": a daily women's safety post (user's request, 17 Nov 2026)**

- **Goal:** women and their mothers trust the site. Brides are only about 1 in 14 joins, so this post is every day, all year.
- **Lead language by day:**

  | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
  |---|---|---|---|---|---|---|
  | Kannada | Telugu | Tamil | Hindi | English | rotates | rotates |

  - Sat and Sun take the next two languages in the order KN → TE → TA → HI → EN, carrying on from the previous week. Note this in the APPROVAL_SHEET.
- **Themes:** one per day, in rotation. Don't repeat the same theme in the same language within 2 weeks.
  1. Block anyone in one tap. Neither of you will see the other again.
  2. Report a member from their profile. We review every report within 24 hours.
  3. Misuse your number or photos? We remove that member permanently, with no refund.
  4. Email us any time, day or night (contactus@seetharamakalyana.in). Your report is confidential.
  5. Verified profiles, no agents, no brokers calling your family.
  6. Hide your profile or photos whenever you want.
  7. A safe first call: talk family to family, meet in public with family, and never send money to anyone you met online.
  8. Serious harassment? We help you report it to the Cyber Crime helpline 1930 or cybercrime.gov.in.
- **Only these promises** come from the Terms "Member safety" section, the Privacy Policy and the Refund Policy (updated 17 Nov 2026). Never say:
  - "your number is never shown", or "your number is shared only when you agree" (a paid member can unlock it for 5 credits);
  - "we refund you";
  - "100% safe";
  - "we reply instantly".
  - "Day or night" means members can report any time. The promise is review within 24 hours.
  - If the site's policy pages change, re-read them and update this list first.
- **Design:** a calm, reassuring style, not scary. Use a soft maroon and gold card with a shield or lotus icon, big text in the lead language, and the email plus the lead-language link in the footer. Women's figures only as respectful illustrations; no victim imagery and no real faces.
- **Caption:**
  1. 2–3 lines in the lead language.
  2. One English line (unless English is the lead).
  3. "Report misuse any time: contactus@seetharamakalyana.in".
  4. The safety-rules link **in the lead language** (policy pages exist in all 5 languages since 17 Nov 2026), written in that language: Kannada `seetharamakalyana.in/kn/terms#safety`, Telugu `/te/terms#safety`, Tamil `/ta/terms#safety`, Hindi `/hi/terms#safety`, English `seetharamakalyana.in/terms#safety`. The same rule applies to any other site link in any post: `/kn/contact-us`, `/hi/privacy`, and so on.
  5. The lead-language register link (see Captions below).
  6. Hashtags: #SafeMatrimony #WomenSafety #SeethaRamaKalyana plus the language tag.
- Count these 7 posts in the APPROVAL_SHEET language tally, separately from the main pieces.

**Reel B:**
- Why join / how it works: text-led and fast. Hook in the first 2 seconds (e.g. "Looking for a match for your son or daughter?"), then 3 short benefit cards (verified profiles, block and report any member, ₹351/year). Never claim "number shared only when both families agree": paid members can unlock a contact for 5 credits, then the end card.
- Silent (no music), so the text carries the message. Keep all on-screen text inside the middle 80% (safe area).
- Text in the reel's lead language (see Languages below), with a short English line where it helps.
- **Never save ad or social files inside the kalyanam_FE repo** (user's rule, 2026-11-13). Use only the week folder in Downloads and `Downloads\SRK_marketing\`.

**Languages: give Kannada, Telugu, Tamil, Hindi and English equal weight (user's rule, 2026-11-13). Kannada is not the default.**

Every piece has one **lead language**. The lead language is used for:
- the big text on the image or video,
- the first caption line,
- the tradition or festival chosen.

Each week, spread the lead languages evenly:

| Piece | Lead languages |
|---|---|
| Ramayana series (3 videos) | English on screen (counts as the English lead); all 4 regional languages appear on the meaning card and in the caption. |
| 4 main pieces (3 feed posts + Reel B) | One each: Kannada, Telugu, Tamil, Hindi. Rotate which day each language gets, week to week. |
| 7 stories | At least one story per language. The 2 extra stories rotate, so over 2–3 weeks every language gets the same number. |
| Traditions and festivals | Rotate regions equally: Karnataka, Andhra/Telangana, Tamil Nadu, North India (Hindi), and pan-Indian ones for English. Plan North Indian festivals too, e.g. Vivah Panchami, Karva Chauth, Chhath, Lohri. |

- **English-lead pieces:** use simple English for urban families and NRIs, with no regional script on the image.
- **Captions:**
  1. Start with the lead language's line.
  2. Then one short line in each of the other 3 regional languages, in rotating order.
  3. Then English, unless English is the lead.
  - **Register link = the lead language's page** (user's request, 15 Nov 2026), written in the lead language:
    | Lead | Link in caption | Example line |
    |---|---|---|
    | Kannada | seetharamakalyana.in/kn | ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ: seetharamakalyana.in/kn |
    | Telugu | seetharamakalyana.in/te | ఇక్కడ నమోదు చేసుకోండి: seetharamakalyana.in/te |
    | Tamil | seetharamakalyana.in/ta | இங்கே பதிவு செய்யுங்கள்: seetharamakalyana.in/ta |
    | Hindi | seetharamakalyana.in/hi | यहाँ रजिस्टर करें: seetharamakalyana.in/hi |
    | English (incl. Ramayana series) | seetharamakalyana.in | Register: seetharamakalyana.in |
    - **Facebook captions use the full tracked link** (since 26 Nov 2026), so sign-ups are counted per piece: `https://www.seetharamakalyana.in/<lang>?p=f<lang><MMDD><type>`, with type `p` post, `r` reel, `s` safety post. Example: `https://www.seetharamakalyana.in/te?p=fte1201r`. English has no `/<lang>` path: `https://www.seetharamakalyana.in/?p=fen1201p`.
    - On Instagram, caption links can't be clicked, so write the short address and "Link in bio". The bio link is `?p=bio`.
    - Hashtags: 2–3 on Facebook, 5–8 on Instagram.
    - Stories: put the lead language's link on the story image's footer.
  4. Then 5–8 hashtags, mixing #KannadaMatrimony #TeluguMatrimony #TamilMatrimony #HindiMatrimony #HinduMatrimony to match the lead.
  5. Then the AI line.
- **Fonts:** use Noto Serif Kannada, Telugu, Tamil or Devanagari to match the lead language. Ask a native speaker, or note it in the APPROVAL_SHEET, when the wording is new.
- **APPROVAL_SHEET:** list each piece's lead language, plus a tally showing the balance across the 5 languages.

**Content mix:**
- Rotate themes: Trust, Tradition, Tips for parents, How it works.
- Every post and reel ends with a light call to register, using the lead language's page (e.g. "ఇక్కడ నమోదు చేసుకోండి: seetharamakalyana.in/te · ₹351/year"; see Captions above). Make at most 1 in 3 a hard "register today" post.
- Include at least one post aimed at brides' families (mothers/daughters) each week, since brides are scarce.

**Steps:**
1. Plan themes, captions, Reel B's script, and this week's 3 Ramayana parts from series.json (scene list with on-screen text and timing).
2. Make the art in Gemini through Claude in Chrome: "devotional Indian painting style, warm gold and maroon tones", with a consistent Rama and Seetha. Start a new chat for every image. Check every image and regenerate any bad ones. The series adds about 9–12 scenes, which is over Gemini's ~13 free images a day together with the posts, so spread the art over 2 days or reuse series scenes for stories.
3. Add text locally with the toolkit in `C:\Users\Suresh\Downloads\SRK_social_toolkit\` (render.js for images; reel.js + reel.html for videos; verify.js to check). Update the week folder and the designs list in the scripts. Run them from PowerShell. Check each reel: length, under 10 MB, text readable, and extract stills to look at.
4. Write the APPROVAL_SHEET (with reel scene lists and stills), then **stop and wait for the user's approval**.
5. Copy the final files to the scratchpad. Schedule each piece to both Facebook and Instagram in Business Suite (feed: `/latest/composer`, reels: `/latest/reels_composer`, stories: `/latest/story_composer`), using the file-input hook, date and time tricks from the memory note.
   - "Post to" must show both "Seetha Rama Kalyana and seetharamakalyanamat". One reel then becomes 2 scheduled items, one FB and one IG.
   - **Reels composer caption trap (14 Nov):** a synthetic paste shows the text in the box, but the reel saves with **no caption**; the scheduled list shows "Your reel".
     - After scheduling, open Scheduled posts and check that every row shows the caption.
     - Fix FB: open `/latest/composer/?asset_id=914182555118025&business_content_id=<ID>` and paste into the "Write in the dialogue…" box; the paste works there. Then click Schedule.
     - Fix IG: row → panel "Actions" → "Edit Reel" → paste into "Describe your reel…" → Next → Schedule.
     - Keep the caption text in a JS const inside the same call. A localStorage handoff pasted the word "null".
6. Always click "Maybe later" on the Boost offer.
7. **Register the week's stories** so their results are tracked per concept: from the admin tab, `POST https://api.seetharamakalyana.in/api/manage/ops/organic/stories` with the `x-auth-token` header (token from `localStorage.user_login_token`) and `{ "stories": [{ "at": "<ISO time>", "language": "Tamil", "concept": "why351" }, …] }`. Concept keys are in the organic-playbook (section 2b).
8. Take a Planner screenshot, then give a summary, "Series: X/15 done, next theme: …", and next week's themes. Update series.json.

**One-time (suggest once if not done):**
- Pin 3 Instagram posts that answer "Is this real? How does it work? What does it cost?".
- Set the Instagram bio link to `https://www.seetharamakalyana.in/?p=bio`.
- Point the Facebook Page's "Sign up" button at `https://www.seetharamakalyana.in/?p=fbpage`.

**Hard rules:**
- **This command is organic only (user's rule, 15 Nov 2026).** Never open Ads Manager; never create, change, pause or delete ads; never make ad cuts; never Boost; never spend money. Paid ads are handled only in `/track-data` sessions, and only when the user asks.
- No invented testimonials, member counts or success stories.
- No film or TV clips, songs or logos.
- Be respectful with devotional content.
- Don't reply to comments or messages.
- If a login is needed, stop and ask the user.

$ARGUMENTS
