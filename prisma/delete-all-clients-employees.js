const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllClientsAndEmployees() {
  try {
    // Delete related records to avoid FK constraint errors
    await prisma.assignment.deleteMany();
    await prisma.schedule.deleteMany();
    await prisma.reminder.deleteMany();
    await prisma.vacation.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.rejectionWarning.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.voucher.deleteMany();

    // Delete all employees
    await prisma.employee.deleteMany();
    // Delete all users
    await prisma.user.deleteMany();
    console.log('✅ All users and employees deleted.');
  } catch (error) {
    console.error('❌ Error deleting clients/employees:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllClientsAndEmployees();
