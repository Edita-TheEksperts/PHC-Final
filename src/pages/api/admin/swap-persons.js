import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });

  const user = await prisma.user.findUnique({
    where: { id: String(userId) },
    select: {
      requestFirstName: true,
      requestLastName: true,
      requestPhone: true,
      careFirstName: true,
      careLastName: true,
      carePhone: true,
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  const updated = await prisma.user.update({
    where: { id: String(userId) },
    data: {
      requestFirstName: user.careFirstName,
      requestLastName: user.careLastName,
      requestPhone: user.carePhone,
      careFirstName: user.requestFirstName,
      careLastName: user.requestLastName,
      carePhone: user.requestPhone,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: "Positionswechsel: Anfragende ↔ Betreuende Person getauscht",
      targetType: "User",
      targetId: String(userId),
    },
  }).catch(() => {});

  return res.status(200).json({ success: true, user: updated });
}
