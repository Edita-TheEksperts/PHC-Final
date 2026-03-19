// /pages/api/admin/profile.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const admin = await prisma.user.findFirst({
      where: { role: "admin" },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    if (!admin) return res.status(404).json({ error: "Admin user not found" });

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin profile" });
  }
}
