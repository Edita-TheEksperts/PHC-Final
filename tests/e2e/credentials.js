// Test credentials used by the screenshot spec. Must match what
// prisma/seed-test-users.js writes to the DB. If you change one, change both.
module.exports = {
  admin: {
    email: "admin@phc.local",
    password: "TestAdmin2026!",
  },
  client: {
    email: "edita.latifi@the-eksperts.com",
    password: "TestEdita2026!",
  },
  employee: {
    // Internal address — see seed-test-users.js note. Display name is still
    // "Fisnik Salihu" so screenshots show Fisnik.
    email: "fisnik.test@phc.local",
    password: "TestFisnik2026!",
  },
};
