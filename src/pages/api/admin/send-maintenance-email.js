import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { date, timeStart, timeEnd } = req.body;
  if (!date || !timeStart || !timeEnd) {
    return res.status(400).json({ message: "Datum und Zeiten fehlen" });
  }

  try {
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "maintenanceEmail" },
    });

    if (!template) {
      return res.status(500).json({ message: "Template not found" });
    }

    // Merrim klientët dhe punonjësit
    const [clients, employees] = await Promise.all([
      prisma.user.findMany({
        select: { email: true, firstName: true, lastName: true },
      }),
      prisma.employee.findMany({
        select: { email: true, firstName: true, lastName: true },
      }),
    ]);

    const phone = process.env.SUPPORT_PHONE || "[Telefonnummer]";

// Dërgojmë email tek klientët
for (const client of clients) {

  // Skip invalid client email
  if (
    !client.email ||
    client.email.trim() === "" ||
    client.email.endsWith("@theeksperts.ch")
  ) {
    continue;
  }

  const html = template.body
    .replace(/{{firstName}}/g, client.firstName || "")
    .replace(/{{lastName}}/g, client.lastName || "")
    .replace(/{{portal}}/g, "Kundenportal")
    .replace(/{{role}}/g, "Kunde")
    .replace(/{{date}}/g, date)
    .replace(/{{timeStart}}/g, timeStart)
    .replace(/{{timeEnd}}/g, timeEnd)
    .replace(/{{phone}}/g, phone);

  try {
    await sendEmail({
      to: client.email,
      subject: template.subject,
      html,
    });
  } catch (err) {
  }
}


for (const emp of employees) {
  // Skip invalid employee email
  if (
    !emp.email ||
    emp.email.trim() === "" ||
    emp.email.endsWith("@theeksperts.ch")
  ) {
    continue;
  }

  const html = template.body
    .replace(/{{firstName}}/g, emp.firstName || "")
    .replace(/{{lastName}}/g, emp.lastName || "")
    .replace(/{{portal}}/g, "Mitarbeiterportal")
    .replace(/{{role}}/g, "Mitarbeiter")
    .replace(/{{date}}/g, date)
    .replace(/{{timeStart}}/g, timeStart)
    .replace(/{{timeEnd}}/g, timeEnd)
    .replace(/{{phone}}/g, phone);

  try {
    await sendEmail({
      to: emp.email,
      subject: template.subject,
      html,
    });
  } catch (err) {
  }
}

    res.status(200).json({
      message: `✅ E-Mails an ${clients.length} Kunden und ${employees.length} Mitarbeiter gesendet.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Senden der E-Mails." });
  }
}
