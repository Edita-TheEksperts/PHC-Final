import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { schedules: true }, // 👈 include schedules, not assignments
    });
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const rate = 28.15;   // CHF per hour
    const kmRate = 0.6;   // CHF per km

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const reduceSchedules = (schedules) =>
      schedules.reduce(
        (sum, s) => {
          const hours = s.hours ?? 0;
          const km = s.kilometers ?? 0;
          const serviceCost = hours * rate;
          const travelCost = km * kmRate;

          return {
            serviceHours: sum.serviceHours + hours,
            kilometers: sum.kilometers + km,
            serviceCost: sum.serviceCost + serviceCost,
            travelCost: sum.travelCost + travelCost,
            total: sum.total + serviceCost + travelCost,
          };
        },
        {
          serviceHours: 0,
          kilometers: 0,
          serviceCost: 0,
          travelCost: 0,
          total: 0,
        }
      );

    // filter schedules by current month/year
    const thisMonthSchedules = employee.schedules.filter((s) => {
      if (!s.date) return false;
      const d = new Date(s.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const thisMonth = reduceSchedules(thisMonthSchedules);
    const allTime = reduceSchedules(employee.schedules);

    res.json({ thisMonth, allTime, rate, kmRate });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
