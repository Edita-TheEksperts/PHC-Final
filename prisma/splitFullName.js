// scripts/splitFullName.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.$executeRawUnsafe(`
    UPDATE "User"
    SET
      "firstName" = split_part("fullName", ' ', 1),
      "lastName" = split_part("fullName", ' ', 2)
    WHERE "fullName" IS NOT NULL;
  `);
  await prisma.$disconnect();
}

run().catch((err) => {
  console.error("❌ Failed to split full name:", err);
});
