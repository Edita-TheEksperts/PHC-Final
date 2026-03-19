// pages/api/employee/vacations.js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const vacations = await prisma.vacation.findMany({
      where: { employee: { email } },
      orderBy: { startDate: "asc" },
    });

    res.status(200).json(vacations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vacations" });
  }
}
