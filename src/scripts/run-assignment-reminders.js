import { runAssignmentReminders } from "../pages/api/assignment-reminder-cron.js";

async function main() {
  await runAssignmentReminders();
}

main().catch(() => {});
