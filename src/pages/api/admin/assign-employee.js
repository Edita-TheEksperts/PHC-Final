import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../../../lib/emails";
import { renderEmail } from "../../../lib/emailTemplate";
import { formalGreeting } from "../../../lib/salutation";
import { describeSeries } from "../../../lib/series";

const prisma = new PrismaClient();

// Fallback HTML used if the `assignmentRequestEmployee` row hasn't been
// seeded into the DB yet. The DB row (editable via /admin/email-templates)
// always wins when present.
const FALLBACK_REQUEST_HTML = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>{{greeting}}</p>
  <p>Sie haben eine neue Einsatz-Serie für den Kunden
    <strong>{{clientFirstName}} {{clientLastName}}</strong>.</p>
  <p><strong>Serie:</strong> {{seriesDescription}}</p>
  <p>Um die Serie anzunehmen oder abzulehnen, melden Sie sich bitte im Dashboard an:</p>
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

  const { appointmentId, userId, employeeId, scope } = req.body;

  if (!userId || !employeeId) {
    return res.status(400).json({ message: "Missing userId or employeeId" });
  }

  try {
    let appointment = null;
    if (appointmentId) {
      appointment = await prisma.schedule.findUnique({ where: { id: Number(appointmentId) } });
      if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    }

    // A7: default is a SERIES assignment (covers all future appointments of the
    // client). A SINGLE assignment is used only for replacements (a schedule
    // released as "ersatz_noetig") or when the caller explicitly asks for it.
    const isSingle = scope === "single" || appointment?.status === "ersatz_noetig";

    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!employee || !user) return res.status(404).json({ message: "User or employee not found" });
    const dashboardUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch"}/employee-dashboard`;

    // ── SINGLE (replacement / one-off) ────────────────────────────────────
    if (isSingle) {
      const existing = await prisma.assignment.findFirst({
        where: { userId, employeeId, scheduleId: appointment?.id ?? null },
      });
      if (existing) {
        return res.status(200).json({ message: "Anfrage wurde bereits gesendet.", deduplicated: true });
      }

      await prisma.assignment.create({
        data: {
          userId,
          employeeId,
          scheduleId: appointment?.id || null,
          serviceName: appointment?.serviceName || "",
          firstDate: appointment?.date || null,
        },
      });

      let updatedSchedule = null;
      if (appointment) {
        updatedSchedule = await prisma.schedule.update({
          where: { id: appointment.id },
          data: { employeeId, status: "active" },
          include: { employee: true, user: true },
        });
      }

      const { subject, html } = await renderEmail(
        "assignmentRequestEmployee",
        {
          greeting: formalGreeting(employee, "casual"),
          clientFirstName: user.firstName || "",
          clientLastName: user.lastName || "",
          serviceName: appointment?.serviceName || "",
          seriesDescription: appointment?.date
            ? `Einzeltermin am ${new Date(appointment.date).toLocaleDateString("de-CH")}`
            : "Einzeltermin",
          dashboardUrl,
        },
        { fallbackSubject: "Neuer Einsatz – Bitte bestätigen", fallbackHtml: FALLBACK_REQUEST_HTML }
      );
      let emailWarning = null;
      try { await sendEmail({ to: employee.email, subject, html }); }
      catch { emailWarning = "Mitarbeiter zugewiesen, aber E-Mail konnte nicht gesendet werden."; }

      return res.status(200).json({
        message: "Einzel-Anfrage an Mitarbeiter gesendet.",
        warning: emailWarning,
        schedule: updatedSchedule,
      });
    }

    // ── SERIES (A7 default) ───────────────────────────────────────────────
    // A running series assignment for this client+employee already exists?
    const existingSeries = await prisma.assignment.findFirst({
      where: {
        userId,
        employeeId,
        scheduleId: null,
        status: "active",
        confirmationStatus: { in: ["pending", "confirmed"] },
      },
    });
    if (existingSeries) {
      return res.status(200).json({ message: "Serien-Anfrage wurde bereits gesendet.", deduplicated: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const seriesSchedules = await prisma.schedule.findMany({
      where: { userId, status: "active", date: { gte: today }, employeeId: null },
      orderBy: { date: "asc" },
      select: { id: true, day: true, hours: true, date: true, serviceName: true },
    });

    const seriesDescription = describeSeries(seriesSchedules);
    const firstDate = seriesSchedules[0]?.date || appointment?.date || null;

    // Create the series-level assignment (scheduleId = null). employeeId is
    // propagated onto the individual schedules only once the employee ACCEPTS
    // (see employee/confirm-assignment.js).
    await prisma.assignment.create({
      data: {
        userId,
        employeeId,
        scheduleId: null,
        serviceName: seriesSchedules[0]?.serviceName || appointment?.serviceName || "",
        firstDate,
      },
    });

    const { subject, html } = await renderEmail(
      "assignmentRequestEmployee",
      {
        greeting: formalGreeting(employee, "casual"),
        clientFirstName: user.firstName || "",
        clientLastName: user.lastName || "",
        serviceName: seriesSchedules[0]?.serviceName || appointment?.serviceName || "",
        seriesDescription,
        dashboardUrl,
      },
      { fallbackSubject: "Neue Einsatz-Serie – Bitte bestätigen", fallbackHtml: FALLBACK_REQUEST_HTML }
    );
    let emailWarning = null;
    try { await sendEmail({ to: employee.email, subject, html }); }
    catch { emailWarning = "Serie zugewiesen, aber E-Mail konnte nicht gesendet werden."; }

    return res.status(200).json({
      message: `Serien-Anfrage an Mitarbeiter gesendet (${seriesDescription}). Nach Bestätigung wird die ganze Serie zugewiesen.`,
      warning: emailWarning,
      seriesDescription,
      seriesCount: seriesSchedules.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
