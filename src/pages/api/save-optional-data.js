import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { sendClientWelcomeEmail } from '../../lib/mailer';
import { recipientEmail } from '../../lib/recipientEmail';

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

  // Send welcome email once at step 4 completion (prevent duplicates via welcomeEmailSent flag).
  //
  // Password flow (F-16): generate a one-time setup token, save it on the user
  // and link the email to /setpassword?token=… — that page is the "first-time
  // create password" flow. It is intentionally separate from /forgot-password
  // (which is for users who already have a password and forgot it). Previously
  // the welcome email routed everyone through forgot-password, which read as
  // "reset" rather than "create".
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, requestEmail: true, firstName: true, lastName: true, anrede: true, welcomeEmailSent: true } });
    const welcomeTo = recipientEmail(user);
    if (welcomeTo && !user.welcomeEmailSent) {
      const setupToken = crypto.randomBytes(32).toString("hex");
      const setupExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await prisma.user.update({
        where: { id: userId },
        data: { resetToken: setupToken, resetTokenExpiry: setupExpiry },
      });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://phc.ch";
      console.log("[save-optional-data] sending welcome email to", welcomeTo, "via", `${baseUrl}/setpassword?token=…`);
      await sendClientWelcomeEmail({
        email: welcomeTo,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        anrede: user.anrede,
        passwordLink: `${baseUrl}/setpassword?token=${setupToken}`,
      });
      await prisma.user.update({ where: { id: userId }, data: { welcomeEmailSent: true } });
      console.log("[save-optional-data] welcome email dispatched to", welcomeTo);
    } else {
      console.log("[save-optional-data] welcome email SKIPPED — welcomeTo=", welcomeTo, " welcomeEmailSent=", user?.welcomeEmailSent);
    }
  } catch (err) {
    console.error("[save-optional-data] welcome email FAILED:", err);
  }

  return res.status(200).json({ success: true });
}
