import type { Locator, Page } from "@playwright/test";

/** The <Field> wrapper whose label reads `label` (labels aren't tied to inputs with htmlFor). */
export const field = (page: Page, label: string): Locator =>
  page.locator(`xpath=//div[label[normalize-space(.)="${label}" or normalize-space(.)="${label}*"]]`);

/** Picks the first option of a SelectField (plain or searchable), optionally filtered by typing. */
export const choose = async (page: Page, label: string, search?: string) => {
  await field(page, label).getByRole("combobox").click();
  if (search) await page.getByPlaceholder(/^Search/).fill(search);
  await page.getByRole("option").first().click();
};

/** Sets a DateField through its month/year dropdowns. */
export const pickDate = async (page: Page, label: string, { year, month, day }: { year: number; month: string; day: number }) => {
  await field(page, label).getByRole("button").click();
  await page.getByRole("combobox", { name: /year/i }).selectOption(String(year));
  await page.getByRole("combobox", { name: /month/i }).selectOption({ label: month });
  // Day buttons are named like "Monday, May 20th, 1996".
  await page.getByRole("button", { name: new RegExp(`${month} ${day}(st|nd|rd|th), ${year}$`) }).click();
};

/** 1x1 PNG, enough for the photo picker. */
export const tinyPng = {
  name: "photo.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
    "base64"
  ),
};
