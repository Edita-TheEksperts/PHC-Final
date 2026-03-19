import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Body: { code: string, amount?: number, commit?: boolean }
 * - If commit === true (default), increments usedCount immediately (as in your plan).
 * - If you prefer to increment only after payment, pass commit:false here and call a separate "redeem" endpoint after charge.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, amount = null, commit = true } = req.body;
  const now = new Date();

  const voucher = await prisma.voucher.findUnique({
    where: { code: String(code).trim().toUpperCase() },
  });

  if (!voucher || !voucher.isActive) {
    return res.status(400).json({ error: "Invalid code" });
  }
  if (voucher.validFrom > now || voucher.validUntil < now) {
    return res.status(400).json({ error: "Code expired" });
  }
  if (voucher.usedCount >= voucher.maxUses) {
    return res.status(400).json({ error: "Maximum usage reached" });
  }

  // Compute discounted total if provided an amount
  let discountedTotal = null;
  if (amount !== null) {
    const n = Number(amount);
    if (voucher.discountType === "percent") {
      discountedTotal = Math.max(0, n - n * (voucher.discountValue / 100));
    } else {
      discountedTotal = Math.max(0, n - voucher.discountValue);
    }
  }

  // As per your plan: increment when validated
  if (commit) {
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: { usedCount: { increment: 1 } },
    });
  }

  return res.status(200).json({
    ok: true,
    voucher,
    discountedTotal,
  });
}
