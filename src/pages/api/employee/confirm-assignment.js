import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";
import { recipientEmail } from "../../../lib/recipientEmail";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
async function getTemplate(name, variables) {
  const template = await prisma.emailTemplate.findUnique({ where: { name } });
  if (!template) throw new Error(`Template ${name} not found`);

  let body = template.body;
  for (const key in variables) {
    body = body.replace(new RegExp(`{{${key}}}`, "g"), variables[key] || "");
  }

  return { subject: template.subject, body };
}
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { assignmentId, action } = req.body;

    if (!assignmentId || !["confirmed", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Check current status BEFORE updating to prevent duplicate emails
    const existing = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { confirmationStatus: true },
    });

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        confirmationStatus: action,
        status: "active",
      },
      include: {
        user: {
          include: {
            services: true,
            schedules: true,
          },
        },
        employee: true,
      },
    });

    // A7: a series assignment (scheduleId == null) covers the whole client series.
    // On acceptance, stamp this employee onto ALL of the client's future,
    // still-unassigned active schedules (single/replacement assignments already
    // had their one schedule stamped at request time).
    if (action === "confirmed" && updated.scheduleId == null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await prisma.schedule.updateMany({
        where: { userId: updated.userId, status: "active", date: { gte: today }, employeeId: null },
        data: { employeeId: updated.employeeId },
      }).catch(() => {});
    }

    // Only send emails if not already confirmed (prevent duplicates)
    if (action === "confirmed" && existing?.confirmationStatus !== "confirmed") {
      try {
        const { sendAssignmentContractEmail } = await import("../../../lib/emailHelpers.js");
        await sendAssignmentContractEmail(updated);

        // Send email to client (customer) about assignment acceptance
        const {sendAssignmentAcceptedEmail} = await import("../../../lib/mailer.js");
        await sendAssignmentAcceptedEmail({
          email: recipientEmail(updated.user),
          firstName: updated.user.firstName,
          lastName: updated.user.lastName,
          anrede: updated.user.anrede,
          employeeFirstName: updated.employee.firstName,
          employeeLastName: updated.employee.lastName,
          employeePhone: updated.employee.phone || '',
          serviceName: updated.serviceName || '',
          firstDate: updated.firstDate || '',
        });
      } catch (emailError) {
      }
    }

    if (action === "rejected") {
      // Clear employeeId so a new employee can be assigned.
      if (updated.scheduleId) {
        // Single/replacement: release just that one appointment.
        await prisma.schedule.update({
          where: { id: updated.scheduleId },
          data: { employeeId: null },
        }).catch(() => {});
      } else {
        // A7: series rejection releases the whole future series back to unassigned.
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        await prisma.schedule.updateMany({
          where: { userId: updated.userId, employeeId: updated.employeeId, status: "active", date: { gte: today } },
          data: { employeeId: null },
        }).catch(() => {});
      }

      try {
        const employeeId = updated.employee.id;

        const rejectedCount = await prisma.assignment.count({
          where: { employeeId, confirmationStatus: "rejected" },
        });

        const warningSent = await prisma.rejectionWarning.findFirst({
          where: { employeeId },
        });

        if (rejectedCount >= 3 && !warningSent) {
          const { subject, body } = await getTemplate("rejectionWarning", {
            employeeFirstName: updated.employee.firstName,
          });

          await transporter.sendMail({
            from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
            to: updated.employee.email,
            cc: "admin@phc.ch",
            subject,
            html: body,
          });

          await prisma.rejectionWarning.create({
            data: { employeeId, sentAt: new Date() },
          });
        }

      } catch (emailError) {
      }
    }

    // ✅ Always return success
    res.status(200).json({ status: "updated", assignment: updated });

  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
}

