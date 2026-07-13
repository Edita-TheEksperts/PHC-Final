import { prisma } from "../../../lib/prisma";

// F-39 — Matching-Score (Gewichtete Mitarbeiter-Empfehlung)
//
//   Verfügbarkeit          30%  (kein Konflikt mit Vacation/Schedule, MA verfügbar am Tag)
//   Region / Distanz       25%  (gleiche Stadt → voll; gleicher Kanton → halb; sonst über Reisebereitschaft)
//   Services Match         20%  (Anteil der gebuchten (Sub)Services, die der MA abdeckt)
//   Sprache                10%  (≥1 gemeinsame Sprache mit Kunde → voll)
//   Erfahrung              10%  (Jahre + Anzahl bisheriger Einsätze)
//   Spezielle Anforderungen 5%  (Raucher, Tiere, Führerschein, Allergien)
//
// Hartes Aussortieren (vorab) gilt weiterhin: Ferien-/Termin-Konflikt,
// Tier-Inkompatibilität, fehlende Körperpflege wenn benötigt.

const W_AVAILABILITY = 30;
const W_REGION       = 25;
const W_SERVICES     = 20;
const W_LANGUAGE     = 10;
const W_EXPERIENCE   = 10;
const W_SPECIAL      = 5;

const SERVICE_ALIASES = {
  "alltagsbegleitung und besorgungen": "alltagsbegleitung",
  "beleitung zu terminen": "terminbegleitung",
  "freizeit und soziale aktivitäten": "freizeit",
  "vorlesen": "freizeit",
  "ausflüge und reisebegleitung": "reisebegleitung",
  "einkäufe erledigen": "einkäufe",
  "haushaltshilfe und wohnpflege": "haushaltshilfe",
  "hauswirtschaft": "haushaltshilfe",
};

const normalize = (arr) =>
  [...new Set((arr || []).map((s) => SERVICE_ALIASES[s] || (s || "").toLowerCase()))];

// Parse "5", "5 Jahre", "über 10" → number of years; 0 if unknown.
function parseYears(v) {
  if (!v) return 0;
  if (typeof v === "number") return v;
  const m = String(v).match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

function dayMatches(daysArray, weekday) {
  if (!Array.isArray(daysArray) || !weekday) return false;
  const want = weekday.toLowerCase();
  return daysArray.some((d) => (d || "").toLowerCase().includes(want));
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { clientId, startDate, endDate } = req.query;
    if (!clientId) return res.status(400).json({ message: "clientId is required" });

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { services: true, subServices: true, schedules: true },
    });
    if (!client) return res.status(404).json({ message: "Client not found" });

    const start = startDate ? new Date(startDate)
                : client.firstDate ? new Date(client.firstDate)
                : new Date();
    const end = endDate ? new Date(endDate)
              : new Date(start.getTime() + 24 * 3600 * 1000);
    const requestedWeekday = start.toLocaleDateString("de-DE", { weekday: "long" });

    // Normalised "needs" (service names + subservice names from the booking).
    let needs = [
      ...(client.services?.map((s) => s.name) || []),
      ...(client.subServices?.map((s) => s.name) || []),
    ];
    if (needs.length === 0) {
      if (client.mobility)       needs.push("mobility");
      if (client.companionship)  needs.push("companionship");
      if (client.shoppingAssist) needs.push("shopping");
      if (client.basicCare)      needs.push("care");
    }
    const finalNeeds = normalize(needs);

    const clientCity     = client.careCity || client.city || null;
    const clientCanton   = client.canton || null;
    const clientLanguages = normalize([client.languages].filter(Boolean).flatMap(l => l.split(/[,;/]/)));
    const clientHasPets  = ["yes", "ja"].includes((client.pets || "").toLowerCase());
    const clientNeedsBodyCare = ["yes", "ja"].includes((client.basicCare || "").toLowerCase());
    const clientPrefersNonSmoker = ["yes", "ja", "nichtraucher"].includes(
      (client.smokerPreference || "").toLowerCase()
    );

    const employees = await prisma.employee.findMany({
      where: { status: { in: ["approved", "accepted", "available"] } },
      include: { vacations: true, schedules: true },
    });

    // Hard filters — vacation/schedule conflict, pet/body-care blockers
    const available = employees.filter((emp) => {
      if (emp.vacations.some((v) => v.startDate <= end && v.endDate >= start)) return false;
      if (emp.schedules.some((s) => s.date && s.date >= start && s.date <= end)) return false;
      if (clientHasPets && !["yes", "ja"].includes((emp.worksWithAnimals || "").toLowerCase())) return false;
      if (clientNeedsBodyCare && !["yes", "ja"].includes((emp.bodyCareSupport || "").toLowerCase())) return false;
      return true;
    });

    function scoreEmployee(emp) {
      const breakdown = {};
      let total = 0;

      // 1. Verfügbarkeit (30): full if employee declares the requested weekday;
      //    half if employee has availabilityDays but not that one; reduced if unknown.
      let avail = 0;
      if (dayMatches(emp.availabilityDays, requestedWeekday)) avail = W_AVAILABILITY;
      else if (emp.availabilityDays?.length > 0) avail = W_AVAILABILITY * 0.4;
      else avail = W_AVAILABILITY * 0.6;
      breakdown.availability = Math.round(avail);
      total += avail;

      // 2. Region / Distanz (25): same city = full; same canton = 60%;
      //    otherwise scaled by stated travel willingness.
      let region = 0;
      if (clientCity && emp.city?.toLowerCase() === clientCity.toLowerCase()) {
        region = W_REGION;
      } else if (clientCanton && emp.canton?.toLowerCase() === clientCanton.toLowerCase()) {
        region = W_REGION * 0.6;
      } else {
        const km = parseYears(emp.howFarCanYouTravel); // re-using number parser
        if (km >= 30) region = W_REGION * 0.5;
        else if (km >= 10) region = W_REGION * 0.3;
      }
      breakdown.region = Math.round(region);
      total += region;

      // 3. Services match (20): share of booked (sub)services covered.
      let services = 0;
      const empServices = normalize(emp.servicesOffered);
      if (finalNeeds.length > 0) {
        const matched = finalNeeds.filter((n) => empServices.includes(n)).length;
        services = (matched / finalNeeds.length) * W_SERVICES;
      } else if (empServices.length > 0) {
        services = W_SERVICES * 0.5;
      }
      breakdown.services = Math.round(services);
      total += services;

      // 4. Sprache (10): ≥1 common language = full points.
      let language = 0;
      const empLangs = normalize(emp.languages);
      if (clientLanguages.length === 0 && empLangs.length > 0) {
        language = W_LANGUAGE * 0.5;
      } else if (clientLanguages.some((l) => empLangs.some((e) => e.includes(l) || l.includes(e)))) {
        language = W_LANGUAGE;
      }
      breakdown.language = Math.round(language);
      total += language;

      // 5. Erfahrung (10): years + prior assignment count.
      let experience = 0;
      const years = parseYears(emp.experienceYears);
      if (years >= 5) experience += W_EXPERIENCE * 0.7;
      else if (years >= 2) experience += W_EXPERIENCE * 0.5;
      else if (years >= 1) experience += W_EXPERIENCE * 0.3;
      const priorJobs = emp.schedules?.length || 0;
      if (priorJobs >= 10) experience += W_EXPERIENCE * 0.3;
      else if (priorJobs >= 3) experience += W_EXPERIENCE * 0.2;
      else if (priorJobs >= 1) experience += W_EXPERIENCE * 0.1;
      experience = Math.min(experience, W_EXPERIENCE);
      breakdown.experience = Math.round(experience);
      total += experience;

      // 6. Spezielle Anforderungen (5): non-smoker preference, driver's license,
      //    no-allergy match. Each subcriterion is worth a slice.
      let special = 0;
      const SUB = W_SPECIAL / 3;
      const empSmoker = (emp.smoker || "").toLowerCase();
      if (clientPrefersNonSmoker) {
        if (empSmoker === "nein" || empSmoker === "no") special += SUB;
      } else {
        special += SUB; // no preference → no penalty
      }
      if (emp.hasLicense) special += SUB;
      if ((emp.hasAllergies || "").toLowerCase() === "nein" ||
          (emp.hasAllergies || "").toLowerCase() === "no" ||
          !emp.hasAllergies) {
        special += SUB;
      }
      special = Math.min(special, W_SPECIAL);
      breakdown.special = Math.round(special);
      total += special;

      return { score: Math.round(Math.min(total, 100)), breakdown };
    }

    const recommendations = available.map((emp) => {
      const { score, breakdown } = scoreEmployee(emp);
      return {
        employeeId: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        city: emp.city,
        canton: emp.canton,
        score,
        breakdown,
        // Legacy fields kept for backwards compatibility with the admin UI.
        reasons: Object.entries(breakdown)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${k}: ${v}`),
      };
    });

    recommendations.sort((a, b) => b.score - a.score);
    return res.status(200).json(recommendations);
  } catch (err) {
    console.error("[matchmaking] error:", err.message);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
