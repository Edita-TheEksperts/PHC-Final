import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const thirtySixHoursAgo = new Date(now.getTime() - 36 * 60 * 60 * 1000);

  const assignments = await prisma.assignment.findMany({
    where: {
      confirmationStatus: "pending",
      createdAt: { lte: thirtySixHoursAgo },
      status: "active",
    },
  });

  for (const assignment of assignments) {
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { status: "cancelled" },
    });

  }
}

main()
  .catch(() => {})
  .finally(() => prisma.$disconnect());
