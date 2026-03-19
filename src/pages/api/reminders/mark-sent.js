import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { reminderId } = req.body;
  if (!reminderId) return res.status(400).json({ message: "reminderId required" });

  try {
    await prisma.reminder.update({
      where: { id: reminderId },
      data: { sent: true },
    });

    res.status(200).json({ message: "Reminder marked as sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error updating reminder" });
  }
}
