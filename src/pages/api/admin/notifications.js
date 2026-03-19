import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { since } = req.query; // ISO timestamp of last check
  const sinceDate = since ? new Date(since) : new Date(Date.now() - 60 * 60 * 1000);

  const [newClients, pendingEmployees, newEmployees] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: sinceDate } } }),
    prisma.employee.count({ where: { status: "pending" } }),
    prisma.employee.count({ where: { createdAt: { gte: sinceDate }, status: "pending" } }),
  ]);

  return res.status(200).json({
    newClients,
    pendingEmployees,
    newEmployees,
    total: newClients + newEmployees,
    checkedAt: new Date().toISOString(),
  });
}
