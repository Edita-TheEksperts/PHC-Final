import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendTerminationEmail({ email, firstName, lastName, immediate = false }) {
  const today = new Date().toLocaleDateString("de-CH");

  let subject, html;
  if (immediate) {
    subject = "Bestätigung Ihrer fristlosen Kündigung bei Prime Home Care AG";
    html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222;">
        <p>Grüezi ${firstName || ""} ${lastName || ""}</p>
        <br>
        <p>Wir bestätigen hiermit die fristlose Kündigung unserer Dienstleistung.</p>
        <br>
        <p>Gemäss unseren AGBs wird eine Aufwandsentschädigung von CHF 300.- exkl. MwSt. berechnet.</p>
        <br>
        <p>Falls Sie Fragen haben oder weitere Unterstützung benötigen, stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
        <br>
        <p>Wir würden uns freuen, Sie in Zukunft wieder als Kunden begrüssen zu dürfen.</p>
        <br>
        <p>Freundliche Grüsse</p>
        <br>
        <p>Prime Home Care AG<br/>
        Birkenstrasse 49<br/>
        CH-6343 Rotkreuz<br/>
        info@phc.ch<br/>
        www.phc.ch</p>
        <br>
        <p>
          <a href="https://phc.ch/AVB" target="_blank">AVB</a> und 
          <a href="https://phc.ch/nutzungsbedingungen" target="_blank">Nutzungsbedingungen</a>
        </p>
      </div>
    `;
  } else {
    subject = "Bestätigung Ihrer Kündigung bei Prime Home Care AG";
    html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222;">
        <p>Grüezi ${firstName || ""} ${lastName || ""}</p>
        <br>
        <p>Wir bestätigen hiermit die Kündigung unserer Dienstleistung.</p>
        <br>
        <p>Der bereits abgebuchte Betrag wird Ihnen innerhalb von 48 Stunden über die ursprüngliche Zahlungsmethode zurückerstattet.</p>
        <br>
        <p>Falls Sie Fragen haben oder weitere Unterstützung benötigen, stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
        <br>
        <p>Wir würden uns freuen, Sie in Zukunft wieder als Kunden begrüssen zu dürfen.</p>
        <br>
        <p>Freundliche Grüsse</p>
        <br>
        <p>Prime Home Care AG<br/>
        Birkenstrasse 49<br/>
        CH-6343 Rotkreuz<br/>
        info@phc.ch<br/>
        www.phc.ch</p>
        <br>
        <p><a href="https://phc.ch/AVB" target="_blank">AVB und Nutzungsbedingungen</a></p>
      </div>
    `;
  }

  const info = await transporter.sendMail({
    from: `"Prime Home Care" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });

}
