import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { userId, newPaymentMethodId, customerId } = req.body;

  if (!userId || !newPaymentMethodId || !customerId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1) Attach new card to customer
    await stripe.paymentMethods.attach(newPaymentMethodId, {
      customer: customerId,
    });

    // 2) Make it default
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: newPaymentMethodId,
      },
    });

    // 3) Update DB
    await prisma.user.update({
      where: { id: userId },
      data: { stripePaymentMethodId: newPaymentMethodId },
    });

    res.status(200).json({
      success: true,
      newPaymentMethodId,
    });
  } catch (error) {
    res.status(500).json({ error: "Could not update payment method" });
  }
}
