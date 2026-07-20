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
      requestStreet,
      requestHouseNumber,
      requestPostalCode,
      requestCity,
      requestKanton,

      // Care address extras
      houseNumber,

      schedules = [],
      paymentIntentId,

      // Contact / Languages
      languages,
      otherLanguage,
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
      serviceName: s.serviceName || null,
      subServiceName: s.subServiceName || null,
    }));

    const totalHours = schedulesCreate.reduce(
      (sum, s) => sum + (s.hours || 0),
      0
    );

    const HOURLY_RATE = 59;
    const totalPayment = totalHours * HOURLY_RATE;

    /* --------------------------------------------------
       6️⃣ QUESTIONNAIRE (SAFE FOR PRISMA)
    -------------------------------------------------- */

    const questionnaireData = removeNulls({
      // Kontakt
      languages: toStr(languages),
      otherLanguage: toStr(otherLanguage),
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
          // The create branch below connects these, but it can never run (see
          // the comment on schedules), so they were never linked in practice.
          services: { set: serviceRecords.map((s) => ({ id: s.id })) },
          subServices: { set: subServiceRecords.map((s) => ({ id: s.id })) },
        },
      });

      // register-user-prepayment creates this user at step 3, BEFORE payment,
      // using the raw form rows — one placeholder per weekday, all stamped with
      // firstDate. So by the time we get here the user always exists, the
      // `else` branch below is dead code, and the generated recurrence series
      // in `schedulesCreate` used to be silently discarded. Replace the
      // placeholders with the real series instead.
      if (schedulesCreate.length) {
        const existing = await prisma.schedule.findMany({
          where: { userId: user.id },
          select: {
            id: true,
            employeeId: true,
            _count: { select: { Assignment: true, transactions: true } },
          },
        });
        // Only drop rows nothing else depends on — never touch a schedule that
        // has already been assigned, booked or billed.
        const disposable = existing
          .filter(
            (s) =>
              !s.employeeId &&
              s._count.Assignment === 0 &&
              s._count.transactions === 0
          )
          .map((s) => s.id);

        if (disposable.length) {
          await prisma.schedule.deleteMany({ where: { id: { in: disposable } } });
        }

        await prisma.schedule.createMany({
          data: schedulesCreate.map((s) => ({ ...s, userId: user.id })),
        });
      }
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
          houseNumber: toStr(houseNumber),
   requestFirstName: toStr(requestFirstName),
    requestLastName: toStr(requestLastName),
    requestEmail: toStr(requestEmail),
    requestPhone: toStr(requestPhone),
    requestStreet: toStr(requestStreet),
    requestHouseNumber: toStr(requestHouseNumber),
    requestPostalCode: toStr(requestPostalCode),
    requestCity: toStr(requestCity),
    requestKanton: toStr(requestKanton),
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

    /* -------- WELCOME EMAIL is sent at step 4 (Abschluss) via save-optional-data -------- */

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
