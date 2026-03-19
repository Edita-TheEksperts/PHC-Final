import { prisma } from "../../lib/prisma";
import { sendEmail } from "../../lib/emails";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { email, firstName } = req.body;
  const portalUrl = "http://phc.ch/login"; // ✅ update in prod
  const setPasswordUrl = `http://phc.ch/set-password?email=${encodeURIComponent(email)}`;

  try {
    // Update employee status
    const updated = await prisma.employee.update({
      where: { email },
      data: { status: "approved", approvedAt: new Date() },
    });

    // Fetch template
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "approvalEmail" },
    });

    if (!template) {
      return res.status(404).json({ message: "❌ approvalEmail template not found" });
    }

    // Replace placeholders
    let body = template.body;
    body = body.replace(/{{firstName}}/g, firstName);
    body = body.replace(/{{email}}/g, email);
    body = body.replace(/{{portalUrl}}/g, portalUrl);
    body = body.replace(/{{setPasswordUrl}}/g, setPasswordUrl);

    // Send email
    await sendEmail({
      to: email,
      subject: template.subject,
      html: body,
    });

    res.status(200).json({ message: "✅ Approval email sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
