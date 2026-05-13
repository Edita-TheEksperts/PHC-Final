// Daily cron — runs interview-follow-up rules for invited candidates.
//
//  • Day 2 after invitation: send a reminder email.
//    Window logic: pick employees whose `inviteSentAt` falls into the 24-hour
//    bracket [day-3, day-2) so each employee receives the reminder exactly once.
//
//  • Day 30 after invitation: auto-set status to "rejected".
//
// Endpoint is invoked by Vercel's scheduler (vercel.json). Locally you can hit
// it manually with GET to test.

import { prisma } from "../../../lib/prisma";
import { sendEmail } from "../../../lib/emails";
import { renderEmail } from "../../../lib/emailTemplate";

const TWO_DAYS_MS = 2 * 24 * 3600 * 1000;
const THREE_DAYS_MS = 3 * 24 * 3600 * 1000;
const THIRTY_DAYS_MS = 30 * 24 * 3600 * 1000;

function reminderHtml(firstName) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hallo ${firstName || ""},</p>
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
      <p>Freundliche Grüsse<br/>Prime Home Care AG</p>
    </div>
  `;
}

export default async function handler(req, res) {
  // Vercel cron uses GET by default; allow POST for manual runs too.
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).end();
  }

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - TWO_DAYS_MS);
  const threeDaysAgo = new Date(now.getTime() - THREE_DAYS_MS);
  const thirtyDaysAgo = new Date(now.getTime() - THIRTY_DAYS_MS);

  const result = { remindersSent: 0, autoRejected: 0, errors: [] };

  try {
    // 1️⃣ Reminders for day-2 (24-hour window so we don't spam)
    const reminderCandidates = await prisma.employee.findMany({
      where: {
        invited: true,
        inviteSentAt: { gte: threeDaysAgo, lt: twoDaysAgo },
        status: { in: ["pending", "invited", "geprueft"] },
      },
      select: { id: true, email: true, firstName: true },
    });

    for (const emp of reminderCandidates) {
      if (!emp.email) continue;
      try {
        const { subject, html } = await renderEmail("interviewReminder", {
          firstName: emp.firstName || "",
        }, {
          fallbackSubject: "Erinnerung – Ihr Interview-Termin bei Prime Home Care AG",
          fallbackHtml: reminderHtml(emp.firstName),
        });
        await sendEmail({ to: emp.email, subject, html });
        result.remindersSent++;
      } catch (err) {
        result.errors.push({ phase: "reminder", id: emp.id, msg: err.message });
      }
    }

    // 2️⃣ Auto-reject after 30 days without progressing
    const rejectCandidates = await prisma.employee.findMany({
      where: {
        invited: true,
        inviteSentAt: { lt: thirtyDaysAgo },
        status: { in: ["pending", "invited", "geprueft"] },
      },
      select: { id: true },
    });

    if (rejectCandidates.length > 0) {
      await prisma.employee.updateMany({
        where: { id: { in: rejectCandidates.map((e) => e.id) } },
        data: { status: "rejected" },
      });
      result.autoRejected = rejectCandidates.length;
    }

    return res.status(200).json({ ok: true, ...result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message, ...result });
  }
}
