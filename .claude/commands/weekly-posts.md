---
description: Create next week's organic Facebook and Instagram posts, reels/videos and stories, and schedule them after approval
---

Do next week's organic posts for Seetha Rama Kalyana. Follow the memory note `weekly-organic-social-workflow`. **Goal: bring more sign-ups**, not just likes. Every piece should make a family want to register.

**0. Look back first (read only):**
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
        - Ad cuts: kn-IN-SapnaNeural, te-IN-ShrutiNeural, ta-IN-PallaviNeural, hi-IN-SwaraNeural, at +5%.
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
- **Ads in sync:**
  - Each series video also gets **4 ad-ready cuts**: Kannada, Telugu, Tamil and Hindi.
    - Same art layers; the hook and fact overlays and the end card are re-rendered in that language.
    - The end card says "Register now · ₹351/year", with no "Follow" line.
    - Keep the shloka card as it is.
    - Save to `C:\Users\Suresh\Downloads\SRK_marketing\meta-ads\video\` as `AD_ramayana_w<week>p<part>_<person>_<lang>_9x16.mp4`.
  - In the step 7 summary, **propose** where they go, matched by language:
    - Kannada → L3
    - Telugu and Tamil → Telugu+Tamil, and Telugu+Tamil outside home states
    - Hindi → Hindi
  - Pick the ads to replace from the latest `meta-ads-campaign-status` read: fatigued ads with falling CTR or frequency above 2.
  - Use utm_content `ram_w<week>p<part>_<lang>`.
  - **Add them in Ads Manager only after the user says yes**, then set the part's status to `in_ads` with the ad ids.

**Reel B:**
- Why join / how it works: text-led and fast. Hook in the first 2 seconds (e.g. "Looking for a match for your son or daughter?"), then 3 short benefit cards (verified profiles, number shared only when both families agree, ₹351/year), then the end card.
- Silent (no music), so the text carries the message. Keep all on-screen text inside the middle 80% (safe area).
- Text in the reel's lead language (see Languages below), with a short English line where it helps.
- **Also save an ad-ready cut** of Reel B (same video, end card with "Register now", no AI story frames) to `C:\Users\Suresh\Downloads\SRK_marketing\meta-ads\video\`, named with its language, e.g. `AD_why_join_te_9x16.mp4`, for possible Meta Reels ads. Don't upload it to Ads Manager; the user decides.
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
| Ad-ready video cuts | Alternate the language across weeks so every campaign language gets fresh videos. |

- **English-lead pieces:** use simple English for urban families and NRIs, with no regional script on the image.
- **Captions:**
  1. Start with the lead language's line.
  2. Then one short line in each of the other 3 regional languages, in rotating order.
  3. Then English, unless English is the lead.
  4. Then 5–8 hashtags, mixing #KannadaMatrimony #TeluguMatrimony #TamilMatrimony #HindiMatrimony #HinduMatrimony to match the lead.
  5. Then the AI line.
- **Fonts:** use Noto Serif Kannada, Telugu, Tamil or Devanagari to match the lead language. Ask a native speaker, or note it in the APPROVAL_SHEET, when the wording is new.
- **APPROVAL_SHEET:** list each piece's lead language, plus a tally showing the balance across the 5 languages.

**Content mix:**
- Rotate themes: Trust, Tradition, Tips for parents, How it works.
- Every post and reel ends with a light call to register (e.g. "Register at seetharamakalyana.in · ₹351/year"). Make at most 1 in 3 a hard "register today" post.
- Include at least one post aimed at brides' families (mothers/daughters) each week, since brides are scarce.

**Steps:**
1. Plan themes, captions, Reel B's script, and this week's 3 Ramayana parts from series.json (scene list with on-screen text and timing).
2. Make the art in Gemini through Claude in Chrome: "devotional Indian painting style, warm gold and maroon tones", with a consistent Rama and Seetha. Start a new chat for every image. Check every image and regenerate any bad ones. The series adds about 9–12 scenes, which is over Gemini's ~13 free images a day together with the posts, so spread the art over 2 days or reuse series scenes for stories.
3. Add text locally with the toolkit in `C:\Users\Suresh\Downloads\SRK_social_toolkit\` (render.js for images; reel.js + reel.html for videos; verify.js to check). Update the week folder and the designs list in the scripts. Run them from PowerShell. Check each reel: length, under 10 MB, text readable, and extract stills to look at.
4. Write the APPROVAL_SHEET (with reel scene lists and stills), then **stop and wait for the user's approval**.
5. Copy the final files to the scratchpad. Schedule each piece to both Facebook and Instagram in Business Suite (feed: `/latest/composer`, reels: `/latest/reels_composer`, stories: `/latest/story_composer`), using the file-input hook, date and time tricks from the memory note.
6. Always click "Maybe later" on the Boost offer.
7. Take a Planner screenshot, then give a summary, where the ad-ready cuts are saved (Reel B + the 12 Ramayana cuts), the proposed ad swaps, "Series: X/15 done, next theme: …", and next week's themes. Update series.json.

**One-time (suggest once if not done):** pin 3 Instagram posts that answer "Is this real? How does it work? What does it cost?".

**Hard rules:**
- Never Boost, never touch ads or Ads Manager, and never spend money. The one exception: adding the Ramayana ad cuts to the campaigns the user approved in this run.
- No invented testimonials, member counts or success stories.
- No film or TV clips, songs or logos.
- Be respectful with devotional content.
- Don't reply to comments or messages.
- If a login is needed, stop and ask the user.

$ARGUMENTS
