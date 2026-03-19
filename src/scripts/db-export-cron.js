import cron from "node-cron";
import { triggerDatabaseExport } from "./auto-export.js";

// Run every Friday at midnight
cron.schedule("0 0 * * 5", async () => {
  try {
    await triggerDatabaseExport();
  } catch (err) {
  }
});
