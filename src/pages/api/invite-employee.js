import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, firstName } = req.body;

  if (!email || !firstName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // 🔎 fetch template from DB
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "interviewInvite" }, // 👈 store this in DB
    });

    if (!template) {
      return res.status(404).json({ message: "❌ Template interviewInvite not found" });
    }

    // 📝 replace placeholders
    let body = template.body;
    body = body.replace(/{{firstName}}/g, firstName);
    body = body.replace(/{{calendlyLink}}/g, "https://calendly.com/YOUR_CALENDLY_LINK");

    // 📧 send email
    await sendEmail({
      to: email,
      subject: template.subject,
      html: body,
    });

    // ✅ update employee
    await prisma.employee.update({
      where: { email },
      data: {
        invited: true,
        inviteSentAt: new Date(),
      },
    });

    return res.status(200).json({ message: "Einladung gesendet" });
  } catch (err) {
    return res.status(500).json({ message: "Fehler beim Senden der Einladung" });
  }
}
