/**
 * Seed three deterministic test users for the Playwright screenshot run.
 * Idempotent: re-running upserts by email, never duplicates.
 *
 *   admin:    qa-admin@phc.local      / TestAdmin2026!
 *   client:   qa-client@phc.local     / TestClient2026!
 *   employee: qa-employee@phc.local   / TestEmployee2026!
 *
 * Run:  node prisma/seed-test-users.js
 * Or:   npm run seed:test-users
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const PASSWORDS = {
  admin: "TestAdmin2026!",
  client: "TestClient2026!",
  employee: "TestEmployee2026!",
};

async function upsertUser(data) {
  const hash = await bcrypt.hash(data.password, 10);
  delete data.password;
  return prisma.user.upsert({
    where: { email: data.email },
    update: { ...data, passwordHash: hash },
    create: { ...data, passwordHash: hash },
  });
}

async function upsertEmployee(data) {
  const hash = await bcrypt.hash(data.password, 10);
  delete data.password;
  return prisma.employee.upsert({
    where: { email: data.email },
    update: { ...data, password: hash, status: "approved" },
    create: { ...data, password: hash, status: "approved" },
  });
}

async function main() {
  console.log("Seeding QA screenshot users…");

  await upsertUser({
    email: "qa-admin@phc.local",
    password: PASSWORDS.admin,
    role: "admin",
    firstName: "QA",
    lastName: "Admin",
    phone: "+41 44 000 00 01",
    address: "Teststrasse 1",
    postalCode: "8001",
    frequency: "admin",
  });
  console.log("  ✓ admin   qa-admin@phc.local");

  await upsertUser({
    email: "qa-client@phc.local",
    password: PASSWORDS.client,
    role: "client",
    firstName: "Maria",
    lastName: "Muster",
    phone: "+41 44 000 00 02",
    anrede: "Frau",
    address: "Buchungsstrasse 5",
    houseNumber: "12a",
    postalCode: "8003",
    kanton: "ZH",
    careCity: "Zürich",
    carePostalCode: "8003",
    careFirstName: "Hans",
    careLastName: "Muster",
    requestEmail: "qa-client@phc.local",
    frequency: "weekly",
    status: "open",
  });
  console.log("  ✓ client  qa-client@phc.local");

  const employee = await upsertEmployee({
    email: "qa-employee@phc.local",
    password: PASSWORDS.employee,
    firstName: "Anna",
    lastName: "Helfer",
    phone: "+41 44 000 00 03",
    city: "Zürich",
    address: "Helferstrasse 8",
    houseNumber: "3",
    zipCode: "8004",
    experienceYears: "3",
    hasLicense: true,
    availabilityFrom: new Date(),
    availabilityDays: ["Mon", "Wed", "Fri"],
    languages: ["de"],
    servicesOffered: [],
  });
  console.log("  ✓ employee qa-employee@phc.local");

  // Filled candidate for F-34 / F-45 — has all the bewerbungs fields populated
  // so the admin detail screen has something to show.
  await upsertEmployee({
    email: "qa-candidate@phc.local",
    password: PASSWORDS.employee,
    firstName: "Lina",
    lastName: "Kandidat",
    phone: "+41 44 000 00 04",
    city: "Bern",
    address: "Kandidatenweg 12",
    houseNumber: "12",
    zipCode: "3000",
    experienceYears: "5",
    hasLicense: true,
    availabilityFrom: new Date(),
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["de", "fr", "it"],
    languageOther: "Albanisch",
    communicationTraits: ["geduldig", "empathisch", "humorvoll"],
    dietaryExperience: ["vegetarisch", "diabetikergerecht"],
    servicesOffered: ["haushaltshilfe", "freizeit"],
    desiredWeeklyHours: ["20-30", "30-40"],
    travelSupport: "ja",
    smoker: "nein",
    salutation: "Frau",
    howFarCanYouTravel: "30km",
    weekendReady: "ja",
    onCallAvailable: "ja",
    worksWithAnimals: "ja",
    status: "pending",
  });
  console.log("  ✓ candidate qa-candidate@phc.local (filled fields)");

  // Schedules for qa-client: Mo / Mi / Fr — proves F-09 fix (distinct weekdays)
  // and gives the dashboard real Termine to render (F-19, F-21, F-22, F-23).
  const clientUser = await prisma.user.findUnique({ where: { email: "qa-client@phc.local" } });
  await prisma.schedule.deleteMany({ where: { userId: clientUser.id } });
  const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
  await prisma.schedule.createMany({
    data: [
      { userId: clientUser.id, day: "Montag",   date: inDays(7),  startTime: "09:00", hours: 2, serviceName: "haushaltshilfe", subServiceName: "kochen",     status: "active" },
      { userId: clientUser.id, day: "Mittwoch", date: inDays(9),  startTime: "14:00", hours: 2, serviceName: "freizeit",       subServiceName: "spazieren", status: "active" },
      { userId: clientUser.id, day: "Freitag",  date: inDays(11), startTime: "10:00", hours: 2, serviceName: "haushaltshilfe", subServiceName: "waschen",    status: "active" },
    ],
  });
  console.log("  ✓ 3 schedules for qa-client (Mo/Mi/Fr)");

  // Pending assignment — proves F-10 / F-11 / F-13-18 dedupe
  const firstSchedule = await prisma.schedule.findFirst({ where: { userId: clientUser.id }, orderBy: { date: "asc" } });
  await prisma.assignment.deleteMany({ where: { userId: clientUser.id, employeeId: employee.id } });
  await prisma.assignment.create({
    data: {
      userId: clientUser.id,
      employeeId: employee.id,
      scheduleId: firstSchedule?.id ?? null,
      serviceName: firstSchedule?.serviceName ?? null,
      confirmationStatus: "pending",
      firstDate: firstSchedule?.date ?? null,
    },
  });
  console.log("  ✓ 1 pending Assignment qa-client → qa-employee");

  console.log("\nDone. Credentials are in tests/e2e/credentials.js.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
