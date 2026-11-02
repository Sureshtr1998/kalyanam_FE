import type { Page } from "@playwright/test";
import { expect, memberProfile, razorpay, test, type FakeApi } from "./fixtures";
import { choose, field, pickDate, tinyPng } from "./form";

const media = [{ url: "https://ik.example.test/photo.png", fileId: "f1" }];

const stubRegistration = (api: FakeApi) => {
  api.on("GET /user-validation", { body: { success: true } });
  api.on("POST /user-register/upload-images", { body: { media } });
  api.on("POST /create-order", (req) => {
    const referral = req.postDataJSON()?.registration?.referralId;
    return { body: { orderId: "order_reg_1", amount: referral ? 30100 : 35100, currency: "INR", userName: "Asha Rao", userEmail: "asha@example.test", userPhone: "9876500001" } };
  });
  api.on("GET /validate-referral/SRKTEST", { body: { valid: true } });
  api.on("GET /validate-referral/BADCODE", { body: { valid: false } });
};

/** Stands in for the Meta Pixel; calls survive page loads in sessionStorage. */
const recordPixel = (page: Page) =>
  page.addInitScript(() => {
    (window as unknown as { fbq: unknown }).fbq = (...args: unknown[]) => {
      const calls = JSON.parse(sessionStorage.getItem("fbq") ?? "[]");
      sessionStorage.setItem("fbq", JSON.stringify([...calls, args]));
    };
  });
const pixelCalls = (page: Page) => page.evaluate(() => JSON.parse(sessionStorage.getItem("fbq") ?? "[]"));

/** Picks a noisy 4000×3000 JPEG, several MB like a phone camera photo. */
const pickBigPhoto = (page: Page) =>
  page.locator('input[type="file"]').evaluate(async (input: HTMLInputElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = 4000;
    canvas.height = 3000;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < img.data.length; i++) img.data[i] = (i * 2654435761) >>> 24;
    ctx.putImageData(img, 0, 0);
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.95));
    const dt = new DataTransfer();
    dt.items.add(new File([blob], "camera.jpg", { type: "image/jpeg" }));
    input.files = dt.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return blob.size;
  });

/** Fills all three steps and stops on the "Before you pay" note. */
const fillRegistration = async (page: Page, { referral, bigPhoto }: { referral?: string; bigPhoto?: boolean } = {}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).first().click();
  await expect(page.locator("#join").getByRole("heading", { name: "Create your profile" })).toBeVisible();

  // Step 1: account
  await field(page, "Bride / groom's full name").getByRole("textbox").fill("Asha Rao");
  await field(page, "Email").getByRole("textbox").fill("Asha@Example.test");
  await field(page, "Password").locator("input").fill("Secret@123");
  await field(page, "Confirm password").locator("input").fill("Secret@123");
  await choose(page, "Gender");
  await pickDate(page, "Date of birth", { year: 1996, month: "May", day: 20 });
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 2: background
  await choose(page, "Caste");
  await choose(page, "Mother tongue");
  await choose(page, "Marital status");
  await choose(page, "Highest qualification");
  await choose(page, "Profile created by");
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 3: photos & contact
  if (bigPhoto) await pickBigPhoto(page);
  else await page.locator('input[type="file"]').setInputFiles(tinyPng);
  await field(page, "WhatsApp number").getByRole("textbox").fill("9876500001");
  if (referral) await field(page, "Referral ID").getByRole("textbox").fill(referral);
};

test("registration: validated, priced by the server, paid, then signed in", async ({ page, api }) => {
  stubRegistration(api);
  api.on("POST /user-register", { body: { id: "u1", fullName: "Asha Rao", email: "asha@example.test", role: "USER", token: "jwt-new" } });
  api.on("GET /my-profile", { body: { profile: memberProfile({ hasCompleteProfile: false }) } });

  await recordPixel(page);
  await fillRegistration(page);
  await expect(page.getByText("₹351").last()).toBeVisible();
  await page.getByRole("button", { name: "Pay ₹351 & register" }).click();
  await expect(page.getByRole("dialog", { name: "Before you pay" })).toBeVisible();
  await page.getByRole("button", { name: /I understand · Pay ₹351/ }).click();

  const options = await razorpay(page).opened();
  expect(options).toMatchObject({ order_id: "order_reg_1", amount: 35100, description: "Annual membership" });

  const [createOrder] = api.callsTo("POST /create-order");
  const registration = (createOrder.body as { registration: Record<string, unknown> }).registration;
  expect(createOrder.body).not.toHaveProperty("amount");
  expect(registration).toMatchObject({ fullName: "Asha Rao", email: "asha@example.test", mobile: "9876500001", dob: "1996-05-20", images: media });

  await razorpay(page).pay("pay_reg_1", "sig_reg_1");

  await page.waitForURL("**/profile");
  expect(api.callsTo("POST /user-register")[0].body).toEqual({ orderId: "order_reg_1", paymentId: "pay_reg_1", signature: "sig_reg_1" });
  const session = await page.evaluate(() => JSON.parse(localStorage.getItem("user_login_token") ?? "null"));
  expect(session.token).toBe("jwt-new");
  expect(await pixelCalls(page)).toEqual([
    ["track", "Lead", { content_name: "Registration" }],
    ["track", "CompleteRegistration", { value: 351, currency: "INR", content_name: "Annual membership" }],
  ]);
});

test("registration: the ad link /?join=1 opens the register form", async ({ page }) => {
  await page.goto("/?join=1");
  await expect(page.locator("#join").getByRole("heading", { name: "Create your profile" })).toBeVisible();
});

test("registration: a large phone photo is shrunk under 1 MB instead of rejected", async ({ page, api }) => {
  stubRegistration(api);
  await fillRegistration(page, { bigPhoto: true });

  await expect(page.getByRole("img", { name: "Photo 1" })).toBeVisible();
  await expect(page.getByText(/must be under/)).toHaveCount(0);

  const upload = page.waitForRequest("**/user-register/upload-images");
  await page.getByRole("button", { name: "Pay ₹351 & register" }).click();
  await page.getByRole("button", { name: /I understand · Pay ₹351/ }).click();
  expect((await upload).postDataBuffer()!.length).toBeLessThan(1024 * 1024 + 2048);
  await razorpay(page).opened();
});

test("registration: a valid referral ID shows and charges the referral price", async ({ page, api }) => {
  stubRegistration(api);
  await fillRegistration(page, { referral: "SRKTEST" });

  await expect(page.getByRole("button", { name: "Pay ₹301 & register" })).toBeVisible();
  await page.getByRole("button", { name: "Pay ₹301 & register" }).click();
  await page.getByRole("button", { name: /I understand · Pay ₹301/ }).click();

  expect((await razorpay(page).opened()).amount).toBe(30100);
  expect((api.callsTo("POST /create-order")[0].body as { registration: { referralId: string } }).registration.referralId).toBe("SRKTEST");
});

test("registration: an invalid referral ID blocks payment", async ({ page, api }) => {
  stubRegistration(api);
  await fillRegistration(page, { referral: "BADCODE" });

  await expect(field(page, "Referral ID").getByText("Invalid referral ID")).toBeVisible();
  await page.getByRole("button", { name: /& register/ }).click();
  await expect(page.getByRole("dialog", { name: "Before you pay" })).toBeHidden();
  expect(api.callsTo("POST /create-order")).toHaveLength(0);
});

test("registration: an email that's already registered is stopped on step 1", async ({ page, api }) => {
  api.on("GET /user-validation", { status: 400, body: { msg: "Email already exists" } });
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).first().click();
  await field(page, "Bride / groom's full name").getByRole("textbox").fill("Asha Rao");
  await field(page, "Email").getByRole("textbox").fill("taken@example.test");
  await field(page, "Password").locator("input").fill("Secret@123");
  await field(page, "Confirm password").locator("input").fill("Secret@123");
  await choose(page, "Gender");
  await pickDate(page, "Date of birth", { year: 1996, month: "May", day: 20 });
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(field(page, "Email").getByText("Email already exists")).toBeVisible();
  await expect(field(page, "Caste")).toHaveCount(0);
});

test("registration: required fields are checked before moving on", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Register" }).first().click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Please check the highlighted fields")).toBeVisible();
  await expect(field(page, "Email").getByText("Enter a valid email")).toBeVisible();
  await expect(field(page, "Password").getByText("At least 8 characters")).toBeVisible();
});

test("registration: paid but account creation failed shows the payment id and support email", async ({ page, api }) => {
  stubRegistration(api);
  api.on("POST /user-register", { status: 409, body: { msg: "This email is already registered." } });

  await fillRegistration(page);
  await page.getByRole("button", { name: "Pay ₹351 & register" }).click();
  await page.getByRole("button", { name: /I understand/ }).click();
  await razorpay(page).opened();
  await razorpay(page).pay("pay_reg_9");

  await expect(page.getByText("Payment received, but registration didn't finish")).toBeVisible();
  await expect(page.getByText(/pay_reg_9/)).toBeVisible();
  await expect(page.getByText(/contactus@seetharamakalyana\.in/).first()).toBeVisible();
  expect(page.url()).not.toContain("/profile");
});
