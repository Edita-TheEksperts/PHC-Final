import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const totalClients = await prisma.user.count({ where: { role: "client" } });
    const totalEmployees = await prisma.employee.count();
    const approved = await prisma.employee.count({ where: { status: "approved" } });
    const pending = await prisma.employee.count({ where: { status: "pending" } });
    const rejected = await prisma.employee.count({ where: { status: "rejected" } });

    res.status(200).json({
      totalClients,
      totalEmployees,
      approved,
      pending,
      rejected,
    });
  } catch (error) {
    res.status(500).json({ error: "Stats fetch error" });
  }
}
