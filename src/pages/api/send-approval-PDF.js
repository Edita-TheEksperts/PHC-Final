// pages/api/send-approval.js
import { sendApprovalEmail } from "../../lib/emailHelpers"; // adjust path

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { employee } = req.body;

    await sendApprovalEmail(employee);

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
