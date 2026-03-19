// test-documents.js
// Generates all 3 document PDFs and sends them to the test email

require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');

const employee = {
  firstName: 'Max',
  lastName: 'Mustermann',
  address: 'Hauptweg',
  houseNumber: '12',
  zipCode: '9014',
  city: 'St. Gallen',
  letterDate: new Date(),
  terminationDate: '31.12.2026',
};

function generatePdf(documentType) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const today = new Date();
    const letterDate = employee.letterDate ? new Date(employee.letterDate) : today;
    const datum = new Intl.DateTimeFormat('de-CH', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }).format(letterDate);

    const nachname = employee.lastName;
    const vorname = employee.firstName;
    const adresse = [employee.address, employee.houseNumber].filter(Boolean).join(' ') || '[Adresse]';
    const plz = employee.zipCode || '[PLZ]';
    const ort = employee.city || '[Ort]';

    doc.page.margins = { top: 50, left: 60, right: 60, bottom: 60 };

    const logoWidth = 100;
    const logoY = 20;
    const logoX = (doc.page.width - logoWidth) / 2;
    doc.image(path.join(__dirname, 'public/images/phc_logo.png'), logoX, logoY, { width: logoWidth });

    let y = 90;
    doc.fillColor('black').font('Helvetica').fontSize(12)
      .text(`${vorname} ${nachname}\n\n${adresse}\n\n${plz} ${ort}`, doc.page.margins.left, y, { align: 'left' });

    doc.moveDown(2);
    doc.moveDown(1);
    doc.text(`Rotkreuz, ${datum}\n\n`);

    if (documentType === 'Auflösungschreiben') {
      doc.font('Helvetica-Bold').fontSize(14).text('Auflösung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.text(
        `Hiermit bestätigen wir Ihnen die Auflösung Ihres Arbeitsverhältnisses mit der Prime Home Care AG.\n\n` +
        `Das Arbeitsverhältnis endet per ${datum} im gegenseitigen Einverständnis. ` +
        `Sämtliche bis zu diesem Zeitpunkt bestehenden Ansprüche (inkl. Lohn, Ferien- und Überzeitguthaben) ` +
        `werden entsprechend den gesetzlichen Vorgaben und unseren Vereinbarungen abgerechnet.\n\n` +
        `Wir bitten Sie, allfällige Arbeitsmaterialien und Unterlagen bis spätestens zu Ihrem letzten Arbeitstag ` +
        `an Ihrem Einsatzort zu deponieren.\n\n` +
        `Wir bedanken uns herzlich für Ihre Mitarbeit und wünschen Ihnen für Ihre berufliche wie auch private Zukunft alles Gute.\n\n` +
        `Freundliche Grüsse\nPrime Home Care AG`
      );

    } else if (documentType === 'KündigungMA') {
      doc.font('Helvetica-Bold').fontSize(14).text('Kündigung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).fillColor('black').text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.fillColor('black').text(
        `Wir teilen Ihnen hiermit mit, dass das Arbeitsverhältnis mit der Prime Home Care AG ordentlich und fristgerecht ` +
        `per ${datum} endet. Die gesetzlich gültige Kündigungsfrist wurde dabei automatisch berücksichtigt.\n\n` +
        `Bis zum Beendigungsdatum bleiben alle bisherigen Vereinbarungen bestehen.\n\n` +
        `Bitte geben Sie alle Arbeitsmaterialien und gegebenenfalls ausgehändigte Schlüssel spätestens an Ihrem letzten Arbeitstag zurück.\n\n` +
        `Wir machen Sie darauf aufmerksam, dass Sie noch 31 Tage ab dem letzten Arbeitstag gegen Nichtberufsunfälle versichert sind. ` +
        `Nach dem Ablauf dieser 31 Tage geniessen Sie keine Unfalldeckung mehr. Es besteht die Möglichkeit bei der SUVA eine Abredeversicherung abzuschliessen.\n\n` +
        `Wir bedanken uns herzlich für Ihre Mitarbeit und wünschen Ihnen für Ihre berufliche wie auch private Zukunft alles Gute.\n\n` +
        `Freundliche Grüsse\nPrime Home Care AG`
      );

    } else if (documentType === 'KündigungMAFristlos') {
      doc.font('Helvetica-Bold').fontSize(14).text('Kündigung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).fillColor('black').text(`Sehr geehrte/r Frau/Herr ${nachname}\n\n`);
      doc.fillColor('black').text(
        `Hiermit beenden wir das Arbeitsverhältnis mit der Prime Home Care AG mit sofortiger Wirkung.\n\n` +
        `Diese Entscheidung wurde aufgrund einer schwerwiegenden Situation getroffen, die eine Fortsetzung des Arbeitsverhältnisses unzumutbar macht. ` +
        `Das Arbeitsverhältnis endet deshalb per sofort.\n\n` +
        `Bitte geben Sie sämtliche Arbeitsmaterialien und ausgehändigte Schlüssel umgehend zurück.\n\n` +
        `Wir machen Sie darauf aufmerksam, dass Sie noch 31 Tage ab dem letzten Arbeitstag gegen Nichtberufsunfälle versichert sind. ` +
        `Nach dem Ablauf dieser 31 Tage geniessen Sie keine Unfalldeckung mehr. Es besteht die Möglichkeit bei der SUVA eine Abredeversicherung abzuschliessen.\n\n` +
        `Wir danken Ihnen für die bisherige Zusammenarbeit und wünschen Ihnen für die Zukunft alles Gute.\n\n` +
        `Freundliche Grüsse\nPrime Home Care AG`
      );
    }

    doc.moveDown(2);
    doc.font('Helvetica').fontSize(12).text(`Rotkreuz, ${datum}`);

    const footerY = doc.page.height - doc.page.margins.bottom - 15;
    doc.font('Helvetica').fontSize(10).fillColor('gray')
      .text('Prime Home Care AG – info@phc.ch – www.phc.ch', doc.page.margins.left, footerY, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: 'center',
      });

    doc.end();
  });
}

async function main() {
  const types = ['Auflösungschreiben', 'KündigungMA', 'KündigungMAFristlos'];

  console.log('Generating PDFs...');
  const attachments = [];
  for (const type of types) {
    const buffer = await generatePdf(type);
    attachments.push({ filename: `${type}_TEST.pdf`, content: buffer });
    console.log(`✅ ${type} generated`);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"PHC Test" <${process.env.SMTP_USER}>`,
    to: 'edita.latifi@the-eksperts.com',
    subject: 'PHC Document PDFs – Test',
    text: 'Attached: Auflösungschreiben, KündigungMA, KündigungMAFristlos',
    attachments,
  });

  console.log('✅ All 3 PDFs sent to edita.latifi@the-eksperts.com');
}

main().catch(console.error);
