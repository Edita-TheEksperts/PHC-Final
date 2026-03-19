import { chargeUnpaidUsers } from '../../utils/payment-capture-cron';
import { runUnassignedClientEmails } from '../../scripts/unassigned-client-cron';

export default async function handler(req, res) {
  if (req.query.secret !== process.env.CRON_SECRET) {
    return res.status(401).send('Unauthorized');
  }

  try {

    await chargeUnpaidUsers();              // Stripe charge
    await runUnassignedClientEmails();     // Email për klientë pa employee

    res.status(200).send('✅ Cron ran successfully');
  } catch (err) {
    res.status(500).send('❌ Error running cron');
  }
}
