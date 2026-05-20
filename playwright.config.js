// Playwright config for the PHC screenshot capture run.
// Boots `npm run dev` on localhost:3000, waits up to 3 minutes for it to be
// reachable, then runs the screenshot spec(s). Re-uses an existing dev server
// if one is already running — that makes local iteration fast.

const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  // Sequential — captures need predictable state, parallel would clobber each other.
  fullyParallel: false,
  workers: 1,
  // Single retry to absorb the odd flaky network call. Most failures should be
  // real (missing seed, dev server down) so we don't retry endlessly.
  retries: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    headless: true,
    viewport: { width: 1440, height: 900 },
    screenshot: "off", // we take explicit screenshots, not the on-failure variety
    video: "off",
    trace: "off",
    locale: "de-CH",
    timezoneId: "Europe/Zurich",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
