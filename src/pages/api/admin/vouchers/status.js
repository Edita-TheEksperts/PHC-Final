import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    const total = await prisma.voucher.count();
    const active = await prisma.voucher.count({ where: { isActive: true } });
    const inactive = await prisma.voucher.count({ where: { isActive: false } });
    const expired = await prisma.voucher.count({
      where: {
        validUntil: { lt: new Date() },
      },
    });

    const used = await prisma.voucher.count({
      where: { usedCount: { gt: 0 } },
    });

    res.status(200).json({
      total,
      active,
      inactive,
      expired,
      used,
    });
  } catch (error) {
    res.status(500).json({ error: "Fehler beim Abrufen der Gutschein-Statistiken" });
  }
}
