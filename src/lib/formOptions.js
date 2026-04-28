// Shared select option lists — keep admin edit modals and profile screens
// in sync with the registration funnel (employee-register.js / register-client.js).

export const SALUTATIONS = ["Herr", "Frau"];

export const CH_CANTONS = [
  "AG", "AI", "AR", "BE", "BL", "BS", "FR", "GE", "GL",
  "GR", "JU", "LU", "NE", "NW", "OW", "SG", "SH", "SO",
  "SZ", "TG", "TI", "UR", "VD", "VS", "ZG", "ZH",
];

export const MARITAL_STATUSES = ["Verheiratet", "Geschieden", "Ledig", "Verwitwet"];

export const FREQUENCIES = ["einmalig", "wöchentlich", "alle 2 Wochen", "monatlich"];

export const PHYSICAL_STATES = ["Vollständig mobil", "Teilweise mobil", "Stark eingeschränkt", "Bettlägerig"];

export const COOKING_OPTIONS = ["Ja, alleine", "Ja, mit Hilfe", "Nein"];

export const TRANSPORT_OPTIONS = ["Eigenes Auto", "ÖV", "Begleitung nötig", "Nicht mobil"];

export const YES_NO = [
  { value: "yes", label: "Ja" },
  { value: "no", label: "Nein" },
];

// Maps field key -> select options. Used by generic edit forms.
export const SELECT_FIELDS = {
  salutation: SALUTATIONS,
  anrede: SALUTATIONS,
  canton: CH_CANTONS,
  kanton: CH_CANTONS,
  maritalStatus: MARITAL_STATUSES,
  frequency: FREQUENCIES,
  physicalState: PHYSICAL_STATES,
  cooking: COOKING_OPTIONS,
  transportOption: TRANSPORT_OPTIONS,
};

// Fields rendered as Ja/Nein dropdowns across all profile edit views.
export const JA_NEIN_FIELDS = new Set([
  "careHasParking", "hasAllergies", "hasTech", "mentalSupportNeeded",
  "shoppingWithClient", "reading", "cardGames", "companionship",
  "companionshipSupport", "allergyCheck", "jointCooking",
  "hasLicense", "hasCar", "carAvailableForWork", "smoker",
  "onCallAvailable", "weekendReady", "worksWithAnimals",
]);

// === CLIENT (User) questionnaire — mirrors RegisterForm1/3/4 ===
// Multi-checkbox option lists. Stored as comma-separated string in DB
// (matching RegisterForm4's `.join(", ")` shape).
export const CLIENT_MULTI_OPTIONS = {
  mobility: [
    "vollständig mobil", "sturzgefährdet", "Bettlägerig",
    "Hilfe beim Aufstehen", "Hilfe beim Toilettengang", "Hilfe beim Umlagern",
  ],
  mobilityAids: [
    "Gehstock", "Rollator", "Rollstuhl", "Hebesitz",
    "Pflegebett", "Patientenlift", "Badewannenlift", "Toilettenstuhl",
  ],
  toolsAvailable: [
    "Gehstock", "Rollator", "Rollstuhl", "Hebesitz",
    "Pflegebett", "Patientenlift", "Badewannenlift", "Toilettenstuhl",
  ],
  incontinenceTypes: ["Urin", "Stuhl", "Dauerkatheter", "Stoma"],
  foodSupportTypes: [
    "Unterstützung notwendig", "Nahrung anreichen notwendig",
    "Flüssigkeitsaufnahme kontrollieren", "Probleme beim Schlucken", "Appetitlosigkeit",
  ],
  basicCareNeeds: ["Körperhygiene", "An-/Auskleiden"],
  mentalDiagnoses: [
    "Depressionen", "Demenz-Diagnose", "Alzheimer-Diagnose",
    "Gestörter Tag-/Nachtrhythmus", "Weglauf Tendenz", "Persönlichkeitsveränderungen",
    "Aggressivität", "Apathie", "Starke Unruhe",
  ],
  behaviorTraits: [
    "Aggressivität", "Apathie", "Starke Unruhe",
    "Weglauf Tendenz", "Persönlichkeitsveränderungen", "Gestörter Tag-/Nachtrhythmus",
  ],
  appointmentTypes: ["Arzt", "Physiotherapie", "Behörde"],
  shoppingItems: ["Lebensmittel", "Apotheke", "Garten", "Kleidung"],
};

// Communication sense select — from RegisterForm3 (Sehen / Hören / Sprechen).
export const CLIENT_COMM_OPTIONS = {
  communicationSehen: [
    { value: "gut", label: "Keine Probleme" },
    { value: "eingeschränkt", label: "Eingeschränkt" },
    { value: "schlecht", label: "Nahezu blind" },
  ],
  communicationHören: [
    { value: "gut", label: "Keine Probleme" },
    { value: "eingeschränkt", label: "Eingeschränkt" },
    { value: "schlecht", label: "Nahezu taub" },
  ],
  communicationSprechen: [
    { value: "gut", label: "Keine Probleme" },
    { value: "eingeschränkt", label: "Eingeschränkt" },
    { value: "schlecht", label: "Kaum möglich" },
  ],
};

// householdTasks is JSON in Prisma — RegisterForm1 stores
// { [taskName]: { answer, details, extra } }.
export const CLIENT_HOUSEHOLD_TASKS = [
  "Balkon und Blumenpflege", "Waschen / Bügeln", "Kochen", "Fenster Putzen",
  "Bettwäsche wechseln", "Aufräumen", "Trennung / Entsorgung Abfall",
  "Kleider waschen/Bügeln/verräumen", "Abstauben", "Staubsaugen",
  "Boden wischen", "Vorhänge reinigen",
];

// === EMPLOYEE registration — mirrors employee-register.js ===
// Ja/Nein selects with lowercase values (`<option value="ja">`).
export const EMPLOYEE_JA_NEIN_LOWER = new Set([
  "hasLicense", "hasCar", "carAvailableForWork", "onCallAvailable",
  "travelSupport", "bodyCareSupport", "worksWithAnimals",
  "nightShifts", "smoker",
]);

// Custom <select> options per field (mirrors reg form dropdown values).
export const EMPLOYEE_SELECT_OPTIONS = {
  country: [
    { value: "CH", label: "Schweiz (CH)" },
    { value: "DE", label: "Deutschland (DE)" },
    { value: "AT", label: "Österreich (AT)" },
  ],
  residencePermit: ["CH Pass", "B", "C", "G", "L"].map((v) => ({ value: v, label: v })),
  licenseType: ["Automat", "Manuell"].map((v) => ({ value: v, label: v })),
  howFarCanYouTravel: [
    { value: "0-15km", label: "0–20 km" },
    { value: "15-30km", label: "20–40 km" },
    { value: "30km+", label: "40 km+" },
  ],
  desiredWeeklyHours: [
    { value: "40", label: "40h / 100%" },
    { value: "32", label: "32h / 80%" },
    { value: "24", label: "24h / 60%" },
    { value: "16", label: "16h / 40%" },
    { value: "8", label: "8h / 20%" },
  ],
};

// Multi-checkbox lists (stored as array in DB, comma-separated in form state).
export const EMPLOYEE_MULTI_OPTIONS = {
  languages: ["CH-Deutsch", "Deutsch", "Englisch", "Französisch", "Italienisch"],
  availabilityDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  servicesOffered: [
    "Alltagsbegleitung und Besorgungen",
    "Freizeit und Soziale Aktivitäten",
    "Gesundheitsführsorge",
    "Haushaltshilfe und Wohnpflege",
  ],
  specialTrainings: [
    "Demenz", "Palliative Care", "Psychiatrie", "Onkologie", "Wundpflege",
  ],
  communicationTraits: [
    "Geduldig", "Empathisch", "Humorvoll", "Aktiv zuhörend", "Strukturiert",
  ],
  dietaryExperience: [
    "Vegetarisch", "Vegan", "Glutenfrei", "Laktosefrei", "Diabetiker", "Halal", "Koscher",
  ],
};

// Helper: parse comma-separated string OR array into Set<string>.
export function parseCsvSet(raw) {
  if (Array.isArray(raw)) return new Set(raw.map(String));
  if (typeof raw === "string" && raw.trim()) {
    return new Set(raw.split(",").map((s) => s.trim()).filter(Boolean));
  }
  return new Set();
}
