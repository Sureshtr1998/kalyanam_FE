import { expect, memberProfile, RAZORPAY_KEY, razorpay, signIn, test } from "./fixtures";

const order = { orderId: "order_e2e_1", amount: 10100, currency: "INR", userName: "Asha Rao", userEmail: "asha@example.test", userPhone: "9876500001" };

test.beforeEach(async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile() } });
});

const buyBasic = (page: import("@playwright/test").Page) => page.getByRole("button", { name: "Buy 21 credits" }).click();

test("buying a credit pack: server-priced order, checkout, credits added", async ({ page, api }) => {
  api.on("POST /create-order", { body: order });
  api.on("POST /buy-interest", {
    body: {
      profile: memberProfile({
        interests: { totalNoOfInterest: 57, sent: [], received: [], viewed: [] },
        transactions: [{ orderId: order.orderId, paymentId: "pay_e2e_1", amountPaid: 101, noOfInterest: 21, note: "Interest Purchase" }],
      }),
    },
  });

  await page.goto("/account");
  await expect(page.getByText("Buy more credits")).toBeVisible();
  await buyBasic(page);

  // The browser says what it wants, never how much it costs.
  await expect.poll(() => api.callsTo("POST /create-order").length).toBe(1);
  expect(api.callsTo("POST /create-order")[0].body).toEqual({ purpose: "interest", pack: "basic" });

  const options = await razorpay(page).opened();
  expect(options).toMatchObject({
    key: RAZORPAY_KEY,
    amount: 10100,
    currency: "INR",
    order_id: order.orderId,
    name: "Seetha Rama Kalyana",
    image: "http://localhost:4317/logo.png",
    prefill: { name: "Asha Rao", email: "asha@example.test", contact: "+919876500001" },
  });

  await razorpay(page).pay("pay_e2e_1", "sig_e2e_1");

  await expect.poll(() => api.callsTo("POST /buy-interest").length).toBe(1);
  expect(api.callsTo("POST /buy-interest")[0].body).toEqual({ orderId: order.orderId, paymentId: "pay_e2e_1", signature: "sig_e2e_1" });
  await expect(page.getByText("Credits added")).toBeVisible();
  await expect(page.getByText("57").first()).toBeVisible();
  // The new transaction is listed (the order id column is hidden on phones).
  await expect(page.getByText(order.orderId)).toBeAttached();
});

test("closing checkout takes no money and lets the member retry", async ({ page, api }) => {
  api.on("POST /create-order", { body: order });
  await page.goto("/account");
  await buyBasic(page);
  await razorpay(page).opened();

  await razorpay(page).dismiss();

  await expect(page.getByText("Payment cancelled")).toBeVisible();
  await expect(page.getByRole("button", { name: "Buy 21 credits" })).toBeEnabled();
  expect(api.callsTo("POST /buy-interest")).toHaveLength(0);
});

test("a declined payment shows the bank's reason", async ({ page, api }) => {
  api.on("POST /create-order", { body: order });
  await page.goto("/account");
  await buyBasic(page);
  await razorpay(page).opened();

  await razorpay(page).fail("Card declined by issuer");

  await expect(page.getByText("Payment failed")).toBeVisible();
  await expect(page.getByText("Card declined by issuer")).toBeVisible();
  expect(api.callsTo("POST /buy-interest")).toHaveLength(0);
});

test("paid but fulfilment failed: the member is told it will be applied, with the payment id", async ({ page, api }) => {
  api.on("POST /create-order", { body: order });
  api.on("POST /buy-interest", { status: 500, body: { msg: "Could not apply your purchase" } });
  await page.goto("/account");
  await buyBasic(page);
  await razorpay(page).opened();

  await razorpay(page).pay("pay_e2e_42");

  await expect(page.getByText("Payment received, but we couldn't add credits yet")).toBeVisible();
  await expect(page.getByText(/pay_e2e_42/)).toBeVisible();
});

test("no checkout opens when the server refuses to create the order", async ({ page, api }) => {
  api.on("POST /create-order", { status: 400, body: { msg: "Unknown interest pack" } });
  await page.goto("/account");
  await buyBasic(page);

  await expect(page.getByText("Couldn't start payment")).toBeVisible();
  await expect(page.getByText("Unknown interest pack")).toBeVisible();
  expect(await razorpay(page).isOpen()).toBe(false);
});

test("if Razorpay can't load, no order is created", async ({ page, api }) => {
  await page.route("https://checkout.razorpay.com/**", (route) => route.abort());
  api.on("POST /create-order", { body: order });
  await page.goto("/account");
  await buyBasic(page);

  await expect(page.getByText("Payment unavailable")).toBeVisible();
  expect(api.callsTo("POST /create-order")).toHaveLength(0);
});
