# Meta ads: strategy, expectations and what to track

Budget: ₹1,000/day to start. Reinvest only when the numbers below say so.

## Setup (business ad account 3311139419043676, Pixel 1199725088340553)

| Campaign | Status | Budget | Ad sets |
|---|---|---|---|
| SRK \| Sales \| Registrations \| Nov 2026 | Draft, ON when published | ₹1,000/day | A Parents (Karnataka, 45–65+) · B Young professionals (Karnataka + Hyderabad, Chennai, Pune, Mumbai, 24–34) · C NRI (US, UK, UAE, Singapore, Australia, Canada, 25–40) |
| SRK \| Sales \| Telugu + Tamil \| READY - keep off | Draft, OFF | ₹300/day | D Telugu (AP, Telangana) · E Tamil (TN, Pondicherry) |

- Optimises for **CompleteRegistration**, which now fires only after Razorpay confirms the ₹351 payment.
- Every ad links to `/?join=1&utm_source=meta&utm_medium=paid_social&utm_campaign=…&utm_content=<ad tag>`.
- Creatives: `marketing/meta-ads/*.png` (16 images), rebuilt with `node marketing/meta-ads/src/render.cjs`.

## Before publishing (in this order)

1. Deploy the current `feature/ai-v1` build. The live site is still the old design, without the new Pixel events or the `/?join=1` link.
2. Do one real registration and check **Events Manager → Test events** for Lead, then CompleteRegistration (value 351).
3. Billing: the account spending limit (₹51,781) is used up. Reset or raise it, and add about ₹19,000 prepaid (₹16,100 + 18% GST) for two weeks.
4. Verify the business for Singapore, or remove Singapore from ad set C.
5. Link Instagram, and have a native speaker check the Kannada, Telugu and Tamil text.
6. Publish **only** the Registrations campaign.

## Honest expectations at ₹1,000/day (≈ ₹35,400/month with GST)

| Metric | Expected | Source |
|---|---|---|
| Cost per click | ₹4–8 | Your Dec 2025–Jan 2026 exports |
| Clicks/month | 4,000–7,000 | |
| Paid members/month | **40–80 likely**, 30–200 possible | Unknown: ₹351 upfront to a new brand is the bottleneck |
| Month 1 money | Loss to break-even (revenue = members × ₹351) | |

The old campaigns' "369 registrations" were mostly clicks on "Okay, I understand" **before** payment, so they don't show how many people paid.

The biggest lever if payments stay low: make sign-up free and charge when members send interests. This could bring 5–10× more sign-ups and fills the site with profiles.

## Weekly tracking (Ads Manager + admin panel + Razorpay)

| What | Healthy |
|---|---|
| Spend, CPM, link clicks | – |
| CPC (link) | ≤ ₹8 |
| Link CTR | ≥ 1% |
| Landing page views → Lead (opened register form) | ≥ 25% |
| Lead → CompleteRegistration (paid) | ≥ 10% |
| Cost per registration (CPR) | ≤ ₹351 to be profitable |
| Purchase events (credit packs, astrology) and value | Growing |
| Frequency (7 days) | < 3 |
| Breakdown by ad set and by `utm_content` | Find winners and losers |
| Pixel CompleteRegistration vs Razorpay paid registrations | Should match |
| New members who get ≥1 interest in week 1 | As high as possible; members with no interest won't renew or recommend |

## Decision rules

**Days 1–4:** don't touch anything (Meta's learning period).

**Day 7:**
- CPC over ₹20 or CTR under 1% → swap creatives.
- Lots of clicks, few Leads → the landing page is the problem.
- Lots of Leads, few payments → the upfront ₹351 offer is the problem.

**Day 14:**
- CPR under ₹351 → raise budget 20% every 3 days.
- CPR ₹351–700 → keep running; pause the worst ads and add 4–6 new creatives in the style of the winners.
- CPR over ₹1,500 → rethink the offer (free sign-up).

**Reinvestment ladder** (only while CPR ≤ about ₹351 and new members get matches):
₹1,000 → ₹1,500 → ₹2,000/day → switch on Telugu + Tamil (₹300/day) → partner/broker ads (image 09) → North India / Hindi, one city cluster first (e.g. Delhi NCR), only once there are a few hundred active profiles.

**Housekeeping:**
- Refresh creatives every 2–3 weeks.
- Retire the "March 2027" ads (B2, C3) before Feb 2027.
