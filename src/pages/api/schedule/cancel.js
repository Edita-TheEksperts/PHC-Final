import { prisma } from "../../../lib/prisma";
import { sendAssignmentCancelledEmail } from "../../../lib/mailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { scheduleId, reason } = req.body;
  if (!scheduleId) return res.status(400).json({ error: "Missing scheduleId" });

  try {
    // 1. Update schedule status to cancelled
    const schedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: { status: "cancelled" },
      include: { user: true, employee: true },
    });

    // 2. Update client status to "storniert" so it's visible on their profile
    if (schedule.userId) {
      await prisma.user.update({
        where: { id: schedule.userId },
        data: { status: "storniert" },
      });
    }

    // 3. Log cancellation to ActivityLog for admin dashboard visibility
    await prisma.activityLog.create({
      data: {
        action: `Termin storniert: ${schedule.date ? new Date(schedule.date).toLocaleDateString("de-CH") : schedule.day || "–"} – ${reason || "Kein Grund angegeben"}`,
        targetType: "Schedule",
        targetId: String(scheduleId),
        actorUserId: schedule.userId || null,
      },
    }).catch(() => {});

    // 4. Send notification emails (client, admin, employee)
    await sendAssignmentCancelledEmail({ schedule, reason: reason || "-" });

    return res.status(200).json({ success: true, schedule });
  } catch (error) {
    return res.status(500).json({ error: "Failed to cancel schedule" });
  }
}
