// Canonical PHC service catalog. Single source of truth for the employee
// registration funnel (employee-register.js) and any new admin/UI surface
// that needs the same option list.
//
// The customer booking flow loads services from the DB (prisma.service /
// prisma.subService) — keep the names below in sync with those rows so that
// what a customer books in `User.subServices` matches what an employee can
// declare in `Employee.servicesOffered`. The audit's F-31 symptom
// ("Subservices im MA-Dashboard nicht kongruent mit Kundeneingabe") is
// resolved when both sides reference the same spelling.

export const SERVICE_CATALOG = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
    "Gemeinsames Kochen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
    "Biografiearbeit",
    "Vorlesen",
    "Gesellschaftspiele",
    "Ausflüge und Reisebegleitung",
  ],
  "Gesundheitsführsorge": [
    "Körperliche Unterstützung",
    "Nahrungsaufnahme",
    "Grundpflegerische Tätigkeiten",
    "Gesundheitsfördernde Aktivitäten",
    "Geistige Unterstützung",
  ],
  "Haushaltshilfe und Wohnpflege": [
    "Hauswirtschaft",
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung / Abfall",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen",
  ],
};

export const SERVICE_NAMES = Object.keys(SERVICE_CATALOG);

// Flat list of every subservice across categories — useful for dashboards
// that need to lookup whether an arbitrary subservice name is known.
export const ALL_SUBSERVICES = Object.values(SERVICE_CATALOG).flat();

// Reverse map: subservice → parent category. For UIs that need to group.
export const SUBSERVICE_TO_CATEGORY = Object.entries(SERVICE_CATALOG)
  .reduce((acc, [cat, subs]) => {
    for (const s of subs) acc[s] = cat;
    return acc;
  }, {});
