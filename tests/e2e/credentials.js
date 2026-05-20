// Test credentials used by the screenshot spec. Must match what
// prisma/seed-test-users.js writes to the DB. If you change one, change both.
module.exports = {
  admin: {
    email: "qa-admin@phc.local",
    password: "TestAdmin2026!",
  },
  client: {
    email: "qa-client@phc.local",
    password: "TestClient2026!",
  },
  employee: {
    email: "qa-employee@phc.local",
    password: "TestEmployee2026!",
  },
};
