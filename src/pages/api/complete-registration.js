import Stripe from 'stripe';
import { prisma } from "../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (!session_id) {
    return res.status(400).json({ error: "❌ Missing session_id" });
  }

  try {
    // ✅ Get Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(400).json({ error: "❌ Session not found" });
    }

    const userId = session.metadata?.userId;
    const paymentIntentId = session.payment_intent;

    if (!userId) {
      return res.status(400).json({ error: "❌ userId missing in metadata" });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ error: "❌ No payment intent on session" });
    }

    // With capture_method: 'manual', payment_status is 'unpaid' at this point
    // (card is authorized but not yet charged). Also support legacy 'paid' (immediate capture).
    if (session.payment_status !== 'paid' && session.payment_status !== 'unpaid') {
      return res.status(400).json({ error: "❌ Payment not authorized" });
    }

    // For 'unpaid' (manual capture), verify the intent is actually authorized
    if (session.payment_status === 'unpaid') {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!['requires_capture', 'succeeded'].includes(intent.status)) {
        return res.status(400).json({ error: `❌ Payment intent not authorized (status: ${intent.status})` });
      }
    }

    // ✅ Update the user with paymentIntentId
    await prisma.user.update({
      where: { id: userId },
      data: { paymentIntentId },
    });

    // ✅ Return userId for frontend to fetch user data
    res.status(200).json({ success: true, userId });
  } catch (err) {
    console.error('[complete-registration] Error:', err.message);
    res.status(500).json({ error: "❌ Internal server error" });
  }
}
