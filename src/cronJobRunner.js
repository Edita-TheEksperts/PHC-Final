import cron from "node-cron";
import capturePendingPayments from "./scripts/capturePayments.js";

cron.schedule("0 * * * *", () => {
  capturePendingPayments();
});

