import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { employeeId, status } = req.query;

  // =========================
  //   POST: Update kilometers
  // =========================
  if (req.method === "POST") {
    const { scheduleId, kilometers } = req.body;

    if (!scheduleId || kilometers === undefined) {
      return res.status(400).json({ error: "Missing data" });
    }

    try {
      const updated = await prisma.schedule.update({
        where: { id: Number(scheduleId) },
        data: { kilometers: Number(kilometers) },
      });

      return res.status(200).json({ success: true, updated });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update kilometers" });
    }
  }

  // =========================
  //   GET: Fetch schedules
  // =========================
  const whereClause = {
    date: { not: null },
    userId: { not: null },
  };

  if (employeeId) {
    whereClause.employeeId = employeeId;
  }

  if (status === "cancelled") whereClause.status = "cancelled";
  if (status === "active") whereClause.status = "active";
  if (status === "modified") whereClause.status = "modified";

  if (status === "past") {
    whereClause.date = { lt: new Date() };
    whereClause.status = "active";
  }

  if (status === "vacation") {
    whereClause.status = "vacation";
  }

  try {
    const schedules = await prisma.schedule.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { firstName: true, lastName: true } },
        service: { select: { name: true } },
        subservice: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    });

    const formatted = schedules.map((s) => ({
      id: s.id,
      date: s.date,
      day: s.day,
      startTime: s.startTime,
      hours: s.hours || 3,
      user: s.user,
      employee: s.employee,
      status: s.status,
      kilometers: s.kilometers || 0,   // ✅ SHTESA
      serviceName: s.service?.name || s.serviceName || null,
      subServiceName: s.subservice?.name || s.subServiceName || null,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
