import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { scheduleId, employeeId } = req.body;


    if (!scheduleId || !employeeId) {
      return res.status(400).json({ error: "Missing scheduleId or employeeId" });
    }

    const updatedSchedule = await prisma.schedule.update({
      where: { id: scheduleId },
      data: { employeeId },
      include: {
        employee: { select: { firstName: true, lastName: true } },
      },
    });


    return res.status(200).json(updatedSchedule);
  } catch (error) {
    return res.status(500).json({ error: "Failed to assign employee" });
  }
}
