// /api/employee/total-payment.js
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body;

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { schedules: true },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const schedules = employee.schedules.filter(
      (s) =>
        s.date &&
        new Date(s.date) >= firstDay &&
        new Date(s.date) <= lastDay
    );

    const serviceHours = schedules.reduce((sum, s) => sum + (s.hours || 0), 0);
    const kilometers = schedules.reduce((sum, s) => sum + (s.kilometers || 0), 0);

    // business rules
    const hourlyRate = 30; // CHF per hour
    const kmRate = 0.7;    // CHF per km

    const serviceCost = serviceHours * hourlyRate;
    const travelCost = kilometers * kmRate;
    const total = serviceCost + travelCost;

    res.json({
      thisMonth: { serviceHours, kilometers, serviceCost, travelCost, total },
    });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
}
