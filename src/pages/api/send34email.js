import nodemailer from 'nodemailer';
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing form" });
      }

      const { email, additionalQuestion } = fields;

      // Validate required fields
      if (!email || !additionalQuestion) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create transporter for sending email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'asmtp.mail.hostpoint.ch',
        port: 465,
        secure: true,
        auth: {
          user: 'landingpage@phc.ch',
          pass: '45uYjTaR_N!x4AE',
        },
      });

      try {
        // Verify the connection configuration for Nodemailer
        await transporter.verify();

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
          <h2 style="color: #2c3e50; text-align: center;">Neues Formular aus dem Kunden-Kontaktformular</h2>
          <p style="color: #34495e; text-align: center;">Nachfolgend finden Sie die Details:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Kommentar:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${additionalQuestion}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #34495e; text-align: center;">Vielen Dank!</p>
        </div>
      `;

        // Send the email with the form data
        await transporter.sendMail({
          from: `"Kunden Landing Page" <landingpage@phc.ch>`,
          to: 'info@phc.ch',
          cc: ['edita.latifi@the-eksperts.com'],
          subject: `Formular: Kunden Landing Page ${email}`,
          html: htmlContent,
        });

        res.status(200).json({ message: 'Email sent successfully!' });

      } catch (error) {
        res.status(500).json({ error: `Failed to send email: ${error.message}` });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
