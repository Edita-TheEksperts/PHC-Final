// pages/api/finances/retry-payments.js
import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails.js";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // 🔐 Security: Cron Authorization
  if (req.headers.authorization !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "GET") return res.status(405).end();

  const now = new Date();

  try {
    // 🔎 Find users whose payment needs retrying
    const users = await prisma.user.findMany({
      where: {
        paymentIntentId: { not: null },
        manualPaid: false,
        phc: false,                   // not flagged yet
        nextAttempt: { lte: now },    // attempt time reached
        attempts: { lt: 3 }           // max 3 attempts
      }
    });

    for (const user of users) {
      try {
        const intent = await stripe.paymentIntents.retrieve(user.paymentIntentId);

        // Only capture if Stripe allows it
        if (intent.status !== "requires_capture") {
          throw new Error("Not capturable");
        }

        // 💰 Try to capture payment
        await stripe.paymentIntents.capture(user.paymentIntentId);

        await prisma.user.update({
          where: { id: user.id },
          data: {
            paymentCaptured: true,
            attempts: user.attempts + 1,
            nextAttempt: null,
            reminderCount: user.reminderCount + 1
          }
        });

      } catch (err) {
        const attempts = user.attempts + 1;

        // ❌ Payment failed 3 times → flag user + notify admin
        if (attempts >= 3) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              phc: true,               // mark as persistent failure
              nextAttempt: null,
              attempts
            }
          });

          // 📩 EMAIL ADMINIT
          await sendEmail({
            to: process.env.ADMIN_NOTIFICATION_EMAIL,
            subject: `⚠️ Payment failed 3 times – ${user.firstName} ${user.lastName}`,
            html: `
              <h2>⚠️ Payment Failure Alert</h2>
              <p>A client's payment has failed three times.</p>
              
              <p><strong>Client:</strong> ${user.firstName} ${user.lastName}</p>
              <p><strong>Email:</strong> ${user.email}</p>
              <p><strong>PaymentIntent ID:</strong> ${user.paymentIntentId}</p>

              <p>This client may need manual follow-up.</p>
            `
          });

        } else {
          // ⏳ Schedule next retry after 48h
          const nextAttempt = new Date();
          nextAttempt.setHours(nextAttempt.getHours() + 48);

          await prisma.user.update({
            where: { id: user.id },
            data: {
              attempts,
              reminderCount: user.reminderCount + 1,
              nextAttempt
            }
          });
        }
      }
    }

    res.status(200).json({ ok: true });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
