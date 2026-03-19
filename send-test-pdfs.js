// send-test-pdfs.js
// Script to email generated test PDFs as attachments


require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function sendTestPdfs() {
  // Read PDF files
  const rahmenPath = path.join(__dirname, 'Rahmenvereinbarung_TEST.pdf');
  const contractPath = path.join(__dirname, 'Contract_TEST.pdf');
  const rahmenBuffer = fs.existsSync(rahmenPath) ? fs.readFileSync(rahmenPath) : null;
  const contractBuffer = fs.existsSync(contractPath) ? fs.readFileSync(contractPath) : null;

  if (!rahmenBuffer && !contractBuffer) {
    console.error('No test PDFs found. Please run test-pdfs.js first.');
    return;
  }

  // Configure transporter (edit with your SMTP credentials)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Prepare attachments
  const attachments = [];
  if (rahmenBuffer) {
    attachments.push({ filename: 'Rahmenvereinbarung_TEST.pdf', content: rahmenBuffer });
  }
  if (contractBuffer) {
    attachments.push({ filename: 'Contract_TEST.pdf', content: contractBuffer });
  }

  // Send email
  await transporter.sendMail({
    from: `PHC Test <${process.env.SMTP_USER}>`,
    to: 'edita.latifi@the-eksperts.com',
    subject: 'PHC Test PDFs',
    text: 'Attached are the generated test PDFs from PHC system.',
    attachments,
  });

  console.log('Test PDFs sent to edita.latifi@the-eksperts.com');
}

sendTestPdfs().catch(console.error);
