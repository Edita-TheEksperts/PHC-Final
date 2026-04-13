import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET ?userId=...&month=YYYY-MM
// Looks up the Stripe customer for this user, finds invoices for that month,
// and redirects to Stripe's hosted_invoice_url (or invoice_pdf fallback).
// Falls back to 404 when no matching invoice exists.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { userId, month } = req.query; // month = "YYYY-MM"
  if (!userId || !month) return res.status(400).json({ error: "userId and month required" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeCustomerId: true },
    });
    if (!user?.stripeCustomerId) {
      return res.status(404).json({ error: "Kein Stripe-Kunde für diesen Nutzer gefunden." });
    }

    const [year, mo] = month.split("-").map(Number);
    const startSec = Math.floor(new Date(year, mo - 1, 1).getTime() / 1000);
    const endSec = Math.floor(new Date(year, mo, 1).getTime() / 1000);

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 100,
      created: { gte: startSec, lt: endSec },
    });

    // Prefer paid invoices; fall back to the first one in the window
    const paid = invoices.data.find(i => i.status === "paid");
    const invoice = paid || invoices.data[0];

    if (!invoice) {
      return res.status(404).json({ error: "Keine Rechnung für diesen Monat gefunden." });
    }

    const target = invoice.hosted_invoice_url || invoice.invoice_pdf;
    if (!target) {
      return res.status(404).json({ error: "Stripe hat keine herunterladbare Rechnung geliefert." });
    }

    res.redirect(302, target);
  } catch (err) {
    return res.status(500).json({ error: "Fehler beim Laden der Stripe-Rechnung." });
  }
}
