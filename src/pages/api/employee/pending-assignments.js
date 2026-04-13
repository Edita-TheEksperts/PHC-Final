import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Missing email" });

  try {
    const employee = await prisma.employee.findUnique({ where: { email } });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const assignments = await prisma.assignment.findMany({
      where: {
        employeeId: employee.id,
        confirmationStatus: "pending",
        status: "active",
      },
      select: {
        id: true,
        confirmationStatus: true,
        status: true,
        Schedule: true,
        user: {
          select: {
            // Location (city/PLZ only — no street, no name, no contact)
            postalCode: true,
            carePostalCode: true,
            careCity: true,
            // Services
            services: { select: { id: true, name: true } },
            subServices: { select: { id: true, name: true } },
            // Questionnaire / Step 4
            physicalState: true,
            mobility: true,
            mobilityAids: true,
            specialRequests: true,
            allergies: true,
            allergyDetails: true,
            mentalConditions: true,
            mentalDiagnoses: true,
            incontinence: true,
            medicalFindings: true,
          },
        },
      },
    });

    res.status(200).json(assignments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
