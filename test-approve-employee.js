// Test employee approval
const fetch = require("node-fetch");

async function testApproval() {
  try {
    console.log("🔄 Testing employee approval...");
    console.log("Email: editalatifi1996@gmail.com\n");

    const response = await fetch("http://localhost:3000/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "editalatifi1996@gmail.com" }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS!");
      console.log("Response:", data);
      console.log("\n📧 Email should have been sent to editalatifi1996@gmail.com");
      console.log("Check the email inbox for:");
      console.log("- Subject: Willkommen im Prime Home Care Team – Ihr Zugang ist aktiviert");
      console.log("- Login credentials");
      console.log("- Rahmenvereinbarung PDF attachment");
    } else {
      console.error("❌ FAILED!");
      console.error("Status:", response.status);
      console.error("Error:", data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testApproval();
