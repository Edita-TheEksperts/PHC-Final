import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!id) return res.status(400).json({ error: "Voucher ID is required" });

    // ✅ UPDATE voucher
    if (req.method === "PUT") {
      const {
        code,
        discountType,
        discountValue,
        maxUses,
        validFrom,
        validUntil,
        isActive,
      } = req.body;

      const updatedVoucher = await prisma.voucher.update({
        where: { id },
        data: {
          code: code.trim().toUpperCase(),
          discountType,
          discountValue: parseFloat(discountValue),
          maxUses: parseInt(maxUses),
          validFrom: new Date(validFrom),
          validUntil: new Date(validUntil),
          isActive: Boolean(isActive),
        },
      });

      return res.status(200).json({ voucher: updatedVoucher });
    }

    // ✅ DELETE voucher
    if (req.method === "DELETE") {
      await prisma.voucher.delete({ where: { id } });
      return res.status(200).json({ message: "Voucher deleted successfully" });
    }

    // ❌ Method not allowed
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).end(`Method ${req.method} not allowed`);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
