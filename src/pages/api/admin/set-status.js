import { prisma } from "../../../lib/prisma";

const CLIENT_STATUSES = ["open", "aktiv", "inaktiv", "storniert", "gekuendigt"];
const EMPLOYEE_STATUSES = ["pending", "geprueft", "invited", "interview", "entscheid", "approved", "rejected", "inaktiv"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { type, id, status } = req.body;

  if (!type || !id || !status) {
    return res.status(400).json({ error: "Missing type, id or status" });
  }

  if (type === "client") {
    if (!CLIENT_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid client status", allowed: CLIENT_STATUSES });
    }
    const updated = await prisma.user.update({
      where: { id: String(id) },
      data: { status },
    });
    await prisma.activityLog.create({
      data: {
        action: `Client-Status geändert zu "${status}"`,
        targetType: "User",
        targetId: String(id),
      },
    }).catch(() => {});
    return res.status(200).json({ success: true, status: updated.status });
  }

  if (type === "employee") {
    if (!EMPLOYEE_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid employee status", allowed: EMPLOYEE_STATUSES });
    }
    const updated = await prisma.employee.update({
      where: { id: String(id) },
      data: { status },
    });
    await prisma.activityLog.create({
      data: {
        action: `Mitarbeiter-Status geändert zu "${status}"`,
        targetType: "Employee",
        targetId: String(id),
        actorEmployeeId: String(id),
      },
    }).catch(() => {});
    return res.status(200).json({ success: true, status: updated.status });
  }

  return res.status(400).json({ error: "Invalid type. Use 'client' or 'employee'" });
}
