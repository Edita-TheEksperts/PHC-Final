// send-test-email.js
import { prisma } from "./src/lib/prisma.js";
// send-test-email.js
import { sendApprovalEmail } from "./src/lib/mailer.js";

const testEmployee = {
  email: "anduela_nurshabaa@hotmail.com",
  firstName: "Test",
  lastName: "Employee",
  address: "Musterstrasse",
  houseNumber: "12A",
  zipCode: "8001",
  city: "Zürich",
  country: "Schweiz",
};

async function main() {
  try {
    await sendApprovalEmail(testEmployee);
    console.log(`✅ Test email sent to ${testEmployee.email}`);
  } catch (err) {
    console.error("❌ Error sending test email:", err);
  }
}

main();
