import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { paymentIntentId, userId } = req.body;

  if (!paymentIntentId) {
    return res.status(400).json({ error: "paymentIntentId required" });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (intent.status === "requires_capture") {
      await stripe.paymentIntents.capture(paymentIntentId);
    } else if (intent.status !== "succeeded") {
      return res.status(400).json({
        error: `Cannot capture intent with status: ${intent.status}`,
      });
    }

    // Mark schedules captured and user paid
    if (userId) {
      await prisma.schedule.updateMany({
        where: { userId, captured: false },
        data: { captured: true },
      });

      try {
        await prisma.user.update({
          where: { id: userId },
          data: { manualPaid: true, paymentCaptured: true },
        });
      } catch (flagErr) {
        // These fields require a server restart after schema migration to take effect.
        // The Stripe capture and schedule update above already succeeded.
        console.warn("[manual-pay] Could not update user flags (restart server to apply schema):", flagErr.message);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[manual-pay] Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
