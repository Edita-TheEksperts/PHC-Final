// READ-ONLY live checks against the deployed site.
// Deliberately stops before step 3 of the booking flow: step 3 creates a real
// Stripe PaymentIntent, and completing the flow would write a real user.
const { test, expect } = require("@playwright/test");

const SEED = "Alltagsbegleitung und Besorgungen";

function startDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("phc_cookie_consent_v1",
        JSON.stringify({ value: "necessary", at: new Date().toISOString() }));
    } catch {}
  });
});

test("live: key pages respond", async ({ page }) => {
  for (const path of ["/", "/services", "/FAQ", "/login", "/register-client"]) {
    const resp = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(resp?.status(), `${path} status`).toBeLessThan(400);
  }
});

test("live: T1 per-day main services works on the deployed build", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto(`/register-client?service=${encodeURIComponent(SEED)}`);

  await page.getByRole("button", { name: "wöchentlich", exact: true }).click();
  await page.getByPlaceholder("TT.MM.JJJJ").fill(startDate());
  await page.keyboard.press("Escape");

  await page.locator("button", { hasText: /^\s*\+\s*$/ }).first().click();

  const day0 = page.locator("#schedule-day-0");
  const day1 = page.locator("#schedule-day-1");
  await expect(day1).toBeVisible();

  await day0.locator("select").first().selectOption("Freitag");
  await day1.locator("select").first().selectOption("Montag");

  const cat = (day, name) =>
    day.locator("button").filter({ hasText: new RegExp(`^${name}$`) }).first();
  const card = (day, name) =>
    day.locator("button").filter({ hasText: name })
       .filter({ hasText: /Hinzufügen|Ausgewählt/ }).first();

  await card(day0, "Gemeinsames Kochen").click();

  await cat(day1, "Freizeit und Soziale Aktivitäten").click();
  await cat(day1, "Gesundheitsführsorge").click();
  await cat(day1, SEED).click();
  await card(day1, "Gesellschaftspiele").click();

  // Days must be independent.
  await expect(cat(day0, SEED)).toHaveClass(/bg-\[#B99B5F\]/);
  await expect(cat(day0, "Freizeit und Soziale Aktivitäten")).not.toHaveClass(/bg-\[#B99B5F\]/);
  await expect(cat(day1, SEED)).not.toHaveClass(/bg-\[#B99B5F\]/);

  // Grids must not bleed across days.
  await expect(day0.getByText("Gemeinsames Kochen")).toBeVisible();
  await expect(day0.getByText("Gesellschaftspiele")).toHaveCount(0);
  await expect(day1.getByText("Gesellschaftspiele")).toBeVisible();
  await expect(day1.getByText("Gemeinsames Kochen")).toHaveCount(0);

  // Advance to step 2 only (still no writes), to prove validation accepts it.
  await page.getByRole("button", { name: "Weiter", exact: true }).click();
  await expect(page.getByText("Angaben der zu betreuenden Person")).toBeVisible();

  expect(errors, "no runtime page errors").toEqual([]);
});
