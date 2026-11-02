import { expect, memberProfile, signIn, test } from "./fixtures";

const summary = {
  kind: "admin",
  members: { total: 10, male: 5, female: 5, complete: 8, incomplete: 2, verified: 7, hidden: 0, new7: 1, new30: 3, active7: 4 },
  signups: [],
  commission: { perMember: 0, referred: 0, paid: 0, due: 0 },
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

const HOUR = 3600000;
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

const row = (overrides: Record<string, unknown>) => ({
  attempts: 1,
  createdAt: ago(5 * HOUR),
  lastAttemptAt: ago(5 * HOUR),
  status: "not_attempted",
  emailCount: 0,
  convertedAfterEmail: false,
  profileCreatedBy: "Self",
  amount: 351,
  ...overrides,
});

const rows = [
  row({ id: "a1", name: "Ravi Kumar", email: "ravi@example.test", mobile: "9000000001", status: "failed", failureReason: "Payment Timed Out" }),
  row({ id: "a2", name: "Meera Bhat", email: "meera@example.test", mobile: "9000000002", emailCount: 1, lastEmailedAt: ago(2 * HOUR), lastEmailedBy: "Site Admin" }),
  row({ id: "a3", name: "Kiran Rao", email: "kiran@example.test", mobile: "9000000003", emailCount: 3, lastEmailedAt: ago(72 * HOUR) }),
  row({ id: "a4", name: "Sita Devi", email: "sita@example.test", mobile: "9000000004" }),
];

const listBody = (list: Record<string, unknown>[] = rows) => ({
  rows: list,
  total: list.length,
  page: 1,
  totalPages: 1,
  limits: { perPerson: 3, gapHours: 24 },
  summary: { total: 12, emailed: 5, converted: 2, convertedAfterEmail: 1, emailConversionRate: 0.2 },
});

test.beforeEach(async ({ page, api }) => {
  await signIn(page);
  api.on("GET /my-profile", { body: { profile: memberProfile({ isAdmin: true }) } });
  api.on("GET /manage/summary", { body: summary });
  api.on("GET /manage/period", { body: period });
  api.on("GET /manage/abandoned", { body: listBody() });
});

const queryOf = (url: string) => Object.fromEntries(new URL(url).searchParams);

/** A person's row: a table row on wide screens, a card on phones. */
const personRow = (page: import("@playwright/test").Page, name: string) =>
  page.locator("tr:visible, ul[aria-label='Abandoned payments']:visible > li", { hasText: name });

const openTab = async (page: import("@playwright/test").Page) => {
  await page.goto("/admin");
  await page.getByRole("tab", { name: "Abandoned" }).click();
};

test("lists abandoned payments with the default filter and summary numbers", async ({ page, api }) => {
  const queries: Record<string, string>[] = [];
  api.on("GET /manage/abandoned", (req) => {
    queries.push(queryOf(req.url()));
    return { body: listBody() };
  });
  await openTab(page);

  const view = page.locator("table:visible, ul[aria-label='Abandoned payments']:visible");
  await expect(view.getByText("Ravi Kumar")).toBeVisible();
  await expect(view.getByText("Payment Timed Out")).toBeVisible();
  await expect(page.getByText("20%")).toBeVisible();
  // Default view: people who haven't joined.
  expect(queries[0]).toMatchObject({ converted: "no", page: "1" });

  // Send blocks are explained on the row.
  await expect(view.getByText("Emailed in the last 24 hours")).toBeVisible();
  await expect(view.getByText("Emailed 3 times")).toBeVisible();

  await page.getByLabel("Search abandoned payments").fill("9000000001");
  await expect.poll(() => queries.at(-1)?.q).toBe("9000000001");

  await page.getByLabel("From date").fill("2026-10-01");
  await expect.poll(() => queries.at(-1)?.from).toBe("2026-10-01");
});

test("sending one email asks first, then refreshes the row", async ({ page, api }) => {
  let sent = false;
  api.on("POST /manage/abandoned/email", () => {
    sent = true;
    return { body: { results: [{ id: "a1", ok: true, msg: "Sent" }], sent: 1 } };
  });
  api.on("GET /manage/abandoned", () => ({
    body: listBody(sent ? [{ ...rows[0], emailCount: 1, lastEmailedAt: new Date().toISOString() }, ...rows.slice(1)] : rows),
  }));
  await openTab(page);

  const ravi = personRow(page, "Ravi Kumar");
  await ravi.getByRole("button", { name: "Send mail" }).click();
  await expect(page.getByRole("alertdialog")).toContainText("ravi@example.test");
  expect(api.callsTo("POST /manage/abandoned/email")).toHaveLength(0);

  await page.getByRole("button", { name: "Send email" }).click();
  await expect(page.getByText("Email sent")).toBeVisible();
  expect(api.callsTo("POST /manage/abandoned/email")[0].body).toEqual({ ids: ["a1"] });
  await expect(ravi.getByRole("button", { name: "Send mail" })).toBeDisabled();
  await expect(ravi.getByText("1×")).toBeVisible();
});

test("bulk email only offers people who can be emailed", async ({ page, api }) => {
  api.on("POST /manage/abandoned/email", { body: { results: [{ id: "a1", ok: true, msg: "Sent" }, { id: "a4", ok: true, msg: "Sent" }], sent: 2 } });
  await openTab(page);

  await expect(personRow(page, "Meera Bhat").getByRole("checkbox")).toBeDisabled();
  await page.getByRole("checkbox", { name: "Select all that can be emailed" }).click();
  await page.getByRole("button", { name: "Email selected (2)" }).click();
  await page.getByRole("button", { name: "Send emails" }).click();

  await expect(page.getByText("2 emails sent")).toBeVisible();
  expect(api.callsTo("POST /manage/abandoned/email")[0].body).toEqual({ ids: ["a1", "a4"] });
});

test("shows joined people and a WhatsApp link", async ({ page, api }) => {
  api.on("GET /manage/abandoned", {
    body: listBody([
      row({ id: "j1", name: "Anu Joshi", email: "anu@example.test", mobile: "9000000005", status: "paid", emailCount: 1, convertedAt: ago(HOUR), convertedAfterEmail: true }),
      rows[0],
    ]),
  });
  await openTab(page);

  const anu = personRow(page, "Anu Joshi");
  await expect(anu.getByText(/Joined .* after email/)).toBeVisible();
  await expect(anu.getByRole("button", { name: "Send mail" })).toBeDisabled();
  await expect(anu.getByRole("link", { name: "WhatsApp" })).toHaveCount(0);

  const link = personRow(page, "Ravi Kumar").getByRole("link", { name: "WhatsApp" });
  const href = await link.getAttribute("href");
  expect(href).toMatch(/^https:\/\/wa\.me\/919000000001\?text=/);
  expect(decodeURIComponent(href!)).toContain("https://seetharamakalyana.in/?join=1");
});

test("works as cards on a phone", async ({ page, api }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  api.on("POST /manage/abandoned/email", { body: { results: [{ id: "a4", ok: true, msg: "Sent" }], sent: 1 } });
  await openTab(page);

  const cards = page.getByRole("list", { name: "Abandoned payments" });
  await expect(cards.getByRole("listitem")).toHaveCount(4);
  await expect(page.locator("table")).toBeHidden();

  const sita = cards.getByRole("listitem").filter({ hasText: "Sita Devi" });
  await sita.getByRole("button", { name: "Send mail" }).click();
  await page.getByRole("button", { name: "Send email" }).click();
  await expect(page.getByText("Email sent")).toBeVisible();
  expect(api.callsTo("POST /manage/abandoned/email")[0].body).toEqual({ ids: ["a4"] });
});
