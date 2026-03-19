import { hash } from "bcryptjs";
import { prisma } from "../../lib/prisma";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { form } = req.body;
    if (!form) return res.status(400).json({ message: "Form data missing" });

    const {
      firstName, lastName, email, password, phone,
      frequency, address, duration, firstDate,
      postalCode, city, street,
      services = [], subServices = [], schedules = []
    } = form;


    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Return userId so frontend can proceed
      return res.status(409).json({ message: "User already exists", userId: existing.id });
    }

    // If no password provided, generate a secure random one
    let finalPassword = password;
    if (!finalPassword) {
      finalPassword = Array.from({length: 16}, () => Math.random().toString(36)[2]).join("");
    }

    const parsedDate = new Date(firstDate.split(".").reverse().join("-"));
    const passwordHash = await hash(finalPassword, 10);

    const totalHours = schedules.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);
    const totalPayment = totalHours * 1;

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone,
        address,
        careStreet: street,
        carePostalCode: postalCode,
        careCity: city,
        frequency,
        duration: parseInt(duration, 10),
        firstDate: parsedDate,
        totalPayment,

        services: services?.length
          ? {
              connect: services.map(name => ({ name }))
            }
          : undefined,

        subServices: subServices?.length
          ? {
              connectOrCreate: subServices.map(name => ({
                where: { name },
                create: { name },
              }))
            }
          : undefined,

        schedules: {
          create: schedules.map(s => ({
            day: s.day,
            startTime: s.startTime,
            hours: parseFloat(s.hours),
            date: parsedDate,
          }))
        }
      }
    });

    // Send password setup email
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://phc.ch";
      // Generate a simple token (for demo; in production, use a secure, DB-stored token)
      const token = Math.random().toString(36).substring(2, 15);
      const passwordLink = `${baseUrl}/forgot-password`;

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Prime Home Care" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "Willkommen bei Prime Home Care AG – Passwort erstellen",
        html: `
<p>Hallo ${user.firstName || ""} ${user.lastName || ""}</p>
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

      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
    }

    res.status(200).json({ userId: user.id });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
}
