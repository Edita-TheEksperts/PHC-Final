import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, stripeCustomerId, stripePaymentMethodId } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId,
        stripePaymentMethodId,
      },
    });

    res.status(200).json({ message: "✅ Saved to DB" });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to save to DB" });
  }
}
