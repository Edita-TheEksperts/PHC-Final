import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient(); // Initialize Prisma Client

// Approve employee in DB
async function approveEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'approved' },  // Change status to 'approved'
  });
}

// Reject employee in DB
async function rejectEmployeeInDB(employeeId) {
  return await prisma.employee.update({
    where: { id: employeeId },
    data: { status: 'rejected' },  // Change status to 'rejected'
  });
}

// The handler function for approving/rejecting employee
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { employeeId, action } = req.body;

    if (action === "approve") {
      try {
        await approveEmployeeInDB(employeeId); // Approve the employee in the database
        res.status(200).send("Employee approved.");
      } catch (error) {
        res.status(500).send("Error approving employee.");
      }
    } else if (action === "reject") {
      try {
        await rejectEmployeeInDB(employeeId); // Reject the employee in the database
        res.status(200).send("Employee rejected.");
      } catch (error) {
        res.status(500).send("Error rejecting employee.");
      }
    } else {
      res.status(400).send("Invalid action.");
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
