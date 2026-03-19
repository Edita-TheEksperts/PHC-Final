import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    // =========================
    //   POST: Update kilometers
    // =========================
    if (req.method === "POST") {
      const { scheduleId, kilometers } = req.body;

      if (!scheduleId || kilometers === undefined) {
        return res.status(400).json({ error: "Missing data" });
      }

      const updated = await prisma.schedule.update({
        where: { id: Number(scheduleId) },
        data: { kilometers: Number(kilometers) },
      });

      return res.status(200).json({ success: true, updated });
    }

    // =========================
    //   GET: Fetch schedules
    // =========================
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    const schedules = await prisma.schedule.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfNextMonth,
        },
      },
      include: {
        user: true,     
        employee: true,
      },
    });

    // Optional: format response
    const formatted = schedules.map((s) => ({
      ...s,
      kilometers: s.kilometers || 0,
    }));

    res.status(200).json(formatted);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedules" });
  }
}
