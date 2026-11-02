// Renders every <section data-name> in creatives.html to ../<name>.png.
// Run from the repo root: node marketing/meta-ads/src/render.cjs
// For another pricing level (see kalyanam_BE/src/utils/pricing.js), pass it:
//   node marketing/meta-ads/src/render.cjs 2   → ../levels/L2/<name>.png
// creatives.html is written at level 3 (₹351); other levels swap the prices in.
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

const PRICES = {
  2: { fee: 201, was: 599, credits: 21, referral: 171, commission: 51, kundli: 151, overview: 41 },
  3: null,
  4: { fee: 501, was: 1499, credits: 51, referral: 431, commission: 151, kundli: 251, overview: 71 },
};

// Level 1 has free registration, so price phrases are reworded rather than swapped.
const FREE_REWRITES = [
  ["Create your profile · ₹351/year", "Create your profile · Free"],
  ["Register for ₹351 a year", "Register free today"],
  ["Register for ₹351 →", "Register free →"],
  ["OTP-verified members · No sales calls · ₹351/year", "OTP-verified members · No sales calls · Free to join"],
  ["₹351 a year. Pay securely by card or UPI", "Free to join. No card needed"],
  ["Hindu matrimony · ₹351/year", "Hindu matrimony · Free to join"],
  ["₹351/year · seetharamakalyana.in", "Free to join · seetharamakalyana.in"],
  ["65% OFF · LAUNCH OFFER", "LAUNCH OFFER"],
  ["One year of membership", "Registration"],
  [`<p class="num" style="font-size:250px;line-height:1;margin-top:10px">₹351</p>`,
    `<p class="num" style="font-size:230px;line-height:1;margin-top:10px">FREE</p>`],
  ["<s>₹999</s> per year · under ₹30 a month", "No payment to join"],
  ["36 interest credits included", "5 interest credits included"],
  ["ವರ್ಷಕ್ಕೆ ಕೇವಲ ₹351", "ನೋಂದಣಿ ಸಂಪೂರ್ಣ ಉಚಿತ"],
  ["సంవత్సరానికి కేవలం ₹351", "నమోదు పూర్తిగా ఉచితం"],
  ["సంవత్సరానికి ₹351 కే నమోదు చేసుకోండి", "ఉచితంగా నమోదు చేసుకోండి"],
  ["ஆண்டுக்கு வெறும் ₹351", "பதிவு முற்றிலும் இலவசம்"],
  ["ஆண்டுக்கு ₹351 – இன்றே பதிவு செய்யுங்கள்", "இலவசமாக இன்றே பதிவு செய்யுங்கள்"],
];

const forLevel = (html, level) => {
  if (level === 1) return FREE_REWRITES.reduce((h, [from, to]) => h.split(from).join(to), html);
  const p = PRICES[level];
  if (!p) return html;
  const off = Math.round((1 - p.fee / p.was) * 100);
  // Specific prices first, so a new fee (e.g. ₹201) is never re-replaced as the old Kundli price.
  return html
    .split(`Kundli matching <span style="color:var(--gold)">₹201</span>`)
    .join(`Kundli matching <span style="color:var(--gold)">₹${p.kundli}</span>`)
    .split("Overview from ₹51").join(`Overview from ₹${p.overview}`)
    .split("₹101").join(`₹${p.commission}`)
    .split("65% OFF").join(`${off}% OFF`)
    .split("under ₹30 a month").join(`under ₹${Math.ceil(p.fee / 12)} a month`)
    .split("₹999").join(`₹${p.was}`)
    .split("₹301").join(`₹${p.referral}`)
    .split("₹351").join(`₹${p.fee}`)
    .split("36 interest credits").join(`${p.credits} interest credits`);
};

(async () => {
  const level = Number(process.argv[2] || 3);
  if (![1, 2, 3, 4].includes(level)) throw new Error(`Unknown pricing level ${process.argv[2]}`);
  const outDir = level === 3 ? path.join(__dirname, "..") : path.join(__dirname, "..", "levels", `L${level}`);
  fs.mkdirSync(outDir, { recursive: true });

  // Written next to the source so logo.png and hero.webp still resolve.
  const src = path.join(__dirname, level === 3 ? "creatives.html" : `.creatives-L${level}.html`);
  if (level !== 3) fs.writeFileSync(src, forLevel(fs.readFileSync(path.join(__dirname, "creatives.html"), "utf8"), level));

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await page.goto("file:///" + src.replace(/\\/g, "/"));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  const ads = await page.$$("section[data-name]");
  for (const ad of ads) {
    const name = await ad.getAttribute("data-name");
    await ad.screenshot({ path: path.join(outDir, `${name}.png`) });
    console.log(name);
  }
  await browser.close();
  if (level !== 3) fs.unlinkSync(src);
})();
