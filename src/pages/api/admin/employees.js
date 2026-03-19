// pages/api/admin/employees.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        invited: true,
        createdAt: true,
         documentStatus: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ KONVERTO DATËN
    const formattedEmployees = employees.map((emp) => ({
      ...emp,
      createdAt: emp.createdAt ? emp.createdAt.toISOString() : null,
    }));

    res.status(200).json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
}
