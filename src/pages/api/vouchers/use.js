import { prisma } from "../../../lib/prisma"; 

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code, userId } = req.body;

    // ❗ Voucher code required, userId is optional
    if (!code) {
      return res.status(400).json({ error: "Missing voucher code" });
    }


    // Find voucher
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.trim().toUpperCase() },
    });

    if (!voucher) {
      return res.status(404).json({ error: "Gutschein nicht gefunden." });
    }

    // Check validity
    const now = new Date();
    const isExpired = voucher.validUntil && new Date(voucher.validUntil) < now;
    const isMaxed = voucher.maxUses && voucher.usedCount >= voucher.maxUses;

    if (!voucher.isActive) {
      return res.status(400).json({ error: "Gutschein ist inaktiv.", reason: "inactive", voucher });
    }
    if (isExpired) {
      return res.status(400).json({ error: "Gutschein ist abgelaufen.", reason: "expired", voucher });
    }
    if (isMaxed) {
      return res.status(400).json({ error: "Gutschein wurde bereits zu oft verwendet.", reason: "maxed", voucher });
    }

    // Prepare update data
    const updateData = {
      usedCount: { increment: 1 },
    };

    // Connect to user **only if userId exists**
    if (userId) {
      updateData.usedBy = { connect: { id: userId } };
    }

    await prisma.voucher.update({
      where: { code: voucher.code },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      discountType: voucher.discountType?.toLowerCase() || null,
      discountValue: voucher.discountValue ?? 0,
      message: "Gutschein erfolgreich eingelöst!",
      voucher,
    });

  } catch (err) {
    return res.status(500).json({ error: "Serverfehler beim Überprüfen des Gutscheins." });
  }
}
