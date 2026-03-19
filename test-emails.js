// test-emails.js
// Tests all email functions from mailer.js

require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');

const TEST_EMAIL = 'edita.latifi@the-eksperts.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function send(subject, html, attachments = []) {
  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: TEST_EMAIL,
    subject: `[TEST] ${subject}`,
    html,
    attachments,
  });
  console.log(`✅ Sent: ${subject}`);
}

// --- 1. Client Welcome Email ---
async function testClientWelcomeEmail() {
  await send('Willkommen bei Prime Home Care – Ihr Zugang ist aktiv', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
      <p>Ihr Zugang zum Kundenportal wurde erfolgreich eingerichtet.</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password"
         style="display:inline-block;background-color:#B99B5F;color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-weight:bold;">
        Passwort erstellen
      </a>
      <br><br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 2. Employee Approval Email (with PDF) ---
function generatePdf() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.fontSize(16).font('Helvetica-Bold').text('Rahmenvereinbarung TEST');
    doc.moveDown();
    doc.fontSize(11).font('Helvetica').text('Prime Home Care AG — Test Document');
    doc.end();
  });
}

async function testEmployeeApprovalEmail() {
  const pdf = await generatePdf();
  await send('Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Anna</p>
      <p>Ihr Zugang zum Mitarbeiter-Portal ist jetzt freigeschaltet.</p>
      <ul>
        <li>Login: <a href="https://phc.ch/login">https://phc.ch/login</a></li>
        <li>Benutzername: ${TEST_EMAIL}</li>
      </ul>
      <p>Hier zum Passwort zurücksetzen: <a href="https://www.phc.ch/forgot-password">Passwort zurücksetzen</a></p>
      <p>Im Anhang finden Sie Ihre Rahmenvereinbarung.</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `, [{ filename: 'Rahmenvereinbarung_TEST.pdf', content: pdf }]);
}

// --- 3. Assignment Cancelled ---
async function testAssignmentCancelledEmail() {
  await send('Ihr Einsatz wurde storniert', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Ihr geplanter Einsatz am <b>20.03.2026</b> um <b>09:00</b> (2 Std) für den Service <b>Alltagsbegleitung</b> wurde storniert.</p>
      <p>Grund: Testgrund</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 4. Assignment Proposal (Employee) ---
async function testAssignmentProposalEmail() {
  await send('Neuer Einsatzvorschlag – jetzt in der App bestätigen', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Hallo Anna</p>
      <p>Wir haben einen neuen Einsatzvorschlag für Sie in der App hinterlegt.</p>
      <p><strong>Ort:</strong> Rotkreuz<br><strong>Datum/Zeit:</strong> 20.03.2026, 09:00</p>
      <p>Bitte bestätigen oder lehnen Sie den Einsatz innerhalb der nächsten 24 Stunden ab.</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 5. Assignment Accepted (Client) ---
async function testAssignmentAcceptedEmail() {
  await send('Ihre Buchung wurde erfolgreich bestätigt', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Ihre Buchung wurde erfolgreich bestätigt und folgender Mitarbeiter wurde Ihnen zugewiesen.</p>
      <p><strong>Betreuer:</strong> Anna Müller</p>
      <p><strong>Kontakt:</strong> +41 79 000 00 00</p>
      <p><strong>Service:</strong> Alltagsbegleitung</p>
      <p>Startdatum: 20.03.2026</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 6. Cancellation Confirmation ---
async function testCancellationConfirmationEmail() {
  await send('Bestätigung Ihrer Stornierung', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Ihr Termin am:<br>Donnerstag<br>20.03.2026<br>um 09:00 wurde erfolgreich storniert.</p>
      <p>Service: Alltagsbegleitung</p>
      <p>Rückerstattung: 100%</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 7. Payment Confirmation ---
async function testPaymentConfirmationEmail() {
  await send('Zahlungsbestätigung / Rechnung zu Ihrer Buchung', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Wir bestätigen den Eingang Ihrer Zahlung über CHF 118.00 zur Buchung REF-001.</p>
      <p>Ihre Rechnung finden Sie auf Ihrer persönlichen PHC-Plattform.</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 8. Capacity Limit ---
async function testCapacityLimitEmail() {
  await send('Information zur Verfügbarkeit Ihrer Buchung', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Leider müssen wir Ihnen mitteilen, dass wir für den von Ihnen gebuchten Zeitraum aktuell keine passenden Kapazitäten zur Verfügung haben.</p>
      <p>Ihre Buchung wird entsprechend nicht ausgeführt. Eine Belastung erfolgt nicht.</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 9. Client Termination ---
async function testClientTerminationEmail() {
  await send('Beendigung der Zusammenarbeit mit Prime Home Care', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Max Mustermann</p>
      <p>Wir bestätigen hiermit die Beendigung der Zusammenarbeit zwischen Ihnen und der Prime Home Care AG.</p>
      <p>Es werden ab 31.03.2026 keine weiteren Dienstleistungen mehr erbracht.</p>
      <br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- 10. Rejection Warning (Employee) ---
async function testRejectionWarningEmail() {
  await send('Rückmeldung zu Ihren Einsatzentscheidungen', `
    <div style="font-family:Arial;line-height:1.6;color:#333;">
      <p>Grüezi Anna</p>
      <p>Uns ist aufgefallen, dass Sie in letzter Zeit mehrere Einsatzvorschläge abgelehnt haben.</p>
      <a href="https://calendly.com/primehomecare" style="color:#04436F;">Jetzt Termin buchen</a>
      <br><br><p>Freundliche Grüsse<br>Prime Home Care AG</p>
    </div>
  `);
}

// --- Run all ---
async function main() {
  const tests = [
    ['Client Welcome Email',         testClientWelcomeEmail],
    ['Employee Approval Email',       testEmployeeApprovalEmail],
    ['Assignment Cancelled',          testAssignmentCancelledEmail],
    ['Assignment Proposal',           testAssignmentProposalEmail],
    ['Assignment Accepted',           testAssignmentAcceptedEmail],
    ['Cancellation Confirmation',     testCancellationConfirmationEmail],
    ['Payment Confirmation',          testPaymentConfirmationEmail],
    ['Capacity Limit',                testCapacityLimitEmail],
    ['Client Termination',            testClientTerminationEmail],
    ['Rejection Warning',             testRejectionWarningEmail],
  ];

  console.log(`\n📧 Sending ${tests.length} test emails to ${TEST_EMAIL}...\n`);

  for (const [name, fn] of tests) {
    try {
      await fn();
    } catch (err) {
      console.error(`❌ Failed: ${name} —`, err.message);
    }
  }

  console.log(`\n✅ Done. Check inbox at ${TEST_EMAIL}`);
}

main().catch(console.error);
