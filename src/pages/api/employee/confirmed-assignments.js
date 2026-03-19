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

const assignments = await prisma.assignment.findMany({
  where: {
    employeeId: employee.id,
    confirmationStatus: "confirmed",
  },
include: {
  user: {
    include: {
      schedules: true,
      services: true,
    },
  },
},

  orderBy: { createdAt: "desc" },
});



    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Failed to load data" });
  }
}
