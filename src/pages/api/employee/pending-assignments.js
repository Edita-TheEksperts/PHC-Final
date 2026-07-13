import { prisma } from "../../../lib/prisma";
import { describeSeries } from "../../../lib/series";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const assignments = await prisma.assignment.findMany({
      where: {
        employeeId: employee.id,
        confirmationStatus: "pending",
        status: "active",
      },
      select: {
        id: true,
        confirmationStatus: true,
        status: true,
        scheduleId: true,
        userId: true,
        Schedule: true,
        user: {
          select: {
            // Location (city/PLZ only — no street, no name, no contact)
            postalCode: true,
            carePostalCode: true,
            careCity: true,
            // Services
            services: { select: { id: true, name: true } },
            subServices: { select: { id: true, name: true } },
            // Questionnaire / Step 4
            physicalState: true,
            mobility: true,
            mobilityAids: true,
            specialRequests: true,
            allergies: true,
            allergyDetails: true,
            mentalConditions: true,
            mentalDiagnoses: true,
            incontinence: true,
            medicalFindings: true,
          },
        },
      },
    });

    // A7: for series assignments (scheduleId == null) attach a human-readable
    // description of the series so the employee knows what they're accepting.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const enriched = await Promise.all(
      assignments.map(async (a) => {
        if (a.scheduleId != null) {
          return { ...a, isSeries: false };
        }
        const seriesSchedules = await prisma.schedule.findMany({
          where: { userId: a.userId, status: "active", date: { gte: today } },
          orderBy: { date: "asc" },
          select: { day: true, hours: true, date: true },
        });
        return {
          ...a,
          isSeries: true,
          seriesDescription: describeSeries(seriesSchedules),
          seriesCount: seriesSchedules.length,
        };
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
