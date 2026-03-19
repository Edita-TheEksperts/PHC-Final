// pages/api/employee/save-vacation.js
import { prisma } from "../../../lib/prisma";
import { logActivity } from "../../../lib/logActivity"; // 👈 import your helper

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, start, end } = req.body;

  if (!email || !start || !end) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const vacation = await prisma.vacation.create({
      data: {
        employeeId: employee.id,
        startDate: new Date(start),
        endDate: new Date(end),
        status: "pending",
      },
    });

    // ✅ Log activity
    await logActivity({
      actorEmployeeId: employee.id,   // 👈 who did the action
      action: "beantragten Urlaub",   // 👈 description
      targetType: "Urlaub",         // 👈 entity type
      targetId: vacation.id,          // 👈 entity ID
    });

    res.status(200).json(vacation);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Speichern des Urlaubs" });
  }
}
