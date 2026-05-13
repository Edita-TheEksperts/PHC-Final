require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const matches = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "edita", mode: "insensitive" } },
        { requestEmail: { contains: "edita", mode: "insensitive" } },
        { email: { contains: "latifi", mode: "insensitive" } },
        { requestEmail: { contains: "latifi", mode: "insensitive" } },
      ],
    },
    select: {
      id: true, email: true, requestEmail: true,
      firstName: true, lastName: true,
      welcomeEmailSent: true, form4Completed: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("Users matching edita/latifi:");
  console.log(JSON.stringify(matches, null, 2));
  console.log("\nTotal user count:", await prisma.user.count());
  await prisma.$disconnect();
})();
