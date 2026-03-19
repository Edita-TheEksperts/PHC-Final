import { sendAssignmentContractEmail, sendApprovalEmail } from "./src/lib/emailHelpers.js";

async function testAllEmails() {
  // Test data for employee and client
  const employee = {
    firstName: "Edita",
    lastName: "Latifi",
    email: "edita.latifi@the-eksperts.com",
    address: "Teststrasse",
    houseNumber: "1",
    zipCode: "1234",
    city: "Teststadt",
  };
  const client = {
    firstName: "TestClient",
    lastName: "Mustermann",
    email: "client@phc.ch",
    address: "Kundenweg",
    postalCode: "5678",
    city: "Kundenstadt",
  };

  // Assignment contract email
  await sendAssignmentContractEmail({
    employee,
    user: client,
    serviceName: "Haushaltshilfe",
    firstDate: new Date().toISOString(),
  });

  // Approval email
  await sendApprovalEmail({
    ...employee,
  });

  // Add more test calls here for any other email functions you fixed today
  console.log("✅ Test emails sent to edita.latifi@the-eksperts.com");
}

testAllEmails().catch(console.error);
