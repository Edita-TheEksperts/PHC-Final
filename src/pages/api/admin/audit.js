// /api/admin/audit.js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { action, adminId, employeeId, clientId } = req.body;
    const log = await prisma.auditLog.create({
      data: { action, adminId, employeeId, clientId },
    });
    return res.json(log);
  }
  if (req.method === "GET") {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { employee: true, client: true },
    });
    return res.json(logs);
  }
}
