// Temporary verification spec for the "different main services on different
// days" fix. Drives the full weekly booking flow end to end, then asserts the
// persisted Schedule rows really do differ per weekday.
const { test, expect } = require("@playwright/test");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SEED = "Alltagsbegleitung und Besorgungen";
const EMAIL = `perday-verify-${Date.now()}@phc.local`;

// Two calendar days out, formatted dd.MM.yyyy (minDate is tomorrow).
function startDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}

test("weekly booking keeps main services separate per day", async ({ page }) => {
  test.setTimeout(300_000);

  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", async (d) => {
    console.log("DIALOG:", d.type(), "->", d.message());
    await d.dismiss();
  });
  page.on("console", (m) => {
    if (m.type() === "error") console.log("CONSOLE ERROR:", m.text());
  });
  page.on("response", async (r) => {
    if (r.url().includes("/api/") && !r.ok()) {
      let body = "";
      try { body = (await r.text()).slice(0, 500); } catch {}
      console.log("API FAIL:", r.status(), r.url(), body);
    }
  });

  await page.goto(`/register-client?service=${encodeURIComponent(SEED)}`);
  await page.evaluate(() => sessionStorage.clear());
  await page.goto(`/register-client?service=${encodeURIComponent(SEED)}`);

  // ---------- Step 1 ----------
  await page.getByRole("button", { name: "wöchentlich", exact: true }).click();

  await page.getByPlaceholder("TT.MM.JJJJ").fill(startDate());
  await page.keyboard.press("Escape");

  // Add a second day.
  await page.locator("button", { hasText: /^\s*\+\s*$/ }).first().click();

  const day0 = page.locator("#schedule-day-0");
  const day1 = page.locator("#schedule-day-1");
  await expect(day1).toBeVisible();

  await day0.locator("select").first().selectOption("Freitag");
  await day1.locator("select").first().selectOption("Montag");

  // --- Day 0 (Freitag): only Alltagsbegleitung ---
  const cat = (day, name) =>
    day.locator("button").filter({ hasText: new RegExp(`^${name}$`) }).first();
  const card = (day, name) =>
    day.locator("button").filter({ hasText: name }).filter({ hasText: /Hinzufügen|Ausgewählt/ }).first();

  await expect(cat(day0, SEED)).toHaveClass(/bg-\[#B99B5F\]/);
  await card(day0, "Gemeinsames Kochen").click();
  await card(day0, "Einkäufe erledigen").click();

  // --- Day 1 (Montag): swap to Freizeit + Gesundheitsführsorge ---
  // This is the exact move that used to be impossible.
  await cat(day1, "Freizeit und Soziale Aktivitäten").click();
  await cat(day1, "Gesundheitsführsorge").click();
  await cat(day1, SEED).click(); // deselect the inherited category

  await card(day1, "Gesellschaftspiele").click();
  await card(day1, "Nahrungsaufnahme").click();

  // ---- THE REGRESSION ASSERTIONS ----
  // Day 0 must be untouched by everything we just did on day 1.
  await expect(cat(day0, SEED)).toHaveClass(/bg-\[#B99B5F\]/);
  await expect(cat(day0, "Freizeit und Soziale Aktivitäten")).not.toHaveClass(/bg-\[#B99B5F\]/);
  await expect(cat(day0, "Gesundheitsführsorge")).not.toHaveClass(/bg-\[#B99B5F\]/);
  await expect(cat(day1, SEED)).not.toHaveClass(/bg-\[#B99B5F\]/);

  // Day 0's grid must not offer day 1's sub-services, and vice versa.
  await expect(day0.getByText("Gemeinsames Kochen")).toBeVisible();
  await expect(day0.getByText("Gesellschaftspiele")).toHaveCount(0);
  await expect(day1.getByText("Gesellschaftspiele")).toBeVisible();
  await expect(day1.getByText("Gemeinsames Kochen")).toHaveCount(0);

  await page.getByRole("button", { name: "Weiter", exact: true }).click();

  // ---------- Step 2 ----------
  await expect(page.getByText("Angaben der zu betreuenden Person")).toBeVisible();
  await page.locator('[name="anrede"]').selectOption("Frau");
  await page.locator('[name="firstName"]').first().fill("Perday");
  await page.locator('[name="lastName"]').first().fill("Verify");
  await page.locator('[name="phone"]').first().fill("0791234567");
  await page.locator('[name="email"]').first().fill(EMAIL);
  await page.locator('[name="street"]').first().fill("Bahnhofstrasse");
  await page.locator('[name="houseNumber"]').first().fill("12a");
  await page.locator('[name="postalCode"]').first().fill("8000");
  await page.locator('[name="city"]').first().fill("Zürich");
  await page.locator('[name="kanton"]').first().selectOption("ZH");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();

  // ---------- Step 3: payment ----------
  await expect(page.getByText("Zahlungsdetails")).toBeVisible();
  const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();
  // The combined CardElement auto-advances between fields, so type through it
  // rather than fill() — fill() on the trailing postal field silently no-ops.
  await frame.locator('[name="cardnumber"]').click();
  await page.keyboard.type("4242424242424242", { delay: 40 });
  await page.keyboard.type("1230", { delay: 40 });
  await page.keyboard.type("123", { delay: 40 });
  const postal = frame.locator('[name="postal"]');
  await postal.click();
  // Test card 4242 is US-issued, so Stripe validates a 5-digit ZIP here —
  // a 4-digit Swiss PLZ is rejected as "unvollständig".
  await page.keyboard.type("12345", { delay: 40 });
  await expect(postal).toHaveValue("12345");
  await page.locator("#agb").check();
  await page.getByRole("button", { name: "Jetzt buchen & weiter" }).click();

  // ---------- Step 4 ----------
  await expect(
    page.getByText("Angaben der zu betreuenden Person (Zusammenfassung)")
  ).toBeVisible({ timeout: 120_000 });
  await page.locator('[name="requestFirstName"]').fill("Perday");
  await page.locator('[name="requestLastName"]').fill("Verify");
  await page.locator('[name="requestPhone"]').fill("0791234567");
  await page.locator('[name="requestEmail"]').fill(EMAIL);
  await page.locator('[name="hasParking"]').selectOption("Nein");
  await page.locator('[name="hasPets"]').selectOption("Nein");
  await page.locator('[name="hasAllergies"]').selectOption("Nein");
  await page.getByRole("button", { name: "Weiter", exact: true }).click();

  // ---------- Step 5 ----------
  await expect(page.getByText("Vielen Dank!")).toBeVisible({ timeout: 120_000 });

  // ---------- DB assertions ----------
  const user = await prisma.user.findUnique({
    where: { email: EMAIL },
    include: { schedules: true },
  });
  expect(user, "user was created").toBeTruthy();

  const freitag = user.schedules.filter((s) => s.day === "Freitag");
  const montag = user.schedules.filter((s) => s.day === "Montag");
  expect(freitag.length).toBeGreaterThan(0);
  expect(montag.length).toBeGreaterThan(0);

  const fServices = [...new Set(freitag.map((s) => s.serviceName))];
  const mServices = [...new Set(montag.map((s) => s.serviceName))];
  const fSubs = [...new Set(freitag.map((s) => s.subServiceName))];
  const mSubs = [...new Set(montag.map((s) => s.subServiceName))];

  console.log("Freitag serviceName:", fServices);
  console.log("Montag  serviceName:", mServices);
  console.log("Freitag subServiceName:", fSubs);
  console.log("Montag  subServiceName:", mSubs);

  expect(fServices).toEqual([SEED]);
  expect(mServices.join()).toContain("Freizeit und Soziale Aktivitäten");
  expect(mServices.join()).toContain("Gesundheitsführsorge");
  expect(mServices.join()).not.toContain(SEED);
  expect(fSubs.join()).not.toContain("Gesellschaftspiele");
  expect(mSubs.join()).not.toContain("Gemeinsames Kochen");

  expect(errors, "no runtime page errors").toEqual([]);
});

test.afterAll(async () => {
  await prisma.$disconnect();
});
