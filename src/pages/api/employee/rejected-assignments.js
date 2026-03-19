import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const rejected = await prisma.assignment.findMany({
      where: {
        employeeId: employee.id,
        confirmationStatus: "rejected",
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(rejected);
  } catch (err) {
    res.status(500).json({ message: "Failed to load data" });
  }
}
