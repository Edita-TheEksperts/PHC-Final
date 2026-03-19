// test-pdfs.js
// Generates and emails ALL PDFs to verify: logo, dates, dynamic fields

require('dotenv').config();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

const TEST_EMAIL = 'edita.latifi@the-eksperts.com';
const LOGO_PATH = path.join(__dirname, 'public/images/phc_logo.png');
const TODAY = new Intl.DateTimeFormat('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());

console.log(`📅 Today's date (de-CH): ${TODAY}`);
console.log(`🖼️  Logo exists: ${fs.existsSync(LOGO_PATH)}`);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const employee = {
  firstName: 'Anna',
  lastName: 'Müller',
  address: 'Bahnhofstrasse',
  houseNumber: '5',
  zipCode: '6300',
  city: 'Zug',
  street: 'Bahnhofstrasse 5',
  zip: '6300',
};

const client = {
  firstName: 'Max',
  lastName: 'Mustermann',
  address: 'Hauptstrasse 10',
  postalCode: '6343',
  city: 'Rotkreuz',
};

// ─── PDF 1: Rahmenvereinbarung (from mailer.js) ───────────────────────────────
function generateRahmenvereinbarungPdf() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    const fitBox = [100, 70];
    const pageWidth = doc.page.width;
    doc.image(LOGO_PATH, (pageWidth - fitBox[0]) / 2, doc.page.margins.top, { fit: fitBox });
    doc.moveDown(3);

    doc.fontSize(16).font('Helvetica-Bold').text('Rahmenvereinbarung', { align: 'left' });
    doc.moveDown(1.2);
    doc.fontSize(11).font('Helvetica').text('zwischen');
    doc.moveDown(0.5);
    doc.font('Helvetica').text('Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz', { continued: true })
      .font('Helvetica-Bold').text('    Arbeitgeberin');
    doc.moveDown(0.8);
    doc.font('Helvetica').text('und');
    doc.moveDown(0.5);
    doc.font('Helvetica')
      .text(`${employee.firstName} ${employee.lastName}, ${employee.street}, ${employee.zip} ${employee.city}`, { continued: true })
      .font('Helvetica-Bold').text('    Arbeitnehmer');
    doc.moveDown(1.5);
    doc.fontSize(11).font('Helvetica').text('Betreffend gelegentliche Arbeitsleistungen / Teilzeitarbeit');
    doc.moveDown(1.2);
    doc.font('Helvetica-Bold').text('1. Inhalt der Vereinbarung');
    doc.font('Helvetica').text('Der Arbeitnehmer lässt sich in die Mitarbeiter-Datenbank der Arbeitgeberin eintragen...');
    doc.moveDown(2);

    doc.addPage();
    doc.moveDown(5);
    doc.fontSize(12).font('Helvetica').text(`Rotkreuz, ${TODAY}`, { align: 'left' });
    doc.moveDown(3);
    doc.font('Helvetica-Bold').text('Prime Home Care AG');
    doc.moveDown(4);
    const leftX = 60, rightX = 330, lineY = doc.y;
    doc.moveTo(leftX, lineY).lineTo(leftX + 200, lineY).stroke();
    doc.moveTo(rightX, lineY).lineTo(rightX + 200, lineY).stroke();
    doc.moveDown(0.5);
    doc.font('Helvetica').text('Arbeitgeberin', leftX, doc.y);
    doc.font('Helvetica').text(`${employee.firstName} ${employee.lastName}`, rightX, doc.y);
    doc.end();
  });
}

// ─── PDF 2: Einsatz-Arbeitsvertrag (from emailHelpers.js) ────────────────────
function generateArbeitsvertragPdf() {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));

    doc.image(LOGO_PATH, doc.page.width / 2 - 60, 20, { width: 120 });
    doc.moveDown(4);

    const fullName = `${employee.firstName} ${employee.lastName}`;
    const fullAddress = `${employee.address} ${employee.houseNumber}, ${employee.zipCode} ${employee.city}`;
    const clientName = `${client.firstName} ${client.lastName}`;
    const clientAddress = `${client.address}, ${client.postalCode} ${client.city}`;

    doc.fontSize(12).font('Helvetica');
    doc.text('Einsatz - Arbeitsvertrag', { align: 'center', underline: true });
    doc.moveDown(2);
    doc.text('zwischen');
    doc.moveDown(1);
    doc.text('Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz\tArbeitgeberin');
    doc.moveDown(1);
    doc.text(`und ${fullName}, ${fullAddress}\tArbeitnehmer`);
    doc.moveDown(2);
    doc.text('1. Beginn der Anstellung');
    doc.text(`Am (${TODAY}) schliessen die Vertragsparteien gestützt auf die Rahmenvereinbarung einen Arbeitsvertrag ab.`);
    doc.moveDown(1);
    doc.text('2. Arbeitsort');
    doc.text(`(${clientName}, ${clientAddress})`);
    doc.moveDown(1);
    doc.text('3. Tätigkeit');
    doc.text('(Alltagsbegleitung und Besorgungen)');
    doc.moveDown(2);
    doc.text(`Rotkreuz, ${TODAY}`);
    doc.moveDown(2);
    doc.text('Prime Home Care AG');
    doc.moveDown(4);
    const pageWidth = doc.page.width, margin = 50, lineWidth = 200;
    const sigLeftX = margin, sigRightX = pageWidth - margin - lineWidth, lineY = doc.y;
    doc.moveTo(sigLeftX, lineY).lineTo(sigLeftX + lineWidth, lineY).stroke();
    doc.moveTo(sigRightX, lineY).lineTo(sigRightX + lineWidth, lineY).stroke();
    doc.font('Helvetica').fontSize(12).text('Arbeitgeberin', sigLeftX, lineY + 5, { width: lineWidth, align: 'center' });
    doc.font('Helvetica').fontSize(12).text('Arbeitnehmer', sigRightX, lineY + 5, { width: lineWidth, align: 'center' });
    doc.end();
  });
}

// ─── PDF 3+4+5: Admin Documents (from send-documents.js) ─────────────────────
function generateDocumentPdf(documentType) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.page.margins = { top: 50, left: 60, right: 60, bottom: 60 };
    const logoWidth = 100;
    const logoX = (doc.page.width - logoWidth) / 2;
    doc.image(LOGO_PATH, logoX, 20, { width: logoWidth });

    let y = 90;
    doc.fillColor('black').font('Helvetica').fontSize(12)
      .text(`${employee.firstName} ${employee.lastName}\n\n${employee.address} ${employee.houseNumber}\n\n${employee.zipCode} ${employee.city}`,
        doc.page.margins.left, y, { align: 'left' });

    doc.moveDown(2);
    doc.moveDown(1);
    doc.text(`Rotkreuz, ${TODAY}\n\n`);

    if (documentType === 'Auflösungschreiben') {
      doc.font('Helvetica-Bold').fontSize(14).text('Auflösung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).text(`Sehr geehrte/r Frau/Herr ${employee.lastName}\n\n`);
      doc.text(
        `Hiermit bestätigen wir Ihnen die Auflösung Ihres Arbeitsverhältnisses per ${TODAY}.\n\n` +
        `Wir bedanken uns herzlich für Ihre Mitarbeit.\n\nFreundliche Grüsse\nPrime Home Care AG`
      );
    } else if (documentType === 'KündigungMA') {
      doc.font('Helvetica-Bold').fontSize(14).text('Kündigung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).text(`Sehr geehrte/r Frau/Herr ${employee.lastName}\n\n`);
      doc.text(
        `Wir teilen Ihnen hiermit mit, dass das Arbeitsverhältnis per ${TODAY} endet.\n\n` +
        `Freundliche Grüsse\nPrime Home Care AG`
      );
    } else if (documentType === 'KündigungMAFristlos') {
      doc.font('Helvetica-Bold').fontSize(14).text('Kündigung des Arbeitsverhältnisses');
      doc.moveDown(1);
      doc.font('Helvetica').fontSize(12).text(`Sehr geehrte/r Frau/Herr ${employee.lastName}\n\n`);
      doc.text(
        `Hiermit beenden wir das Arbeitsverhältnis mit sofortiger Wirkung per ${TODAY}.\n\n` +
        `Freundliche Grüsse\nPrime Home Care AG`
      );
    }

    doc.moveDown(2);
    doc.text(`Rotkreuz, ${TODAY}`);

    const footerY = doc.page.height - doc.page.margins.bottom - 15;
    doc.font('Helvetica').fontSize(10).fillColor('gray')
      .text('Prime Home Care AG – info@phc.ch – www.phc.ch', doc.page.margins.left, footerY, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: 'center',
      });
    doc.end();
  });
}

// ─── Run ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n📄 Generating all PDFs...\n`);

  const pdfs = [];

  const tasks = [
    ['Rahmenvereinbarung',   generateRahmenvereinbarungPdf,                   `Rahmenvereinbarung_${employee.firstName}_${employee.lastName}.pdf`],
    ['Einsatz-Arbeitsvertrag', generateArbeitsvertragPdf,                     `Arbeitsvertrag_${employee.firstName}_${employee.lastName}.pdf`],
    ['Auflösungschreiben',   () => generateDocumentPdf('Auflösungschreiben'), 'Auflösungschreiben.pdf'],
    ['KündigungMA',          () => generateDocumentPdf('KündigungMA'),        'KündigungMA.pdf'],
    ['KündigungMAFristlos',  () => generateDocumentPdf('KündigungMAFristlos'),'KündigungMAFristlos.pdf'],
  ];

  for (const [name, fn, filename] of tasks) {
    try {
      const buf = await fn();
      pdfs.push({ name, filename, buf });
      console.log(`✅ ${name} generated`);
    } catch (e) {
      console.error(`❌ ${name}: ${e.message}`);
    }
  }

  if (pdfs.length === 0) {
    console.error('\n❌ No PDFs generated.');
    return;
  }

  console.log(`\n📧 Sending ${pdfs.length} PDFs to ${TEST_EMAIL}...`);

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: TEST_EMAIL,
    subject: `[TEST] All PDFs — ${TODAY}`,
    html: `
      <div style="font-family:Arial;line-height:1.6;color:#333;">
        <h2>PHC PDF Test — ${TODAY}</h2>
        <p>${pdfs.length} PDFs attached. Please verify each one:</p>
        <ul>
          ${pdfs.map(p => `<li><b>${p.name}</b> — logo visible, date = <b>${TODAY}</b>, name = <b>${employee.firstName} ${employee.lastName}</b></li>`).join('')}
        </ul>
        <hr>
        <p><b>Test employee:</b> ${employee.firstName} ${employee.lastName}, ${employee.address} ${employee.houseNumber}, ${employee.zipCode} ${employee.city}</p>
        <p><b>Test client:</b> ${client.firstName} ${client.lastName}, ${client.address}, ${client.postalCode} ${client.city}</p>
      </div>
    `,
    attachments: pdfs.map(p => ({ filename: p.filename, content: p.buf })),
  });

  console.log(`\n✅ All ${pdfs.length} PDFs sent to ${TEST_EMAIL}`);
  console.log(`\n🔍 Check each PDF for:`);
  console.log(`   ✓ Logo at top center`);
  console.log(`   ✓ Date: ${TODAY}`);
  console.log(`   ✓ Employee: ${employee.firstName} ${employee.lastName}`);
  console.log(`   ✓ Address: ${employee.address} ${employee.houseNumber}, ${employee.zipCode} ${employee.city}`);
}

main().catch(console.error);
