import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Invalid email" });
  }

  const existing = await prisma.employee.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  return res.status(200).json({ exists: !!existing });
}
