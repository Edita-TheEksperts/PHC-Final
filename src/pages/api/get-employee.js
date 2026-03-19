// pages/api/get-employee.js
import { prisma } from "../../lib/prisma"; // Adjust path if needed

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  // Check if email is provided
  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required and must be a string" });
  }

  try {
    const employee = await prisma.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Return employee data
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
