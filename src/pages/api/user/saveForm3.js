import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      height = "",
      weight = "",
      mobility = [],
      aids = [],
      aidsOther = "",
      incontinence = [],
      communication = {},
      foodSupport = [],
      allergies = "",
      basicCare = [],
      basicCareOther = "",
      healthActivities = [],
      healthActivitiesOther = "",
      mentalSupport = "",
      mentalConditions = [],
      medicalFindings = ""
    } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        height: String(height),
        weight: String(weight),
        mobility: mobility.join(", "),
        aids: aids.join(", "),
        aidsOther,
        incontinence: incontinence.join(", "),
        communicationSehen: communication.Sehen || "",
        communicationHören: communication.Hören || "",
        communicationSprechen: communication.Sprechen || "",
        foodSupport: foodSupport.join(", "),
        allergies,
        basicCare: basicCare.join(", "),
        basicCareOther,
        healthActivities: healthActivities.join(", "),
        healthActivitiesOther,
        mentalSupport,
        mentalConditions: mentalConditions.join(", "),
        medicalFindings,
        form3Completed: true
      }
    });

    res.status(200).json({ message: "Form 3 saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
