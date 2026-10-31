# Kalyanam_FE

Seetha Rama Kalyana matrimony web app (React + Vite).

## Setup

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

All configuration comes from environment variables, listed in `.env.example`.
`.env.production` holds the committed, non-secret production defaults (site
URL, Meta Pixel id); Vercel environment variables override it. A production
build fails if `VITE_API_BASE_URL`, `VITE_RAZORPAY_KEY_ID` or `VITE_SITE_URL`
is missing, or if a Vercel production deploy uses an `rzp_test_` key.

Display prices live in `src/utils/constants.ts`; the backend decides what is
actually charged, so keep the two in sync.

## End-to-end tests

```bash
npx playwright install chromium   # once
npm run test:e2e                  # desktop + mobile
npm run test:e2e:ui               # interactive
```

The suite (`e2e/`) runs the real app against a fake backend and a stand-in
for Razorpay Checkout, so it needs no server, keys or network. It covers
every payment flow (registration, credit packs, astrology, partner sign-up),
including cancelled, declined and paid-but-not-fulfilled payments, plus
login and session expiry.
