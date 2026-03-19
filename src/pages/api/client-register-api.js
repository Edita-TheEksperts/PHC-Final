import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { sendClientWelcomeEmail } from "../../lib/mailer";
import { createOrUpdateSalesforceAccount } from "../../lib/salesforce";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const {
      // Basic
      firstName,
      lastName,
      email,
      phone,
      address,
      street,
      postalCode,
      city,
      frequency,
      duration,
      firstDate,
      services = [],
      subServices = [],
      anrede,
      kanton,

      // Care person
      careFirstName,
      careLastName,
      carePhone,
      careHasParking,
      careEntrance,
      careArrivalConditions,
      mailboxKeyLocation,
      mailboxDetails,

      // Request person
      requestFirstName,
      requestLastName,
      requestEmail,
      requestPhone,

      schedules = [],
      paymentIntentId,

      // Contact / Languages
      languages,
      emergencyContactName,
      emergencyContactPhone,

      // Health
      hasAllergies,
      allergyDetails,
      healthFindings,
      medicalFindings,
      height,
      weight,
      physicalState,
      mobility,
      mobilityAids,
      toolsAvailable,
      toolsOther,
      incontinence,
      foodSupport,
      basicCare,
      basicCareOther,
      healthPromotions,
      healthPromotionOther,
      mentalSupportNeeded,
      mentalDiagnoses,
      behaviorTraits,

      // Household
      householdRooms,
      householdPeople,
      pets,
      cooking,
      jointCooking,
      shoppingType,
      shoppingWithClient,
      shoppingItems,
      transportOption,
      companionship,
      biographyWork,
      hasTech,
      reading,
      cardGames,
      trips,
      additionalAccompaniment,

      // Communication
      communicationVision,
      communicationSehen,
      communicationHearing,
      communicationHören,
      communicationSpeech,
      communicationSprechen,
    } = req.body;

    /* --------------------------------------------------
       1️⃣ BASIC VALIDATION (STRIPE SAFE)
    -------------------------------------------------- */

    if (!email) {
      return res.status(400).json({ message: "❌ Email missing" });
    }

    if (!paymentIntentId) {
      return res.status(400).json({ message: "❌ paymentIntentId missing" });
    }

    /* --------------------------------------------------
       2️⃣ HELPERS (TYPE SAFE)
    -------------------------------------------------- */

const toStr = (v) => {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
};

const toStrAllowEmpty = (v) => {
  if (v === undefined || v === null) return null;
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "string") return v.trim();
  return String(v);
};


    const toInt = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const toBool = (v) => {
      if (v === true || v === "true") return true;
      if (v === false || v === "false") return false;
      return null;
    };

    const removeNulls = (obj) =>
      Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));

    /* --------------------------------------------------
       3️⃣ DATE PARSE
    -------------------------------------------------- */

    let parsedDate = null;
    if (firstDate) {
      parsedDate =
        typeof firstDate === "string" && firstDate.includes(".")
          ? new Date(firstDate.split(".").reverse().join("-"))
          : new Date(firstDate);
    }

    /* --------------------------------------------------
       4️⃣ SERVICES (TOLERANT MATCH)
    -------------------------------------------------- */

    const allServices = await prisma.service.findMany();
    const allSubServices = await prisma.subService.findMany();

    const normalize = (x) => String(x ?? "").toLowerCase().trim();

    const serviceRecords = allServices.filter((s) =>
      services.some((i) => normalize(i).includes(normalize(s.name)))
    );

    const subServiceRecords = allSubServices.filter((s) =>
      subServices.some((i) => normalize(i).includes(normalize(s.name)))
    );

    /* --------------------------------------------------
       5️⃣ SCHEDULES + PAYMENT
    -------------------------------------------------- */

    const schedulesCreate = (schedules || []).map((s) => ({
      day: s.day,
      startTime: s.startTime,
      hours: toInt(s.hours) ?? 0,
      date: s.date ? new Date(s.date) : null,
    }));

    const totalHours = schedulesCreate.reduce(
      (sum, s) => sum + (s.hours || 0),
      0
    );

    const HOURLY_RATE = 1; // adjust if needed
    const totalPayment = totalHours * HOURLY_RATE;

    /* --------------------------------------------------
       6️⃣ QUESTIONNAIRE (SAFE FOR PRISMA)
    -------------------------------------------------- */

    const questionnaireData = removeNulls({
      // Kontakt
      languages: toStr(languages),
      emergencyContactName: toStr(emergencyContactName),
      emergencyContactPhone: toStr(emergencyContactPhone),

      // Allergien & Gesundheit
      hasAllergies: toStr(hasAllergies),
      allergyDetails: toStr(allergyDetails),
      healthFindings: toStr(healthFindings),
      medicalFindings: toStr(medicalFindings),
      height: toStr(height),
      weight: toStr(weight),
      physicalState: toStr(physicalState),

      // Mobilität & Hilfsmittel
      mobility: toStr(mobility),
      mobilityAids: toStr(mobilityAids),
      toolsAvailable: toStr(toolsAvailable),
      toolsOther: toStr(toolsOther),
      incontinence: toStr(incontinence),
      foodSupport: toStr(foodSupport),
      basicCare: toStr(basicCare),
      basicCareOther: toStr(basicCareOther),
      healthPromotions: toStr(healthPromotions),
      healthPromotionOther: toStr(healthPromotionOther),
      mentalSupportNeeded: toStr(mentalSupportNeeded),
      mentalDiagnoses: toStr(mentalDiagnoses),
      behaviorTraits: toStr(behaviorTraits),

      // Haushalt
      householdRooms: toInt(householdRooms),
      householdPeople: toInt(householdPeople),
      pets: toStr(pets),

      // Alltag
      cooking: toStr(cooking),
      jointCooking: toStr(jointCooking),
      shoppingType: toStr(shoppingType),
      shoppingWithClient: toStr(shoppingWithClient),
      shoppingItems: toStr(shoppingItems),
      transportOption: toStr(transportOption),
      companionship: toStr(companionship),
      biographyWork: toStr(biographyWork),
      hasTech: toStr(hasTech),
      reading: toStr(reading),
      cardGames: toStr(cardGames),
      trips: toStr(trips),
      additionalAccompaniment: toStr(additionalAccompaniment),

      // Care-Adresse-Extras
      careHasParking: toStr(careHasParking),
      careEntrance: toStr(careEntrance),
      careArrivalConditions: toStr(careArrivalConditions),
      mailboxKeyLocation: toStr(mailboxKeyLocation),
      mailboxDetails: toStr(mailboxDetails),

      // Kommunikation
      communicationVision: toStr(communicationVision),
      communicationSehen: toStr(communicationSehen),
      communicationHearing: toStr(communicationHearing),
      communicationHören: toStr(communicationHören),
      communicationSpeech: toStr(communicationSpeech),
      communicationSprechen: toStr(communicationSprechen),
    });

    /* --------------------------------------------------
       7️⃣ CREATE OR UPDATE USER
    -------------------------------------------------- */

    let user = await prisma.user.findUnique({ where: { email } });

    const isNewUser = !user;

    if (user) {
      user = await prisma.user.update({
        where: { email },
        data: {
          paymentIntentId,
          totalPayment,
          ...questionnaireData,
        },
      });
    } else {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

      user = await prisma.user.create({
        data: {
          firstName: toStr(firstName),
          lastName: toStr(lastName),
          email,
          phone: toStr(phone),
          address: toStr(address) ?? "—",
          frequency: toStr(frequency) ?? "einmalig",
          duration: toInt(duration),
          firstDate: parsedDate,
  careFirstName: toStr(careFirstName),
  careLastName: toStr(careLastName),
  carePhone: toStr(carePhone),
          careStreet: toStr(street),
          carePostalCode: toStr(postalCode),
          careCity: toStr(city),
   requestFirstName: toStr(requestFirstName),
    requestLastName: toStr(requestLastName),
    requestEmail: toStr(requestEmail),
    requestPhone: toStr(requestPhone),
          paymentIntentId,
          totalPayment,
          resetToken,
          resetTokenExpiry,
          anrede: toStr(anrede),
          kanton: toStr(kanton),

          ...questionnaireData,

          services: {
            connect: serviceRecords.map((s) => ({ id: s.id })),
          },
          subServices: {
            connect: subServiceRecords.map((s) => ({ id: s.id })),
          },
          schedules: {
            create: schedulesCreate,
          },
        },
      });
    }

    /* -------- SEND WELCOME EMAIL (new users or users without a password) -------- */

    const shouldSendEmail = isNewUser || !user.password;

    if (shouldSendEmail) {
      try {
        await sendClientWelcomeEmail({
          email,
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          passwordLink: `${process.env.NEXT_PUBLIC_BASE_URL}/forgot-password`,
        });
      } catch (emailErr) {
      }
    }

    /* --------------------------------------------------
       8️⃣ SALESFORCE SYNC
    -------------------------------------------------- */

    if (user && !user.salesforceId) {
      try {
        const sfId = await createOrUpdateSalesforceAccount(user);
        await prisma.user.update({
          where: { id: user.id },
          data: { salesforceId: sfId },
        });
      } catch (e) {
      }
    }

    /* --------------------------------------------------
       9️⃣ REMINDERS
    -------------------------------------------------- */

    await prisma.reminder.createMany({
      data: [
        {
          userId: user.id,
          type: "4h_reminder",
          scheduledAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        },
        {
          userId: user.id,
          type: "48h_reminder",
          scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      ],
    });

    return res.status(201).json({
      message: "✅ Registration complete",
      userId: user.id,
    });
  } catch (error) {

    return res.status(500).json({
      message: "❌ Internal server error",
      error: error?.message || String(error),
    });
  }
}
