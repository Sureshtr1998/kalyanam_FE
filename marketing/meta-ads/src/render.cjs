// Renders every <section data-name> in creatives.html to ../<name>.png.
// Run from the repo root: node marketing/meta-ads/src/render.cjs
const path = require("path");
const { chromium } = require("@playwright/test");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await page.goto("file:///" + path.join(__dirname, "creatives.html").replace(/\\/g, "/"));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  const ads = await page.$$("section[data-name]");
  for (const ad of ads) {
    const name = await ad.getAttribute("data-name");
    await ad.screenshot({ path: path.join(__dirname, "..", `${name}.png`) });
    console.log(name);
  }
  await browser.close();
})();
