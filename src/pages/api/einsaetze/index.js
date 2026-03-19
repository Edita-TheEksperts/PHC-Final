import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const now = new Date();

    // ▌1. LOAD ALL SCHEDULES
    const schedules = await prisma.schedule.findMany({
      orderBy: { date: "asc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            services: { select: { name: true } },
            subServices: { select: { name: true } },
          },
        },
        employee: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    // ▌2. ACTIVE SCHEDULES
    const aktive = schedules.filter(
      (s) => s.status === "active" && s.date && new Date(s.date) >= now
    );

    // ▌3. PAST SCHEDULES (Vergangene)
    const vergangene = schedules.filter((s) => s.date && new Date(s.date) < now);

    // ▌4. CANCELED (Stornierte schedules)
    const stornierteSchedules = schedules.filter((s) => s.status === "cancelled");

    // ▌5. MODIFIED
    const abgeänderte = schedules.filter(
      (s) => s.status === "changed" || s.status === "modified"
    );

    // ▌7. OPEN ASSIGNMENTS (employeeId missing)
    const offeneZuweisungen = await prisma.schedule.findMany({
      where: {
        employeeId: null,
        status: "active",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            services: { select: { name: true } },
            subServices: { select: { name: true } },
          },
        },
      },
    });

    // ▌8. REJECTED ASSIGNMENTS
    const rejectedAssignments = await prisma.assignment.findMany({
      where: { confirmationStatus: "rejected" },
      include: {
        user: true,
        employee: true,
        Schedule: {
          select: {
            date: true,
            startTime: true,
            hours: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ▌9. FORMAT REJECTED ASSIGNMENTS
    const formattedRejectedAssignments = rejectedAssignments.map((r) => ({
      id: r.id,
      date: r.schedule ? r.schedule.date : r.originalDate,
      startTime: r.schedule ? r.schedule.startTime : r.originalStartTime,
      hours: r.schedule ? r.schedule.hours : r.originalHours,

      user: r.user,
      employee: r.employee,
      status: r.schedule?.status || "active",
      confirmationStatus: r.confirmationStatus,
    }));

    // Stornierte = vetem schedules me status cancelled
    const stornierte = stornierteSchedules;

    // ▌11. RETURN ALL DATA
    return res.status(200).json({
      aktive,
      vergangene,
      stornierte,
      abgeänderte,
      offeneZuweisungen,
      rejected: formattedRejectedAssignments,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch einsätze" });
  }
}
