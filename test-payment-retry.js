import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "./src/lib/emails.js";

// Sleep helper
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fake Stripe simulation
function fakeStripeCaptureSimulation(attempt) {
  return { success: false, reason: "Card declined" }; 
}


async function runTestSimulation() {
  let attempts = 0;
  let reminderCount = 0;
  let phc = false;

  console.log("🚀 TEST STARTED — simulation of 3 x 48h!\n");

  while (attempts < 3 && !phc) {
    attempts++;
    reminderCount++;

    console.log(`⏳ Attempt ${attempts} (48h later...)`);

    const stripe = fakeStripeCaptureSimulation(attempts);

    if (stripe.success) {
      console.log("🟢 Payment captured successfully on attempt:", attempts);
      console.log("📬 reminderCount:", reminderCount);
      console.log("\n🏁 END OF TEST — SUCCESS");
      return;
    }

    console.log("❌ Failed:", stripe.reason);

    // AFTER 3 FAILED ATTEMPTS → SEND EMAIL
    if (attempts >= 3) {
      phc = true;

      console.log("🚨 After 3 failed attempts → moved to PHC manual!");
      console.log("📌 reminderCount:", reminderCount);
      console.log("📨 Sending admin email…\n");

      try {
        await sendEmail({
          to: process.env.ADMIN_NOTIFICATION_EMAIL,
          subject: "⚠️ Payment failed 3 times — ACTION REQUIRED",
          html: `
            <h2>⚠️ Payment Failed Notification</h2>
            <p>Dear admin,</p>
            <p>A client's automatic payment has failed <strong>3 times</strong>.</p>
            <p>This is a simulation from <em>test-payment-retry.js</em>.</p>

            <h3>📌 Details</h3>
            <ul>
              <li>Attempts: ${attempts}</li>
              <li>Reminder count: ${reminderCount}</li>
              <li>Status: Moved to PHC manual payment</li>
            </ul>

            <p>Please check this client in the dashboard.</p>
            <br>
            <p>— System Test Engine 🤖</p>
          `,
        });

        console.log("✅ Admin email sent successfully!");
      } catch (err) {
        console.error("❌ Failed to send admin email:", err);
      }

      console.log("\n🏁 END OF TEST — FAILED 3 TIMES");
      return;
    }

    // For test: 1 second = 48h
    await sleep(1000);
  }
}

runTestSimulation();
