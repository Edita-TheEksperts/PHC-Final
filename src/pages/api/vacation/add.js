import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, startDate, endDate } = req.body;

  if (!userId || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    // 1️⃣ Ruaj Vacation
    const vacation = await prisma.vacation.create({
      data: {
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    // 2️⃣ Gjej terminet brenda Urlaub
    const schedules = await prisma.schedule.findMany({
      where: {
        userId,
        status: "active",
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
    });

    // 3️⃣ BËJI AUTOMATIKISHT STORNIERT
    for (const schedule of schedules) {
      await prisma.schedule.update({
        where: { id: schedule.id },
        data: {
          status: "cancelled",
        },
      });
    }

    return res.status(200).json({
      success: true,
      vacation,
      cancelledSchedules: schedules.length,
    });

  } catch (err) {
    return res.status(500).json({ error: "Could not save vacation" });
  }
}
