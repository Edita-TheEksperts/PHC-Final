import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // 1. Neue Buchungen — recent clients without full assignment
    const neueBuchungen = await prisma.user.findMany({
      where: { role: "client" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        createdAt: true, careCity: true, kanton: true, firstDate: true,
        assignments: { select: { id: true, status: true, employeeId: true } },
      },
    });

    // 2. Offene Bewerbungen — pending employees
    const offeneBewerbungen = await prisma.employee.findMany({
      where: { status: { in: ["pending", "rejected"] } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true, firstName: true, lastName: true, email: true, phone: true,
        createdAt: true, status: true, invited: true, city: true, canton: true,
        servicesOffered: true,
      },
    });

    // 3. Aktive/bevorstehende Einsätze — schedules today + this week
    const aktiveEinsaetze = await prisma.schedule.findMany({
      where: {
        date: { not: null, gte: todayStart, lte: weekEnd },
        status: { not: "cancelled" },
      },
      orderBy: { date: "asc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // 4. Offene Zuweisungen — assignments that need attention
    const offeneZuweisungen = await prisma.assignment.findMany({
      where: {
        OR: [
          { status: "pending" },
          { confirmationStatus: "pending" },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // 5. Ausstehende Entscheidungen — assignments sent to employees awaiting confirmation
    const ausstehend = await prisma.assignment.findMany({
      where: { confirmationStatus: "pending" },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // 6. Bevorstehende Interviews — employees recently invited (interview pending)
    const interviews = await prisma.employee.findMany({
      where: {
        invited: true,
        status: { in: ["pending"] },
      },
      orderBy: { inviteSentAt: "desc" },
      select: {
        id: true, firstName: true, lastName: true, inviteSentAt: true,
        status: true, invited: true,
      },
    });

    // 7. Offene Krank-/Ferienmeldungen
    const offeneAbwesenheiten = await prisma.vacation.findMany({
      where: { status: "pending" },
      orderBy: { startDate: "asc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Quick stats
    const [totalEmployees, totalClients, pendingEmployees, approvedEmployees] = await Promise.all([
      prisma.employee.count(),
      prisma.user.count({ where: { role: "client" } }),
      prisma.employee.count({ where: { status: "pending" } }),
      prisma.employee.count({ where: { status: "approved" } }),
    ]);

    return res.status(200).json({
      neueBuchungen,
      offeneBewerbungen,
      aktiveEinsaetze,
      offeneZuweisungen,
      ausstehend,
      interviews,
      offeneAbwesenheiten,
      stats: { totalEmployees, totalClients, pendingEmployees, approvedEmployees },
    });
  } catch (error) {
    console.error("[dashboard-overview]", error?.message || error);
    return res.status(500).json({
      message: "Fehler beim Laden der Dashboard-Daten",
      neueBuchungen: [],
      offeneBewerbungen: [],
      aktiveEinsaetze: [],
      offeneZuweisungen: [],
      ausstehend: [],
      interviews: [],
      offeneAbwesenheiten: [],
      stats: { totalEmployees: 0, totalClients: 0, pendingEmployees: 0, approvedEmployees: 0 },
    });
  }
}
