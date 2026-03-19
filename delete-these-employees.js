
import { prisma } from "./src/lib/prisma.js";

async function main() {
  const emails = [
    "edita.latifi@the-eksperts.com",
    "vedatlatifi01@gmail.com"
  ];

  for (const email of emails) {
    try {
      // Find employee by email
      const employee = await prisma.employee.findUnique({ where: { email }, select: { id: true, email: true } });
      if (!employee) {
        console.log(`⚠️  Employee not found: ${email}`);
        continue;
      }
      const employeeId = employee.id;

      // 1) Activity logs (where employee was actor)
      await prisma.activityLog?.deleteMany?.({ where: { actorEmployeeId: employeeId } });

      // 2) Assignments (Employee side)
      await prisma.assignment?.deleteMany?.({ where: { employeeId } });

      // 3) Schedules (Employee side)
      await prisma.schedule?.deleteMany?.({ where: { employeeId } });

      // 4) Vacations (Employee side)
      await prisma.vacation?.deleteMany?.({ where: { employeeId } });

      // 5) Transactions (Employee side)
      await prisma.transaction?.deleteMany?.({ where: { employeeId } });

      // 6) RejectionWarnings (Employee side)
      await prisma.rejectionWarning?.deleteMany?.({ where: { employeeId } });

      // 7) Finally delete employee
      await prisma.employee.delete({ where: { id: employeeId } });
      console.log(`✔️ Employee deleted successfully: ${employeeId} (${email})`);
    } catch (e) {
      console.error(`Error deleting employee with email ${email}:`, e);
    }
  }

  await prisma.$disconnect();
}

main();
