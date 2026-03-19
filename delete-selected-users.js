
import { prisma } from "./src/lib/prisma.js";

async function main() {
  const emails = [
    "vedatlatifi@gmail.com"
  ];

  for (const email of emails) {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email }, select: { id: true, email: true } });
      if (!user) {
        console.log(`⚠️  User not found: ${email}`);
        continue;
      }
      const userId = user.id;

      // 1) Activity logs (where user was actor)
      await prisma.activityLog?.deleteMany?.({ where: { actorUserId: userId } });

      // 2) Reminders
      await prisma.reminder?.deleteMany?.({ where: { userId } });

      // 3) Transactions (User side)
      await prisma.transaction?.deleteMany?.({ where: { userId } });

      // 4) Assignments (User side)
      await prisma.assignment?.deleteMany?.({ where: { userId } });

      // 5) Schedules (User side)
      await prisma.schedule?.deleteMany?.({ where: { userId } });

      // 6) Vacations (User side)
      await prisma.vacation?.deleteMany?.({ where: { userId } });

      // 7) Many-to-many: services, subServices, vouchers
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            services: { set: [] },
            subServices: { set: [] },
            vouchers: { set: [] },
          },
        });
      } catch (e) {
        // Ignore if not present
      }

      // 8) Finally delete user
      await prisma.user.delete({ where: { id: userId } });
      console.log(`✔️ User deleted successfully: ${userId} (${email})`);
    } catch (e) {
      console.error(`Error deleting user with email ${email}:`, e);
    }
  }

  await prisma.$disconnect();
}

main();
