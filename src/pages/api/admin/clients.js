import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const clients = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    res.status(200).json({ clients });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Laden der Kunden." });
  }
}
