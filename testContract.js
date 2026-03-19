import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { createNdaPdf, createContractPdf } from "./src/lib/mailer.js";

dotenv.config();

// Dummy test employee
const testEmployee = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  email: "ermal.bislimi@the-eksperts.com",
  firstName: "Ermal",
  lastName: "Bislimi",
  phone: "+38344111222",
  address: "Rruga e Dëshmorëve",
  houseNumber: "15",
  zipCode: "61000",
  city: "Rahovec",
  country: "Kosovo",
  desiredWeeklyHours: "40",
  servicesOffered: ["Körperpflege", "Haushaltshilfe"],
  startDate: "09.09.2025",
  endDate: "31.12.2025",
};

(async () => {
  try {
    // Generate PDFs
    const ndaBuffer = await createNdaPdf(testEmployee.firstName, testEmployee.lastName);
    const contractBuffer = await createContractPdf(testEmployee);

    // Save locally (optional for checking)
    fs.writeFileSync("NDA_Test.pdf", ndaBuffer);
    fs.writeFileSync("Arbeitsvertrag_Test.pdf", contractBuffer);
    console.log("✅ PDFs generated: NDA_Test.pdf & Arbeitsvertrag_Test.pdf");

    // Portal URL
    const portalUrl = process.env.NEXT_PUBLIC_BASE_URL + "/login";

    // Setup mail transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Mail options with text + html
    const mailOptions = {
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: testEmployee.email,
      subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
      text: `
Liebe ${testEmployee.firstName},

Vielen Dank für Ihre Registrierung bei Prime Home Care AG.

Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Hier finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.

Login-Link: ${portalUrl}
Benutzername: ${testEmployee.email}

Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Willkommen im Team!

Herzliche Grüsse  
Prime Home Care AG
      `,
      html: `
        <p>Liebe ${testEmployee.firstName}</p>
        <p>Vielen Dank für Ihre Registrierung bei <strong>Prime Home Care AG</strong>.</p>
        <p>Ihr Zugang zum Mitarbeitenden-Portal ist jetzt freigeschaltet. Hier finden Sie alle relevanten Informationen zu Einsätzen, Dokumenten, Rapports und mehr.</p>
        <p><strong>Login-Link:</strong> <br/> <a href="${portalUrl}">${portalUrl}</a><br/>
        <strong>Benutzername:</strong> ${testEmployee.email}</p>
        <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung. Willkommen im Team!</p>
        <p>Herzliche Grüsse<br/>
        Prime Home Care AG</p>
      `,
      attachments: [
        { filename: `NDA_${testEmployee.firstName}_${testEmployee.lastName}.pdf`, content: ndaBuffer },
        { filename: `Arbeitsvertrag_${testEmployee.firstName}_${testEmployee.lastName}.pdf`, content: contractBuffer },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log(`📧 Test email sent to ${testEmployee.email}`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
