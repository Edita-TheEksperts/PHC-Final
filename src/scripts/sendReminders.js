import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendReminderEmail(user, assignment) {
  if (!user.email) return;

await transporter.sendMail({
  from: '"Prime Home Care AG" <info@primehomecare.ch>',
  to: user.email,
  subject: "Final Reminder: Bitte Job akzeptieren",
  html: `
    <p>Hallo ${employee.firstName}</p>

    <p>Du hast den Job noch nicht bestätigt. Nach 36 Stunden wird der Job automatisch storniert.</p>

    <p>Danke!</p>
        
<p>Freundliche Grüsse</p>  

<p>
  Prime Home Care AG<br/>
  Birkenstrasse 49<br/>
  CH-6343 Rotkreuz<br/>
  info@phc.ch<br/>
  www.phc.ch
</p>

<p>
  <a
    href="https://phc.ch/AVB"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "underline",
      color: "#04436F",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    AVB und Nutzungsbedingungen
  </a>
</p>
  `,
});



}

async function main() {
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);

  const assignments = await prisma.assignment.findMany({
    where: {
      confirmationStatus: "pending",
      createdAt: { lte: twelveHoursAgo },
      reminderSentCount: 0,
    },
    include: { user: true },
  });

  for (const assignment of assignments) {
    await sendReminderEmail(assignment.user, assignment);
    await prisma.assignment.update({
      where: { id: assignment.id },
      data: { reminderSentCount: 1 },
    });
  }
}

main()
  .catch(() => {})
  .finally(() => prisma.$disconnect());
