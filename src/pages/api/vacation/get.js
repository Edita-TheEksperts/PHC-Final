import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query
    try {
      const vacations = await prisma.vacation.findMany({
        where: { userId },
        orderBy: { startDate: "asc" }
      })
      return res.status(200).json(vacations)
    } catch (err) {
      return res.status(500).json({ error: "Urlaube konnten nicht geladen werden." })
    }
  }
  res.status(405).json({ error: "Methode nicht erlaubt" })
}
