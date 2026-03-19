import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;

  try {
    let customer = await stripe.customers.list({ email, limit: 1 });
    let stripeCustomer;

    if (customer.data.length > 0) {
      stripeCustomer = customer.data[0];
    } else {
      stripeCustomer = await stripe.customers.create({ email });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomer.id,
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomer.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
