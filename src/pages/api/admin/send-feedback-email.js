import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { caregiverName, feedbackLink } = req.body;

  if (!caregiverName || !feedbackLink) {
    return res.status(400).json({ message: "Betreuername und Feedback-Link fehlen" });
  }

  try {
    // fetch template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "feedbackEmail" },
    });

    if (!template) {
      return res.status(500).json({ message: "Template not found" });
    }

    const clients = await prisma.user.findMany({
      select: { email: true, firstName: true, lastName: true },
    });

    // send for each client
    const sendTasks = clients.map((client) => {
      const html = template.body
        .replace(/{{firstName}}/g, client.firstName || "")
        .replace(/{{lastName}}/g, client.lastName || "")
        .replace(/{{caregiverName}}/g, caregiverName)
        .replace(/{{feedbackLink}}/g, feedbackLink);

      return sendEmail({
        to: client.email,
        subject: template.subject,
        html,
      });
    });

    await Promise.all(sendTasks);

    res.status(200).json({
      message: `Feedback-Mails an ${clients.length} Kunden gesendet.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Senden der Feedback-Mails." });
  }
}
