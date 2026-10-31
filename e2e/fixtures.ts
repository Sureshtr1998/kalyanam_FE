import { test as base, expect, type Page, type Request, type Route } from "@playwright/test";

export const API = "http://api.e2e.test/api";
export const RAZORPAY_KEY = "rzp_test_e2e";

type Reply = { status?: number; body?: unknown };
type Handler = (req: Request) => Reply | Promise<Reply>;

/**
 * A fake backend: tests register replies per "METHOD /path", every call is
 * recorded, and anything unregistered fails loudly with a 501.
 */
export class FakeApi {
  private handlers = new Map<string, Handler>();
  readonly calls: { method: string; path: string; body: unknown }[] = [];

  on(route: string, reply: Reply | Handler) {
    this.handlers.set(route, typeof reply === "function" ? reply : () => reply);
    return this;
  }

  callsTo(route: string) {
    const [method, path] = route.split(" ");
    return this.calls.filter((c) => c.method === method && c.path === path);
  }

  async handle(route: Route) {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = req.method();
    if (method === "OPTIONS") return route.fulfill({ status: 204, headers: cors });
    let body: unknown = null;
    try {
      body = req.postDataJSON();
    } catch {
      body = req.postData();
    }
    this.calls.push({ method, path, body });
    const handler = this.handlers.get(`${method} ${path}`);
    if (!handler) {
      return route.fulfill({ status: 501, headers: cors, json: { msg: `No fake for ${method} ${path}` } });
    }
    const { status = 200, body: json = {} } = await handler(req);
    return route.fulfill({ status, headers: cors, json });
  }
}

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET,POST,PUT,DELETE",
};

/**
 * Stand-in for https://checkout.razorpay.com/v1/checkout.js. It records the
 * options the app opens checkout with, and lets a test play the customer:
 * pay, close the popup, or have the bank decline.
 */
const RAZORPAY_STUB = `
  window.Razorpay = function (options) {
    this.options = options;
    this.events = {};
    window.__rzp = this;
  };
  window.Razorpay.prototype.on = function (event, cb) { this.events[event] = cb; };
  window.Razorpay.prototype.open = function () {
    window.__rzpOpened = JSON.parse(JSON.stringify(this.options));
  };
`;

/** What the stub leaves on `window` (functions only exist in the page, not in __rzpOpened). */
interface StubWindow {
  __rzpOpened?: Record<string, unknown>;
  __rzp: {
    options: {
      order_id: string;
      handler: (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void;
      modal: { ondismiss: () => void };
    };
    events: Record<string, (resp: { error: { description: string } }) => void>;
  };
}
// page.evaluate callbacks are serialised into the page, so each one casts `window` itself.

export const razorpay = (page: Page) => ({
  /** Options passed to `new Razorpay(...)`, once checkout opened. */
  opened: async () => {
    await expect.poll(() => page.evaluate(() => !!(window as unknown as StubWindow).__rzpOpened)).toBe(true);
    return (await page.evaluate(() => (window as unknown as StubWindow).__rzpOpened)) as Record<string, unknown>;
  },
  isOpen: () => page.evaluate(() => !!(window as unknown as StubWindow).__rzpOpened),
  pay: (paymentId = "pay_e2e_1", signature = "sig_e2e_1") =>
    page.evaluate(
      ([paymentId, signature]) => {
        const rzp = (window as unknown as StubWindow).__rzp;
        rzp.options.handler({
          razorpay_order_id: rzp.options.order_id,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
        });
      },
      [paymentId, signature]
    ),
  dismiss: () => page.evaluate(() => (window as unknown as StubWindow).__rzp.options.modal.ondismiss()),
  fail: (description: string) =>
    page.evaluate(
      (description) => (window as unknown as StubWindow).__rzp.events["payment.failed"]({ error: { description } }),
      description
    ),
});

export const memberProfile = (overrides: Record<string, unknown> = {}) => ({
  _id: "u1",
  hasCompleteProfile: true,
  isVerified: true,
  basic: {
    fullName: "Asha Rao",
    email: "asha@example.test",
    mobile: "9876500001",
    gender: "Female",
    uniqueId: "SRK001",
    images: [],
  },
  personal: {},
  family: {},
  partner: {},
  interests: { totalNoOfInterest: 36, sent: [], received: [], viewed: [] },
  transactions: [],
  astrology: [],
  ...overrides,
});

export const signIn = async (page: Page, session: Record<string, unknown> = {}) => {
  await page.addInitScript((session) => {
    // Init scripts re-run on every navigation; seed once so a sign-out sticks.
    if (sessionStorage.getItem("e2e-seeded")) return;
    sessionStorage.setItem("e2e-seeded", "1");
    localStorage.setItem(
      "user_login_token",
      JSON.stringify({ id: "u1", fullName: "Asha Rao", email: "asha@example.test", role: "USER", token: "jwt-e2e", ...session })
    );
  }, session);
};

export const test = base.extend<{ api: FakeApi }>({
  // "provide" rather than Playwright's usual "use", which the React hooks lint rule mistakes for a hook.
  api: async ({ page }, provide) => {
    const api = new FakeApi();
    await page.route(`${API}/**`, (route) => api.handle(route));
    await page.route("https://checkout.razorpay.com/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: RAZORPAY_STUB })
    );
    // Keep runs hermetic and fast: no fonts, analytics or place search from the internet.
    await page.route(/^https:\/\/(fonts\.(googleapis|gstatic)\.com|connect\.facebook\.net|www\.facebook\.com|photon\.komoot\.io)\//, (route) =>
      route.abort()
    );
    await provide(api);
  },
});

export { expect };
