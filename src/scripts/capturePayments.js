// 1. Import dependencies
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";
import nodemailer from "nodemailer";

// 2. Set up Stripe and Prisma
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 3. Set up nodemailer transporter (for sending email)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendPaymentConfirmationEmail(user, amount, bookingReference) {
  const mailOptions = {
    from: '"Prime Home Care AG" <info@primehomecare.ch>',
    to: user.email,
    subject: "Zahlungsbestätigung / Rechnung zu Ihrer Buchung",
    html: `
      <p>Guten Tag ${user.firstName || ""} ${user.lastName || ""},</p>

      <p>
        Wir bestätigen den Eingang Ihrer Zahlung über 
        <strong>CHF ${amount.toFixed(2)}</strong> 
        zur Buchung <strong>${bookingReference}</strong>.
      </p>

      <p>
        Ihre Rechnung finden Sie auf Ihrer persönlichen PHC-Plattform.
      </p>

      <p>
        Bei Fragen stehen wir Ihnen jederzeit gerne zur Verfügung.
      </p>

      <p>Freundliche Grüsse</p>

      <p>
        <strong>Prime Home Care AG</strong><br/>
        Birkenstrasse 49<br/>
        CH-6343 Rotkreuz<br/>
        info@phc.ch<br/>
        www.phc.ch
      </p>

      <p>
        <a href="https://phc.ch/AVB"
           target="_blank"
           style="text-decoration: underline; color:#04436F; font-weight:500;">
          AVB und Nutzungsbedingungen
        </a>
      </p>
    `,
  };

  await transporter.sendMail(mailOptions);
}


// 5. Main function: capture payments & send confirmation email
export async function capturePendingPayments() {
  try {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24h ago

    const usersToCharge = await prisma.user.findMany({
      where: {
        firstDate: { lte: cutoffDate },
        paymentIntentId: { not: null },
        paymentCaptured: false,
      },
    });

    for (const user of usersToCharge) {
      try {
        const paymentIntent = await stripe.paymentIntents.capture(user.paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          await prisma.user.update({
            where: { id: user.id },
            data: { paymentCaptured: true },
          });

          await sendPaymentConfirmationEmail(
            user,
            paymentIntent.amount / 100,  // Stripe uses cents
            user.id                      // Used as booking reference
          );
        }
      } catch (stripeError) {
      }
    }
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

// 6. Run it
capturePendingPayments();
