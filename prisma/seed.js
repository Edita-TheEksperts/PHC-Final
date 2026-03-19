import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function safeCreate(model, where, data) {
  const found = await model.findUnique({ where });
  if (found) return found;
  return model.create({ data });
}

async function main() {
  console.log("🌱 Safe seeding…");

  // ----------------------------------------
  // SERVICES
  // ----------------------------------------
  const haushalt = await safeCreate(prisma.service, { name: "haushaltshilfe" }, { name: "haushaltshilfe" });
  const einkauf = await safeCreate(prisma.service, { name: "einkäufe" }, { name: "einkäufe" });
  const freizeit = await safeCreate(prisma.service, { name: "freizeit" }, { name: "freizeit" });
  const begleitung = await safeCreate(prisma.service, { name: "terminbegleitung" }, { name: "terminbegleitung" });

  // ----------------------------------------
  // SUBSERVICES
  // ----------------------------------------
  const unterhaltung = await safeCreate(prisma.subService, { name: "unterhaltung" }, { name: "unterhaltung", serviceId: freizeit.id });
  const spazieren = await safeCreate(prisma.subService, { name: "spazieren" }, { name: "spazieren", serviceId: freizeit.id });
  const kochen = await safeCreate(prisma.subService, { name: "kochen" }, { name: "kochen", serviceId: haushalt.id });
  const waschen = await safeCreate(prisma.subService, { name: "waschen" }, { name: "waschen", serviceId: haushalt.id });
  const terminFahrt = await safeCreate(prisma.subService, { name: "fahrt" }, { name: "fahrt", serviceId: begleitung.id });
  const einkaufBegleitung = await safeCreate(prisma.subService, { name: "shoppingAssist" }, { name: "shoppingAssist", serviceId: einkauf.id });

  // ----------------------------------------
  // CLIENTS (4 TEST CLIENTS FOR MATCHING)
  // ----------------------------------------
  const clients = [
    // SUPER MATCH (Pets + DE + Haushalt + Freizeit)
    {
      email: "clientA@test.com",
      role: "client",
      status: "open",

      firstName: "Hans",
      lastName: "Müller",
      phone: "123456789",

      address: "Teststrasse 1",
      frequency: "weekly",

      firstDate: new Date("2025-02-10"),
      careCity: "Zürich",
      carePostalCode: "8001",
      kanton: "ZH",

      pets: "ja",
      languages: "de",

      services: { connect: [{ id: haushalt.id }, { id: freizeit.id }] },
      subServices: { connect: [{ id: kochen.id }, { id: spazieren.id }] },
    },

    // GOOD MATCH (Haushalt + BodyCare)
    {
      email: "clientB@test.com",
      role: "client",
      status: "open",

      firstName: "Maria",
      lastName: "Keller",
      phone: "5551234",

      address: "Musterweg 5",
      frequency: "weekly",

      firstDate: new Date("2025-02-14"),
      careCity: "Zürich",
      carePostalCode: "8002",
      kanton: "ZH",

      basicCare: "ja",
      languages: "de",

      services: { connect: [{ id: haushalt.id }] },
    },

    // MEDIUM MATCH (Einkäufe, Bern)
    {
      email: "clientC@test.com",
      role: "client",
      status: "open",

      firstName: "Peter",
      lastName: "Schwarz",
      phone: "222444",

      address: "Bahnhofstrasse 22",
      frequency: "monthly",

      firstDate: new Date("2025-02-08"),
      careCity: "Bern",
      carePostalCode: "3001",
      kanton: "BE",

      pets: "nein",
      languages: "de",

      services: { connect: [{ id: einkauf.id }] },
    },

    // LOW MATCH (Companionship)
    {
      email: "clientD@test.com",
      role: "client",
      status: "open",

      firstName: "Laura",
      lastName: "Fischer",
      phone: "333444",

      address: "Centralplatz 3",
      frequency: "weekly",

      firstDate: new Date("2025-02-12"),
      careCity: "Basel",
      carePostalCode: "4001",
      kanton: "BS",

      companionship: "ja",
      languages: "en",

      services: { connect: [{ id: freizeit.id }] },
    },
  ];

  // Insert clients
  for (const c of clients) {
    await prisma.user.create({ data: c });
  }

  // ----------------------------------------
  // EMPLOYEES WITH REQUIRED FIELDS
  // ----------------------------------------
  const required = {
    experienceYears: "3",
    hasLicense: true,
    address: "Seedstrasse 5",
  };

  const employeeList = [
    {
      email: "super@test.com",
      firstName: "Anna",
      lastName: "Supermatch",
      city: "Zürich",
      canton: "ZH",
      servicesOffered: ["haushaltshilfe", "freizeit", "kochen", "spazieren"],
      languages: ["de"],
      worksWithAnimals: "ja",
      bodyCareSupport: "ja",
      status: "available",
      availabilityFrom: new Date(),
      availabilityDays: ["Mon", "Tue", "Wed"],
    },
    {
      email: "good@test.com",
      firstName: "Marco",
      lastName: "Gut",
      city: "Zürich",
      canton: "ZH",
      servicesOffered: ["haushaltshilfe"],
      languages: ["de"],
      worksWithAnimals: "nein",
      bodyCareSupport: "nein",
      status: "available",
      availabilityFrom: new Date(),
      availabilityDays: ["Mon", "Fri"],
    },
    {
      email: "medium@test.com",
      firstName: "Julia",
      lastName: "Medi",
      city: "Bern",
      canton: "BE",
      servicesOffered: ["einkäufe"],
      languages: ["de"],
      worksWithAnimals: "ja",
      status: "available",
      availabilityFrom: new Date(),
      availabilityDays: ["Tue", "Thu"],
    },
    {
      email: "low@test.com",
      firstName: "Tim",
      lastName: "Schwach",
      city: "Basel",
      canton: "BS",
      servicesOffered: ["terminbegleitung"],
      languages: ["fr"],
      worksWithAnimals: "nein",
      status: "available",
      availabilityFrom: new Date(),
      availabilityDays: ["Mon"],
    },
    {
      email: "fallback@test.com",
      firstName: "Eva",
      lastName: "Fallback",
      city: "Luzern",
      canton: "LU",
      servicesOffered: [],
      languages: ["it"],
      worksWithAnimals: "nein",
      status: "available",
      availabilityFrom: new Date(),
      availabilityDays: ["Mon"],
    },
  ];

for (const emp of employeeList) {
  await safeCreate(
    prisma.employee,
    { email: emp.email },
    { ...required, ...emp }
  );
}

  console.log("🌱 Seed completed safely!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
