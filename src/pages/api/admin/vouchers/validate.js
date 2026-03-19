import { prisma } from "../../../../lib/prisma";


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code fehlt." });

  try {
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!voucher)
      return res.status(404).json({ error: "Gutschein nicht gefunden." });

    const now = new Date();
    if (
      !voucher.isActive ||
      voucher.validFrom > now ||
      voucher.validUntil < now ||
      voucher.usedCount >= voucher.maxUses
    ) {
      return res.status(400).json({ error: "Gutschein ist nicht gültig." });
    }

    return res.status(200).json({
      success: true,
      message: "Gutschein gültig!",
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
    });
  } catch (err) {
    return res.status(500).json({ error: "Serverfehler beim Prüfen." });
  }
}
