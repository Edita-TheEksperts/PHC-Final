// Bridge helper: load an EmailTemplate row from the DB, interpolate `{{var}}`
// placeholders, and fall back to the supplied hardcoded copy if the row is
// missing or the DB call fails. This lets the admin edit any template via
// `/admin/email-templates` without us having to migrate everything at once —
// new templates can be added gradually, and the app keeps working if the DB
// seed hasn't run yet.
//
// Usage:
//   const { subject, html } = await renderEmail("clientWelcome", vars, {
//     fallbackSubject: "Willkommen…",
//     fallbackHtml: `<p>Hallo {{firstName}}…</p>`,
//   });
//   await transporter.sendMail({ to, subject, html });

import { prisma } from "./prisma";

function interpolate(text, vars) {
  if (!text) return "";
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const v = vars?.[key];
    return v === undefined || v === null ? "" : String(v);
  });
}

export async function renderEmail(name, vars = {}, fallback = {}) {
  const fallbackSubject = fallback.fallbackSubject ?? "";
  const fallbackHtml    = fallback.fallbackHtml    ?? "";

  let row = null;
  try {
    row = await prisma.emailTemplate.findUnique({ where: { name } });
  } catch (err) {
    // DB unreachable — fall back so emails still go out.
    console.error(`[emailTemplate] DB lookup for "${name}" failed:`, err.message);
  }

  const subject = row?.subject || fallbackSubject;
  const body    = row?.body    || fallbackHtml;

  return {
    subject: interpolate(subject, vars),
    html:    interpolate(body, vars),
    source:  row ? "db" : "fallback",
  };
}
