import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../../lib/emails";
import { renderEmail } from "../../../lib/emailTemplate";
import { formalGreeting } from "../../../lib/salutation";

const prisma = new PrismaClient();

// Fallback HTML used if the `assignmentRequestEmployee` row hasn't been
// seeded into the DB yet. The DB row (editable via /admin/email-templates)
// always wins when present.
const FALLBACK_REQUEST_HTML = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{greeting}}</p>
  <p>Sie haben einen neuen Einsatz für den Kunden
    <strong>{{clientFirstName}} {{clientLastName}}</strong>.</p>
  <p>Um den Einsatz anzunehmen oder abzulehnen, melden Sie sich bitte im Dashboard an:</p>
  <p>
    <a href="{{dashboardUrl}}"
       style="display:inline-block;padding:12px 20px;background:#04436F;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">
      Zum Mitarbeiter-Dashboard
    </a>
  </p>
  <p>Freundliche Grüsse<br>Prime Home Care AG</p>
</div>`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { appointmentId, userId, employeeId } = req.body;

  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    let appointment = null;
    let updatedSchedule = null;

    if (appointmentId) {
      appointment = await prisma.schedule.findUnique({
        where: { id: Number(appointmentId) }
      });

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
    }

    const assignment = await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        scheduleId: appointment?.id || null,
        serviceName: appointment?.serviceName || "",
      },
      include: { user: true, employee: true },
    });

    if (appointment) {
      updatedSchedule = await prisma.schedule.update({
        where: { id: appointment.id },
        data: { employeeId },
        include: { employee: true, user: true },
      });
    }

    const employee = assignment.employee;
    const user = assignment.user;
    const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch"}/employee-dashboard`;

    // F-18: load the request email from the DB EmailTemplate row so the admin
    // can edit it via /admin/email-templates. Falls back to FALLBACK_REQUEST_HTML
    // until the seed has run on this environment.
    const { subject, html } = await renderEmail(
      "assignmentRequestEmployee",
      {
        greeting: formalGreeting(employee, "casual"),
        clientFirstName: user.firstName || "",
        clientLastName: user.lastName || "",
        serviceName: appointment?.serviceName || "",
        dashboardUrl,
      },
      {
        fallbackSubject: "Neuer Einsatz – Bitte bestätigen",
        fallbackHtml: FALLBACK_REQUEST_HTML,
      }
    );

    let emailWarning = null;
    try {
      await sendEmail({ to: employee.email, subject, html });
    } catch (mailError) {
      emailWarning = "Mitarbeiter zugewiesen, aber E-Mail konnte nicht gesendet werden.";
    }

    // The client is notified later, only after the employee accepts the assignment
    // (see src/pages/api/employee/confirm-assignment.js → sendAssignmentAcceptedEmail).

    return res.status(200).json({
      message: "Anfrage an Mitarbeiter gesendet. Nach Bestätigung wird der Einsatz zugewiesen.",
      warning: emailWarning,
      schedule: updatedSchedule,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
