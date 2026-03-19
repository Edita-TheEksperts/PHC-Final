import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { fullName, email, phone, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: fullName,
      email,
      phone: phone || "",
      passwordHash: hashedPassword,
      role,
    },
  });

  // If the user is an employee → send email with setup link
  if (role === "employee") {
    await sendAccountSetupEmail(email, fullName);
    return res
      .status(201)
      .json({ message: "Registration successful, check your email for login setup." });
  }

  res.status(201).json({
    message: "Registration successful, you can now log in to your dashboard.",
  });
}

// ------------------ EMAIL FUNCTION ------------------

async function sendAccountSetupEmail(userEmail, fullName) {
  // create transporter using Hostpoint credentials from .env
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // ✅ Base URL from .env (local or Vercel)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://phc.ch";
  const token = Math.random().toString(36).substring(2, 15); // example token (you can replace with real one)
  const passwordLink = `${baseUrl}/setpassword?token=${token}`;

  // ✅ Email HTML
  const mailOptions = {
    from: `"Prime Home Care" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: "Willkommen bei Prime Home Care AG – Passwort erstellen",
    html: `
<p>Hallo ${fullName}</p>
<p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
<p>Ihr Zugang zum Kundenportal wurde erfolgreich eingerichtet:</p>
<ul>
  <li>Buchungen verwalten</li>
  <li>Rechnungen einsehen</li>
  <li>Mit uns kommunizieren</li>
</ul>
<p><strong>Bitte erstellen Sie Ihr Passwort über die Schaltfläche unten:</strong></p>
<a href="${passwordLink}"
   style="display:inline-block; background-color:#B99B5F; color:#fff; padding:10px 18px; border-radius:5px; text-decoration:none; font-weight:bold;">
  Passwort erstellen
</a>
<br><br>
<p>Ihr Prime Home Care Team</p>

    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
  }
}
