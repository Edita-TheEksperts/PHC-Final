// Direct SMTP test: sends the welcome email exactly like the production flow,
// but inline (no import of mailer.js, which has ESM resolution issues outside
// Webpack). If this succeeds, the production flow's SMTP setup also works.
import "dotenv/config";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const targetEmail = process.env.TARGET_EMAIL || null;
const user = await prisma.user.findFirst({
  where: targetEmail ? { email: targetEmail } : undefined,
  orderBy: targetEmail ? undefined : { createdAt: "desc" },
  select: {
    id: true, email: true, requestEmail: true,
    firstName: true, lastName: true, anrede: true,
  },
});
if (!user) {
  console.error(`No user found${targetEmail ? ` for email "${targetEmail}"` : ""}.`);
  process.exit(1);
}

const setupToken = crypto.randomBytes(32).toString("hex");
await prisma.user.update({
  where: { id: user.id },
  data: {
    resetToken: setupToken,
    resetTokenExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    welcomeEmailSent: false,
  },
});

const to = user.requestEmail || user.email;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch";
const passwordLink = `${baseUrl}/setpassword?token=${setupToken}`;

// Salutation
const anrede = (user.anrede || "").toLowerCase();
let greeting;
if (anrede === "herr" || anrede === "mr" || anrede === "mr.") greeting = `Sehr geehrter Herr ${user.lastName || ""}`.trim();
else if (anrede === "frau" || anrede === "mrs" || anrede === "ms") greeting = `Sehr geehrte Frau ${user.lastName || ""}`.trim();
else greeting = `Guten Tag ${[user.firstName, user.lastName].filter(Boolean).join(" ")}`.trim() || "Sehr geehrte Damen und Herren";

// Pull template from DB (same as renderEmail) — fall back to inline HTML.
const tpl = await prisma.emailTemplate.findUnique({ where: { name: "clientWelcome" } });
const fallback = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>{{greeting}}</p>
    <p>Vielen Dank für Ihre Buchung bei Prime Home Care AG.</p>
    <p>Bitte erstellen Sie Ihr Passwort über den folgenden Link:</p>
    <p><a href="{{passwordLink}}" style="display:inline-block;background-color:#B99B5F;color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-weight:bold;">Passwort erstellen</a></p>
  </div>`;
const interp = (s) => (s || "").replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => ({ greeting, passwordLink, firstName: user.firstName || "", lastName: user.lastName || "" }[k] ?? ""));
const subject = interp(tpl?.subject || "Willkommen bei Prime Home Care AG – Passwort erstellen");
const html = interp(tpl?.body || fallback);

console.log("SMTP config:");
console.log("  host:", process.env.SMTP_HOST);
console.log("  port:", process.env.SMTP_PORT);
console.log("  secure:", process.env.SMTP_SECURE);
console.log("  user:", process.env.SMTP_USER);
console.log("Sending to:", to);
console.log("  user.id:", user.id);
console.log("  passwordLink:", passwordLink);
console.log("  template source:", tpl ? "db" : "fallback");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

try {
  // Verify connection first to surface any auth/connection error explicitly.
  console.log("\nVerifying SMTP connection...");
  await transporter.verify();
  console.log("✓ SMTP connection OK");

  const info = await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
  console.log("\n✓ Email dispatched. messageId:", info.messageId);
  console.log("  accepted:", info.accepted);
  console.log("  rejected:", info.rejected);
  console.log("  response:", info.response);

  await prisma.user.update({
    where: { id: user.id },
    data: { welcomeEmailSent: true },
  });
} catch (err) {
  console.error("\n✗ FAILED:", err);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
