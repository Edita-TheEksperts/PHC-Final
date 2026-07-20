// Temporary verification spec for the Einsätze feedback:
//  T2 "Mitarbeiter zuweisen" button, T3 popup too big,
//  T4 English score labels, T5 popup overflow on small viewports.
const { test, expect } = require("@playwright/test");
const creds = require("./credentials");

async function loginAdmin(page) {
  // The cookie banner is ALSO `fixed inset-0` and sits above the modal —
  // it breaks both element lookups and clicks if left up.
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        "phc_cookie_consent_v1",
        JSON.stringify({ value: "necessary", at: new Date().toISOString() })
      );
    } catch {}
  });
  const baseURL = page.context()._options?.baseURL || "http://localhost:3000";
  const resp = await page.request.post(`${baseURL}/api/login`, {
    data: { email: creds.admin.email, password: creds.admin.password },
  });
  if (!resp.ok()) throw new Error(`Login failed: ${resp.status()} ${await resp.text()}`);
  const body = await resp.json();
  await page.goto("/login");
  await page.evaluate(({ token, role, email }) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("email", email);
  }, { token: body.token, role: body.role, email: creds.admin.email });
}

async function openAssignModal(page) {
  await page.goto("/admin/einsaetze");
  const btn = page.getByRole("button", { name: "Mitarbeiter zuweisen" }).first();
  await expect(btn).toBeVisible({ timeout: 30_000 });
  await btn.click();
  const heading = page.getByRole("heading", { name: "Einsatz Details" });
  await expect(heading).toBeVisible();
  // Anchor to the heading's own card, not to `.fixed.inset-0` (the cookie
  // banner shares that class and would match first).
  return page.locator("div.fixed.inset-0", { has: heading }).locator("> div").first();
}

test.describe("Einsätze assignment popup", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdmin(page);
  });

  test("T2: a Mitarbeiter zuweisen button exists and opens the modal", async ({ page }) => {
    const modal = await openAssignModal(page);
    await expect(modal).toBeVisible();
    await expect(page.getByText("Empfohlene Mitarbeiter")).toBeVisible();
  });

  test("T4: score breakdown is German, not English", async ({ page }) => {
    await openAssignModal(page);

    // Matchmaking is slow — wait for the loading state to clear rather than
    // guessing a fixed delay.
    const t0 = Date.now();
    await expect(page.getByText("Lade Empfehlungen...")).toHaveCount(0, { timeout: 90_000 });
    console.log(`matchmaking resolved in ${Date.now() - t0}ms`);

    const body = await page.locator("body").innerText();
    const hasRecs = !/Keine passenden Empfehlungen gefunden/.test(body);
    test.skip(!hasRecs, "no recommendations in this dataset to inspect");

    for (const en of ["availability:", "region:", "services:", "language:", "experience:", "special:"]) {
      expect(body, `English label "${en}" must be gone`).not.toContain(en);
    }
    expect(body).toMatch(/Verfügbarkeit:|Region \/ Distanz:|Passende Leistungen:|Sprache:|Erfahrung:/);
  });

  for (const vp of [
    { name: "laptop", width: 1440, height: 900 },
    { name: "small laptop", width: 1280, height: 720 },
    { name: "short window", width: 1100, height: 600 },
  ]) {
    test(`T3/T5: modal fits and footer is reachable on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const modal = await openAssignModal(page);
      await page.waitForTimeout(2500);

      const box = await modal.boundingBox();
      expect(box, "modal has a box").toBeTruthy();

      // Must not exceed the viewport in either direction.
      expect(box.height, "modal height within viewport").toBeLessThanOrEqual(vp.height);
      expect(box.y, "modal top on screen").toBeGreaterThanOrEqual(0);
      expect(box.y + box.height, "modal bottom on screen").toBeLessThanOrEqual(vp.height + 1);

      // The page itself must not scroll horizontally.
      const overflowX = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflowX, "no horizontal page overflow").toBeLessThanOrEqual(1);

      // Footer actions must be reachable (scrolling inside the modal is fine).
      const close = page.getByRole("button", { name: "Schliessen" });
      await close.scrollIntoViewIfNeeded();
      await expect(close).toBeVisible();
      await close.click();
      await expect(page.getByRole("heading", { name: "Einsatz Details" })).toHaveCount(0);
    });
  }
});
