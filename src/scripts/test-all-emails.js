// Note: sendReminders and emails use ESM — run this file with a bundler or convert to ESM
const { sendPendingReminders } = require('../lib/sendReminders');
const { sendEmail } = require('../lib/emails');

const TEST_EMAIL = 'edita.latifi@the-eksperts.com';

async function runAllEmails() {
  try {
    // --- 1. Client Registration Email ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Client Registration',
      html: '<p>Hello Client 👋</p><p>Your registration was successful.</p>',
    });

    // --- 2. Employee Registration Email ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Employee Registration',
      html: '<p>Hello Employee 👋</p><p>We received your application.</p>',
    });

    // --- 3. Password Reset Email ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Passwort zurücksetzen',
      html: '<p>Klicken Sie hier, um Ihr Passwort zurückzusetzen: <a href="#">Zurücksetzen</a></p>',
    });

    // --- 4. Feedback Request Email ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Wie zufrieden sind Sie mit unserer Betreuung?',
      html: `
        <p>Hallo Max Mustermann</p>
        <p>Bitte bewerten Sie die Betreuung durch Frau Müller.</p>
        <p><a href="https://example.com/feedback">Jetzt Feedback geben</a></p>
      `,
    });

    // --- 5. Reminder Email: 4h ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Ihre Betreuung wartet auf Sie (4h_reminder)',
      html: `
        <p>Guten Tag Max Mustermann,</p>
        <p>Sie haben Ihr Kundenkonto erfolgreich erstellt – vielen Dank! Uns ist aufgefallen, dass Sie noch keine Buchung abgeschlossen haben.</p>
        <p>Möchten Sie Hilfe oder eine telefonische Beratung? Kontaktieren Sie uns gerne unter +41 44 123 45 67 oder buchen Sie direkt hier: <a href="https://yourapp.com/booking">Direktlink zur Buchung</a>.</p>
        <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
      `,
    });

    // --- 6. Reminder Email: 48h ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Erinnerung: Bitte fehlende Unterlagen hochladen (48h_reminder)',
      html: `
        <p>Guten Tag Max Mustermann,</p>
        <p>Wir bitten Sie freundlich, die noch ausstehenden Dokumente für Ihre Kundenakte hochzuladen. Diese sind erforderlich, um Ihre Betreuung korrekt zu planen und durchzuführen.</p>
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung. Vielen Dank für Ihre Mithilfe!</p>
        <p>Freundliche Grüsse<br/>Ihr Prime Home Care Team</p>
      `,
    });

    // --- 7. Assignment Emails ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Neue Einsatzbestätigung',
      html: '<p>Sie wurden für einen neuen Einsatz bestätigt.</p>',
    });

    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Einsatz wurde abgelehnt',
      html: '<p>Der Einsatz wurde leider abgelehnt.</p>',
    });

    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Einsatz wartet auf Ihre Bestätigung',
      html: '<p>Bitte bestätigen Sie den neuen Einsatz.</p>',
    });

    // --- 8. Admin Notification ---
    await sendEmail({
      to: TEST_EMAIL,
      subject: 'Neue Registrierung',
      html: '<p>Ein neuer Nutzer hat sich registriert.</p>',
    });

 // --- 9. Send real reminders from DB if available ---
await sendPendingReminders();
} catch (err) {
}
}

runAllEmails();
