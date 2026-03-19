import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: "Fehlende Angaben" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "asmtp.mail.hostpoint.ch",
      port: 465,
      secure: true,
      auth: {
        user: "landingpage@phc.ch",
        pass: "45uYjTaR_N!x4AE",
      },
    });

    await transporter.sendMail({
      from: `"PHC System" <landingpage@phc.ch>`,
      to: "admin@phc.ch", // Replace with your admin email
      subject: "Zahlungsänderung angefragt",
      html: `
        <p>Der Kunde <strong>${name}</strong> (${email}) möchte seine Zahlungsdaten aktualisieren.</p>
        <p>Bitte kontaktieren Sie ihn für weitere Schritte.</p>
            
<p>Freundliche Grüsse</p>  

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
</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "E-Mail konnte nicht gesendet werden." });
  }
}
