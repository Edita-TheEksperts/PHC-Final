import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import path from "path";
/**
 * Send 'Einsatz - Arbeitsvertrag' PDF to employee when assignment is accepted
 * @param {object} assignment - Assignment object (with user and employee included)
 */
export async function sendAssignmentContractEmail(assignment) {
  const { employee, user, serviceName, firstDate } = assignment;
  if (!employee?.email) throw new Error("Employee email missing");

  // Prepare dynamic fields for PDF
  const contractData = {
    employeeFirstName: employee.firstName,
    employeeLastName: employee.lastName,
    employeeAddress: employee.address || "",
    employeeHouseNumber: employee.houseNumber || "",
    employeeZip: employee.zipCode || "",
    employeeCity: employee.city || "",
    clientFirstName: user.firstName || "",
    clientLastName: user.lastName || "",
    clientAddress: user.address || "",
    clientZip: user.postalCode || "",
    clientCity: user.city || "",
    serviceName: serviceName || "",
    firstDate: firstDate ? new Date(firstDate).toLocaleDateString("de-CH") : "",
  };

  // Use existing createContractPdf, or create a new one if you want a different layout
  const contractBuffer = await createContractPdf({
    ...employee,
    ...contractData,
    client: user,
    assignment,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
    to: employee.email,
    subject: "Ihre Einsatzbestätigung – Arbeitsvertrag im Anhang",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width:600px; margin:auto; border:1px solid #eee; border-radius:8px;">
        <div style="padding:24px 24px 0 24px; text-align:center;">
          <img src='https://www.phc.ch/phc-logo.png' alt='Prime Home Care Logo' style='max-width:180px; margin-bottom:16px;' />
        </div>
        <div style="padding:24px;">
          <p>Grüezi ${employee.firstName}</p>
          <p>Wir freuen uns Ihnen mitzuteilen, dass Ihr Einsatz offiziell bestätigt wurde.</p>
          <p>Den dazugehörigen Arbeitsvertrag finden Sie im Anhang dieser E-Mail.</p>
          <p>Bitte lesen Sie den Arbeitsvertrag sorgfältig durch und unterzeichnen Sie das Dokument digital.</p>
          <p>Vielen Dank für Ihr Engagement und willkommen im Team von Prime Home Care AG.</p>
          <br>
          <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
          <p>
            <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">AVB</a> und 
            <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;">Nutzungsbedingungen</a>
          </p>
        </div>
      </div>
    `,
    attachments: [
      { filename: `Einsatz-Arbeitsvertrag_${employee.firstName}_${employee.lastName}.pdf`, content: contractBuffer },
    ],
  });
}
/**
 * Create Arbeitsvertrag PDF
 */
export async function createContractPdf(employee) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });

    // Add logo at the top
    try {
      const logoPath = path.join(process.cwd(), "public/images/phc_logo.png");
      doc.image(logoPath, doc.page.width / 2 - 60, 20, { width: 120 });
    } catch (e) {
      // Logo not added
    }
    doc.moveDown(2);
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));

    // Dynamic fields
    const fullName = `${employee.firstName || ""} ${employee.lastName || ""}`.trim();
    const fullAddress = `${employee.address || ""} ${employee.houseNumber || ""}, ${employee.zipCode || ""} ${employee.city || ""}`.trim();
    const contractDate = new Date().toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
    const clientName = employee.client ? `${employee.client.firstName || ""} ${employee.client.lastName || ""}`.trim() : "";
    const clientAddress = employee.client ? `${employee.client.address || ""}, ${employee.client.postalCode || ""} ${employee.client.city || ""}`.trim() : "";
    const serviceName = employee.serviceName || (employee.assignment && employee.assignment.serviceName) || "";

    doc.fontSize(12).font("Helvetica");
    doc.text("Einsatz - Arbeitsvertrag", { align: "center", underline: true });
    doc.moveDown(2);
    doc.text("zwischen");
    doc.moveDown(1);
    doc.text("Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz\tArbeitgeberin");
    doc.moveDown(1);
    doc.text(`und ${fullName}, ${fullAddress}\tArbeitnehmer`);
    doc.moveDown(2);
    doc.text("Betreffend gelegentliche Arbeitsleistungen in unechter Arbeit auf Abruf evtl. Teilzeitarbeit.");
    doc.moveDown(1);
    doc.text("Allgemeines");
    doc.text("Die in diesem Vertrag enthaltenen Personenbezeichnungen beziehen sich in gleicher Weise auf die weibliche und männliche Form.");
    doc.moveDown(1);
    doc.text("1. Beginn der Anstellung");
    doc.text(`Am (${contractDate}) schliessen die Vertragsparteien gestützt auf die Rahmenvereinbarung einen Arbeitsvertrag als gelegentliche Arbeitsleistung über einen einzelnen Arbeitseinsatz ab. Eine Probezeit ist nicht vorgesehen.`);
    doc.moveDown(1);
    doc.text("2. Arbeitsort");
    doc.text("Als Arbeitsort gilt der im Vertrag festgelegter Einsatzort, vorliegend:");
    doc.text(`(${clientName}, ${clientAddress})`);
    doc.moveDown(1);
    doc.text("3. Tätigkeit");
    doc.text("Die folgenden Tätigkeiten fallen in den Aufgabenbereich:");
    doc.text(`(${serviceName})`);
    doc.moveDown(1);
    doc.text("4. Arbeitszeit, Dauer des Einsatzes");
    doc.text("Der Einsatz ist unbefristet im Umfange der im Vertrag festgelegten Stunden/Woche vorgesehen. Anpassungen als Reduktion oder Erweiterung/Verlängerung sind möglich, wobei beide Parteien damit einverstanden sein müssen. Bei solchen Änderungen des Arbeitspensums fallen irgendwelche Ansprüche der Arbeitnehmer ausser Betracht (Ausnahme Ziff. 4 lit. b Rahmenvereinbarung).");
    doc.text("Der Arbeitsplan für den Einsatz ist auf der Online-Plattform verfügbar. Dieser ist einzuhalten. Der Arbeitnehmer ist ausdrücklich mit der Verwendung des digitalen Arbeitsplans (inkl. Stundeneintrag) einverstanden. Ist der festgelegte Einsatzplan veränderten Kundenbedürfnissen anzupassen, ist die Arbeitgeberin darüber durch den Arbeitnehmer zu informieren und es ist ein neuer Arbeitsplan zwischen Arbeitgeberin und Arbeitnehmer zu vereinbaren.");
    doc.moveDown(1);
    doc.text("5. Überstunden");
    doc.text("Überstunden ab 43. Wochenstunde dürfen nur auf ausdrückliche Anordnung der Arbeitgeberin hin geleistet werden. Mehrstunden innerhalb der Grenzen von 42 Wochenstunden werden mit Freizeit von gleicher Dauer kompensiert oder in Ausnahmefällen ohne Zuschlag ausbezahlt.");
    doc.moveDown(1);
    doc.text("6. Lohn");
    doc.text("Der Stundengrundlohn beträgt\tCHF 25.00");
    doc.text("Zusätzliche Ferienentschädigung\t8.33%/10.64%");
    doc.text("Anteil 13. Monatslohn\t8.33%");
    doc.text("Die Auszahlung des Lohnes erfolgt monatlich, jeweils bis zum 5. des Nachfolgemonats.");
    doc.moveDown(1);
    doc.text("7. Auslagenersatz");
    doc.text("Sollten durch die Arbeitsleistung dem Arbeitnehmer Auslagen entstehen, werden solche gegen Beleg mit dem Lohn ausbezahlt.");
    doc.text("Kosten für den Arbeitsweg (Wohnort – Einsatzort) sowie Verpflegung stellen in keinem Falle Auslagen dar, die von der Arbeitgeberin zu vergüten sind.");
    doc.moveDown(1);
    doc.text("8. Ferien");
    doc.text("Der Ferienanspruch beträgt bis zum zurückgelegten 20. Altersjahr und ab dem vollendeten 50. Altersjahr 25 Arbeitstage (10.6%). Für alle übrigen Arbeitnehmer beträgt der Ferienanspruch 20 Arbeitstage (8.33%) Die Ferienentschädigung wird monatlich mit dem Gehalt ausbezahlt, womit der Arbeitnehmer ausdrücklich einverstanden ist.");
    doc.moveDown(1);
    doc.text("9. Steuern");
    doc.text("Bei Quellensteuerpflicht wird die Steuer direkt vom Bruttogehalt des Arbeitnehmers abgezogen.");
    doc.moveDown(1);
    doc.text("10. Krankheit");
    doc.text("Die Arbeitgeberin unterhält eine Krankentaggeldversicherung mit einer Deckung von 80% des Lohnes während 730 Tagen abzüglich Wartefrist. Der Arbeitnehmer bezahlt die Hälfte der Prämie, diese wird vom Bruttolohn abgezogen. Während einer allfälligen mit der Versicherung vereinbarten Wartefrist bezahlt die Arbeitgeberin das Taggeld.");
    doc.moveDown(1);
    doc.text("11. Unfall");
    doc.text("Der Arbeitnehmer ist bei unfallbedingter Arbeitsunfähigkeit für 80% des Lohnes ab dem dritten Tag versichert. Diese Deckung gilt für betriebs- und Nichtbetriebsunfälle. Die Nichtbetriebsunfallversicherung deckt den Lohnausfall nur dann, wenn der Arbeitnehmer mehr als 8 Stunden pro Woche (durchschnittlich) arbeitet. Die Prämien für die Betriebsunfallversicherung bezahlt die Arbeitgeberin, diejenigen der Nichtbetriebsunfallversicherung des Arbeitnehmers.");
    doc.moveDown(1);
    doc.text("12. Arbeitsunfähigkeit");
    doc.text("Abwesenheiten wegen Krankheit oder Unfall müssen umgehend und vor geplantem Arbeitsbeginn gemeldet werden. Dauert die Abwesenheit länger als 2 Tage, kann die Arbeitgeberin ein Arztzeugnis verlangen oder die Überprüfung der Arbeitsunfähigkeit durch einen eigenen Vertrauensarzt vornehmen lassen.");
    doc.moveDown(1);
    doc.text("13. Weitere Bestimmungen");
    doc.text("a. Weisungsrecht: Das Recht auf Arbeitsanweisungen jeglicher Art steht ausschliesslich der Arbeitgeberin zu. Der Arbeitnehmer haftet für die übliche Sorgfalt bei seiner Arbeitsleistung nach Art. 321e OR");
    doc.text("b. Geheimhaltung: Der Arbeitnehmer ist verpflichtet, vertrauliche Informationen und weitere geheime Fakten und Dokumente, zu welchen er bei der Verrichtung seiner Arbeitsleistung Zugang hat, streng geheim zu halten und keinesfalls an Dritte weiterzugeben. Dies gilt auch nach Beendigung seines Einsatzes. Dokumente oder Gegenstände, welche dem Arbeitnehmer während des Einsatzes ausgehändigt wurden, sind am Ende des Einsatzes zurückzugeben.");
    doc.text("c. Einsicht des Kunden in persönliche Daten: Soweit der Kunde dies wünscht, kann die Arbeitgeberin ihm persönliche Informationen über den Arbeitnehmer zugänglich machen, jedoch erst dann, wenn der Arbeitnehmer sein Einverständnis hierzu abgegeben hat. Der Kunde ist in einem solchen Fall zur vollständigen Geheimhaltung zu verpflichten.");
    doc.text("d. Arbeitsbewilligung: Ist für den Arbeitnehmer zur Arbeitsleistung eine behördliche Arbeitsbewilligung nötig, darf die Arbeit erst nach deren Vorliegen begonnen werden. Der Arbeitgeberin ist eine Kopie der Arbeitsbewilligung zuzustellen.");
    doc.text("e. Anwendbares Recht: Dieser Vertrag unterliegt ausschliesslich schweizerischem Recht. Bei Streitigkeiten aus diesem Vertrag sind ausschliesslich die Gerichte am Arbeits- oder Wohnort des Beklagten zuständig.");
    doc.moveDown(2);
    doc.text(`Rotkreuz, ${contractDate}`);
    doc.moveDown(2);
    doc.text("Prime Home Care AG");
    doc.moveDown(4);
    // Signature lines
    const pageWidth = doc.page.width;
    const margin = 50;
    const lineWidth = 200;
    const sigLeftX = margin;
    const sigRightX = pageWidth - margin - lineWidth;
    const lineY = doc.y;
    doc.moveTo(sigLeftX, lineY).lineTo(sigLeftX + lineWidth, lineY).stroke();
    doc.moveTo(sigRightX, lineY).lineTo(sigRightX + lineWidth, lineY).stroke();
    const labelY = lineY + 5;
    doc.font("Helvetica").fontSize(12).text("Arbeitgeberin", sigLeftX, labelY, { width: lineWidth, align: "center" });
    doc.font("Helvetica").fontSize(12).text("Arbeitnehmer", sigRightX, labelY, { width: lineWidth, align: "center" });
    // Footer with AVB and Nutzungsbedingungen links
    const footerY = doc.page.height - 60;
    doc.fontSize(10).fillColor('#04436F').text('AVB', 50, footerY, { link: 'https://phc.ch/AVB', underline: true });
    doc.fontSize(10).fillColor('#04436F').text('Nutzungsbedingungen', 120, footerY, { link: 'https://phc.ch/nutzungsbedingungen', underline: true });
    doc.end();
  });
}


export async function sendApprovalEmail(employee) {
  const { email, firstName, lastName } = employee;
  const portalUrl = process.env.NEXT_PUBLIC_BASE_URL + "/login";

  const contractBuffer = await createContractPdf(employee);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

await transporter.sendMail({
  from: `"Prime Home Care AG" <${process.env.SMTP_USER}>`,
  to: email,
  subject: `Ihre Einsatzbestätigung – Arbeitsvertrag im Anhang`,
  text: `Grüezi ${firstName}

Wir freuen uns Ihnen mitzuteilen, dass Ihr Einsatz offiziell bestätigt wurde.  

Den dazugehörigen Arbeitsvertrag finden Sie im Anhang dieser E-Mail. 

Bitte lesen Sie den Arbeitsvertrag sorgfältig durch und unterzeichnen Sie das Dokument digital. 

Vielen Dank für Ihr Engagement und willkommen im Team von Prime Home Care AG. 

Freundliche Grüsse 

Prime Home Care AG 

Birkenstrasse 49 

CH-6343 Rotkreuz 

info@phc.ch 

www.phc.ch 

AVB und Nutzungsbedingungen`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Grüezi ${firstName}</p>

      <p>Wir freuen uns Ihnen mitzuteilen, dass Ihr Einsatz offiziell bestätigt wurde.</p>

      <p>Den dazugehörigen Arbeitsvertrag finden Sie im Anhang dieser E-Mail.</p>

      <p>Bitte lesen Sie den Arbeitsvertrag sorgfältig durch und unterzeichnen Sie das Dokument digital.</p>

      <p>Vielen Dank für Ihr Engagement und willkommen im Team von Prime Home Care AG.</p>

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
    style="text-decoration:underline;color:#04436F;font-weight:500;cursor:pointer;"
  >
    AVB und Nutzungsbedingungen
  </a>
</p>

    </div>
  `,
  attachments: [
    {
      filename: `Arbeitsvertrag_${firstName}_${lastName}.pdf`,
      content: contractBuffer,
    },
  ],
});
}
