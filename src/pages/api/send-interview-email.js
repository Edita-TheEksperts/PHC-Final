import sendInterviewEmail from "../../lib/sendInterviewEmail"; // adjust path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, firstName } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    await sendInterviewEmail(email, firstName);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Email send failed" });
  }
}
