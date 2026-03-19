import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { assignmentId } = req.body;

    try {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: { status: "cancelled" },
      });

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to cancel assignment" });
    }
  }
}
