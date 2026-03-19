import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { vacationId, action } = req.body;

  if (!vacationId || !["approve", "decline"].includes(action)) {
    return res.status(400).json({ message: "Invalid fields" });
  }

  try {
    const vacation = await prisma.vacation.update({
      where: { id: vacationId },
      data: { status: action === "approve" ? "approved" : "declined" },
    });

    return res.status(200).json({ message: "Vacation updated", vacation });
  } catch (err) {
    return res.status(500).json({ message: "Error updating vacation" });
  }
}
