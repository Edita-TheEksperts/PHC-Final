// test-update-worked-data.js
import "dotenv/config"; // load .env for SMTP creds
import handler from "./src/pages/api/update-worked-data.js";

import { prisma } from "./src/lib/prisma.js";
import { sendEmail } from "./src/lib/emails.js";

// ✅ Mock Prisma update (simulate DB returning a schedule)
prisma.schedule = {
  update: async () => ({
    id: 1,
    hours: 8,
    kilometers: 15,
    user: {
      firstName: "Max",
      lastName: "Muster",
      email: "anduela.nurshaba@the-eksperts.com", // <-- test target
    },
    employee: { firstName: "Anna", lastName: "Müller" },
  }),
};

// ✅ Proper req/res mock
function mockReqRes(body = {}, method = "POST") {
  const req = { method: method.toUpperCase(), body }; // force uppercase
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      console.log("📩 Response:", this.statusCode, data);
      return data;
    },
    end() {
      console.log("👉 Response ended with", this.statusCode);
    },
  };
  return { req, res };
}

// ✅ Run manual test
async function runTests() {
  console.log("👉 Running manual test (this will try to send a REAL email)…");
  console.log("SMTP_HOST =", process.env.SMTP_HOST);
  console.log("SMTP_USER =", process.env.SMTP_USER);

  // Valid POST request (should trigger sendEmail)
  let { req, res } = mockReqRes(
    {
      scheduleId: 1,
      workedHours: 8,
      kilometers: 15,
      employeeId: "emp123",
    },
    "POST"
  );
  await handler(req, res);

  // Wrong method → 405
  ({ req, res } = mockReqRes({}, "GET"));
  await handler(req, res);

  // Invalid input → 400
  ({ req, res } = mockReqRes(
    {
      scheduleId: "bad",
      workedHours: "x",
      kilometers: "y",
      employeeId: 5,
    },
    "POST"
  ));
  await handler(req, res);

  // Simulate DB crash → 500
  prisma.schedule.update = async () => {
    throw new Error("DB crash");
  };
  ({ req, res } = mockReqRes(
    {
      scheduleId: 1,
      workedHours: 5,
      kilometers: 20,
      employeeId: "emp123",
    },
    "POST"
  ));
  await handler(req, res);

  console.log("✅ Manual test finished");
}

runTests();
