import nodemailer from "nodemailer";

export async function sendCalendlyInvite(email, firstName = "") {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const calendlyLink = "https://calendly.com/primehomecare";

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Vereinbaren Sie Ihr Interview",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #333;">
        <p>Hallo ${firstName}</p>
        <br>
        <p>Vielen Dank für Ihre Bewerbung – wir freuen uns, Sie näher kennenzulernen!</p>
        <br>
        <p>
          Bitte wählen Sie über folgenden Link einen passenden Termin für ein Interview mit uns:
          <br><br>
          <a href="${calendlyLink}" style="text-decoration: underline;">
            Interview buchen
          </a>
        </p>
        <br>
        <p>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
        <br>
        <p>Freundliche Grüsse</p>
        <br>
        <p>Prime Home Care AG<br/>
          Birkenstrasse 49<br/>
          CH-6343 Rotkreuz<br/>
          info@phc.ch<br/>
          www.phc.ch
        </p>
        <br>
        <p>
          <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
          <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
        </p>
      </div>
    `,
  });
}
