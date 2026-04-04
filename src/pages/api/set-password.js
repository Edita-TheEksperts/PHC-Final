import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Not allowed" });

  const { email, password, token } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email und Passwort sind erforderlich." });
  }

  if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    return res.status(400).json({ message: "Passwort muss mindestens 8 Zeichen, Gross-/Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten." });
  }

  try {
    // Verify token if provided (secure path)
    if (token) {
      const employee = await prisma.employee.findFirst({
        where: { email, resetToken: token, resetTokenExpiry: { gt: new Date() } },
      });
      if (!employee) {
        return res.status(401).json({ message: "Ungültiger oder abgelaufener Token." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.employee.update({
        where: { email },
        data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
      });
    } else {
      // Fallback: only allow if employee has no password yet (first-time setup)
      const employee = await prisma.employee.findUnique({ where: { email } });
      if (!employee) return res.status(404).json({ message: "Mitarbeiter nicht gefunden." });
      if (employee.password) {
        return res.status(403).json({ message: "Passwort bereits gesetzt. Bitte nutzen Sie 'Passwort vergessen'." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.employee.update({
        where: { email },
        data: { password: hashedPassword },
      });
    }

    res.status(200).json({ message: "Passwort gespeichert." });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Speichern." });
  }
}
