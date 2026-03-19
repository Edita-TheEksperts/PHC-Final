import Stripe from "stripe";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const users = await prisma.user.findMany({
      where: { paymentIntentId: { not: null } },
      include: { schedules: true }
    });

    const results = [];

    for (const user of users) {
      const intent = await stripe.paymentIntents.retrieve(user.paymentIntentId);
let status;

if (intent.metadata?.manualPaid === "true") {
  status = "manuell";
} else if (intent.status === "succeeded") {
  status = "bezahlt";
} else if (intent.status === "requires_capture") {
  status = "offen";
} else if (intent.status === "requires_payment_method") {
  status = "fehler";
} else {
  status = "fehler";
}




 const amount =
  intent.metadata?.manualPaid === "true"
    ? intent.amount / 100
    : intent.status === "succeeded"
    ? intent.amount_received / 100
    : intent.amount / 100;


const paymentDate =
  intent.metadata?.manualPaid === "true"
    ? new Date() // manual paid now
    : intent.created
    ? new Date(intent.created * 1000)
    : null;


results.push({
  userId: user.id,
  paymentIntentId: user.paymentIntentId,   // ⭐ NECESSARY
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  amount,
  status,
  schedules: user.schedules.map(s => ({
    day: s.day,
    hours: s.hours,
    date: s.date,
    captured: s.captured
  })),
  stripeStatus: intent.status,
  lastError: intent.last_payment_error?.message || null,
  manualPaid: intent.metadata?.manualPaid === "true",
  paymentDate
});

    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
