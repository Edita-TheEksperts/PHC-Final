import { prisma } from "../../lib/prisma"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ error: "No Authorization header provided" })

    // ⚠️ Këtu zakonisht dekodohet token → userId
    const userId = "USER_ID_FROM_TOKEN"

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // BASIC
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        postalCode: true,
        frequency: true,

        // CONTACT
        emergencyContactName: true,
        emergencyContactPhone: true,

        // CARE
        careCity: true,
        careStreet: true,
        carePhone: true,
        carePostalCode: true,
        careHasParking: true,
        careArrivalConditions: true,
        careEntrance: true,
        careEntranceDetails: true,

            services: { select: { id: true, name: true } },
    subServices: { select: { id: true, name: true } },

        // PERSONAL
        languages: true,
        pets: true,
        hasAllergies: true,
        allergyDetails: true,
        behaviorTraits: true,

        // HEALTH
        healthFindings: true,
        mobilityAids: true,
        physicalState: true,
        mentalDiagnoses: true,
        incontinenceTypes: true,

        // HOUSEHOLD
        householdPeople: true,
        householdRooms: true,

        // EXTRA
        specialRequests: true,
        shoppingWithClient: true,
        transport: true,
        outings: true,
        reads: true,
        playsCards: true,
      },
    })

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
}
