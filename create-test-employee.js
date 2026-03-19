// Create test employee
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestEmployee() {
  try {
    const employee = await prisma.employee.create({
      data: {
        email: "editalatifi1996@gmail.com",
        firstName: "Edita",
        lastName: "Latifi",
        phone: "+41791234567",
        address: "Test Address 123",
        experienceYears: "2-5",
        experienceWhere: "Healthcare",
        hasLicense: true,
        availabilityFrom: new Date(),
        availabilityDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        servicesOffered: ["Hauswirtschaft", "Betreuung"],
        status: "pending",
        city: "Zurich",
        zipCode: "8000",
        canton: "ZH",
        nationality: "CH",
        salutation: "Frau",
      },
    });

    console.log("✅ Test employee created:", employee);
    console.log("\nEmployee Details:");
    console.log("ID:", employee.id);
    console.log("Email:", employee.email);
    console.log("Name:", employee.firstName, employee.lastName);
    console.log("Status:", employee.status);
  } catch (error) {
    console.error("❌ Error creating employee:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestEmployee();
