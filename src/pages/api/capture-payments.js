// pages/api/capture-payments.js
import { capturePendingPayments } from "../../scripts/capturePayments";

export default async function handler(req, res) {
  try {
    await capturePendingPayments();
    res.status(200).json({ message: "Capture job ran" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
