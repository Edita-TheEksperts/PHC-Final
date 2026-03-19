const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = "admin@phc.ch";
  const plainPassword = "admin123!"; 

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: "admin",
      passwordHash,
    },
    create: {
      email,
      passwordHash,
      role: "admin",

      // FUSHA TË DETYRUESHME NGA SCHEMA
      address: "Admin Address",
      frequency: "N/A",

      // OPSIONALE
      firstName: "Admin",
      lastName: "PHC",
      status: "active",
    },
  });

  console.log("✅ Admin u krijua/updates:", admin.email);
}

main()
  .catch((err) => console.error("❌ Gabim:", err))
  .finally(async () => {
    await prisma.$disconnect();
  });
