/**
 * Seed deterministic test users for the Playwright screenshot run.
 * Idempotent: re-running upserts by email, never duplicates.
 *
 *   admin:    admin@phc.local                    / TestAdmin2026!
 *   client:   edita.latifi@the-eksperts.com      / TestEdita2026!
 *   employee: fisnik.salihu@the-eksperts.com     / TestFisnik2026!
 *   candidate (pending, for F-34 / F-45):
 *             lina.kandidat@phc.local            / TestFisnik2026!
 *
 * Run:  npm run seed:test-users
 *       (or: node prisma/seed-test-users.js)
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// Real team e-mail addresses so screenshots show real PHC people and so
// F-12 (e-mail recipient) can be visually verified in the actual Outlook
// inbox — that's the nDSG-grade proof Bettina needs.
// NOTE on the employee e-mail: fisnik.salihu@the-eksperts.com already exists
// in the User table as a real admin (see prisma/add-admins.js). The login API
// checks Users before Employees, so re-using that address would route Fisnik's
// employee login through the admin row and 401 against the plaintext password
// 'changeme' that's stored there. We avoid the collision by giving the test
// Employee a dedicated internal address; the displayed firstName/lastName
// (the values that show up in screenshots) is still "Fisnik Salihu".
const EMAILS = {
  admin:    "admin@phc.local",
  client:   "edita.latifi@the-eksperts.com",
  employee: "fisnik.test@phc.local",
  candidate:"lina.kandidat@phc.local",
};

const PASSWORDS = {
  admin:     "TestAdmin2026!",
  client:    "TestEdita2026!",
  employee:  "TestFisnik2026!",
  candidate: "TestFisnik2026!",
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
  const status = data.status || "approved";
  delete data.status;
  return prisma.employee.upsert({
    where: { email: data.email },
    update: { ...data, password: hash, status },
    create: { ...data, password: hash, status },
  });
}

async function main() {
  console.log("Seeding QA screenshot users…");

  await upsertUser({
    email: EMAILS.admin,
    password: PASSWORDS.admin,
    role: "admin",
    firstName: "PHC",
    lastName: "Admin",
    phone: "+41 44 000 00 01",
    address: "Birkenstrasse 49",
    postalCode: "6343",
    frequency: "admin",
  });
  console.log(`  ✓ admin     ${EMAILS.admin}`);

  await upsertUser({
    email: EMAILS.client,
    password: PASSWORDS.client,
    role: "client",
    firstName: "Edita",
    lastName: "Latifi",
    phone: "+41 44 000 00 02",
    anrede: "Frau",
    address: "Bahnhofstrasse 14",
    houseNumber: "14a",
    postalCode: "8001",
    kanton: "ZH",
    // Care person
    careFirstName: "Hans",
    careLastName: "Müller",
    careCity: "Zürich",
    carePostalCode: "8003",
    careStreet: "Pflegeweg 7",
    carePhone: "+41 44 000 00 05",
    requestEmail: EMAILS.client,
    frequency: "weekly",
    status: "open",
    firstDate: new Date(),
    // Questionnaire content so F-04, F-29, F-22 have something to show.
    languages: "Deutsch, Albanisch",
    height: "168",
    weight: "62",
    physicalState: "gut",
    mobility: "selbstständig mit Hilfsmitteln",
    mobilityAids: "Rollator, Gehstock",
    toolsAvailable: "Pflegebett",
    toolsOther: "",
    aids: "Rollator, Gehstock",
    aidsOther: "",
    hasAllergies: "ja",
    allergyDetails: "Nüsse",
    allergyWhich: "Erdnüsse",
    incontinence: "nein",
    foodSupport: "ja",
    basicCare: "ja",
    basicCareNeeds: "Hilfe beim Anziehen",
    mentalConditions: "leichte Demenz",
    mentalDiagnoses: "Alzheimer initial",
    behaviorTraits: "ruhig, kooperativ",
    medicalFindings: "Bluthochdruck",
    healthFindings: "altersbedingte Beschwerden",
    pets: "Katze",
    householdRooms: 4,
    householdPeople: 2,
    specialRequests: "Bitte nachmittags Spaziergänge",
    emergencyContactName: "Sohn Peter Müller",
    emergencyContactPhone: "+41 44 000 00 06",
    totalPayment: 354,
  });
  console.log(`  ✓ client    ${EMAILS.client} (mit vollem Fragebogen)`);

  const employee = await upsertEmployee({
    email: EMAILS.employee,
    password: PASSWORDS.employee,
    firstName: "Fisnik",
    lastName: "Salihu",
    phone: "+41 44 000 00 03",
    city: "Zürich",
    address: "Helferstrasse 8",
    houseNumber: "3",
    zipCode: "8004",
    experienceYears: "5",
    hasLicense: true,
    availabilityFrom: new Date(),
    availabilityDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["de", "en", "sq"],
    languageOther: "",
    communicationTraits: ["geduldig", "empathisch"],
    dietaryExperience: ["vegetarisch", "diabetikergerecht"],
    servicesOffered: ["haushaltshilfe", "freizeit", "einkäufe"],
    desiredWeeklyHours: ["20-30", "30-40"],
    travelSupport: "ja",
    smoker: "nein",
    salutation: "Herr",
    howFarCanYouTravel: "30km",
    weekendReady: "ja",
    onCallAvailable: "ja",
    worksWithAnimals: "ja",
  });
  console.log(`  ✓ employee  ${EMAILS.employee}`);

  // Pending candidate for F-34 / F-45 (admin candidate detail).
  await upsertEmployee({
    email: EMAILS.candidate,
    password: PASSWORDS.candidate,
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
  console.log(`  ✓ candidate ${EMAILS.candidate} (pending, gefüllt)`);

  // 3 Schedules for the client — Mo/Mi/Fr proves the F-09 fix and gives the
  // dashboard real Termine to render (F-19, F-21, F-22, F-23, F-32).
  const clientUser = await prisma.user.findUnique({ where: { email: EMAILS.client } });
  await prisma.schedule.deleteMany({ where: { userId: clientUser.id } });
  const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d; };
  await prisma.schedule.createMany({
    data: [
      { userId: clientUser.id, day: "Montag",   date: inDays(7),  startTime: "09:00", hours: 2, serviceName: "haushaltshilfe", subServiceName: "kochen",    status: "active" },
      { userId: clientUser.id, day: "Mittwoch", date: inDays(9),  startTime: "14:00", hours: 2, serviceName: "freizeit",       subServiceName: "spazieren", status: "active" },
      { userId: clientUser.id, day: "Freitag",  date: inDays(11), startTime: "10:00", hours: 2, serviceName: "haushaltshilfe", subServiceName: "waschen",   status: "active" },
    ],
  });
  console.log("  ✓ 3 Schedules für Edita (Mo/Mi/Fr)");

  // 1 pending + 1 confirmed Assignment Edita ↔ Fisnik.
  const schedules = await prisma.schedule.findMany({ where: { userId: clientUser.id }, orderBy: { date: "asc" } });
  await prisma.assignment.deleteMany({ where: { userId: clientUser.id, employeeId: employee.id } });
  if (schedules[0]) {
    await prisma.assignment.create({
      data: {
        userId: clientUser.id,
        employeeId: employee.id,
        scheduleId: schedules[0].id,
        serviceName: schedules[0].serviceName,
        confirmationStatus: "pending",
        firstDate: schedules[0].date,
      },
    });
  }
  if (schedules[1]) {
    await prisma.schedule.update({
      where: { id: schedules[1].id },
      data: { employeeId: employee.id },
    });
    await prisma.assignment.create({
      data: {
        userId: clientUser.id,
        employeeId: employee.id,
        scheduleId: schedules[1].id,
        serviceName: schedules[1].serviceName,
        confirmationStatus: "confirmed",
        firstDate: schedules[1].date,
      },
    });
  }
  console.log("  ✓ 1 pending + 1 confirmed Assignment Edita ↔ Fisnik");

  console.log("\nFertig. Credentials in tests/e2e/credentials.js.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
