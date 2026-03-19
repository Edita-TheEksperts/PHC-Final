import { prisma } from "../../lib/prisma";
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
    const { userId, employeeId } = req.body;

    if (!userId || !employeeId) {
      return res.status(400).json({ message: "Missing userId or employeeId" });
    }

    // complete old assignments
    await prisma.assignment.updateMany({
      where: { userId, status: "active" },
      data: { status: "completed" },
    });

    // create new assignment
    const assignment = await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        status: "active",
        confirmationStatus: "pending",
        serviceName: req.body.serviceName,
        firstDate: req.body.firstDate ? new Date(req.body.firstDate) : null,
      },
    });

    // fetch employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    // ✅ fetch email template from DB
    const template = await prisma.emailTemplate.findUnique({
      where: { name: "assignmentNotification" },
    });

    // simple placeholder replacement
    const html = template.body.replace("{{firstName}}", employee.firstName);

    // send email
    await transporter.sendMail({
      from: `"PHC Admin" <${process.env.SMTP_USER}>`,
      to: employee.email,
      subject: template.subject,
      html,
    });

    res.status(200).json({ assignment });
  } catch (err) {
    res.status(500).json({ message: "Failed to assign employee" });
  }
}
