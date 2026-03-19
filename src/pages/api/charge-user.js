// Example: backend route /api/charge-user.js
import Stripe from 'stripe';
import { prisma } from '../../lib/prisma';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { userId, amount } = req.body;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // in cents
    currency: 'chf',
    customer: user.stripeCustomerId,
    payment_method: user.stripePaymentMethodId,
    off_session: true,
    confirm: true,
    metadata: {
      userId: user.id,
      employeeId: user.employeeId || '',
      scheduleId: scheduleId || ''
    }
  });

  res.status(200).json({ status: "✅ Charged successfully", id: paymentIntent.id });
}
