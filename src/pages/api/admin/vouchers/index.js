import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  try {
    // ✅ GET → list all vouchers with usage stats
    if (req.method === "GET") {
      const vouchers = await prisma.voucher.findMany({
        orderBy: { createdAt: "desc" },
      });

      // 🧮 Calculate stats for admin dashboard
      const total = vouchers.length;
      const used = vouchers.filter((v) => v.usedCount > 0).length;
      const active = vouchers.filter((v) => v.isActive).length;
      const usageRate = total ? Math.round((used / total) * 100) : 0;

      return res.status(200).json({
        vouchers,
        stats: { total, used, active, usageRate },
      });
    }

    // ✅ POST → create a new voucher
    if (req.method === "POST") {
      const {
        code,
        discountType,
        discountValue,
        maxUses,
        validFrom,
        validUntil,
        isActive,
      } = req.body;

      // ✅ Validate required fields
      if (
        !code ||
        !discountType ||
        discountValue === undefined ||
        !maxUses ||
        !validFrom ||
        !validUntil
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // ✅ Create voucher in DB
      const voucher = await prisma.voucher.create({
        data: {
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          maxUses: parseInt(maxUses),
          usedCount: 0, // 🧮 track usage
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil),
          isActive: isActive !== undefined ? Boolean(isActive) : true,
        },
      });

      return res.status(201).json({ voucher });
    }

    // ❌ Method not allowed
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
