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

      const { name, vorname, email, region, questions } = fields;

      // Validate required fields
      if (!name || !vorname || !email || !region || !questions) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create transporter for sending email using Nodemailer
      const transporter = nodemailer.createTransport({
        host: 'asmtp.mail.hostpoint.ch',
        port: 465,
        secure: true,
        auth: {
          user: 'landingpage@phc.ch',
          pass: '4Z6j0JmP7ATGC#%!',
        },
      });

      try {
        // Verify the connection configuration for Nodemailer
        await transporter.verify();

        // Prepare the email HTML body
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
            <h2 style="color: #2c3e50; text-align: center;">Neues Formular aus dem Jobs-Kontaktformular</h2>
            <p style="color: #34495e; text-align: center;">Nachfolgend finden Sie die Details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Vorname:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${vorname}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Region:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${region}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Fragen:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${questions}</td>
              </tr>
            </table>
            

Freundliche Grüsse  

<p>
  Prime Home Care AG<br/>
  Birkenstrasse 49<br/>
  CH-6343 Rotkreuz<br/>
  info@phc.ch<br/>
  www.phc.ch
</p>

<p>
  <a
    href="https://phc.ch/AVB"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "underline",
      color: "#04436F",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    AVB und Nutzungsbedingungen
  </a>
</p>         </div>
        `;

        // Prepare the attachments array, checking if CV exists
        let attachments = [];
        if (files.cv && Array.isArray(files.cv) && files.cv[0]?.filepath) {
          const cvFile = files.cv[0]; // Get the first file from the list
          const cvFileContent = fs.readFileSync(cvFile.filepath, { encoding: "base64" });
          attachments.push({
            filename: cvFile.originalFilename,
            content: cvFileContent,
            encoding: 'base64',
          });
        }

        await transporter.sendMail({
          from: `"Jobs Landing Page" <landingpage@phc.ch>`,
          to: 'landingpage@phc.ch',
          cc: ['admin@phc.ch','jobs@phc.ch'],
          subject: `Formular: Jobs Landing Page ${name}`,
          html: htmlContent,
          attachments: attachments,
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
