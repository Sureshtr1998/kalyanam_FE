import { expect, memberProfile, signIn, test } from "./fixtures";

const summary = {
  kind: "admin",
  members: { total: 10, male: 5, female: 5, complete: 8, incomplete: 2, verified: 7, hidden: 0, new7: 1, new30: 3, active7: 4 },
  signups: [],
  commission: { perMember: 0, referred: 0, paid: 0, due: 0 },
  brokers: { total: 2, pending: 1, approved: 1, suspended: 0 },
  pricingLevel: 2,
};
const period = {
  from: "2026-11-02T00:00:00+05:30",
  to: "2026-11-02T12:00:00+05:30",
  members: { joined: 0, male: 0, female: 0, referred: 0 },
  partnersJoined: 0,
  revenue: { total: 0, refunded: 0, payments: 0, byType: {} },
  commission: 0,
};

const partner = (overrides: Record<string, unknown>) => ({
  email: "p@example.test",
  phone: "9000000001",
  companyName: "Matchmakers",
  createdAt: "2026-11-01T10:00:00Z",
  paidFee: 501,
  referred: 0,
  commissionDue: 0,
  commissionPaid: 0,
  idProofs: [],
  ...overrides,
});
const pending = partner({ _id: "b1", name: "Lakshmi", status: "pending" });
const active = partner({ _id: "b2", name: "Ramesh", status: "approved", referralId: "RAM1234", email: "r@example.test" });

test.beforeEach(async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile({ isAdmin: true }) } });
  api.on("GET /manage/summary", { body: summary });
  api.on("GET /manage/period", { body: period });
});

const openPartners = async (page: import("@playwright/test").Page) => {
  await page.goto("/admin");
  await page.getByRole("tab", { name: /Partners/ }).click();
};

const card = (page: import("@playwright/test").Page, name: string) =>
  page.locator("div.rounded-2xl", { has: page.getByText(name, { exact: true }) }).first();

test("rejecting a pending application needs a reason and refunds it", async ({ page, api }) => {
  let rejected = false;
  api.on("GET /manage/brokers", () => ({
    body: { brokers: [rejected ? { ...pending, status: "rejected", rejectReason: "ID proof is unreadable" } : pending, active] },
  }));
  api.on("POST /manage/brokers/b1/reject", () => {
    rejected = true;
    return { body: { msg: "Rejected · ₹501 refunded" } };
  });

  await openPartners(page);
  // Only pending applications can be rejected.
  await expect(card(page, "Ramesh").getByRole("button", { name: "Reject & refund" })).toHaveCount(0);
  await card(page, "Lakshmi").getByRole("button", { name: "Reject & refund" }).click();

  const dialog = page.getByRole("alertdialog");
  await expect(dialog.getByText("₹501 fee is refunded in full")).toBeVisible();
  const confirm = dialog.getByRole("button", { name: "Reject & refund" });
  await expect(confirm).toBeDisabled();
  await dialog.getByLabel("Reason for rejecting").fill("ID proof is unreadable");
  await confirm.click();

  await expect(page.getByText("Rejected · ₹501 refunded")).toBeVisible();
  expect(api.callsTo("POST /manage/brokers/b1/reject")[0].body).toEqual({ reason: "ID proof is unreadable" });
  await expect(card(page, "Lakshmi").getByText("Rejected · refunded")).toBeVisible();
  await expect(card(page, "Lakshmi").getByText("ID proof is unreadable")).toBeVisible();
  // A rejected application has no further actions.
  await expect(card(page, "Lakshmi").getByRole("button", { name: /Approve|Suspend|Reactivate|Reject/ })).toHaveCount(0);
});

test("a failed refund keeps the application pending and says why", async ({ page, api }) => {
  api.on("GET /manage/brokers", { body: { brokers: [pending] } });
  api.on("POST /manage/brokers/b1/reject", { status: 400, body: { msg: "Insufficient balance" } });

  await openPartners(page);
  await card(page, "Lakshmi").getByRole("button", { name: "Reject & refund" }).click();
  await page.getByRole("alertdialog").getByLabel("Reason for rejecting").fill("Duplicate");
  await page.getByRole("alertdialog").getByRole("button", { name: "Reject & refund" }).click();

  await expect(page.getByText("Insufficient balance")).toBeVisible();
  await expect(card(page, "Lakshmi").getByText("Awaiting approval")).toBeVisible();
});
