import { prisma } from "../../../lib/prisma"; // ose "@/lib/prisma" nëse përdor alias

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // fetch all approved employees
    const approvedEmployees = await prisma.employee.findMany({
      where: { status: "approved" },
    });

    res.status(200).json(approvedEmployees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
