import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Not allowed" });

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email und Passwort sind erforderlich." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.employee.update({
      where: { email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Passwort gespeichert." });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Speichern." });
  }
}
