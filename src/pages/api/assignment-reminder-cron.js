// src/utils/assignment-reminder-cron.js
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../lib/emails.js";

const prisma = new PrismaClient();

export async function runAssignmentReminders() {
  try {
    const now = new Date();

    const reminder1Time = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const reminder2Time = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const cancelTime   = new Date(now.getTime() - 36 * 60 * 60 * 1000);

    const assignments = await prisma.assignment.findMany({
      where: { confirmationStatus: "pending" },
      include: { employee: true, user: true }
    });

    for (const a of assignments) {
      const employee = a.employee;
      if (!employee?.email) continue;

      // Reminder 1 — after 12h
      if (a.reminderSentCount === 0 && a.createdAt <= reminder1Time) {
        await sendEmail({
          to: employee.email,
          subject: "Reminder: Bitte Job akzeptieren",
          html: `
            <p>Hallo ${employee.firstName}</p>
            <p>Bitte bestätige den dir zugewiesenen Einsatz.</p>
                
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
          `
        });

        await prisma.assignment.update({
          where: { id: a.id },
          data: { reminderSentCount: 1 }
        });

        continue;
      }

      // Reminder 2 — after 24h
      if (a.reminderSentCount === 1 && a.createdAt <= reminder2Time) {
        await sendEmail({
          to: employee.email,
          subject: "Letzte Erinnerung: Bitte Job akzeptieren",
          html: `
            <p>Hallo ${employee.firstName}</p>
            <p>Dies ist die letzte Erinnerung, den Einsatz zu bestätigen.</p>
            <p>Prime Home Care</p>
          `
        });

        await prisma.assignment.update({
          where: { id: a.id },
          data: { reminderSentCount: 2 }
        });

        continue;
      }

      // Auto cancel — after 36h
      if (a.reminderSentCount >= 2 && a.createdAt <= cancelTime) {

        await prisma.assignment.update({
          where: { id: a.id },
          data: { confirmationStatus: "cancelled" }
        });

        const admins = await prisma.user.findMany({
          where: { role: "admin" }
        });

        for (const admin of admins) {
          await sendEmail({
            to: admin.email,
            subject: "Einsatz automatisch storniert",
            html: `
       <p>Hallo Admin</p> 

<p>Die Zuweisung von ${employee.firstName} ${employee.lastName} wurde nach 36h ohne Bestätigung automatisch storniert.</p>
    
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
            `
          });
        }

        continue;
      }
    }

  } catch (err) {
  } finally {
    await prisma.$disconnect();
  }
}
