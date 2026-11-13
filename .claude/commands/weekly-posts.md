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
| **Reels/videos** | **2** | **Tue and Sat at 7:30 pm** | 9:16 MP4, 1080×1920, **15–25 s**, under 10 MB |
| Stories | 7 (daily) | 8:30 am | 9:16 image |

**Reels/videos (new):**
- Reel A, story/devotional: 5–6 Gemini scenes with slow zoom/pan (Ken Burns), short animated text on each scene, and a final card with the logo, "₹351/year · No sales calls" and seetharamakalyana.in.
- Reel B, why join / how it works: text-led and fast. Hook in the first 2 seconds (e.g. "Looking for a match for your son or daughter?"), then 3 short benefit cards (verified profiles, number shared only when both families agree, ₹351/year), then the end card.
- Silent (no music), so the text carries the message. Keep all on-screen text inside the middle 80% (safe area).
- Text in the reel's lead language (see Languages below), with a short English line where it helps.
- **Also save an ad-ready cut** of each reel (same video, end card with "Register now", no AI story frames) to `C:\Users\Suresh\Downloads\SRK_marketing\meta-ads\video\`, named with its language, e.g. `AD_why_join_te_9x16.mp4`, for possible Meta Reels ads. Don't upload it to Ads Manager; the user decides.
- **Never save ad or social files inside the kalyanam_FE repo** (user's rule, 2026-11-13). Use only the week folder in Downloads and `Downloads\SRK_marketing\`.

**Languages: give Kannada, Telugu, Tamil, Hindi and English equal weight (user's rule, 2026-11-13). Kannada is not the default.**

Every piece has one **lead language**. The lead language is used for:
- the big text on the image or video,
- the first caption line,
- the tradition or festival chosen.

Each week, spread the lead languages evenly:

| Piece | Lead languages |
|---|---|
| 5 main pieces (3 feed posts + 2 reels) | One each: Kannada, Telugu, Tamil, Hindi, English. Rotate which day each language gets, week to week. |
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
1. Plan themes, captions and both reel scripts (scene list with on-screen text and timing).
2. Make the art in Gemini through Claude in Chrome: "devotional Indian painting style, warm gold and maroon tones", with a consistent Rama and Seetha. Start a new chat for every image. Check every image and regenerate any bad ones.
3. Add text locally with the toolkit in `C:\Users\Suresh\Downloads\SRK_social_toolkit\` (render.js for images; reel.js + reel.html for videos; verify.js to check). Update the week folder and the designs list in the scripts. Run them from PowerShell. Check each reel: length, under 10 MB, text readable, and extract stills to look at.
4. Write the APPROVAL_SHEET (with reel scene lists and stills), then **stop and wait for the user's approval**.
5. Copy the final files to the scratchpad. Schedule each piece to both Facebook and Instagram in Business Suite (feed: `/latest/composer`, reels: `/latest/reels_composer`, stories: `/latest/story_composer`), using the file-input hook, date and time tricks from the memory note.
6. Always click "Maybe later" on the Boost offer.
7. Take a Planner screenshot, then give a summary, where the ad-ready cuts are saved, and next week's themes.

**One-time (suggest once if not done):** pin 3 Instagram posts that answer "Is this real? How does it work? What does it cost?".

**Hard rules:**
- Never Boost, never touch ads or Ads Manager, and never spend money.
- No invented testimonials, member counts or success stories.
- No film or TV clips, songs or logos.
- Be respectful with devotional content.
- Don't reply to comments or messages.
- If a login is needed, stop and ask the user.

$ARGUMENTS
