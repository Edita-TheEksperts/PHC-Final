import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {

  try {
    // 1️⃣ Merr të gjitha pagesat
    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
        employee: true,
      },
      orderBy: { createdAt: "desc" },
    });


    // 2️⃣ Ndarja sipas statusit
    const paid = transactions.filter(t => t.status === "paid");
    const pending = transactions.filter(t => t.status === "pending");
    const error = transactions.filter(t =>
      ["failed", "canceled", "error"].includes(t.status)
    );

    // 3️⃣ Llogarit totalet
    const sum = arr =>
      arr.reduce((acc, t) => acc + (t.amountClient || 0), 0);

    const income = {
      allTimePaid: sum(paid),
      allTimePending: sum(pending),
      allTimeError: sum(error),
      thisMonthPaid: sum(
        paid.filter(t => {
          const d = new Date(t.createdAt);
          const now = new Date();
          return d.getMonth() === now.getMonth() &&
                 d.getFullYear() === now.getFullYear();
        })
      ),
    };

    // 4️⃣ Voucher-at
    const vouchers = await prisma.voucher.findMany();

    return res.json({
      income,
      invoices: transactions, // TE GJITHA PAGESAT
      vouchers,
    });

  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
