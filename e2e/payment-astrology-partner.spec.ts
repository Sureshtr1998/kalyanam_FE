import type { Page } from "@playwright/test";
import { expect, memberProfile, razorpay, signIn, test } from "./fixtures";
import { choose, field, pickDate, tinyPng } from "./form";

const pickTime = async (page: Page, label: string, hour: string, minute: string) => {
  await field(page, label).getByRole("button").click();
  // Hour chips come before the minute chips, and "10" exists in both.
  await page.getByRole("button", { name: hour, exact: true }).first().click();
  await page.getByRole("button", { name: minute, exact: true }).last().click();
  await page.getByRole("button", { name: "Done" }).click();
};

test.describe("astrology reading", () => {
  test.beforeEach(async ({ page, api }) => {
    await signIn(page);
    api.on("GET /my-profile", { body: { profile: memberProfile() } });
    api.on("GET /astro-data", { body: { astrology: [] } });
    await page.route("https://photon.komoot.io/**", (route) =>
      route.fulfill({
        json: {
          features: [
            { properties: { name: "Mysuru", state: "Karnataka", country: "India" }, geometry: { coordinates: [76.64, 12.3] } },
          ],
        },
      })
    );
  });

  const fillBirthDetails = async (page: Page) => {
    await page.goto("/astrology");
    await field(page, "Full name").getByRole("textbox").fill("Asha Rao");
    await pickDate(page, "Date of birth", { year: 1996, month: "May", day: 20 });
    await pickTime(page, "Time of birth", "10", "30");
    await page.locator("#p1-place").fill("Mysuru");
    await page.getByRole("option", { name: /Mysuru, Karnataka, India/ }).click();
  };

  test("pays for an Overview reading with birth details the server can price and verify", async ({ page, api }) => {
    api.on("POST /create-order", { body: { orderId: "order_astro_1", amount: 5100, currency: "INR" } });
    api.on("POST /astro-data", {
      status: 201,
      body: { msg: "Your request has been received.", data: { astrology: [{ uId: "a1", consultationMode: "Overview", name: "Asha Rao", status: "pending", dob: "1996-05-20T10:30:00.000Z", place: "Mysuru, Karnataka, India" }] } },
    });

    await fillBirthDetails(page);
    await page.getByRole("button", { name: "Pay ₹51 & submit" }).click();

    const options = await razorpay(page).opened();
    expect(options).toMatchObject({ order_id: "order_astro_1", amount: 5100, description: "Vedic astrology · Overview" });
    expect(api.callsTo("POST /create-order")[0].body).toEqual({
      purpose: "astro",
      astro: {
        consultationMode: "Overview",
        name: "Asha Rao",
        gender: expect.any(String),
        dob: "1996-05-20T10:30",
        place: "Mysuru, Karnataka, India",
        lat: 12.3,
        lng: 76.64,
      },
    });

    await razorpay(page).pay("pay_astro_1", "sig_astro_1");
    await expect(page.getByText("Request received")).toBeVisible();
    expect(api.callsTo("POST /astro-data")[0].body).toEqual({ orderId: "order_astro_1", paymentId: "pay_astro_1", signature: "sig_astro_1" });
  });

  test("the pay button stays disabled until birth details are complete", async ({ page }) => {
    await page.goto("/astrology");
    await expect(page.getByRole("button", { name: "Pay ₹51 & submit" })).toBeDisabled();
  });

  test("paid but fulfilment failed tells the member it is still processing", async ({ page, api }) => {
    api.on("POST /create-order", { body: { orderId: "order_astro_2", amount: 5100, currency: "INR" } });
    api.on("POST /astro-data", { status: 500, body: { msg: "Server error" } });

    await fillBirthDetails(page);
    await page.getByRole("button", { name: "Pay ₹51 & submit" }).click();
    await razorpay(page).opened();
    await razorpay(page).pay("pay_astro_2");

    await expect(page.getByText("Payment received, request still processing")).toBeVisible();
    await expect(page.getByText(/pay_astro_2/)).toBeVisible();
  });
});

test.describe("partner sign-up", () => {
  const fillPartnerForm = async (page: Page) => {
    await page.goto("/partner-with-us");
    await field(page, "Full Name").getByRole("textbox").fill("Lakshmi Matchmakers");
    await field(page, "Email Address").getByRole("textbox").fill("Lakshmi@Example.test");
    await field(page, "Phone Number (10 digits)").getByRole("textbox").fill("9000000001");
    await field(page, "Password").locator("input").fill("Secret@123");
    await field(page, "Confirm Password").locator("input").fill("Secret@123");
    await field(page, "Company Name").getByRole("textbox").fill("LM");
    await field(page, "Business Address").getByRole("textbox").fill("Mysuru");
    await choose(page, "Communities You Serve");
    await page.keyboard.press("Escape");
    await page.locator('input[type="file"]').setInputFiles(tinyPng);
  };

  test("uploads the ID proof before taking the ₹501 fee, then registers", async ({ page, api }) => {
    const media = [{ url: "https://ik.example.test/id.png", fileId: "id1" }];
    api.on("GET /broker-validation", { body: { success: true } });
    api.on("POST /broker-register/upload-idproof", { body: { media } });
    api.on("POST /create-order", { body: { orderId: "order_partner_1", amount: 50100, currency: "INR" } });
    api.on("POST /broker-register", { status: 201, body: { success: true } });

    await fillPartnerForm(page);
    await page.getByRole("button", { name: "Pay ₹501 & apply" }).click();

    const options = await razorpay(page).opened();
    expect(options).toMatchObject({ order_id: "order_partner_1", amount: 50100 });
    // ID proof is safely uploaded before any money moves.
    expect(api.callsTo("POST /broker-register/upload-idproof")).toHaveLength(1);
    const body = api.callsTo("POST /create-order")[0].body as { purpose: string; broker: Record<string, unknown> };
    expect(body.purpose).toBe("broker");
    expect(body.broker).toMatchObject({ email: "lakshmi@example.test", phone: "9000000001" });
    expect(body).not.toHaveProperty("amount");

    await razorpay(page).pay("pay_partner_1", "sig_partner_1");

    await expect(page.getByText("Application received")).toBeVisible();
    expect(api.callsTo("POST /broker-register")[0].body).toEqual({
      orderId: "order_partner_1",
      paymentId: "pay_partner_1",
      signature: "sig_partner_1",
      idProofs: media,
    });
    await page.waitForURL((url) => url.pathname === "/");
  });

  test("a failed ID upload stops before checkout, so nothing is charged", async ({ page, api }) => {
    api.on("GET /broker-validation", { body: { success: true } });
    api.on("POST /broker-register/upload-idproof", { status: 500, body: { msg: "Failed to upload ID proof" } });

    await fillPartnerForm(page);
    await page.getByRole("button", { name: "Pay ₹501 & apply" }).click();

    await expect(page.getByText("Failed to upload ID proof")).toBeVisible();
    expect(api.callsTo("POST /create-order")).toHaveLength(0);
    expect(await razorpay(page).isOpen()).toBe(false);
  });

  test("an already-registered partner is stopped before checkout", async ({ page, api }) => {
    api.on("GET /broker-validation", { status: 400, body: { msg: "Email already exists" } });

    await fillPartnerForm(page);
    await page.getByRole("button", { name: "Pay ₹501 & apply" }).click();

    await expect(page.getByText("Email already exists")).toBeVisible();
    expect(api.callsTo("POST /create-order")).toHaveLength(0);
  });
});
