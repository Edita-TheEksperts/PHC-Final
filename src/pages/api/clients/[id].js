import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  // =====================================================
  // ✅ GET – Fetch client details
  // =====================================================
  if (req.method === "GET") {
    try {
      const client = await prisma.user.findUnique({
        where: { id: String(id) },
        include: {
          assignments: {
            include: {
              employee: true,
            },
          },
          schedules: {
            include: {
              employee: true,
              user: true,
            },
          },
          services: true,
          subServices: true,
        },
      });

      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }

      // ✅ SAFE extras (nuk prish punë nëse s’janë në DB)
      const schedulesWithExtras = (client.schedules || []).map((s) => ({
        ...s,
        baseHours: s.baseHours || 0,
        baseKm: s.baseKm || 0,
        extraHours: (s.hours || 0) - (s.baseHours || 0),
        extraKm: (s.kilometers || 0) - (s.baseKm || 0),
      }));

      return res.status(200).json({
        ...client,
        schedules: schedulesWithExtras,
      });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch client details" });
    }
  }

  // =====================================================
  // ✅ PUT – Update client (Bearbeiten / Speichern)
  // =====================================================
  if (req.method === "PUT") {
    // Verify JWT — user can only update their own profile (or admin)
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.id !== String(id) && decoded.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      const data = req.body;

      /**
       * 🔒 SECURITY NOTE
       * Ruajmë vetëm field-at primitive që lejojmë të editohen
       * (jo relations, jo password, jo stripe, etj.)
       */
const ALLOWED_FIELDS = [
  // Basic
  "anrede",
  "firstName",
  "lastName",
  "email",
  "phone",
  "languages",
  "otherLanguage",

  // Address / Care
  "careStreet",
  "carePostalCode",
  "careCity",
  "careFirstName",
  "careLastName",
  "carePhone",
  "careHasParking",
  "careEntrance",
  "careEntranceDetails",
  "careArrivalConditions",
  "mailboxKeyLocation",
  "mailboxDetails",

  // Request person
  "requestFirstName",
  "requestLastName",
  "requestEmail",
  "requestPhone",

  // Questionnaire – Health
  "height",
  "weight",
  "physicalState",
  "mobility",
  "mobilityAids",

  // ✅ Pflegehilfsmittel (PRISMA REAL)
  "toolsAvailable",
  "toolsOther",
  "aids",
  "aidsOther",

  // Inkontinenz / Ernährung
  "incontinence",
  "incontinenceTypes",
  "foodSupport",
  "foodSupportTypes",

  // Medical / Health
  "medicalFindings",
  "healthFindings",
  "allergyDetails",
  "hasAllergies",

  // Mental / Verhalten
  "mentalDiagnoses",
  "behaviorTraits",

  // Household
  "householdRooms",
  "householdPeople",
  "householdTasks",
  "pets",

  // Activities
  "shoppingType",
  "shoppingWithClient",
  "shoppingItems",
  "jointCooking",
  "cooking",
  "companionship",
  "biographyWork",
  "hasTech",
  "reading",
  "cardGames",
  "trips",
  "transportOption",

  // Health extras
  "healthPromotions",
  "healthPromotionOther",
  "mentalSupportNeeded",
  "communicationVision",
  "communicationHearing",
  "communicationSpeech",

  // Appointments
  "appointmentTypes",
  "appointmentOther",
  "additionalAccompaniment",

  // Emergency
  "emergencyContactName",
  "emergencyContactPhone",

  // Misc
  "specialRequests",
];



      // 👉 Marrim vetëm field-at e lejuara
      const updateData = {};
for (const key of ALLOWED_FIELDS) {
  if (key in data && data[key] !== undefined) {
    updateData[key] = data[key];
  }
}

      const updatedClient = await prisma.user.update({
        where: { id: String(id) },
        data: updateData,
      });

      return res.status(200).json(updatedClient);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update client" });
    }
  }

  // =====================================================
  // ❌ Method not allowed
  // =====================================================
  return res.status(405).json({ message: "Method Not Allowed" });
}
