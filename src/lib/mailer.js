import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- Assignment Cancelled Notification (Client, Admin, Employee) ---
export async function sendAssignmentCancelledEmail({ schedule, reason }) {
  const { user, employee, date, startTime, hours, serviceName } = schedule;
  const formattedDate = date ? new Date(date).toLocaleDateString('de-CH') : '';
  const formattedTime = startTime || '';
  const duration = hours ? `${hours} Std` : '';
  const service = serviceName || '';

  // 1. Client notification
  if (user?.email) {
    try {
      await transporter.sendMail({
        from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Ihr Einsatz wurde storniert',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hallo ${user.firstName || ''} ${user.lastName || ''}</p>
            <p>Ihr geplanter Einsatz am <b>${formattedDate}</b> um <b>${formattedTime}</b> (${duration}) für den Service <b>${service}</b> wurde storniert.</p>
            <p>Grund: ${reason || '-'}</p>
            <br>
            <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          </div>
        `
      });
    } catch (error) {
      console.error('[sendAssignmentCancelledEmail] Failed to send client notification to', user.email, error);
    }
  }

  // 2. Employee notification
  if (employee?.email) {
    try {
      await transporter.sendMail({
        from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
        to: employee.email,
        subject: 'Ihr Einsatz wurde storniert',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hallo ${employee.firstName || ''} ${employee.lastName || ''}</p>
            <p>Ihr geplanter Einsatz am <b>${formattedDate}</b> um <b>${formattedTime}</b> (${duration}) für den Service <b>${service}</b> wurde storniert.</p>
            <p>Grund: ${reason || '-'}</p>
            <br>
            <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          </div>
        `
      });
    } catch (error) {
      console.error('[sendAssignmentCancelledEmail] Failed to send employee notification to', employee.email, error);
    }
  }

  // 3. Admin notification
  try {
    await transporter.sendMail({
      to: 'admin@phc.ch',
      subject: 'Einsatz storniert',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Ein Einsatz wurde storniert:</p>
          <ul>
            <li>Kunde: ${user?.firstName || ''} ${user?.lastName || ''} (${user?.email || ''})</li>
            <li>Mitarbeiter: ${employee?.firstName || ''} ${employee?.lastName || ''} (${employee?.email || ''})</li>
            <li>Datum: ${formattedDate}</li>
            <li>Zeit: ${formattedTime}</li>
            <li>Dauer: ${duration}</li>
            <li>Service: ${service}</li>
            <li>Grund: ${reason || '-'}</li>
          </ul>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendAssignmentCancelledEmail] Failed to send admin notification', error);
  }
}
// --- System Maintenance Notification (Client) ---
export async function sendSystemMaintenanceEmail({ email, firstName, lastName, date, timeStart, timeEnd, phone }) {
  try {
    await transporter.sendMail({

      to: email,
      subject: 'Information: Vorübergehende Systemwartung',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName || ''} ${lastName || ''}</p>
          <p>Am ${date} zwischen ${timeStart} und ${timeEnd} führen wir geplante Wartungsarbeiten an unserem System durch.</p>
          <p>In diesem Zeitraum ist das Kundenportal vorübergehend nicht erreichbar. Bei dringenden Anliegen erreichen Sie uns telefonisch unter ${phone || '043 200 10 20'}.</p>
          <p>Vielen Dank für Ihr Verständnis.</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendSystemMaintenanceEmail] Failed to send email to', email, error);
  }
}

// --- Feedback Request (Client) ---
export async function sendFeedbackRequestEmail({ email, firstName, lastName, caregiverName, feedbackLink }) {
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Wie zufrieden sind Sie mit unserer Betreuung?',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName} ${lastName}</p>
          <p>Wir hoffen, dass Sie mit der Betreuung durch ${caregiverName} zufrieden waren.</p>
          <p>Wir freuen uns über Ihre Rückmeldung: <a href="${feedbackLink}">${feedbackLink}</a></p>
          <p>Ihr Feedback hilft uns, unsere Dienstleistung weiter zu verbessern.</p>
          <p>Danke für Ihr Vertrauen!</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendFeedbackRequestEmail] Failed to send email to', email, error);
  }
}

// --- Assignment Proposal/Notification (Employee) ---
export async function sendAssignmentProposalEmail({ email, firstName, location, dateTime, deadline }) {
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Neuer Einsatzvorschlag – jetzt in der App bestätigen',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName}</p>
          <p>Wir haben einen neuen Einsatzvorschlag für Sie in der App hinterlegt.</p>
          <p><strong>Ort:</strong> ${location}<br><strong>Datum/Zeit:</strong> ${dateTime}</p>
          <p>Bitte bestätigen oder lehnen Sie den Einsatz direkt in der App innerhalb der nächsten ${deadline || '24 Stunden'} ab.</p>
          <p>Vielen Dank für Ihre Flexibilität!</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendAssignmentProposalEmail] Failed to send email to', email, error);
  }
}

// --- Assignment Accepted (Notify Client) ---
export async function sendAssignmentAcceptedEmail({ email, firstName, lastName, employeeFirstName, employeeLastName, employeePhone, serviceName, firstDate }) {
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Ihre Buchung wurde erfolgreich bestätigt',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName} ${lastName}</p>
          <p>Ihre Buchung wurde erfolgreich bestätigt und folgender Mitarbeiter wurde Ihnen zugewiesen.</p>
          <p><strong>Betreuer:</strong> ${employeeFirstName} ${employeeLastName}</p>
          <p><strong>Kontakt:</strong> ${employeePhone}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p>Startdatum: ${firstDate}</p>
          <p>Vielen Dank für Ihr Vertrauen.</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendAssignmentAcceptedEmail] Failed to send email to', email, error);
  }
}

// --- Cancellation Confirmation (Client/Employee) ---
export async function sendCancellationConfirmationEmail({ email, firstName, lastName, weekday, date, time, refundPercent, serviceName }) {
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Bestätigung Ihrer Stornierung',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName} ${lastName}</p>
          <p>Ihr Termin am:<br>${weekday}<br>${date}<br>um ${time} wurde erfolgreich storniert.</p>
          <p>Service: ${serviceName || ''}</p>
          <p>Rückerstattung: ${refundPercent || 0}%</p>
          <br>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendCancellationConfirmationEmail] Failed to send email to', email, error);
  }
}

// --- Payment Confirmation (Client) ---
export async function sendPaymentConfirmationEmail({ email, firstName, lastName, amount, bookingReference }) {
  try {
    await transporter.sendMail({
      to: email,
      subject: 'Zahlungsbestätigung / Rechnung zu Ihrer Buchung',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Hallo ${firstName} ${lastName}</p>
          <p>Wir bestätigen den Eingang Ihrer Zahlung über CHF ${amount} zur Buchung ${bookingReference}.</p>
          <p>Ihre Rechnung finden Sie auf Ihrer persönlichen PHC-Plattform.</p>
          <p>Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error('[sendPaymentConfirmationEmail] Failed to send email to', email, error);
  }
}
// --- Admin Notification: Assignment Cancelled Automatically ---
export async function sendAdminAssignmentCancelledEmail({ employeeFirstName, employeeLastName }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo Admin</p>
      <p>Die Zuweisung von ${employeeFirstName} ${employeeLastName} wurde nach 36h ohne Bestätigung automatisch storniert.</p>
      <br>
      <p>Freundliche Grüsse</p>
      <p>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
      <p><a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a></p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: 'admin@phc.ch',
      subject: 'Assignment automatisch storniert',
      html,
    });
  } catch (error) {
    console.error('[sendAdminAssignmentCancelledEmail] Failed to send admin notification', error);
  }
}

// --- Payment Update Request Email ---
export async function sendPaymentUpdateRequestEmail({ name, email: userEmail }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Der Kunde/Employee <strong>${name}</strong> (${userEmail}) möchte seine Zahlungsdaten aktualisieren.</p>
      <p>Bitte kontaktieren Sie ihn für weitere Schritte.</p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: 'admin@phc.ch',
      subject: 'Zahlungsänderung angefragt',
      html,
    });
  } catch (error) {
    console.error('[sendPaymentUpdateRequestEmail] Failed to send admin notification for', userEmail, error);
  }
}

// --- Capacity Limit Notification (Kapazitätsgrenzen) ---
export async function sendCapacityLimitEmail({ email, firstName, lastName }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo ${firstName} ${lastName}</p>
      <p>Vielen Dank für Ihre Online-Buchung bei Prime Home Care.</p>
      <p>Leider müssen wir Ihnen mitteilen, dass wir für den von Ihnen gebuchten Zeitraum aktuell keine passenden Kapazitäten zur Verfügung haben. Ein geeignetes Matching zwischen Kunde und Betreuungsperson ist derzeit nicht möglich.</p>
      <p>Ihre Buchung wird entsprechend nicht ausgeführt. Eine Belastung erfolgt nicht.</p>
      <p>Gerne können Sie jederzeit eine neue Online-Buchung mit einem alternativen Zeitraum vornehmen.</p>
      <p>Vielen Dank für Ihr Verständnis.</p>
      <br>
      <p>Freundliche Grüsse</p>
      <p>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
      <p><a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a></p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Information zur Verfügbarkeit Ihrer Buchung',
      html,
    });
  } catch (error) {
    console.error('[sendCapacityLimitEmail] Failed to send email to', email, error);
  }
}

// --- Client-Initiated Termination ---
export async function sendClientTerminationEmail({ email, firstName, lastName, endDate }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo ${firstName} ${lastName}</p>
      <p>Wir bestätigen hiermit die Beendigung der Zusammenarbeit zwischen Ihnen und der Prime Home Care AG.</p>
      <p>Es werden ab ${endDate} keine weiteren Dienstleistungen mehr erbracht.</p>
      <p>Ihr Kundenkonto im Prime-Home-Care-Portal wird entsprechend geschlossen. Ein Zugriff auf das Kundenportal ist danach nicht mehr möglich.</p>
      <p>Sollten Sie zu einem späteren Zeitpunkt erneut Dienstleistungen über Prime Home Care in Anspruch nehmen wollen, ist eine neue Registrierung sowie eine neue Online-Buchung erforderlich.</p>
      <p>Wir danken Ihnen für die bisherige Zusammenarbeit.</p>
      <br>
      <p>Freundliche Grüsse</p>
      <p>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
      <p><a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a></p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Beendigung der Zusammenarbeit mit Prime Home Care',
      html,
    });
  } catch (error) {
    console.error('[sendClientTerminationEmail] Failed to send email to', email, error);
  }
}

// --- Rejection Warning (Employee) ---
export async function sendRejectionWarningEmail({ email, firstName }) {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo ${firstName}</p>
      <p>Uns ist aufgefallen, dass Sie in letzter Zeit mehrere Einsatzvorschläge abgelehnt haben.</p>
      <p>Bitte beachten Sie, dass eine regelmässige Ablehnung von Einsätzen unsere Einsatzplanung erschwert.</p>
      <p>Gerne möchten wir mit Ihnen besprechen, ob es bestimmte Gründe gibt und wie wir Sie besser unterstützen können.</p>
      <a href="https://calendly.com/primehomecare" rel="noopener noreferrer" target="_blank" style="color: #04436F;">Jetzt Termin buchen</a>
      <br><br>
      <p style="margin-bottom: 5px;"><strong>Freundliche Grüsse</strong></p>
      <p style="margin-bottom: 5px;"><strong>Prime Home Care AG</strong></p>
      <p style="margin-bottom: 5px;">Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
      <p style="margin-bottom: 0;">
        <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
        <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
      </p>
    </div>
  `;
  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Rückmeldung zu Ihren Einsatzentscheidungen',
      html,
    });
  } catch (error) {
    console.error('[sendRejectionWarningEmail] Failed to send email to', email, error);
  }
}
// --- Client Welcome Email ---
export async function sendClientWelcomeEmail({ email, firstName, lastName, passwordLink }) {

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo ${firstName} ${lastName}</p>
      <p>Vielen Dank für Ihre Registrierung bei Prime Home Care AG.</p>
      <p>Ihr Zugang zum Kundenportal wurde erfolgreich eingerichtet. Sie können dort:</p>
      <ul>
        <li>Buchungen verwalten</li>
        <li>Mit uns kommunizieren</li>
      </ul>
      <p><strong>Bitte erstellen Sie Ihr Passwort über den folgenden Link:</strong></p>
      <a href="${passwordLink}"
         style="display:inline-block; background-color:#B99B5F; color:#fff; padding:10px 18px; border-radius:5px; text-decoration:none; font-weight:bold;">
        Passwort erstellen
      </a>
      <br><br>
      <p>Freundliche Grüsse</p>
      <p>Prime Home Care AG<br>
        Birkenstrasse 49<br>
        CH-6343 Rotkreuz<br>
        info@phc.ch<br>
        www.phc.ch
      </p>
      <p>
        <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
        <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Willkommen bei Prime Home Care – Ihr Zugang ist aktiv",
      html,
    });
  } catch (error) {
    console.error('[sendClientWelcomeEmail] Failed to send email to', email, error);
  }
}

// ---------- Rahmenvereinbarung PDF ----------
export function createRahmenvereinbarungPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));


    // ===== Centered Logo on Top =====
    const fitBox = [100, 70]; // width, height
    const pageWidth = doc.page.width;
    const logoPath = path.join(process.cwd(), "public/images/phc_logo.png");
    doc.image(logoPath, (pageWidth - fitBox[0]) / 2, doc.page.margins.top, { fit: fitBox });
    doc.moveDown(3);

    // Page 1 - Header and Title
    doc.fontSize(16).font("Helvetica-Bold").text("Rahmenvereinbarung", { align: "left" });
    doc.moveDown(1.2);

    doc.fontSize(11).font("Helvetica").text("zwischen");
    doc.moveDown(0.5);

    doc.font("Helvetica")
      .text("Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz", { continued: true })
      .font("Helvetica-Bold")
      .text("    Arbeitgeberin");

    doc.moveDown(0.8);

    // Space after "und"
    doc.font("Helvetica").text("und");
    doc.moveDown(0.5);

    doc.font("Helvetica")
      .text(
        `${employee.firstName} ${employee.lastName}, ${employee.street || "[Strasse Nr.]"}, ${employee.zip || "[PLZ]"} ${employee.city || "[Ort]"}`,
        { continued: true }
      )
      .font("Helvetica-Bold")
      .text("    Arbeitnehmer");

    doc.moveDown(1.5);

    doc.fontSize(11).font("Helvetica")
      .text("Betreffend gelegentliche Arbeitsleistungen / Teilzeitarbeit");

    doc.moveDown(1.2);

    doc.font("Helvetica-Bold").text("Allgemeines");
    doc.font("Helvetica")
      .text("Die in diesem Vertrag enthaltenen Personenbezeichnungen beziehen sich in gleicher Weise auf die weibliche und männliche Form.");

    doc.moveDown(1);

    doc.font("Helvetica-Bold").text("1. Inhalt der Vereinbarung");
    doc.font("Helvetica")
      .text("Der Arbeitnehmer lässt sich in die Mitarbeiter-Datenbank der Arbeitgeberin eintragen. Gestützt auf den Eintrag schliessen die Arbeitgeberin und der Arbeitnehmer vorliegende zeitlich unbefristete Rahmenvereinbarung, welche es der Arbeitgeberin ermöglicht, dem Arbeitnehmer einzelne Arbeitseinsätze im Haushalts- und Betreuungsbereich anzubieten.");

    doc.moveDown(1);

    doc.font("Helvetica-Bold").text("2. Rechtliche Qualifikation der Arbeitsangebote");
    doc.font("Helvetica")
      .text("Bei den Arbeitsangeboten handelt es sich um unechte Arbeit auf Abruf, da es dem Arbeitnehmer freisteht, die jeweiligen Angebote der Arbeitgeberin anzunehmen oder abzulehnen.");

    doc.moveDown(1);

    doc.font("Helvetica-Bold").text("3. Einsatzvertrag");
    doc.font("Helvetica")
      .text("Ein konkreter Arbeitsvertrag entsteht erst, wenn der Arbeitnehmer ein Angebot annimmt und sich zur Leistung von Arbeit verpflichtet. Ein solcher Einsatz wird jeweils in einem schriftlichen Einsatzvertrag vereinbart.");

    doc.moveDown(1);

    doc.font("Helvetica-Bold").text("4. Rechtliche Qualifikation der einzelnen Arbeitseinsätze");
    doc.font("Helvetica")
      .text("a. Die einzelnen Einsatzverträge stellen grundsätzlich Gelegenheitsarbeit dar. Es werden dem Arbeitnehmer ausdrücklich kein minimales Arbeitspensum und keine Kündigungsfristen garantiert.\nb. Erfolgen mehrere und regelmässige Einsätze während einer Dauer von mehr als drei Jahren, wandelt sich der Einsatzvertrag über Gelegenheitsarbeit in ein andauerndes Arbeitsverhältnis über Teilzeitarbeit um. Daran ändert auch nichts, dass die Vertragsparteien bezüglich der einzelnen Arbeitseinsätze über Abschlussfreiheit verfügen.\nDie Umwandlung in ein Teilzeitarbeitsverhältnis bedeutet, dass ab dem vierten Dienstjahr die Arbeitgeberin dem Arbeitnehmer während der Kündigungsfrist von Art. 335c OR bei fehlenden oder geringeren Einsätzen den Bruttodurchschnittslohn zu entrichten hat, wenn der Arbeitnehmer während dieser Zeit seine Arbeitsleistung anbietet.");

    // ===== Page 2 - Signature Page =====
    doc.addPage();

    doc.moveDown(5);

    const today = new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
    doc.fontSize(12).font("Helvetica")
      .text(`Rotkreuz, ${today}`, { align: "left" });

    doc.moveDown(3);

    doc.font("Helvetica-Bold").text("Prime Home Care AG");

    doc.moveDown(4);

    // Signature Lines aligned cleanly
    const leftX = 60;
    const rightX = 330;
    const lineY = doc.y;

    doc.moveTo(leftX, lineY).lineTo(leftX + 200, lineY).stroke();
    doc.moveTo(rightX, lineY).lineTo(rightX + 200, lineY).stroke();

    doc.moveDown(0.5);

    doc.font("Helvetica")
      .text("Arbeitgeberin", leftX, doc.y)
      .text(`${employee.firstName} ${employee.lastName}`, rightX, doc.y);

    doc.end();
  });
}

export async function sendApprovalEmail(employee, plainPassword) {
  const { email, firstName, lastName } = employee;


  try {
    const rahmenBuffer = await createRahmenvereinbarungPdf(employee);


    try {
      const loginUrl = "https://phc.ch/login";
      await transporter.sendMail({
        from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <p>Hallo ${firstName}</p>
            <p>Vielen Dank für Ihre Registrierung bei der Prime Home Care AG.</p>
            <p>Ihr Zugang zum Mitarbeiter-Portal ist jetzt freigeschaltet.</p>
            <ul>
              <li>Login-Link: <a href="${loginUrl}">${loginUrl}</a></li>
              <li>Benutzername: ${email}</li>
            </ul>
            <p>Hier zum Passwort zurücksetzen: <a href="https://www.phc.ch/forgot-password" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Passwort zurücksetzen</a></p>
            <p>Im Anhang finden Sie Ihre Rahmenvereinbarung.</p>
            <br>
            <p>Freundliche Grüsse</p>
            <p>Prime Home Care AG<br>
            Birkenstrasse 49<br>
            CH-6343 Rotkreuz<br>
            info@phc.ch<br>
            www.phc.ch</p>
            <p>
              <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
              <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
            </p>
          </div>
        `,
        attachments: [
          { filename: `Rahmenvereinbarung_${firstName}_${lastName}.pdf`, content: rahmenBuffer },
        ],
      });
    } catch (err) {
      throw err;
    }

  } catch (error) {
    throw new Error(`Failed to send approval email: ${error.message}`);
  }
}
