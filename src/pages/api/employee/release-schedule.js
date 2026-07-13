import { prisma } from "../../../lib/prisma";

// A7 — per-appointment absence (Krankheit/Urlaub).
// The primary employee releases ONE appointment of their series without losing
// the series: the schedule is set to "ersatz_noetig" and its employeeId cleared
// so the admin can arrange a single-appointment replacement. The series
// assignment stays intact for all other dates.
//
// POST { email, scheduleId }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end();
  }

  const { email, scheduleId } = req.body || {};
  if (!email || !scheduleId) {
    return res.status(400).json({ message: "email und scheduleId erforderlich." });
  }

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return res.status(404).json({ message: "Mitarbeiter nicht gefunden." });

    const schedule = await prisma.schedule.findUnique({ where: { id: Number(scheduleId) } });
    if (!schedule) return res.status(404).json({ message: "Termin nicht gefunden." });

    // Only the currently-assigned employee may release their own appointment.
    if (schedule.employeeId !== employee.id) {
      return res.status(403).json({ message: "Dieser Termin ist Ihnen nicht zugewiesen." });
    }

    const updated = await prisma.schedule.update({
      where: { id: schedule.id },
      data: { employeeId: null, status: "ersatz_noetig" },
    });

    return res.status(200).json({
      message: "Termin freigegeben. Ein Ersatz wird organisiert.",
      schedule: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: "Serverfehler beim Freigeben des Termins." });
  }
}
