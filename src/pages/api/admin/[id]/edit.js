import { prisma } from "../../../../lib/prisma";
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
const { day, date, startTime, hours, serviceName, subServiceName, userId } = req.body;

const updated = await prisma.schedule.update({
  where: { id: Number(id) },
  data: {
    day,
    date: date ? new Date(date) : undefined,
    startTime,
    hours: Number(hours),
    serviceName,
    subServiceName,
    userId   // ← FIX
  },
  include: {
    user: true,
    employee: true
  }
});


    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
