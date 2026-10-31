import { expect, memberProfile, signIn, test } from "./fixtures";

test("logs in and lands on matches", async ({ page, api }) => {
  api.on("POST /login", { body: { id: "u1", fullName: "Asha Rao", email: "asha@example.test", role: "USER", token: "jwt-1" } });
  api.on("GET /my-profile", { body: { profile: memberProfile() } });
  api.on("POST /fetch-profiles", { body: { profiles: [], total: 0 } });

  await page.goto("/");
  await page.locator("#login-email").fill("  Asha@Example.test ");
  await page.locator("#join").locator('input[type="password"]').fill("Secret@123");
  await page.locator("#join").getByRole("button", { name: /log in/i }).click();

  await page.waitForURL("**/home");
  expect(api.callsTo("POST /login")[0].body).toMatchObject({ email: "asha@example.test", password: "Secret@123", isPartner: false });
});

test("shows the server's message on a failed login", async ({ page, api }) => {
  api.on("POST /login", { status: 400, body: { msg: "Invalid credentials" } });
  await page.goto("/");
  await page.locator("#login-email").fill("asha@example.test");
  await page.locator("#join").locator('input[type="password"]').fill("wrong");
  await page.locator("#join").getByRole("button", { name: /log in/i }).click();

  await expect(page.getByText("Invalid credentials")).toBeVisible();
  await expect(page).toHaveURL("/");
});

test("member pages redirect to the landing page when signed out", async ({ page }) => {
  for (const path of ["/home", "/account", "/astrology"]) {
    await page.goto(path);
    await expect(page).toHaveURL("/");
  }
});

test("an expired session signs the member out", async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { status: 401, body: { msg: "Token or secret is not valid" } });

  await page.goto("/account");

  await expect(page).toHaveURL("/");
  expect(await page.evaluate(() => localStorage.getItem("user_login_token"))).toBeNull();
});

test("public pages show prices from the shared constants", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByText("₹351").first()).toBeVisible();
  await expect(page.getByText("₹751").first()).toBeVisible();
});

test("no third-party tracking runs outside production", async ({ page }) => {
  const tracking: string[] = [];
  page.on("request", (r) => /facebook/.test(r.url()) && tracking.push(r.url()));
  await page.goto("/");
  await expect(page.locator("#join")).toBeVisible();
  expect(await page.evaluate(() => typeof (window as unknown as { fbq?: unknown }).fbq)).toBe("undefined");
  expect(tracking).toEqual([]);
});
