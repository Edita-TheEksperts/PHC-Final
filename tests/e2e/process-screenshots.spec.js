// Process-oriented screenshot capture for the 12.07.2026 QA package (Part B).
// Produces screenshots/<NAME>.png using the QA's exact filenames, grouped by
// the 11 core processes. Reuses the same login/softShot approach as
// screenshots.spec.js.
//
// Coverage philosophy:
//   • Every REACHABLE screen is captured for real (login pages, funnel steps,
//     dashboards, admin views, the new A4 receipts card, dialogs/modals).
//   • Screens that require a completed Stripe payment, a real e-mail inbox, or
//     the not-yet-built A7 series behaviour are SKIPPED with an explicit reason
//     and appear as labelled placeholders in the generated document.

const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const creds = require("./credentials");

const SCREENSHOT_DIR = path.resolve(__dirname, "..", "..", "screenshots");
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
const shotPath = (name) => path.join(SCREENSHOT_DIR, `${name}.png`);

async function dismissCookieBanner(page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        "phc_cookie_consent_v1",
        JSON.stringify({ value: "necessary", at: new Date().toISOString() })
      );
    } catch {}
  });
}

async function login(page, role) {
  await dismissCookieBanner(page);
  const c = creds[role];
  const baseURL = page.context()._options?.baseURL || "http://localhost:3000";
  const resp = await page.request.post(`${baseURL}/api/login`, {
    data: { email: c.email, password: c.password },
  });
  if (!resp.ok()) throw new Error(`Login failed for ${role}: ${resp.status()}`);
  const body = await resp.json();
  await page.goto("/login");
  await page.evaluate(({ token, role, email }) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("email", email);
  }, { token: body.token, role: body.role, email: c.email });
}

// Minimal capture for heavy pages (client dashboard) whose data fetch leaves a
// persistent skeleton — softShot's waitForFunction loops hang there. Mirrors the
// diagnostic path that reliably works: fixed settle + animation-frozen shot.
async function plainShot(page, name, delay = 4000) {
  await page.waitForTimeout(delay);
  await page.screenshot({ path: shotPath(name), fullPage: false, animations: "disabled", timeout: 15000 }).catch(() => {});
}

async function softShot(page, name, opts = {}) {
  await page.waitForLoadState("domcontentloaded").catch(() => {});
  await page.waitForFunction(() => {
    const c = Array.from(document.querySelectorAll(".animate-spin, .animate-pulse"));
    if (c.length === 0) return true;
    return c.every((s) => {
      const r = s.getBoundingClientRect();
      const cs = window.getComputedStyle(s);
      return r.width === 0 || r.height === 0 || cs.display === "none" || cs.visibility === "hidden";
    });
  }, { timeout: 12000 }).catch(() => {});
  await page.waitForFunction(
    () => !/(?:Wird geladen|Lade\s|Lädt|Loading)/i.test(document.body.textContent || ""),
    { timeout: 10000 }
  ).catch(() => {});
  await page.waitForTimeout(opts.delay ?? 2200);
  await page.screenshot({ path: shotPath(name), fullPage: opts.fullPage !== false });
}

// ── 1. Login & session ──────────────────────────────────────────────────
test.describe("1. Login & Session", () => {
  test("01-03_login_rollen — login page", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/login");
    await softShot(page, "01-03_login_rollen");
  });

  test("04_login_fehler — wrong password", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/login");
    await page.waitForTimeout(1500);
    await page.locator('input[type="email"], input[name="email"]').first().fill("admin@phc.local").catch(() => {});
    await page.locator('input[type="password"], input[name="password"]').first().fill("falschesPasswort").catch(() => {});
    await page.locator('button[type="submit"], button:has-text("Anmelden"), button:has-text("Login")').first().click().catch(() => {});
    await page.waitForTimeout(2500);
    await softShot(page, "04_login_fehler", { delay: 500 });
  });

  test("05_pw_vergessen — forgot password form", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/forgot-password");
    await softShot(page, "05_pw_vergessen");
  });

  test("06_logout — redirect to login after token cleared", async ({ page }) => {
    await login(page, "client");
    await page.goto("/client-dashboard");
    await page.waitForTimeout(1500);
    await page.evaluate(() => { localStorage.clear(); });
    await page.goto("/client-dashboard");
    await page.waitForTimeout(2000);
    await softShot(page, "06_logout", { delay: 500 });
  });

  test("07_session_timeout — no token → login", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/client-dashboard");
    await page.waitForTimeout(2500);
    await softShot(page, "07_session_timeout", { delay: 500 });
  });
});

// ── 2. Booking funnel ───────────────────────────────────────────────────
test.describe("2. Buchung (Funnel)", () => {
  for (const [step, name] of [[1, "10_funnel_s1"], [2, "10_funnel_s2"], [3, "10_funnel_s3"], [4, "10_funnel_s4"]]) {
    test(`${name}`, async ({ page }) => {
      await dismissCookieBanner(page);
      await page.goto(`/register-client?step=${step}`);
      await page.waitForTimeout(3000);
      await softShot(page, name);
    });
  }

  test("14_termine_serie — client termine list", async ({ page }) => {
    await login(page, "client");
    await page.goto("/client-dashboard", { waitUntil: "domcontentloaded" });
    await plainShot(page, "14_termine_serie");
  });
});

// ── 3. Payment (Stripe) ─────────────────────────────────────────────────
test.describe("3. Zahlung (Stripe)", () => {
  test("17_karte — change card modal", async ({ page }) => {
    await login(page, "client");
    await page.goto("/dashboard/finanzen");
    await page.waitForTimeout(2500);
    await page.locator('button:has-text("Karte ändern"), button:has-text("Karte hinzufügen")').first().click().catch(() => {});
    await page.waitForTimeout(1500);
    await softShot(page, "17_karte", { delay: 500 });
  });

  test("18-19_quittungen — receipts section (A4)", async ({ page }) => {
    await login(page, "client");
    await page.goto("/dashboard/finanzen");
    await page.waitForTimeout(2500);
    // Bring the new receipts card into view before the full-page shot.
    await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll("h3")).find((e) => /Quittungen/i.test(e.textContent || ""));
      h?.scrollIntoView({ block: "center" });
    });
    await page.waitForTimeout(1200);
    await softShot(page, "18-19_quittungen");
  });
});

// ── 4. Re-booking (existing client) ─────────────────────────────────────
test.describe("4. Neubuchung", () => {
  test("20-21_neubuchung — booking widget", async ({ page }) => {
    await login(page, "client");
    await page.goto("/client-dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Neuen Termin"), button:has-text("Termin buchen"), button:has-text("buchen")').first().click({ timeout: 4000 }).catch(() => {});
    await plainShot(page, "20-21_neubuchung", 1800);
  });

  test("23_neubuchung_admin — admin einsätze", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/einsaetze");
    await softShot(page, "23_neubuchung_admin");
  });
});

// ── 5. Cancellation ─────────────────────────────────────────────────────
test.describe("5. Storno", () => {
  test("24-27_storno — cancellation fee dialog", async ({ page }) => {
    await login(page, "client");
    await page.goto("/client-dashboard", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    await page.waitForTimeout(3000);
    await page.locator('button:has-text("Stornieren"), button:has-text("Storno")').first().click({ timeout: 4000 }).catch(() => {});
    await plainShot(page, "24-27_storno", 1800);
  });
});

// ── 6. Termination (CHF 300) ────────────────────────────────────────────
test.describe("6. Kündigung", () => {
  test("29-30_kuendigung — termination dialog", async ({ page }) => {
    await login(page, "client");
    await page.goto("/dashboard/kundigung");
    await softShot(page, "29-30_kuendigung");
  });

  test("32-33_ehemalige — former clients", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/ehemalige-kunden");
    await softShot(page, "32-33_ehemalige");
  });
});

// ── 7. Assignment & matching ────────────────────────────────────────────
test.describe("7. Zuweisung & Matching", () => {
  test("34-36_matching — recommendations dialog", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/einsaetze");
    await page.waitForTimeout(3000);
    // Try to open the first open (unassigned) Einsatz to reveal recommendations.
    await page.locator('text=/Offen|Nicht zugewiesen|Zuweisen|Details/i').first().click().catch(() => {});
    await page.waitForTimeout(2000);
    await softShot(page, "34-36_matching");
  });

  test("52_ma_dashboard — employee dashboard", async ({ page }) => {
    await login(page, "employee");
    await page.goto("/employee-dashboard");
    await softShot(page, "52_ma_dashboard");
  });
});

// ── 9. Employee application ─────────────────────────────────────────────
test.describe("9. Mitarbeiter / Bewerbung", () => {
  test("47-48_bewerbung — application funnel (stacked)", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/employee-register");
    await page.waitForTimeout(3000);
    await page.evaluate(() => document.querySelectorAll("[hidden]").forEach((el) => el.removeAttribute("hidden")));
    await page.waitForTimeout(500);
    await softShot(page, "47-48_bewerbung");
  });

  test("49_kandidat_detail — candidate detail (Lina)", async ({ page }) => {
    await login(page, "admin");
    const resp = await page.request.get("/api/admin/employees");
    if (!resp.ok()) { test.skip(true, "employees list unavailable"); return; }
    const data = await resp.json();
    const list = Array.isArray(data) ? data : data.employees || [];
    const cand = list.find((e) => e.email === "lina.kandidat@phc.local") || list[0];
    if (!cand) { test.skip(true, "no candidate seed"); return; }
    await page.goto(`/admin/employees/${cand.id}`);
    await softShot(page, "49_kandidat_detail");
  });

  test("50-51_genehmigung — set-password page", async ({ page }) => {
    await dismissCookieBanner(page);
    await page.goto("/set-password?email=lina.kandidat%40phc.local&token=demo");
    await softShot(page, "50-51_genehmigung");
  });
});

// ── 10. Admin processes ─────────────────────────────────────────────────
test.describe("10. Admin & Verwaltung", () => {
  test("53-54_admin_profil — settings (A3 correct admin)", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/settings");
    await softShot(page, "53-54_admin_profil");
  });

  test("55-56_admin_verwaltung — client management", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/kunden");
    await softShot(page, "55-56_admin_verwaltung");
  });

  test("59-60_admin_rest — finance / vouchers", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/finanzen");
    await softShot(page, "59-60_admin_rest");
  });

  test("67_mail_vorlagen — email template editor", async ({ page }) => {
    await login(page, "admin");
    await page.goto("/admin/email-templates");
    await softShot(page, "67_mail_vorlagen");
  });
});

// ── Not auto-capturable — documented as manual / pending A7 ──────────────
test.describe("Manual or A7-pending (skipped with reason)", () => {
  const manual = {
    "15_zahlung_ok": "Requires a completed Stripe payment in the CardElement iframe — capture live.",
    "16_zahlung_abgelehnt": "Requires driving Stripe decline card 4000...0002 live.",
    "22_neubuchung_reload": "Post-payment reload state — capture live after a real booking.",
    "28_storno_mail": "E-mail — needs a real inbox (Edita's Outlook).",
    "31_kuendigung_frei": "Depends on a >30-day contract in the DB — capture live.",
    "37_anfrage": "Mutates data (sends Anfrage) — capture live during a real run.",
    "38-39_serie_annahme": "A7 series behaviour is DEFERRED (not yet built).",
    "38b_serie_mail": "A7 + e-mail — pending A7 build and a real inbox.",
    "40_kunde_serie": "A7 series behaviour — pending A7 build.",
    "41_serie_abgelehnt": "A7 series behaviour — pending A7 build.",
    "42_kein_match": "Needs a client with no matching employee — capture live.",
    "43_absenz_meldung": "A7 replacement flow — pending A7 build.",
    "44_ersatz_matching": "A7 replacement flow — pending A7 build.",
    "45_ersatz_bestaetigt": "A7 replacement flow — pending A7 build.",
    "46_urlaub_matching": "Needs an employee vacation over the booked period — capture live.",
    "57_kunde_urlaub": "Client vacation entry mutates data — capture live.",
    "58_ma_urlaub": "Employee vacation request mutates data — capture live.",
    "61-62_mail_buchung": "E-mail — needs a real inbox.",
    "63-64_mail_zuweisung": "E-mail — needs a real inbox.",
    "65-66_mail_rest": "E-mail — needs a real inbox.",
    "67_mail_vorlagen": "Admin e-mail template editor — capture live (admin/email-templates).",
  };
  for (const [name, reason] of Object.entries(manual)) {
    test(`${name} — manual/pending`, async () => { test.skip(true, `${name}: ${reason}`); });
  }
});
