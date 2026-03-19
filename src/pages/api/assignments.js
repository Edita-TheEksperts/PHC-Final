import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    const assignments = await prisma.user.findMany({
      include: {
        services: true,
        schedules: true,
      },
    });

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}
