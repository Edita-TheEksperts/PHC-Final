import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { sendTerminationEmail } from "../../lib/sendTerminationEmail";
import { recipientEmail } from "../../lib/recipientEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// F-24: Kunden die innerhalb der ersten 30 Tage seit Vertragsbeginn kündigen,
// werden mit einer Aufwandsentschädigung von CHF 300 belastet. Wir charken über
// die hinterlegte Stripe-Zahlungsmethode (off_session). Schlägt das Charge
// fehl, wird die Kündigung trotzdem ausgeführt (gesetzliches Kündigungsrecht)
// und das Resultat im Response zurückgemeldet, damit das Admin-Dashboard die
// offene Forderung sichtbar hat.

const EARLY_TERMINATION_DAYS = 30;
const EARLY_TERMINATION_FEE_CHF = 300;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { reason, acknowledgedFee } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Termination reason required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true, requestEmail: true, firstName: true, lastName: true,
        firstDate: true, createdAt: true,
        stripeCustomerId: true, stripePaymentMethodId: true,
      },
    });

    // Days since contract started — fall back to createdAt if firstDate not set.
    const contractStart = user?.firstDate || user?.createdAt;
    const daysSinceStart = contractStart
      ? Math.floor((Date.now() - new Date(contractStart).getTime()) / (1000 * 60 * 60 * 24))
      : Infinity;

    const feeApplies = daysSinceStart < EARLY_TERMINATION_DAYS;

    // Safety net: the frontend should explicitly ask the user to acknowledge
    // the CHF 300 fee before submitting. If the fee applies and the client
    // didn't acknowledge, refuse to terminate so the user has to see the
    // dialog.
    if (feeApplies && !acknowledgedFee) {
      return res.status(409).json({
        message: "fee_acknowledgement_required",
        feeChf: EARLY_TERMINATION_FEE_CHF,
        daysSinceStart,
      });
    }

    // 1️⃣ Charge the fee BEFORE we tear down the contract — that way if the
    //    charge errors with a hard 4xx (e.g. card declined) we can fail fast
    //    and the user keeps their payment method.
    let chargeStatus = "not_applicable";
    let chargeError = null;
    if (feeApplies) {
      if (user?.stripeCustomerId && user?.stripePaymentMethodId) {
        try {
          await stripe.paymentIntents.create({
            amount: EARLY_TERMINATION_FEE_CHF * 100,
            currency: "chf",
            customer: user.stripeCustomerId,
            payment_method: user.stripePaymentMethodId,
            off_session: true,
            confirm: true,
            description: "PHC Aufwandsentschädigung – Kündigung innerhalb 30 Tagen",
            metadata: { userId, reason: "early_termination_fee" },
          });
          chargeStatus = "succeeded";
        } catch (err) {
          chargeStatus = "failed";
          chargeError = err?.message || "stripe_error";
          console.error("[terminate-contract] Stripe charge failed:", chargeError);
          // Continue with termination — user has a legal right to terminate.
          // Admin sees the failure in dashboard and follows up manually.
        }
      } else {
        chargeStatus = "no_payment_method";
        console.error("[terminate-contract] Fee owed but no Stripe payment method on file for user", userId);
      }
    }

    // 2️⃣ Mark user as terminated (soft-delete; row stays for history).
    //    F-25: also capture WHY and WHEN so the "Ehemalige Kunden" admin
    //    view has the context that used to be lost on hard-delete.
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "gekuendigt",
        terminationReason: reason,
        terminationDate: new Date(),
      },
    });

    // 3️⃣ Cancel all schedules
    await prisma.schedule.updateMany({
      where: {
        userId,
        NOT: { status: { in: ["cancelled", "done"] } },
      },
      data: { status: "terminated" },
    });

    // 4️⃣ Terminate assignments
    await prisma.assignment.updateMany({
      where: { userId, status: "active" },
      data: { status: "terminated" },
    });

    const terminationTo = recipientEmail(user);
    if (terminationTo) {
      await sendTerminationEmail({
        email: terminationTo,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }

    return res.status(200).json({
      success: true,
      feeApplies,
      feeChf: feeApplies ? EARLY_TERMINATION_FEE_CHF : 0,
      daysSinceStart,
      chargeStatus,
      chargeError,
    });
  } catch (error) {
    return res.status(500).json({ message: "Termination failed" });
  }
}
