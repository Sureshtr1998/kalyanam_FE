---
description: Health check of Meta ads, the Facebook Page and Instagram (actual vs expected)
---

Run the "track data" routine for Seetha Rama Kalyana. Read only: never edit ads, Boost, reply to comments or change settings. Use Claude in Chrome (the user is already logged in).

Follow the memory notes `track-data-routine` and `meta-ads-campaign-status`. In short:

1. **Meta ads:** open https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=3311139419043676&business_id=736180206161421&nav_entry_point=ads_ecosystem_navigation_menu&nav_source=ads_manager
   - Read numbers through page JS: `window.__accessToken` with `https://adsmanager-graph.facebook.com/v22.0/` and `fetch(..., {credentials:'include'})`. In the output, replace "&" and "=" or the tool blocks it.
   - Keep calls few, because the API rate-limits after about 10.
   - Pull:
     - campaign 120252415073490693, lifetime and today
     - ad sets (today and lifetime)
     - ads
     - daily trend
     - hourly spend today
     - placements
     - budget_remaining
   - Ask the user for the Razorpay paid-member count. It's the source of truth, because Meta under-counts members.
   - Benchmarks:

     | Metric | Expected |
     |---|---|
     | CPC | ₹4–8 |
     | CTR | 1–2% |
     | Landing page views per click | 70–85% |
     | Leads per landing page view | 10–20% |
     | Paid per Lead | 10% or more |
     | Cost per paid member | ₹351 or less (break-even) |
     | Frequency | under 2.5 |
     | CPM | ₹80–200 |

2. **Facebook Page:** Business Suite → Insights → Content, at https://business.facebook.com/latest/insights/content?asset_id=914182555118025. For each post, story and reel, give views, interactions, comments, shares and link clicks. Also confirm the week's scheduled posts went out. Note that profile.php?id=61583189982529 is the user's personal profile, not the Page.

3. **Instagram:** open https://www.instagram.com/seetharamakalyanamat/ and give posts, followers, and likes, comments and views per post.

Report as tables of actual vs expected, then one verdict per area and 1–3 actions. Update the `meta-ads-campaign-status` memory with the new read. Close the Chrome tab when done.

$ARGUMENTS
