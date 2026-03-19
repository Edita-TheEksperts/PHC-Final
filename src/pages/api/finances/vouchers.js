import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        usedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    const total = vouchers.length;
    const used = vouchers.filter((v) => v.usedBy.length > 0).length;
    const active = vouchers.filter((v) => v.isActive).length;

    return res.status(200).json({
      vouchers,
      stats: {
        total,
        used,
        active,
        usageRate: total ? Math.round((used / total) * 100) : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ vouchers: [] });
  }
}
