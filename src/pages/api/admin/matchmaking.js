import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { clientId, startDate, endDate } = req.query;
    if (!clientId) return res.status(400).json({ message: "clientId is required" });

    // ------------------------------------------------------------
    // STEP 1 — LOAD CLIENT
    // ------------------------------------------------------------
    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { services: true, subServices: true },
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    // ------------------------------------------------------------
    // STEP 2 — TIME WINDOW
    // ------------------------------------------------------------
    let start = startDate ? new Date(startDate) :
                client.firstDate ? new Date(client.firstDate) :
                new Date();

    let end = endDate ? new Date(endDate) :
              new Date(start.getTime() + 24 * 3600 * 1000);

    // ------------------------------------------------------------
    // STEP 3 — NORMALIZED CLIENT NEEDS
    // ------------------------------------------------------------
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

    const normalize = arr =>
      [...new Set(arr.map(s => SERVICE_ALIASES[s] || s.toLowerCase()))];

    let needs = [
      ...(client.services?.map(s => s.name.toLowerCase()) || []),
      ...(client.subServices?.map(s => s.name.toLowerCase()) || []),
    ];

    if (needs.length === 0) {
      if (client.mobility) needs.push("mobility");
      if (client.companionship) needs.push("companionship");
      if (client.shoppingAssist) needs.push("shopping");
      if (client.basicCare) needs.push("care");
    }

    const finalNeeds = normalize(needs);

    // ------------------------------------------------------------
    // STEP 4 — CLIENT CONTEXT
    // ------------------------------------------------------------
    const clientCity = client.careCity || null;
    const clientCanton = client.canton || null;
    const clientLanguage = client.languages?.toLowerCase() || null;
    const clientHasPets = client.pets?.toLowerCase() === "yes" || client.pets?.toLowerCase() === "ja";
    const clientNeedsBodyCare = client.basicCare?.toLowerCase() === "yes" || client.basicCare?.toLowerCase() === "ja";

    // ------------------------------------------------------------
    // STEP 5 — LOAD EMPLOYEES
    // ------------------------------------------------------------
    const employees = await prisma.employee.findMany({
      where: { status: "available" },
      include: { vacations: true, schedules: true },
    });

    // ------------------------------------------------------------
    // STEP 6 — HARD FILTERS
    // ------------------------------------------------------------
    const available = [];

    for (const emp of employees) {

      // Vacation overlaps
      const vacationConflict = emp.vacations.some(v =>
        v.startDate <= end && v.endDate >= start
      );
      if (vacationConflict) continue;

      // Schedule overlaps
      const scheduleConflict = emp.schedules.some(s =>
        s.date && s.date >= start && s.date <= end
      );
      if (scheduleConflict) continue;

      // Pets rule
      if (clientHasPets && emp.worksWithAnimals?.toLowerCase() !== "yes" && emp.worksWithAnimals?.toLowerCase() !== "ja")
        continue;

      // Body care rule
      if (clientNeedsBodyCare && emp.bodyCareSupport?.toLowerCase() !== "yes" && emp.bodyCareSupport?.toLowerCase() !== "ja")
        continue;

      available.push(emp);
    }

    // ------------------------------------------------------------
    // STEP 7 — SCORING SYSTEM (0–100)
    // ------------------------------------------------------------
    function scoreEmployee(emp) {
      let score = 0;
      let reasons = [];

      // ---- 1. Location (max 30)
      if (clientCity && emp.city?.toLowerCase() === clientCity.toLowerCase()) {
        score += 20;
        reasons.push("Same city");
      }
      if (clientCanton && emp.canton?.toLowerCase() === clientCanton.toLowerCase()) {
        score += 10;
        reasons.push("Same canton");
      }

      // ---- 2. Services (max 30)
      const matchedServices = emp.servicesOffered?.filter(s =>
        finalNeeds.includes(s.toLowerCase())
      ) || [];

      if (matchedServices.length > 0) {
        score += Math.min(matchedServices.length * 10, 30);
        reasons.push(`Service match: ${matchedServices.join(", ")}`);
      }

      // ---- 3. SubServices (max 10)
      const matchedSub = emp.servicesOffered?.filter(s =>
        finalNeeds.includes(s.toLowerCase())
      ) || [];

      if (matchedSub.length > 0) {
        score += Math.min(matchedSub.length * 5, 10);
      }

      // ---- 4. Language (max 10)
      if (clientLanguage && emp.languages?.includes(clientLanguage)) {
        score += 10;
        reasons.push("Language match");
      }

      // ---- 5. Bodycare (max 5)
      if (clientNeedsBodyCare && emp.bodyCareSupport?.toLowerCase() === "yes") {
        score += 5;
        reasons.push("Can provide body care");
      }

      // ---- 6. Availability (max 5)
      if (emp.availabilityDays?.length > 0) {
        score += 5;
      }

      return { score: Math.min(score, 100), reasons };
    }

    const recommendations = available.map(emp => {
      const result = scoreEmployee(emp);

      return {
        employeeId: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        city: emp.city,
        canton: emp.canton,
        score: result.score,
        reasons: result.reasons,
      };
    });

    // ------------------------------------------------------------
    // STEP 8 — SORT + FALLBACK
    // ------------------------------------------------------------
    recommendations.sort((a, b) => b.score - a.score);

    if (recommendations.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(recommendations);

  } catch (err) {
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
