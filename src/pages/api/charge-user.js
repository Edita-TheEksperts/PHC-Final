import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, amount, scheduleId } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "Missing userId or amount" });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.stripeCustomerId || !user.stripePaymentMethodId) {
      return res.status(400).json({ error: "User has no payment method configured" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'chf',
      customer: user.stripeCustomerId,
      payment_method: user.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        userId: user.id,
        scheduleId: scheduleId || '',
      },
    });

    res.status(200).json({ status: "Charged successfully", id: paymentIntent.id });
  } catch (err) {
    console.error("[charge-user] Error:", err.message);
    res.status(500).json({ error: "Payment failed" });
  }
}
