import { PrismaClient } from "@prisma/client";
import { runAssignmentReminders } from "./src/pages/api/assignment-reminder-cron.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 STARTING TEST...");

  // 1️⃣ Krijojmë një assignment test me status pending
  const assignment = await prisma.assignment.create({
    data: {
      userId: "e6bfda6d-f264-4354-b669-78064140395b",
      employeeId: "4d911d6f-921c-4a81-a4db-111da2921cba",
      confirmationStatus: "pending",
      reminderSentCount: 0,
      createdAt: new Date(), // fillimisht tani
    },
  });

  console.log("🆕 Created test assignment:", assignment.id);

  // 2️⃣ Simulo 13 orë më vonë për Reminder 1
  await prisma.assignment.update({
    where: { id: assignment.id },
    data: {
      createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000), // -13 orë
      reminderSentCount: 0,
    },
  });

  console.log("⏱  Simulating +13 hours → Expect REMINDER 1");
  await runAssignmentReminders();

  // 3️⃣ Simulo 25 orë më vonë për Reminder 2
  await prisma.assignment.update({
    where: { id: assignment.id },
    data: {
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // -25 orë
      reminderSentCount: 1,
    },
  });

  console.log("⏱  Simulating +25 hours → Expect REMINDER 2");
  await runAssignmentReminders();

  // 4️⃣ Simulo 37 orë më vonë për Auto-Cancel
  await prisma.assignment.update({
    where: { id: assignment.id },
    data: {
      createdAt: new Date(Date.now() - 37 * 60 * 60 * 1000), // -37 orë
      reminderSentCount: 2,
    },
  });

  console.log("⏱  Simulating +37 hours → Expect AUTO-CANCEL + ADMIN EMAIL");
  await runAssignmentReminders();

  console.log("✅ TEST FINISHED");
}

main()
  .catch((err) => console.error(err))
  .finally(() => prisma.$disconnect());
