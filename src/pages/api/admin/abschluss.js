import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  if (req.method === "GET") {
    const record = await prisma.clientAbschluss.findFirst({
      where: { userId: String(userId) },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ abschluss: record || null });
  }

  if (req.method === "POST") {
    const { endDate, reason, satisfaction, recommendations, notes, completedBy } = req.body;
    if (!endDate) return res.status(400).json({ error: "Missing endDate" });

    const record = await prisma.clientAbschluss.create({
      data: {
        userId: String(userId),
        endDate: new Date(endDate),
        reason: reason || null,
        satisfaction: satisfaction || null,
        recommendations: recommendations || null,
        notes: notes || null,
        completedBy: completedBy || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: `Abschluss-Fragebogen ausgefüllt (Enddatum: ${new Date(endDate).toLocaleDateString("de-CH")})`,
        targetType: "User",
        targetId: String(userId),
      },
    }).catch(() => {});

    return res.status(200).json({ success: true, abschluss: record });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
