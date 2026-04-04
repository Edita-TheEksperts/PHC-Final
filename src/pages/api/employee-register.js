import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({ message: "Missing required fields" });
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
    desiredWeeklyHours: data.desiredWeeklyHours || null,
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


    return res.status(201).json({
      message: "Employee registered successfully. Waiting for admin approval.",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
