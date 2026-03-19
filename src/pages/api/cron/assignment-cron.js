import cron from "node-cron";
import { runAssignmentReminders } from "../assignment-reminder-cron.js";
import { runUnassignedClientEmails } from "../../../scripts/unassigned-client-cron.js";

cron.schedule("* * * * *", async () => {

  await runAssignmentReminders();
  await runUnassignedClientEmails();
});
