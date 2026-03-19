import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    // Merr të gjithë voucher-at me përdorimet (nga rezervimet)
    const vouchers = await prisma.voucher.findMany({
      include: {
        bookings: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Llogarit statistika
    const total = vouchers.length;
    const used = vouchers.filter((v) => v.bookings.length > 0).length;
    const totalRedemptions = vouchers.reduce(
      (sum, v) => sum + v.bookings.length,
      0
    );

    const totalDiscountGiven = vouchers.reduce((sum, v) => {
      return sum + v.bookings.length * v.discountValue;
    }, 0);

    res.status(200).json({
      vouchers,
      stats: {
        total,
        used,
        totalRedemptions,
        totalDiscountGiven,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load voucher usage data" });
  }
}
