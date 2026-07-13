// A7 series-flow screenshot capture. Seeds an isolated demo client with a
// Mon/Wed/Fri series, drives assign → accept → absence via the real APIs, and
// screenshots the resulting UI states. Cleans up all seeded rows afterwards.
//
// Produces: 38-39_serie_annahme, 40_kunde_serie, 43_absenz_meldung, 44_ersatz_matching.

require("dotenv").config();
const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const creds = require("./credentials");

const prisma = new PrismaClient();
const SHOT_DIR = path.resolve(__dirname, "..", "..", "screenshots");
const shotPath = (n) => path.join(SHOT_DIR, `${n}.png`);
const BASE = "http://localhost:3000";

const CLIENT_EMAIL = "a7demo-client@phc.local";
const CLIENT_PW = "A7demo2026!";
const ctx = {}; // shared: userId, scheduleIds, empId, adminToken

async function loginAs(page, email, password, opts = {}) {
  const r = await page.request.post(`${BASE}/api/login`, { data: { email, password } });
  const b = await r.json();
  // Inject auth via addInitScript so localStorage is set BEFORE any page script.
  // The employee dashboard has a strict isTokenExpired guard that rejects an
  // injected token; its APIs only need the email, so omit the token there.
  await page.addInitScript(({ t, role, e }) => {
    try {
      if (t) localStorage.setItem("userToken", t);
      localStorage.setItem("userRole", role);
      localStorage.setItem("email", e);
      localStorage.setItem("employeeEmail", e);
      localStorage.setItem("phc_cookie_consent_v1", JSON.stringify({ value: "necessary" }));
    } catch {}
  }, { t: opts.noToken ? "" : b.token, role: b.role, e: email });
}
async function shot(page, name, delay = 3500) {
  await page.waitForTimeout(delay);
  await page.screenshot({ path: shotPath(name), fullPage: false, animations: "disabled", timeout: 15000 }).catch(() => {});
}

test.beforeAll(async ({ request }) => {
  const emp = await prisma.employee.findUnique({ where: { email: creds.employee.email }, select: { id: true, email: true } });
  ctx.empId = emp.id; ctx.empEmail = emp.email;

  const user = await prisma.user.create({
    data: { email: CLIENT_EMAIL, address: "Serienweg 1", frequency: "wöchentlich", role: "client", firstName: "Serie", lastName: "Demo", passwordHash: await bcrypt.hash(CLIENT_PW, 10) },
  });
  ctx.userId = user.id;

  const fut = (d) => { const x = new Date(); x.setDate(x.getDate() + d); x.setHours(9, 0, 0, 0); return x; };
  const mk = (day, date) => prisma.schedule.create({ data: { day, startTime: "09:00", hours: 2, userId: user.id, date, status: "active", serviceName: "Grundpflege" } });
  const s1 = await mk("Montag", fut(7));
  const s2 = await mk("Mittwoch", fut(9));
  await mk("Freitag", fut(11));
  ctx.s1 = s1.id; ctx.s2 = s2.id;

  const login = await request.post(`${BASE}/api/login`, { data: { email: creds.admin.email, password: creds.admin.password } });
  ctx.adminToken = (await login.json()).token;
  // Series assign (admin)
  await request.post(`${BASE}/api/admin/assign-employee`, {
    headers: { Authorization: `Bearer ${ctx.adminToken}` },
    data: { appointmentId: ctx.s1, userId: ctx.userId, employeeId: ctx.empId },
  });
});

test.afterAll(async () => {
  if (ctx.userId) {
    await prisma.assignment.deleteMany({ where: { userId: ctx.userId } }).catch(() => {});
    await prisma.schedule.deleteMany({ where: { userId: ctx.userId } }).catch(() => {});
    await prisma.user.delete({ where: { id: ctx.userId } }).catch(() => {});
  }
  await prisma.$disconnect();
});

test("38-39_serie_annahme — employee sees the named series (pending)", async ({ page }) => {
  await loginAs(page, creds.employee.email, creds.employee.password, { noToken: true });
  await page.goto("/employee-dashboard?tab=zuweisungen", { waitUntil: "domcontentloaded" });
  await shot(page, "38-39_serie_annahme");
});

test("40_kunde_serie — client sees all series dates confirmed", async ({ page, request }) => {
  await request.post(`${BASE}/api/employee/confirm-assignment`, { data: { assignmentId: (await prisma.assignment.findFirst({ where: { userId: ctx.userId, scheduleId: null }, orderBy: { createdAt: "desc" } })).id, action: "confirmed" } });
  await loginAs(page, CLIENT_EMAIL, CLIENT_PW);
  await page.goto("/client-dashboard", { waitUntil: "domcontentloaded" });
  await shot(page, "40_kunde_serie");
});

test("43_absenz_meldung — employee confirmed einsätze with Absenz melden", async ({ page }) => {
  await loginAs(page, creds.employee.email, creds.employee.password, { noToken: true });
  await page.goto("/employee-dashboard?tab=einsaetze", { waitUntil: "domcontentloaded" });
  await shot(page, "43_absenz_meldung");
});

test("44_ersatz_matching — admin sees the released appointment (Ersatz nötig)", async ({ page, request }) => {
  // Release S2 as the primary employee
  await request.post(`${BASE}/api/employee/release-schedule`, { data: { email: ctx.empEmail, scheduleId: ctx.s2 } });
  await loginAs(page, creds.admin.email, creds.admin.password);
  await page.goto("/admin/einsaetze", { waitUntil: "domcontentloaded" });
  await shot(page, "44_ersatz_matching", 7000);
});
