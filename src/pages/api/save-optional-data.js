import { prisma } from '../../lib/prisma';
import { sendClientWelcomeEmail } from '../../lib/mailer';

// Remove null, undefined, or empty string values
function cleanData(obj) {
  const cleaned = {};
  for (const key in obj) {
    const val = obj[key];
    if (val !== null && val !== undefined && !(typeof val === "string" && val.trim() === "")) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

function serializeArrays(data) {
  const stringOnlyFields = [
    "postalCode", "carePostalCode", "cardNumber", "cvc", "expiryDate",
    "cooking", "jointCooking", "height", "weight"
  ];

  const numberFields = ["householdRooms", "householdPeople", "totalPayment", "duration"];

  const result = {};
  for (const key in data) {
    const val = data[key];

    if (Array.isArray(val)) {
      result[key] = val.join(', ');
    } else if (numberFields.includes(key)) {
      result[key] = Number(val);
    } else if (stringOnlyFields.includes(key)) {
      result[key] = String(val);
    } else {
      result[key] = val;
    }
  }

  return result;
}

const allowedUserFields = new Set([
  "frequency", "duration", "firstDate", "email", "address",
  "mobilityAids","mobility", "transportOption", "careFirstName", "careLastName", "carePhone",
  "careStreet", "careEntrance", "carePostalCode", "careCity", "careEntranceDetails",
  "careArrivalConditions", "careHasParking", "appointmentTypes", "appointmentOther",
  "shoppingWithClient", "shoppingItems", "mailboxKeyLocation", "mailboxDetails",
  "additionalAccompaniment","companionship", "companionshipSupport", "jointCooking", "biographyWork",
  "techAvailable", "allergyCheck", "allergyWhich", "reading", "cardGames", "trips",
  "height", "weight", "physicalState", "toolsAvailable", "toolsOther", "incontinenceTypes",
  "communicationVision", "communicationHearing", "communicationSpeech", "foodSupportTypes",
  "basicCareNeeds", "basicCareOtherField", "healthPromotions", "healthPromotionOther",
  "mentalSupportNeeded", "mentalDiagnoses", "behaviorTraits", "healthFindings",
  "languages", "otherLanguage", "pets",  "paymentIntentId", "totalPayment",
  "householdRooms", "householdPeople", "householdTasks", "cooking",  "requestFirstName",
  "requestLastName",
  "requestEmail",
  "requestPhone",
    "communicationSehen",
  "communicationHören",
  "communicationSprechen",
]);

function filterValidFields(data) {
  const filtered = {};
  for (const key in data) {
    if (allowedUserFields.has(key)) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}

function mapFrontendToBackend(formData) {
  const mapping = {
    firstName: "careFirstName",
    lastName: "careLastName",
    phone: "carePhone",
    street: "careStreet",
    entranceLocation: "careEntrance",
    postalCode: "carePostalCode",
      requestFirstName: "requestFirstName",
  requestLastName: "requestLastName",
  requestEmail: "requestEmail",
  requestPhone: "requestPhone",
    city: "careCity",
    entranceDescription: "careEntranceDetails",
    arrivalConditions: "careArrivalConditions",
    hasParking: "careHasParking",

    mobilityAids: "mobilityAids",
    transportOption: "transportOption",

    accompanimentAppointments: "appointmentTypes",
    accompanimentOther: "appointmentOther",

    shoppingWithClient: "shoppingWithClient",
    shoppingItems: "shoppingItems",
    mobility: "mobility",

    mailboxKeyLocation: "mailboxKeyLocation",
    mailboxDetails: "mailboxDetails",
    additionalAccompaniment: "additionalAccompaniment",

    companionship: "companionshipSupport",
    cookingTogether: "jointCooking",
    hasAllergies: "allergyCheck",
    allergyDetails: "allergyWhich",
    biographyWork: "biographyWork",
    hasTech: "techAvailable",
    reading: "reading",
    cardGames: "cardGames",
    trips: "trips",

    height: "height",
    weight: "weight",
    physicalCondition: "physicalState",
    careTools: "toolsAvailable",
    careToolsOther: "toolsOther",
    incontinence: "incontinenceTypes",

    Sehen: "communicationVision",
    Hören: "communicationHearing",
    Sprechen: "communicationSpeech",

    nutritionSupport: "foodSupportTypes",
    basicCare: "basicCareNeeds",
    basicCareOther: "basicCareOtherField",
    healthPromotion: "healthPromotions",
    healthPromotionOther: "healthPromotionOther",
    mentalSupportNeeded: "mentalSupportNeeded",
    diagnoses: "mentalDiagnoses",
    behaviorTraits: "behaviorTraits",
    healthFindings: "healthFindings",

    roomCount: "householdRooms",
    householdSize: "householdPeople",
    householdTasks: "householdTasks",
    cookingForPeople: "cooking",
    languages: "languages",
    languageOther: "otherLanguage",
    otherLanguage: "otherLanguage",
    hasPets: "pets",
  };

  const result = {};
  for (const key in formData) {
    const backendKey = mapping[key] || key;
    result[backendKey] = formData[key];
  }

  return result;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, optionalData } = req.body;

  if (!userId || !optionalData) {
    return res.status(400).json({ error: 'Missing userId or optionalData' });
  }

  if (typeof optionalData !== 'object' || optionalData === null) {
    return res.status(400).json({ error: 'Invalid optionalData structure' });
  }

  const {
    services,
    subServices,
    schedules,
    ...restData
  } = optionalData;

  // 🧼 Clean + map + serialize
  const mappedData = mapFrontendToBackend(restData);
  const cleanedData = filterValidFields(serializeArrays(cleanData(mappedData)));

  try {
    // 🔄 Update flat fields
    await prisma.user.update({
      where: { id: userId },
      data: cleanedData,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update user data' });
  }

  // 🔗 Update services
  if (services?.length) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          services: {
            set: [],
            connect: services.map((s) => ({ name: typeof s === 'string' ? s : s.name })),
          },
        },
      });
    } catch (error) {
      // still continue
    }
  }

  // 🔗 Update subServices
  if (subServices?.length) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subServices: {
            set: [],
            connect: subServices.map((s) => ({ name: typeof s === 'string' ? s : s.name })),
          },
        },
      });
    } catch (error) {
      // still continue
    }
  }

  // 🕓 Schedules are already created by register-user-prepayment or client-register-api
  // Do NOT delete and recreate them here — that would lose the dates and service names

  // Send welcome email once at step 4 completion (prevent duplicates via welcomeEmailSent flag)
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, firstName: true, lastName: true, welcomeEmailSent: true } });
    if (user?.email && !user.welcomeEmailSent) {
      await sendClientWelcomeEmail({
        email: user.email,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        passwordLink: `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`,
      });
      await prisma.user.update({ where: { id: userId }, data: { welcomeEmailSent: true } });
    }
  } catch (_) {}

  return res.status(200).json({ success: true });
}
