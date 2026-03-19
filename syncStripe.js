import Stripe from "stripe";
import {prisma} from "./src/lib/prisma.js";  // ✅ correct relative path

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function syncPayments() {
  const payments = await stripe.paymentIntents.list({ limit: 100 });

  for (const pi of payments.data) {
    if (pi.status === "succeeded") {
      const exists = await prisma.transaction.findUnique({
        where: { paymentIntentId: pi.id },
      });

      if (!exists) {
        await prisma.transaction.create({
          data: {
            userId: pi.metadata.userId,
            employeeId: pi.metadata.employeeId,
            scheduleId: parseInt(pi.metadata.scheduleId),
            paymentIntentId: pi.id,
            amountClient: pi.amount_received / 100,
            amountEmployee: 28.15 * (pi.metadata.hours || 1), // example
            status: "paid",
          },
        });
      }
    }
  }

}

syncPayments().catch(console.error);
