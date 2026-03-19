import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { appointmentId, userId } = req.body;

    if (!appointmentId || !userId) {
      return res.status(400).json({ message: "Missing appointmentId or userId" });
    }

    // ✅ Update schedule with selected client
    const updateAppointment = await prisma.schedule.update({
      where: { id: appointmentId },
      data: { userId },
      include: {
        employee: true,
        user: true,
      },
    });

    // ✅ Fetch assigned employee info
    const employee = updateAppointment?.employee;
    const client = updateAppointment?.user;

    if (!employee || !client) {
      return res.status(200).json({
        message: "Assigned client, but no employee linked to this appointment yet.",
      });
    }

    // ✅ Email Template (optional – can reuse same template)
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "assignmentNotification" },
    });

    if (template) {
      let body = template.body;
      body = body.replace("{{firstName}}", employee.firstName || "");

      await transporter.sendMail({
        from: `"PHC Admin" <${process.env.SMTP_USER}>`,
        to: employee.email,
        subject: template.subject,
        html: body,
      });
    }

    res.status(200).json({ success: true, appointment: updateAppointment });

  } catch (err) {
    res.status(500).json({ message: "Failed to assign client" });
  }
}
