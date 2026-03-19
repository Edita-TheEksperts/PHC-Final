// Delete test employee
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteTestEmployee() {
  try {
    const email = "editalatifi1996@gmail.com";
    
    console.log("🗑️ Deleting employee:", email);
    
    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      console.log("❌ Employee not found!");
      return;
    }

    console.log("Found employee:", employee.firstName, employee.lastName);
    console.log("Status:", employee.status);
    
    // Delete related records first to avoid foreign key constraints
    console.log("\n🗑️ Deleting related records...");
    
    // Delete assignments
    const assignments = await prisma.assignment.deleteMany({
      where: { employeeId: employee.id },
    });
    console.log(`Deleted ${assignments.count} assignments`);
    
    // Delete schedules
    const schedules = await prisma.schedule.deleteMany({
      where: { employeeId: employee.id },
    });
    console.log(`Deleted ${schedules.count} schedules`);
    
    // Delete transactions
    const transactions = await prisma.transaction.deleteMany({
      where: { employeeId: employee.id },
    });
    console.log(`Deleted ${transactions.count} transactions`);
    
    // Delete vacations
    const vacations = await prisma.vacation.deleteMany({
      where: { employeeId: employee.id },
    });
    console.log(`Deleted ${vacations.count} vacations`);
    
    // Delete rejection warnings
    const warnings = await prisma.rejectionWarning.deleteMany({
      where: { employeeId: employee.id },
    });
    console.log(`Deleted ${warnings.count} rejection warnings`);
    
    // Delete activity logs
    const logs = await prisma.activityLog.deleteMany({
      where: { actorEmployeeId: employee.id },
    });
    console.log(`Deleted ${logs.count} activity logs`);
    
    // Now delete the employee
    await prisma.employee.delete({
      where: { email },
    });

    console.log("\n✅ Employee successfully deleted!");
    console.log("You can now run: node create-test-employee.js");
  } catch (error) {
    console.error("❌ Error deleting employee:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTestEmployee();
