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

  await upsertEmployee({
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

  console.log("\nDone. Credentials are in tests/e2e/credentials.js.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
