// processRefunds.js
import { prisma } from "./src/lib/prisma.js";

async function processRefunds() {
  const today = new Date();

  // marrim të gjitha transactions me schedules
  const txs = await prisma.transaction.findMany({
    include: { schedule: true, user: true },
  });

  for (const tx of txs) {
    const { schedule, amountClient } = tx;
    if (!schedule?.date) {
      console.log(`⚠️ Transaction ${tx.id} nuk ka date!`);
      continue;
    }

    const daysDiff = Math.floor(
      (schedule.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    let refundPercent = 0;
    if (daysDiff >= 14) {
      refundPercent = 100;
    } else if (daysDiff >= 7) {
      refundPercent = 50;
    } else {
      refundPercent = 0;
    }

    const refundAmount = (amountClient * refundPercent) / 100;

    console.log(
      `🧾 Schedule ${schedule.id} → ${daysDiff} days left → Refund: ${refundPercent}% = ${refundAmount} CHF`
    );

    // këtu normalisht thërrasim Stripe.refunds.create(...)
    // por për test vetëm e shënojmë në DB si "refunded"
    if (refundAmount > 0) {
      await prisma.transaction.update({
        where: { id: tx.id },
        data: { status: "refunded" },
      });
      console.log(`✅ Transaction ${tx.id} updated as refunded`);
    } else {
      console.log(`❌ No refund for transaction ${tx.id}`);
    }
  }
}

processRefunds()
  .catch((err) => console.error(err))
  .finally(async () => {
    await prisma.$disconnect();
  });
