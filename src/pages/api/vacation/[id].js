import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    await prisma.vacation.delete({ where: { id: Number(id) } });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Could not delete vacation" });
  }
}
