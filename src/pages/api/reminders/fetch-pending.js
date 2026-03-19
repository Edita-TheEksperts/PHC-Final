import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const now = new Date();

    const reminders = await prisma.reminder.findMany({
      where: {
        sent: false,
        scheduledAt: { lte: now },
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching reminders" });
  }
}
