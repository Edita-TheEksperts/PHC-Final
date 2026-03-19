import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { assignmentId, newEmployeeId } = req.body;

    try {
      const updated = await prisma.assignment.update({
        where: { id: assignmentId },
        data: {
          employeeId: newEmployeeId,
          status: "active",
        },
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to reassign client" });
    }
  }
}