import nodemailer from "nodemailer";

async function sendTestEmail() {
  // 1. Create a test account
  const testAccount = await nodemailer.createTestAccount();

  // 2. Create transporter with Ethereal test SMTP
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // 3. Send email
const info = await transporter.sendMail({
  from: '"PHC Personalabteilung" <support@phc.ch>', // you can fake this
  to: "edita.latifi@the-eksperts.ch",              // stays here
  subject: "📄 Test Email – PHC System",
  text: "Hallo Edita,\n\nDies ist eine Test-E-Mail vom PHC System.\n\nViele Grüße\nDein PHC Team",
  html: `<p><b>Hallo Edita,</b></p>
         <p>Dies ist eine <span style="color:blue;">Test-E-Mail</span> vom PHC System.</p>
         <p>Viele Grüße,<br>Dein PHC Team</p>`,
});
console.log("Preview it here:", nodemailer.getTestMessageUrl(info));


  console.log("✅ Test email sent!");
  console.log("Preview it here:", nodemailer.getTestMessageUrl(info));
}

sendTestEmail().catch(console.error);
