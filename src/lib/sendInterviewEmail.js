import nodemailer from "nodemailer";

export default async function sendInterviewEmail(email, firstName = "") {
  const transporter = nodemailer.createTransport({
    host: "asmtp.mail.hostpoint.ch",
    port: 465,
    secure: true,
    auth: {
       user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const calendlyUrl = "https://calendly.com/primehomecare"; // ← Replace with real link

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px;">
      <p>Grüezi ${firstName || "Bewerber/in"}</p>
      <p>Vielen Dank für Ihre Bewerbung bei der <strong>Prime Home Care AG</strong>.</p>
      <p>Wir haben Ihre Unterlagen erfolgreich erhalten und werden diese sorgfältig prüfen.</p>
      <p>Wir melden uns so bald wie möglich mit weiteren Informationen bei Ihnen.</p>
      <br>
      <p>Freundliche Grüsse<br>
      Prime Home Care AG<br>
      Birkenstrasse 49<br>
      CH-6343 Rotkreuz<br>
      info@phc.ch<br>
      www.phc.ch</p>
      <p>
        <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
        <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Prime Home Care AG" <landingpage@phc.ch>`,
    to: email,
    subject: "Ihre Bewerbung bei Prime Home Care AG",
    html: htmlContent,
  });
}
