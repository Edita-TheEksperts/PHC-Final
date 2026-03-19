import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  // Method guard
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Ensure ID is valid
  const rawId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const id = Number.parseInt(String(rawId), 10);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: "Invalid appointment id" });
  }

  try {
    const appt = await prisma.schedule.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            address: true,
            careCity: true,

            // ✅ relations from user
            services: {
              select: { id: true, name: true },
            },
            subServices: {
              select: { id: true, name: true },
            },
          },
        },
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            city: true,
            languages: true,
            profilePhoto: true,
          },
        },
      },
    });

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ✅ prepare clean strings (optional but helpful)
    const userServices =
      Array.isArray(appt.user?.services) && appt.user.services.length > 0
        ? appt.user.services.map((s) => s?.name).filter(Boolean).join(", ")
        : null;

    const userSubServices =
      Array.isArray(appt.user?.subServices) && appt.user.subServices.length > 0
        ? appt.user.subServices.map((s) => s?.name).filter(Boolean).join(", ")
        : null;

    // ✅ fallback to schedule fields if needed
    const serviceNameToShow = userServices || appt.serviceName || null;
    const subServiceNameToShow = userSubServices || appt.subServiceName || null;

    return res.status(200).json({
      id: appt.id,
      date: appt.date ? appt.date.toISOString() : null,
      startTime: appt.startTime,
      hours: appt.hours,
      notes: appt.notes ?? null,

      // ✅ keep originals
      user: appt.user,
      client: appt.user,
      employee: appt.employee,

      // ✅ add these so frontend always has them
      serviceName: serviceNameToShow,
      subServiceName: subServiceNameToShow,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
