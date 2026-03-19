import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function addBusinessHours(date, hours) {
  let result = new Date(date);
  let remaining = hours;

  while (remaining > 0) {
    result.setHours(result.getHours() + 1);
    const day = result.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      remaining--;
    }
  }
  return result;
}

/**
 * Calculate the deadline for capturing a payment.
 * Default: 48 business hours after the service date.
 * If the employee confirmed hours/km or the client raised a dispute afterwards,
 * the deadline shifts to 48 business hours after that action.
 */
function calcCaptureDeadline(schedule, logs) {
  let baseDate = schedule.date || new Date();
  let deadline = addBusinessHours(baseDate, 48);

  const lastRelevantLog = [...logs]
    .reverse()
    .find((log) =>
      ["employee_update_hours", "employee_update_km", "client_reject"].includes(log.action)
    );

  if (lastRelevantLog) {
    deadline = addBusinessHours(lastRelevantLog.createdAt, 48);
    console.log(`🔄 Deadline shifted by log (${lastRelevantLog.action}) → ${deadline}`);
  }

  return deadline;
}

export async function chargeUnpaidUsers() {
  const now = new Date();

  // Find all schedules not yet captured where the user has a payment intent
  const schedules = await prisma.schedule.findMany({
    where: {
      captured: false,
      user: { paymentIntentId: { not: null } },
    },
    include: { user: true },
  });

  // Deduplicate: one paymentIntentId may cover multiple schedules.
  // We only call stripe.capture() once per intent; subsequent schedules for
  // the same intent just get marked captured directly.
  const capturedIntents = new Set();

  for (const schedule of schedules) {
    const intentId = schedule.user.paymentIntentId;

    try {
      const logs = await prisma.activityLog.findMany({
        where: { targetId: String(schedule.id) },
        orderBy: { createdAt: "asc" },
      });

      const deadline = calcCaptureDeadline(schedule, logs);

      if (!deadline || now < deadline) {
        console.log(`⏳ Schedule ${schedule.id} not ready. Deadline: ${deadline}`);
        continue;
      }

      // ── Already captured this intent in this run ───────────────────────
      if (capturedIntents.has(intentId)) {
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { captured: true },
        });
        console.log(`✅ Schedule ${schedule.id} marked captured (intent already done this run)`);
        continue;
      }

      // ── Retrieve the intent from Stripe ───────────────────────────────
      const paymentIntent = await stripe.paymentIntents.retrieve(intentId);

      if (paymentIntent.status === "requires_capture") {
        // Card is authorized — capture the funds now
        const captured = await stripe.paymentIntents.capture(intentId);
        capturedIntents.add(intentId);

        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { captured: true },
        });

        try {
          await prisma.user.update({ where: { id: schedule.userId }, data: { paymentCaptured: true } });
        } catch (_) { /* field available after server restart */ }

        // Create a Transaction record so the finance dashboard has data
        if (schedule.employeeId) {
          const amountClient = (captured.amount_received ?? captured.amount) / 100;
          const amountEmployee = (schedule.hours || 0) * 30; // 30 CHF/h base rate

          try {
            await prisma.transaction.create({
              data: {
                scheduleId: schedule.id,
                userId: schedule.userId,
                employeeId: schedule.employeeId,
                amountClient,
                amountEmployee,
                status: "paid",
                paymentIntentId: intentId,
              },
            });
          } catch (txErr) {
            // Unique constraint on paymentIntentId — already exists, skip
            if (!txErr.message.includes("Unique constraint")) {
              console.error(`⚠️ Transaction create failed for schedule ${schedule.id}:`, txErr.message);
            }
          }
        }

        console.log(`💰 Captured payment for schedule ${schedule.id} (${intentId})`);

      } else if (paymentIntent.status === "succeeded") {
        // Payment was already captured (legacy flow or manual capture).
        // Just mark the schedule so the cron stops retrying.
        capturedIntents.add(intentId);
        await prisma.schedule.update({
          where: { id: schedule.id },
          data: { captured: true },
        });
        try {
          await prisma.user.update({ where: { id: schedule.userId }, data: { paymentCaptured: true } });
        } catch (_) { /* field available after server restart */ }
        console.log(`✅ Schedule ${schedule.id} already paid — marked captured`);

      } else {
        console.warn(`⚠️ Schedule ${schedule.id}: intent ${intentId} is in status "${paymentIntent.status}" — skipping`);
      }

    } catch (err) {
      console.error(`❌ Error processing schedule ${schedule.id}:`, err.message);
    }
  }
}
