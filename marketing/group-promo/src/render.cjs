// Renders every <section data-name> in groups.html to ../<name>.png.
// Run from the repo root: node marketing/group-promo/src/render.cjs
const path = require("path");
const { chromium } = require("@playwright/test");

(async () => {
  const src = path.join(__dirname, "groups.html");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 2000 } });
  await page.goto("file:///" + src.replace(/\\/g, "/"));
  await page.waitForFunction(() => window.qrReady === true);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("networkidle");
  for (const ad of await page.$$("section[data-name]")) {
    const name = await ad.getAttribute("data-name");
    await ad.screenshot({ path: path.join(__dirname, "..", `${name}.png`) });
    console.log(name);
  }
  await browser.close();
})();
