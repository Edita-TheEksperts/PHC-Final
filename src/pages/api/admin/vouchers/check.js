import { prisma } from "../../../../lib/prisma";


export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Voucher code required" });

    // Find voucher in DB
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!voucher)
      return res.status(404).json({ error: "Voucher not found." });

    // Check validity
    const now = new Date();
    if (!voucher.isActive)
      return res.status(400).json({ error: "Voucher is inactive." });

    if (voucher.validFrom > now)
      return res.status(400).json({ error: "Voucher not yet valid." });

    if (voucher.validUntil < now)
      return res.status(400).json({ error: "Voucher has expired." });

    if (voucher.usedCount >= voucher.maxUses)
      return res.status(400).json({ error: "Voucher usage limit reached." });

    // Everything OK ✅
    return res.status(200).json({
      success: true,
      message: "Voucher is valid!",
      voucher: {
        code: voucher.code,
        discountType: voucher.discountType, // "percent" or "fixed"
        discountValue: voucher.discountValue,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
