import { prisma } from "./prisma";
import { sendEmail } from "./emails"; // make sure this exists and works

export async function sendReminderForInviteInterview() {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  // 1. Get employees who were invited 3+ days ago and haven't scheduled anything
  const employees = await prisma.employee.findMany({
    where: {
      invited: true,
      inviteSentAt: { lte: threeDaysAgo },
      status: "pending",
    },
  });

  const calendlyUrl = "https://calendly.com/primehomecare";

  // 2. Send a reminder email to each one
  for (const emp of employees) {
    const subject = "Erinnerung: Termin für Kennenlernen noch nicht vereinbart";

    const body = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hallo ${emp.firstName}</p>
        <p>Wir freuen uns auf ein Gespräch mit Ihnen, jedoch haben wir noch keine Terminbuchung über unseren Kalender erhalten.</p>
        <p>
          Bitte wählen Sie jetzt Ihren Wunschtermin aus:
          <a href="https://calendly.com/primehomecare" style="text-decoration: underline; color:#04436F;">Hier Termin vereinbaren</a>
        </p>
        <p>Bei Fragen helfen wir gerne weiter.</p>
        <br>
        <p>Freundliche Grüsse</p>
        <p>Prime Home Care AG<br/>
          Birkenstrasse 49<br/>
          CH-6343 Rotkreuz<br/>
          info@phc.ch<br/>
          www.phc.ch
        </p>
        <p>
          <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
          <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
        </p>
      </div>
    `;

    try {
      await sendEmail({
        to: emp.email,
        subject,
        html: body,
      });
    } catch (error) {
      console.error('[sendReminderForInviteInterview] Failed to send reminder to', emp.email, error);
    }
  }
}
