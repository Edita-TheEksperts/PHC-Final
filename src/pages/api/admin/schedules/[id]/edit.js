import { prisma } from "../../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { date, startTime, hours, serviceName, subServiceName, userId, employeeId } = req.body;

    // 1️⃣ Cancel old schedule
    await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status: "cancelled" }
    });

    // 2️⃣ Get correct weekday name
    const day = new Date(date).toLocaleDateString("de-DE", {
      weekday: "long",
    });

 const newSchedule = await prisma.schedule.create({
  data: {
    day,
    date: new Date(date),
    startTime,
    hours,
    serviceName,
    subServiceName,
userId: userId || undefined,
employeeId: employeeId || null,



    status: "active",
  },
  include: {
    user: true,
    employee: true,
  },
});


    res.status(200).json(newSchedule);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}
