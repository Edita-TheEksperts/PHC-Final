import { prisma } from "../../lib/prisma.js";
import { sendEmail } from "../../lib/emails.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { scheduleId, workedHours, kilometers, employeeId } = req.body;

  // ✅ Validate input types
  if (
    typeof scheduleId !== "number" ||
    typeof workedHours !== "number" ||
    typeof kilometers !== "number" ||
    typeof employeeId !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Invalid input. Must be correct types." });
  }

  try {
    // 👉 update DB and include relations (user & employee)
    const updated = await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        hours: workedHours,
        kilometers,
        employeeId, // ✅ Save which employee did this
      },
      include: {
        user: true,
        employee: true,
      },
    });

    // 👉 send email to client if user exists
    if (updated?.user?.email) {
      await sendEmail({
        to: updated.user.email,
        subject: "⏰ Update zu Ihrem Einsatzplan",
        html: `
          <p>Guten Tag ${updated.user.firstName} ${updated.user.lastName},</p>
          <p>Ihre Betreuungsperson <b>${updated.employee?.firstName} ${updated.employee?.lastName}</b> 
          hat die Einsatzdaten angepasst:</p>
          <ul>
            <li><b>Stunden:</b> ${updated.hours}</li>
            <li><b>Kilometer:</b> ${updated.kilometers}</li>
          </ul>
          <p>Mit besten Grüßen,<br>Prime Home Care AG</p>
        `,
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Update failed" });
  }
}
