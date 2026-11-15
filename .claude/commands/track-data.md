---
description: Health check of Meta ads, the Facebook Page and Instagram (actual vs expected)
---

Run the "track data" routine for Seetha Rama Kalyana. Read only: never edit ads, Boost, reply to comments or change settings. Use Claude in Chrome (the user is already logged in).

Follow the memory notes `track-data-routine`, `meta-ads-campaign-status` and `ads-account-structure-rule`.

## 0. Account structure (as of 14 Nov 2026): one campaign per language

| Campaign | ID | Budget/day | Ad sets (`Language \| Place \| Audience`) |
|---|---|---|---|
| SRK \| Kannada | 120252415073490693 | ₹1,700 | Kannada \| Karnataka \| Parents 45-65 · Kannada \| Karnataka + 4 cities \| Young 24-34 |
| SRK \| Telugu | 120252420507450693 | ₹2,100 | Telugu \| AP + Telangana \| 45-65 |
| SRK \| Tamil | 120252642638230693 | ₹1,700 | Tamil \| Tamil Nadu + Puducherry \| 45-65 |
| SRK \| Hindi | 120252522581030693 | ₹2,500 | Hindi \| North India \| 45-65 |

- If the campaign list in Ads Manager differs from this table, report the difference first, update this table and the memory note, and then continue.
- Every ad's Website URL should go to its language page (`/kn`, `/te`, `/ta`, `/hi`). Flag any ad still landing on the English `/`.
- Flag anything that breaks the structure rule: a campaign that isn't a language campaign, or leftover drafts and paused items that should be deleted. Only suggest the clean-up; don't do it.

## 1. Meta ads: report **by language**

Open https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=3311139419043676&business_id=736180206161421

**How to read the numbers:** read the Ads Manager tables in the page.
- Use the Campaigns, Ad sets and Ads tabs, with the date picker set to Today, Yesterday, Last 7 days and Lifetime.
- Use Breakdown → By delivery → Placement, Platform, and Age/Gender.
- Use `get_page_text` and `find`; the browser window is short, so scroll the grid.
- Don't call the Graph API with `window.__accessToken`. The safety check blocked it on 14 Nov. Use it only if the user has explicitly allowed it again.

**Pull, per language campaign:**
- Spend, link clicks, CTR, CPC, CPM, frequency, landing page views, Leads, paid (Website completed registration), cost per paid
  - for today, yesterday, the last 7 days and lifetime
- The same per ad set
- Per ad: the top 3 and bottom 3 by cost per paid, and ads with **frequency above 2 or falling CTR** (fatigue)
- **Ramayana series ads** (names `RAM-W<week>P<part>-<LANG> | <person>`, utm_content `ram_w<week>p<part>_<lang>`):
  - Give each its own row: status (in review, active, rejected), spend, CTR, Leads, paid, cost per paid.
  - Compare against the ad set's other ads.
  - Verdict: keep, scale, or pause after ₹500 spent with 0 paid.
- WhatsApp placements (marketing messages + Status) as their own line
- Total spend vs total budget (₹8,000/day), and the prepaid balance from Billing

**Real joins (source of truth):** read https://www.seetharamakalyana.in/admin.
- Use Overview → "New sign-ups" and the "Meta ads · spend" panel, for today, yesterday and this week.
- Meta under-counts members, so these numbers win.
- Admin has no source column. To report "without WhatsApp", subtract Meta's WhatsApp-placement paid count from the joins and WhatsApp spend from the spend.
- Never repeat members' names, phones or emails.

**Benchmarks:**

| Metric | Expected |
|---|---|
| CPC | ₹4–8 |
| CTR | 1–2% |
| Landing page views per click | 70–85% |
| Leads per landing page view | 10–20% |
| Paid per Lead | 10% or more |
| Cost per paid member | ₹351 or less (break-even); scale rule: 3-day cost under ₹250 |
| Frequency | under 2.5 |
| CPM | ₹80–200 |

## 2. Facebook Page

Business Suite → Insights → Content, at https://business.facebook.com/latest/insights/content?asset_id=914182555118025.
- For each post, story and reel, give views, interactions, comments, shares and link clicks.
- Confirm the week's scheduled posts went out, and that each shows its caption (not "Your reel").
- profile.php?id=61583189982529 is the user's personal profile, not the Page.

For reels, also give plays and average watch time where Business Suite shows them, and name the best-performing reel so the next `/weekly-posts` can do more of it.

**Ramayana series** ("Unknown Heroes of Ramayana", Tue/Thu/Sun):
- For each part, give plays, average watch time, shares, and the FB Page and IG follower change since the previous read. Follows are the series' goal.
- Say whether the next part should keep the same hook style.

## 3. Instagram

Open https://www.instagram.com/seetharamakalyanamat/ and give posts, followers, and likes, comments and views per post.

## Report format

1. A **per-language table** (Kannada, Telugu, Tamil, Hindi, plus a total row): spend, Meta paid, cost per paid, CTR, frequency, trend vs the last read.
2. Real joins from admin (all, and without WhatsApp).
3. Series ads table.
4. Organic tables (FB, IG, series).
5. One verdict per language and per area, then 1–3 actions. Any change to campaigns or ad sets must follow the structure rule, and needs the plan shown and the user's OK first.

Update the `meta-ads-campaign-status` memory with the new read. Close the Chrome tab when done.

$ARGUMENTS
