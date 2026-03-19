const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * ==============================
 *  USER (CLIENT) IDS TO DELETE
 * ==============================
 */
const USER_IDS = [
  "ce4c0ada-1a02-469b-a84a-96663e190ad8",
    "f0fda771-37ec-4f3b-a053-6c403b5ef111",
      "ee37a1f7-b363-414c-ad8c-07113218025c",
        "e84b68da-fb4c-43c5-91eb-98f7013ec3c5",
          "ba0d28a6-84a5-40f3-9788-dd91ad437ac1",
            "b31d58b2-f942-4e10-aec7-4817f94f1c74",
              "b2abbb88-4a0b-4164-880b-3c12979a61d8",
  // "another-user-id",
];

async function deleteUsers() {
  try {
    console.log("🗑  Starting USER deletion...");

    for (const userId of USER_IDS) {
      console.log(`\n➡️  Deleting user: ${userId}`);

      // (Optional) Sigurohu qe ekziston
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true, email: true },
      });

      if (!user) {
        console.log(`⚠️  User not found: ${userId}`);
        continue;
      }

      // (Optional) nese do veç client-at:
      // if (user.role !== "client") {
      //   console.log(`⚠️  Skipping (role is ${user.role}): ${userId}`);
      //   continue;
      // }

      // 1) Activity logs (where user was actor)
      await prisma.activityLog.deleteMany({
        where: { actorUserId: userId },
      });

      // 2) Reminders
      await prisma.reminder.deleteMany({
        where: { userId },
      });

      // 3) Transactions (User side)
      await prisma.transaction.deleteMany({
        where: { userId },
      });

      // 4) Assignments (User side)
      // NOTE: Assignments kanë relation me Schedule; por meqë i fshijmë Schedule poshtë,
      // këtu i fshijmë assignment-et e user-it direkt.
      await prisma.assignment.deleteMany({
        where: { userId },
      });

      // 5) Schedules (User side)
      // (Schedule ka transactions + Assignment, por i kemi fshirë më lart)
      await prisma.schedule.deleteMany({
        where: { userId },
      });

      // 6) Vacations (User side)
      await prisma.vacation.deleteMany({
        where: { userId },
      });

      // 7) Lidhjet many-to-many: services, subServices, vouchers
      // Prisma e bën këtë me disconnect (fshin rreshtat në join table)
      await prisma.user.update({
        where: { id: userId },
        data: {
          services: { set: [] },
          subServices: { set: [] },
          vouchers: { set: [] },
        },
      });

      // 8) Finally delete user
      await prisma.user.delete({
        where: { id: userId },
      });

      console.log(`✔️ User deleted successfully: ${userId} (${user.email})`);
    }

    console.log("\n🎉 Done! All selected users have been deleted.");
  } catch (err) {
    console.error("❌ Error deleting users:", err);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUsers();
