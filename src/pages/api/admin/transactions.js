import {prisma} from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Totals
    const totalIncome = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "payment" },
    });

    const totalCost = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "payout" },
    });

    // Per service breakdowns with service name
    const incomePerService = await prisma.transaction.groupBy({
      by: ["serviceId"],
      _sum: { amount: true },
      where: { type: "payment" },
    });

    const costPerService = await prisma.transaction.groupBy({
      by: ["serviceId"],
      _sum: { amount: true },
      where: { type: "payout" },
    });

    // Attach service names
    const serviceIds = [
      ...incomePerService.map((i) => i.serviceId),
      ...costPerService.map((c) => c.serviceId),
    ];

    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      select: { id: true, name: true },
    });

    const serviceMap = Object.fromEntries(
      services.map((s) => [s.id, s.name])
    );

    const incomeWithNames = incomePerService.map((i) => ({
      serviceName: serviceMap[i.serviceId] || "Unknown",
      amount: i._sum.amount || 0,
    }));

    const costWithNames = costPerService.map((c) => ({
      serviceName: serviceMap[c.serviceId] || "Unknown",
      amount: c._sum.amount || 0,
    }));

    res.json({
      totalIncome: totalIncome._sum.amount || 0,
      totalCost: totalCost._sum.amount || 0,
      incomePerService: incomeWithNames,
      costPerService: costWithNames,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load transactions" });
  }
}
