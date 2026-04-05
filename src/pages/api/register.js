import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const ALLOWED_ROLES = ["client", "employee"];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Passwort muss mindestens 8 Zeichen lang sein" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.trim().toLowerCase(),
        phone: phone || "",
        passwordHash: hashedPassword,
        role,
        address: "Schweiz",
        frequency: "einmalig",
      },
    });

    if (role === "employee") {
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 7 * 24 * 3600000) },
      });
      await sendSetupEmail(email, fullName, token);
      return res.status(201).json({ message: "Registrierung erfolgreich. Bitte prüfen Sie Ihre E-Mail." });
    }

    res.status(201).json({ message: "Registrierung erfolgreich. Sie können sich jetzt einloggen." });
  } catch (error) {
    console.error("[register] Error:", error.message);
    res.status(500).json({ message: "Registrierung fehlgeschlagen. Bitte erneut versuchen." });
  }
}

async function sendSetupEmail(userEmail, fullName, token) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch";
  const escapedName = fullName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    await transporter.sendMail({
      from: `"Prime Home Care" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: "Willkommen bei Prime Home Care AG – Passwort erstellen",
      html: `<p>Hallo ${escapedName}</p>
<p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
<p><a href="${baseUrl}/reset-password?resetToken=${token}" style="display:inline-block;background-color:#B99B5F;color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-weight:bold;">Passwort erstellen</a></p>
<p>Ihr Prime Home Care Team</p>`,
    });
  } catch (error) {
    console.error("[register] Email send failed:", error.message);
  }
}
