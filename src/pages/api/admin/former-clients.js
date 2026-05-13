import { prisma } from "../../../lib/prisma";

// Returns clients whose contract has been terminated. We use a soft-delete
// (status = "gekuendigt") so the historical record can stay visible to admins.
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "client",
        status: { in: ["gekuendigt", "canceled", "cancelled"] },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        requestEmail: true,
        phone: true,
        careCity: true,
        kanton: true,
        status: true,
        firstDate: true,
        createdAt: true,
        updatedAt: true,
        terminationReason: true,
        terminationDate: true,
      },
    });

    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden ehemaliger Kunden." });
  }
}
