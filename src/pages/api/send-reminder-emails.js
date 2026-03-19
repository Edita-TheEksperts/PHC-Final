import { sendReminderForInviteInterview } from "../../lib/sendReminderForInviteInterview";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    await sendReminderForInviteInterview();
    res.status(200).json({ message: "Reminder emails sent" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send reminders", error: error.message });
  }
}
