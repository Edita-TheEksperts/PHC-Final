import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  // === UPDATE (PATCH) ===
// === UPDATE (PATCH) ===
if (req.method === "PATCH") {
  try {
const allowed = [
  // BASIC
  "email", "phone", "salutation", "firstName", "lastName",

  // ADDRESS
  "address", "houseNumber", "zipCode", "city", "country", "canton", "nationality",

  // EXPERIENCE
  "experienceYears", "experienceWhere", "experienceCompany",

  // AVAILABILITY
  "availabilityFrom", "availabilityDays",

  // LICENSE & CAR
  "hasLicense", "licenseType", "hasCar", "carAvailableForWork",

  // WORK CONDITIONS
  "smoker", "onCallAvailable", "nightShifts",
  "travelSupport", "bodyCareSupport", "worksWithAnimals",
  "desiredWeeklyHours", "howFarCanYouTravel",

  // SKILLS
  "languages", "languageOther",
  "specialTrainings", "communicationTraits", "dietaryExperience",
  "servicesOffered"
];


    const data = {};

    Object.keys(req.body).forEach((key) => {
      if (allowed.includes(key)) {
        data[key] = req.body[key];
      }
    });

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update employee" });
  }
}



  // === GET (EXISTING) ===
  if (req.method === "GET") {
    try {
      const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
          schedules: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  services: { select: { name: true } },
                  subServices: { select: { name: true } },
                },
              },
              employee: {
                select: { firstName: true, lastName: true, id: true },
              },
            },
            orderBy: { date: "desc" },
          },
          assignments: { include: { user: true } },
          rejectionWarnings: true,
          vacations: true,
        },
      });

      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      const scheduleStats = employee.schedules.reduce(
        (acc, sched) => {
          acc.totalHours += sched.hours || 0;
          acc.totalKilometers += sched.kilometers || 0;

          const key = sched.date
            ? sched.date.toISOString().slice(0, 7)
            : "unknown";

          if (!acc.monthly[key]) {
            acc.monthly[key] = { hours: 0, count: 0 };
          }

          acc.monthly[key].hours += sched.hours || 0;
          acc.monthly[key].count += 1;

          return acc;
        },
        { totalHours: 0, totalKilometers: 0, monthly: {} }
      );

      return res.status(200).json({
        ...employee,
        scheduleStats,
        registeredAt: employee.createdAt,
        inviteSentAt: employee.inviteSentAt,
        files: {
          cv: employee.cvFile,
          passport: employee.passportFile,
          visa: employee.visaFile,
          policeLetter: employee.policeLetterFile,
          certificate: employee.certificateFile,
          drivingLicence: employee.drivingLicenceFile,
          profilePhoto: employee.profilePhoto,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
