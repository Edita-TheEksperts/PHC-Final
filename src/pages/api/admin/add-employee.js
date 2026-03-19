import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        // only the fields that are required in your schema
        experienceYears: "0",  // required String, so provide default
        hasLicense: false,     // required Boolean
        availabilityFrom: new Date(), // required DateTime
        availabilityDays: [],  // required String[]
        servicesOffered: [],   // required String[]
        communicationTraits: [],
        languages: [],
        dietaryExperience: [],
      },
    });

    res.status(200).json({ success: true, employee: newEmployee });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to add employee" });
  }
}
