import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Fehlender Token oder Passwort" });
  }

  if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/\d/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
    return res.status(400).json({ message: "Passwort muss mindestens 8 Zeichen, Gross-/Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten." });
  }

  // Check both user (client) and employee tables
  const user = await prisma.user.findFirst({ where: { resetToken } });
  const employee = !user ? await prisma.employee.findFirst({ where: { resetToken } }) : null;

  if (!user && !employee) {
    return res.status(404).json({ message: "Ungültiger oder abgelaufener Reset-Token" });
  }

  const record = user || employee;
  if (!record.resetTokenExpiry || record.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Reset-Token abgelaufen" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
  } else {
    await prisma.employee.update({
      where: { id: employee.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
    });
  }

  res.status(200).json({ message: "Passwort erfolgreich zurückgesetzt!" });
}
