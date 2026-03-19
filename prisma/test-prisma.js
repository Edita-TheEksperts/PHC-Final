import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const schedules = await prisma.schedule.findMany({
    include: { user: true, employee: true },
  });
  // Rezultati merret, por nuk shfaqet më në console
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
