// One-off inspection: print the latest user's email-related fields so we can
// see why the welcome email didn't fire. Reset welcomeEmailSent so the next
// /api/save-optional-data call re-sends.
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, requestEmail: true,
      firstName: true, lastName: true, anrede: true,
      welcomeEmailSent: true, form4Completed: true,
      createdAt: true,
    },
  });
  console.log("Latest user:");
  console.log(JSON.stringify(user, null, 2));

  if (user && user.welcomeEmailSent) {
    await prisma.user.update({
      where: { id: user.id },
      data: { welcomeEmailSent: false },
    });
    console.log(`\nReset welcomeEmailSent=false for ${user.email}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
