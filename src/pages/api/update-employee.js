import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, email, ...data } = req.body;

    if (!id && !email) {
      return res.status(400).json({ error: "Missing identifier" });
    }

    const updated = await prisma.employee.update({
      where: id ? { id } : { email },
      data,
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Could not update employee" });
  }
}
