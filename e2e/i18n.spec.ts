import { test, expect, memberProfile, signIn } from "./fixtures";

const pickLanguage = async (page: import("@playwright/test").Page, label: string) => {
  await page.getByRole("combobox", { name: "Language" }).click();
  await page.getByRole("option", { name: label }).click();
};

test("public pages follow the language picked in the header, and remember it", async ({ page, api }) => {
  void api;
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();

  await pickLanguage(page, "ಕನ್ನಡ");
  await expect(page.getByRole("heading", { name: "ಮರಳಿ ಸ್ವಾಗತ" })).toBeVisible();
  // The Sanskrit verse stays as it is.
  await expect(page.getByText("tava anveṣaṇaṃ").first()).toBeAttached();

  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: "ಸರಳ, ಪ್ರಾಮಾಣಿಕ ಬೆಲೆ" })).toBeVisible();
  await page.goto("/about-us");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ಹಿಂದೂ ಕುಟುಂಬಗಳನ್ನು");
});

test("the registration form follows the chosen language, with option values unchanged", async ({ page, api }) => {
  void api;
  await page.addInitScript(() => localStorage.setItem("site_lang", JSON.stringify("kn")));
  await page.goto("/?join=1");
  await expect(page.getByRole("heading", { name: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ" })).toBeVisible();
  await expect(page.getByText("ವಧು / ವರನ ಪೂರ್ಣ ಹೆಸರು")).toBeVisible();

  await page.getByRole("button", { name: "ಮುಂದುವರಿಸಿ" }).click();
  await expect(page.getByText("ಸರಿಯಾದ ಇಮೇಲ್ ನಮೂದಿಸಿ")).toBeVisible();

  await page.getByRole("combobox").filter({ hasText: "ಆರಿಸಿ" }).first().click();
  await expect(page.getByRole("option")).toHaveText(["ಗಂಡು", "ಹೆಣ್ಣು"]);
});

test("partner page uses the global language and offers no Malayalam or Bengali", async ({ page, api }) => {
  void api;
  await page.goto("/partner-with-us");
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveCount(1);
  await pickLanguage(page, "हिंदी");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("सीता राम कल्याण के साथ साझेदारी करें");

  await page.getByRole("combobox", { name: "Language" }).click();
  await expect(page.getByRole("option")).toHaveText(["English", "ಕನ್ನಡ", "हिंदी", "తెలుగు", "தமிழ்"]);
});

test("empty matches default to the member's mother tongue and can be overridden", async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile({ basic: { ...memberProfile().basic, motherTongue: "Kannada" } }) } });
  api.on("POST /fetch-profiles", { body: { profiles: [], totalProfiles: 0 } });

  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "ನಾವು ಈಗಷ್ಟೇ ಆರಂಭಿಸಿದ್ದೇವೆ, ಬೇಗನೆ ಸೇರಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು" })).toBeVisible();

  await pickLanguage(page, "English");
  await expect(page.getByRole("heading", { name: "We're just getting started, thank you for joining early" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "We're just getting started, thank you for joining early" })).toBeVisible();
});

test("astrology defaults to the mother tongue, and other mother tongues stay English", async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile({ basic: { ...memberProfile().basic, motherTongue: "Telugu" } }) } });
  api.on("GET /astro-data", { body: { astrology: [] } });

  await page.goto("/astrology");
  await expect(page.getByRole("heading", { name: "వైదిక జ్యోతిష్యం" })).toBeVisible();
  await expect(page.getByText("ఇంకా ఫలితాలు లేవు")).toBeVisible();
});

test("a mother tongue without a translation shows English", async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile({ basic: { ...memberProfile().basic, motherTongue: "Marathi" } }) } });
  api.on("GET /astro-data", { body: { astrology: [] } });

  await page.goto("/astrology");
  await expect(page.getByRole("heading", { name: "Vedic astrology" })).toBeVisible();
});
