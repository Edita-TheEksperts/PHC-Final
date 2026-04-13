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
