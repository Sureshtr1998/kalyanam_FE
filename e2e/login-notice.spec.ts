import { expect, memberProfile, signIn, test } from "./fixtures";

test("members see the login notice once per session, with their biodata PDF", async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile() } });
  api.on("POST /fetch-profiles", { body: { profiles: [], totalProfiles: 0 } });

  await page.goto("/home");
  const notice = page.getByRole("dialog", { name: "Welcome back" });
  await expect(notice).toBeVisible();
  await expect(notice.getByText("Your 1-year membership starts in March 2027")).toBeVisible();
  await expect(notice.getByText("No need to keep checking.")).toBeVisible();

  const download = page.waitForEvent("download");
  await notice.getByRole("button", { name: "Download biodata (PDF)" }).click();
  expect((await download).suggestedFilename()).toMatch(/\.pdf$/);

  await notice.getByRole("button", { name: "Got it" }).click();
  await expect(notice).toBeHidden();

  await page.reload();
  await expect(page.getByRole("heading", { name: "We're just getting started, thank you for joining early" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("partners don't get the login notice", async ({ page, api }) => {
  await signIn(page, { role: "BROKER" });
  api.on("GET /my-profile", { body: { profile: memberProfile() } });
  api.on("POST /fetch-profiles", { body: { profiles: [], totalProfiles: 0 } });

  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Partner dashboard" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
