import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Check both user (client) and employee tables
  const user = await prisma.user.findUnique({ where: { email } });
  const employee = !user ? await prisma.employee.findUnique({ where: { email } }) : null;

  // Always return success to prevent email enumeration
  if (!user && !employee) {
    return res.status(200).json({ success: true });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1h

  if (user) {
    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
  } else {
    await prisma.employee.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
  }

  const firstName = user ? user.firstName : employee.firstName;
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?resetToken=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Passwort zurücksetzen",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName}</p>
          <p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
          <a 
            href="${resetLink}"
            style="display:inline-block;padding:12px 20px;background:#04436F;color:white;text-decoration:none;border-radius:6px;font-weight:bold;"
          >
            Passwort zurücksetzen
          </a>
          <p>Dieser Link ist 1 Stunde gültig.</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: "Email could not be sent" });
  }
}
