import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const newEmployee = await prisma.employee.create({
    data: {
      firstName: "Test",
      lastName: "Employee",
      email: `test${Date.now()}@gmail.com`,
      phone: "123456789",
      status: "pending",
      invited: false,
      createdAt: new Date(),

      // ✅ Fields required by schema
      experienceYears: "1",
      availabilityFrom: new Date(),
      availabilityDays: ["Mon", "Tue"],
      servicesOffered: ["Service1"],
      communicationTraits: ["Calm"],
      dietaryExperience: ["None"],
      languages: ["Deutsch"],

      // ✅ create employee with minimal required values
      hasLicense: false,
    },
  });

  console.log("✅ Employee created:", newEmployee);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
