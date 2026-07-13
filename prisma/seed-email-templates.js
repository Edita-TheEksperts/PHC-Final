// Idempotent seeder for EmailTemplate rows that the bridge helper
// (src/lib/emailTemplate.js) will read at runtime. Each template's `name` is
// the lookup key used by mailer functions. The hardcoded HTML lives both here
// AND inside the mailer as a runtime fallback — so the app keeps working even
// if the seed hasn't been run yet on a given environment.
//
// Run (locally or first-time on a new environment):
//   npm run seed:emails        ← preferred
//   node prisma/seed-email-templates.js   ← equivalent
//
// Re-running is safe: rows are upserted by `name`. We DO NOT overwrite an
// existing row's body/subject — once an admin has edited a template via the
// dashboard, the seed must not stomp their change. The first run creates the
// row; subsequent runs only ensure the row exists and update nothing.
//
// ──────────────────────────────────────────────────────────────────────────
// F-15 TODO (Edita): the bodies below are the CURRENT hardcoded versions —
// they get a customer's job done but they're not the "official" PHC copy.
// Once this seed has run, open /admin/email-templates and paste the
// finalised text from the marketing/legal-approved Word docs for each of:
//   • clientWelcome
//   • appointmentConfirmation
//   • cancellationConfirmation
//   • assignmentAccepted
//   • assignmentCancelledClient
//   • assignmentCancelledEmployee
//   • paymentConfirmation
//   • interviewReminder
//   • applicantConfirmation
// Available placeholders are listed in each block below as `{{name}}`.
// Editing in the admin UI is preserved across re-seeds and across deploys.
// ──────────────────────────────────────────────────────────────────────────

// Load .env from project root so DATABASE_URL is available when invoked
// directly via `node prisma/seed-email-templates.js` (Prisma only auto-loads
// .env for its CLI commands, not for standalone Node scripts).
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SHARED_FOOTER = `
  <br>
  <p>Freundliche Grüsse<br>Prime Home Care AG<br>Birkenstrasse 49<br>CH-6343 Rotkreuz<br>info@phc.ch<br>www.phc.ch</p>
  <p>
    <a href="https://phc.ch/AVB" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">AVB</a> und
    <a href="https://phc.ch/nutzungsbedingungen" target="_blank" style="text-decoration:underline;color:#04436F;font-weight:500;">Nutzungsbedingungen</a>
  </p>
`;

const templates = [
  {
    name: "clientWelcome",
    subject: "Willkommen bei Prime Home Care AG – Passwort erstellen",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Vielen Dank für Ihre Buchung bei Prime Home Care AG.</p>
        <p>Bitte erstellen Sie Ihr Passwort, um sich in Ihrem Kunden-Portal anzumelden:</p>
        <p>
          <a href="{{passwordLink}}"
             style="display:inline-block;background-color:#B99B5F;color:#fff;padding:10px 18px;border-radius:5px;text-decoration:none;font-weight:bold;">
             Passwort erstellen
          </a>
        </p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "appointmentConfirmation",
    subject: "Ihre Terminbestätigung bei Prime Home Care AG",
    body: `
      <p>{{greeting}}</p>
      <p>Wir bestätigen Ihren Termin am</p>
      <p><strong>{{day}}, {{date}}</strong> um <strong>{{startTime}}</strong> Uhr ({{hours}} Std).</p>
      <p>Service: <strong>{{serviceName}}</strong></p>
      ${SHARED_FOOTER}
    `,
  },
  {
    name: "cancellationConfirmation",
    subject: "Bestätigung Ihrer Stornierung",
    body: `
      <p>{{greeting}}</p>
      <p>Ihr Termin am <strong>{{day}}, {{date}}</strong> um <strong>{{startTime}}</strong> wurde erfolgreich storniert.</p>
      <p>Stornogebühr: <strong>{{feePercent}}%</strong>{{refundLine}}</p>
      ${SHARED_FOOTER}
    `,
  },
  {
    name: "assignmentAccepted",
    subject: "Ihre Buchung wurde erfolgreich bestätigt",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Ihre Buchung wurde erfolgreich bestätigt und folgender Mitarbeiter wurde Ihnen zugewiesen.</p>
        <p><strong>Betreuer:</strong> {{employeeFirstName}} {{employeeLastName}}</p>
        <p><strong>Kontakt:</strong> {{employeePhone}}</p>
        <p><strong>Service:</strong> {{serviceName}}</p>
        <p>Startdatum: {{firstDate}}</p>
        <p>Vielen Dank für Ihr Vertrauen.</p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "assignmentRequestEmployee",
    subject: "Neuer Einsatz – Bitte bestätigen",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Sie haben einen neuen Einsatz für den Kunden
          <strong>{{clientFirstName}} {{clientLastName}}</strong>.</p>
        <p><strong>Serie:</strong> {{seriesDescription}}</p>
        <p>Um den Einsatz anzunehmen oder abzulehnen, melden Sie sich bitte im Mitarbeiter-Dashboard an:</p>
        <p>
          <a href="{{dashboardUrl}}"
             style="display:inline-block;padding:12px 20px;background:#04436F;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
            Zum Mitarbeiter-Dashboard
          </a>
        </p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "assignmentCancelledClient",
    subject: "Ihr Einsatz wurde storniert",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Ihr geplanter Einsatz am <b>{{date}}</b> um <b>{{startTime}}</b> ({{duration}}) für den Service <b>{{service}}</b> wurde storniert.</p>
        <p>Grund: {{reason}}</p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "assignmentCancelledEmployee",
    subject: "Ihr Einsatz wurde storniert",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Ihr geplanter Einsatz am <b>{{date}}</b> um <b>{{startTime}}</b> ({{duration}}) für den Service <b>{{service}}</b> wurde storniert.</p>
        <p>Grund: {{reason}}</p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "paymentConfirmation",
    subject: "Zahlungsbestätigung",
    body: `
      <p>{{greeting}}</p>
      <p>Wir bestätigen den Eingang Ihrer Zahlung über <strong>CHF {{amount}}</strong>.</p>
      <p>Buchungsreferenz: {{bookingReference}}</p>
      ${SHARED_FOOTER}
    `,
  },
  {
    name: "interviewReminder",
    subject: "Erinnerung – Ihr Interview-Termin bei Prime Home Care AG",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Wir haben Ihnen vor zwei Tagen eine Einladung zum Interview gesendet, aber noch
        keine Buchung erhalten.</p>
        <p>Bitte wählen Sie einen passenden Termin, damit wir den Bewerbungsprozess
        fortsetzen können.</p>
        <p>
          <a href="https://phc.ch/login"
             style="display:inline-block;padding:10px 18px;background:#04436F;color:#fff;
                    border-radius:6px;text-decoration:none;font-weight:bold;">
            Interview-Termin wählen
          </a>
        </p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "employeeWelcome",
    subject: "Willkommen bei Prime Home Care AG – Bitte erstellen Sie Ihr Passwort",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Vielen Dank für Ihre Bewerbung bei der Prime Home Care AG.
        Ihr Zugang zum Mitarbeiter-Portal ist jetzt freigeschaltet.</p>
        <p>Bitte erstellen Sie Ihr Passwort, um sich erstmals einzuloggen:</p>
        <p>
          <a href="{{passwordLink}}"
             style="display:inline-block;background-color:#04436F;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:bold;">
             Passwort erstellen
          </a>
        </p>
        <p>Der Link ist 48 Stunden gültig. Im Anhang finden Sie Ihre Rahmenvereinbarung.</p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
  {
    name: "applicantConfirmation",
    subject: "Ihre Bewerbung bei Prime Home Care AG",
    body: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>{{greeting}}</p>
        <p>Vielen Dank für Ihre Bewerbung bei Prime Home Care AG.</p>
        <p>Wir haben Ihre Unterlagen erhalten und prüfen diese sorgfältig. In der Regel
        melden wir uns innerhalb von 2 bis 3 Werktagen bei Ihnen, um die nächsten
        Schritte (in der Regel ein kurzes Interview) zu vereinbaren.</p>
        <p>Bei Rückfragen erreichen Sie uns jederzeit unter info@phc.ch.</p>
        ${SHARED_FOOTER}
      </div>
    `,
  },
];

async function main() {
  let created = 0;
  let skipped = 0;
  for (const t of templates) {
    const existing = await prisma.emailTemplate.findUnique({ where: { name: t.name } });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.emailTemplate.create({ data: t });
    created++;
    console.log(`  + created template "${t.name}"`);
  }
  console.log(`\nDone — ${created} created, ${skipped} already existed.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
