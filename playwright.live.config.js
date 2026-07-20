// Live-site config: no webServer, points at the deployed URL.
// Run: npx playwright test --config playwright.live.config.js
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 20_000 },
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL || "https://phc-final.vercel.app",
    headless: true,
    viewport: { width: 1440, height: 900 },
    locale: "de-CH",
    timezoneId: "Europe/Zurich",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
