import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET ?userId=...
// Lists the Stripe charges for this user's customer and returns each charge's
// hosted receipt_url so the client can open a receipt. A client without any
// Stripe customer / charges gets a clean empty list (200 []), never an error.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end();
  }

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });

    // No customer yet → clean empty state, not an error.
    if (!user?.stripeCustomerId) return res.status(200).json([]);

    const charges = await stripe.charges.list({
      customer: user.stripeCustomerId,
      limit: 100,
    });

    const items = charges.data
      // Only show charges that actually went through.
      .filter((c) => c.status === "succeeded" || c.paid)
      .map((c) => ({
        id: c.id,
        date: new Date(c.created * 1000).toISOString(),
        amount: c.amount / 100,
        currency: (c.currency || "chf").toUpperCase(),
        receiptUrl: c.receipt_url,
        status: c.status,
      }));

    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: "Fehler beim Laden der Quittungen." });
  }
}
