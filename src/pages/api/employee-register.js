import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendApplicantConfirmationEmail } from "../../lib/mailer";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Diagnostic: surface whether the registration form actually sent the
    // skill arrays. F-34 reported these as "missing" — every fresh registration
    // since this log was added should show the array sizes in Vercel logs, so
    // we can tell if the symptom is data-related (legacy rows) or wire-related.
    if (process.env.NODE_ENV !== "test") {
      console.log("[employee-register] skills received:", {
        email: data.email,
        languages: Array.isArray(data.languages) ? data.languages.length : "non-array",
        languageOther: data.languageOther ? "set" : "empty",
        communicationTraits: Array.isArray(data.communicationTraits) ? data.communicationTraits.length : "non-array",
        dietaryExperience: Array.isArray(data.dietaryExperience) ? data.dietaryExperience.length : "non-array",
        specialTrainings: Array.isArray(data.specialTrainings) ? data.specialTrainings.length : "non-array",
        desiredWeeklyHours: Array.isArray(data.desiredWeeklyHours) ? data.desiredWeeklyHours.length : (data.desiredWeeklyHours ? 1 : 0),
      });
    }

    const existingEmployee = await prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existingEmployee) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // 🔐 password generated but NOT emailed
    const plainPassword = data.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const normalizedAvailabilityDays = Array.isArray(data.availabilityDays)
      ? data.availabilityDays.map((d) =>
          typeof d === "object"
            ? `${d.day}: ${d.startTime}-${d.endTime}`
            : String(d)
        )
      : [];

      function normalizeFile(value) {
  if (typeof value === "string" && value.trim() !== "") return value;
  return null;
}

await prisma.employee.create({
  data: {
    // === BASIC ===
    email: data.email,
    salutation: data.salutation || null,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone || null,

    // === ADDRESS ===
    address: data.address || null,
    houseNumber: data.houseNumber || null,
    zipCode: data.zipCode || null,
    city: data.city || null,
    country: data.country || null,
    canton: data.canton || null,
    nationality: data.nationality || null,

    // === RESIDENCE / PERMIT ===
    residencePermit: data.residencePermit || null,

    // === EXPERIENCE ===
 experienceYears: data.experienceYears || "0",    experienceWhere: data.experienceWhere || null,
    experienceCompany: data.experienceCompany || null,

    // === LICENSE & CAR ===
    hasLicense: Boolean(data.hasLicense),
    licenseType: data.licenseType || null,
    hasCar: data.hasCar || null, // "ja" | "nein"
    carAvailableForWork: data.carAvailableForWork || null,

    // === WORK CONDITIONS ===
    smoker: data.smoker || null,
    onCallAvailable: data.onCallAvailable || null,
    nightShifts: data.nightShifts || null,
    travelSupport: data.travelSupport || null,
    bodyCareSupport: data.bodyCareSupport || null,
    worksWithAnimals: data.worksWithAnimals || null,
    desiredWeeklyHours: Array.isArray(data.desiredWeeklyHours)
      ? data.desiredWeeklyHours
      : data.desiredWeeklyHours
        ? [data.desiredWeeklyHours]
        : [],
    howFarCanYouTravel: data.howFarCanYouTravel || null,

    // === AVAILABILITY ===
    availabilityFrom: data.availabilityFrom
      ? new Date(data.availabilityFrom)
      : null,
   availabilityDays: normalizedAvailabilityDays,

    // === SKILLS ===
    languages: data.languages || [],
    languageOther: data.languageOther || null,
    specialTrainings: data.specialTrainings || [],
    communicationTraits: data.communicationTraits || [],
    dietaryExperience: data.dietaryExperience || [],
    servicesOffered: data.servicesOffered || [],
// === FILES ===
passportFile: normalizeFile(data.passportFrontFile),
passportBackFile: normalizeFile(data.passportBackFile),
visaFile: normalizeFile(data.workPermitFile),
policeLetterFile: normalizeFile(data.policeLetterFile),
cvFile: normalizeFile(data.cvFile),
certificateFile: normalizeFile(data.certificateFile),
drivingLicenceFile: normalizeFile(data.drivingLicenceFile),
profilePhoto: normalizeFile(data.profilePhoto),


    // === META ===
    howDidYouHearAboutUs: data.howDidYouHearAboutUs || null,

    // === AUTH ===
    password: hashedPassword,

    // === STATUS ===
    status: "pending",
    invited: false,
    inviteSentAt: null,
  },
});


    // F-06: confirm receipt of the application. The earlier flow only
    // returned 201 and the candidate never heard back until manual
    // outreach — Bettina/Silvain reported this as "E-Mail kommt nicht".
    // Fire-and-forget so a transient SMTP issue doesn't fail the
    // registration itself; the function logs its own errors.
    sendApplicantConfirmationEmail({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      salutation: data.salutation,
    }).catch((err) =>
      console.error("[employee-register] applicant confirmation failed:", err)
    );

    return res.status(201).json({
      message: "Employee registered successfully. Waiting for admin approval.",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
