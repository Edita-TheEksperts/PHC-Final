import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: "Fehlender Token oder Passwort" });
  }

  const user = await prisma.user.findFirst({
    where: { resetToken },
  });

  if (!user) {
    return res.status(404).json({ message: "Ungültiger oder abgelaufener Reset-Token" });
  }

  if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
    return res.status(400).json({ message: "Reset-Token abgelaufen" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  res.status(200).json({ message: "Passwort erfolgreich zurückgesetzt!" });
}
