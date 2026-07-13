// /pages/api/admin/profile.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Identity is injected by src/middleware.js from the verified adminToken cookie.
  const adminEmail = req.headers["x-admin-email"];
  if (!adminEmail) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { firstName: true, lastName: true, email: true, phone: true },
    });
    if (!admin) return res.status(404).json({ error: "Admin user not found" });
    return res.status(200).json(admin);
  }

  if (req.method === "PATCH") {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Bitte beide Passwoerter angeben." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Passwort muss mind. 6 Zeichen lang sein." });
    }

    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    if (!admin) return res.status(404).json({ message: "Admin nicht gefunden." });

    const ok = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: "Aktuelles Passwort ist falsch." });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email: adminEmail }, data: { passwordHash } });
    return res.status(200).json({ message: "Passwort aktualisiert." });
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).end();
}
