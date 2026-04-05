import { prisma } from "../../../../../lib/prisma";
import { sendEmail } from "../../../../../lib/emails";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { date, startTime, hours, serviceName, subServiceName, userId, employeeId } = req.body;

    // 1. Get old schedule with relations before cancelling
    const oldSchedule = await prisma.schedule.findUnique({
      where: { id: Number(id) },
      include: { user: true, employee: true },
    });

    // 2. Cancel old schedule
    await prisma.schedule.update({
      where: { id: Number(id) },
      data: { status: "cancelled" },
    });

    // 3. Cancel related assignments
    await prisma.assignment.updateMany({
      where: { scheduleId: Number(id), confirmationStatus: { in: ["pending", "confirmed"] } },
      data: { confirmationStatus: "cancelled", status: "cancelled" },
    });

    // 4. Create new schedule
    const day = new Date(date).toLocaleDateString("de-DE", { weekday: "long" });

    const newSchedule = await prisma.schedule.create({
      data: {
        day,
        date: new Date(date),
        startTime,
        hours,
        serviceName,
        subServiceName,
        userId: userId || oldSchedule?.userId || undefined,
        employeeId: employeeId || null,
        status: "active",
      },
      include: { user: true, employee: true },
    });

    // 5. Notify client about reschedule
    if (newSchedule.user?.email) {
      try {
        await sendEmail({
          to: newSchedule.user.email,
          subject: "Ihr Termin wurde geändert",
          html: `
<p>Hallo ${newSchedule.user.firstName} ${newSchedule.user.lastName}</p>
<p>Ihr Termin wurde aktualisiert:</p>
<p><strong>${day}, ${new Date(date).toLocaleDateString("de-DE")}</strong> um <strong>${startTime}</strong> Uhr (${hours} Stunden)</p>
<p>Freundliche Grüsse<br>Prime Home Care AG</p>
          `,
        });
      } catch {}
    }

    // 6. Notify employee about reschedule
    if (newSchedule.employee?.email) {
      try {
        await sendEmail({
          to: newSchedule.employee.email,
          subject: "Einsatz wurde geändert",
          html: `
<p>Hallo ${newSchedule.employee.firstName}</p>
<p>Ihr Einsatz wurde aktualisiert:</p>
<p><strong>${day}, ${new Date(date).toLocaleDateString("de-DE")}</strong> um <strong>${startTime}</strong> Uhr (${hours} Stunden)</p>
<p>Kunde: ${newSchedule.user?.firstName || ""} ${newSchedule.user?.lastName || ""}</p>
<p>Freundliche Grüsse<br>Prime Home Care AG</p>
          `,
        });
      } catch {}
    }

    res.status(200).json(newSchedule);
  } catch (error) {
    console.error("[schedules/edit] Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
}
