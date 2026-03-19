import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { customerId } = req.query;

  if (!customerId)
    return res.status(400).json({ error: "customerId fehlt" });

  try {
    const methods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    if (methods.data.length === 0)
      return res.status(200).json({ paymentMethod: null });

    const pm = methods.data[0];

    res.status(200).json({
      paymentMethod: {
        brand: pm.card.brand,
        last4: pm.card.last4,
        exp_month: pm.card.exp_month,
        exp_year: pm.card.exp_year,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Payment Method konnte nicht geladen werden" });
  }
}
