// One-off: trigger the welcome email manually for the latest user. Uses the
// real mailer pipeline (renderEmail → SMTP) so any SMTP error surfaces.
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, email: true, requestEmail: true,
      firstName: true, lastName: true, anrede: true,
    },
  });
  if (!user) throw new Error("No user found.");

  const setupToken = crypto.randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: setupToken,
      resetTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Use the same helpers as the production flow.
  const { sendClientWelcomeEmail } = require("../src/lib/mailer.js");
  const { recipientEmail } = require("../src/lib/recipientEmail.js");

  const to = recipientEmail(user);
  if (!to) throw new Error("recipientEmail() returned falsy — no email on record");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch";
  const passwordLink = `${baseUrl}/setpassword?token=${setupToken}`;

  console.log("Sending welcome email...");
  console.log("  to:", to);
  console.log("  user.id:", user.id);
  console.log("  passwordLink:", passwordLink);

  await sendClientWelcomeEmail({
    email: to,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    anrede: user.anrede,
    passwordLink,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { welcomeEmailSent: true },
  });

  console.log("\n✓ Welcome email dispatched.");
}

main()
  .catch((e) => { console.error("✗ FAILED:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
