import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { userId } = req.query;

  try {
    // ✅ 1. Total payment (sum of all transactions)
    const total = await prisma.transaction.aggregate({
      where: { userId },
      _sum: { amountClient: true },
    });

    // ✅ 2. Payment per service (join transaction → schedule → service if needed)
    // Right now you don’t have service info directly in Transaction.
    // We can group only if you link it. For now, keep empty array to avoid crashes.
    const paymentPerService = [];

    // ✅ 3. Payment history per month
    const payments = await prisma.transaction.findMany({
      where: { userId },
      select: { amountClient: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    const monthly = {};
    payments.forEach((p) => {
      const monthKey = new Date(p.createdAt).toISOString().slice(0, 7); // YYYY-MM
      monthly[monthKey] = (monthly[monthKey] || 0) + (p.amountClient || 0);
    });

    const paymentHistory = Object.entries(monthly).map(([month, amount]) => ({
      month,
      amount,
    }));

    // ✅ send safe response
    res.json({
      totalPayment: total._sum.amountClient || 0,
      paymentPerService, // currently empty until service link exists
      paymentHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load client finance" });
  }
}
