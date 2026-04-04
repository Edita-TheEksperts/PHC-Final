// pages/admin/clients/[id].jsx
import { useEffect, useMemo, useState, memo } from "react";

import { useRouter } from "next/router";

const CLIENT_STATUSES = ["open", "aktiv", "inaktiv", "storniert", "gekuendigt"];

function StatusSetter({ type, id, currentStatus, onUpdated }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const statuses = type === "client" ? CLIENT_STATUSES : ["pending", "approved", "rejected", "inaktiv"];

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/set-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdated?.(data.status);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded px-2 py-1 text-sm text-gray-700"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={saving || status === currentStatus}
        className="px-3 py-1 text-xs bg-[#04436F] text-white rounded hover:bg-[#033350] disabled:opacity-50 transition"
      >
        {saving ? "…" : saved ? "✓" : "Speichern"}
      </button>
    </div>
  );
}

export default function ClientDetails() {
  const router = useRouter();
  const { id } = router.query;

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ edit
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const [showSchedules, setShowSchedules] = useState(false);

  // Positionswechsel
  const [swapping, setSwapping] = useState(false);
  async function handleSwapPersons() {
    if (!client?.id) return;
    setSwapping(true);
    try {
      const res = await fetch("/api/admin/swap-persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: client.id }),
      });
      const data = await res.json();
      if (res.ok) setClient((prev) => ({ ...prev, ...data.user }));
    } finally {
      setSwapping(false);
    }
  }

  // Internal Notes
  const [clientNotes, setClientNotes] = useState([]);
  const [clientNoteText, setClientNoteText] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/notes?userId=${id}`)
      .then(r => r.json())
      .then(d => setClientNotes(d.notes || []))
      .catch(() => {});
  }, [id]);

  // Abschluss
  const [showAbschluss, setShowAbschluss] = useState(false);
  const [abschlussData, setAbschlussData] = useState(null);
  const [abschlussForm, setAbschlussForm] = useState({
    endDate: "", reason: "", satisfaction: "", recommendations: "", notes: "", completedBy: "",
  });
  const [savingAbschluss, setSavingAbschluss] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/abschluss?userId=${id}`)
      .then((r) => r.json())
      .then((d) => setAbschlussData(d.abschluss))
      .catch(() => {});
  }, [id]);

  async function handleAbschlussSubmit(e) {
    e.preventDefault();
    setSavingAbschluss(true);
    try {
      const res = await fetch(`/api/admin/abschluss?userId=${client.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(abschlussForm),
      });
      const data = await res.json();
      if (res.ok) {
        setAbschlussData(data.abschluss);
        setShowAbschluss(false);
      }
    } finally {
      setSavingAbschluss(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${d.getFullYear()}`;
  }

  useEffect(() => {
    if (!id) return;

    async function fetchClient() {
      setLoading(true);
      try {
        const res = await fetch(`/api/clients/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setClient(null);
          return;
        }
        setClient(data);
      } catch (err) {
        setClient(null);
      } finally {
        setLoading(false);
      }
    }

    fetchClient();
  }, [id]);

  const uniqueAssignments = useMemo(() => {
    const list = client?.assignments || [];
    const filtered = list.filter((a) => a?.employee?.id);
    return Array.from(new Map(filtered.map((a) => [a.employee.id, a])).values());
  }, [client]);

  useEffect(() => {
    if (!client) return;
  }, [client]);

  // =========================================================
  // ✅ HELPERS
  // =========================================================

  const EXCLUDE_KEYS = new Set([
    "passwordHash",
    "resetToken",
    "resetTokenExpiry",
    "stripeCustomerId",
    "stripePaymentMethodId",
    "paymentIntentId",
    "services",
    "subServices",
    "assignments",
    "schedules",
    "transactions",
    "reminders",
    "vouchers",
    "activityLogs",
    "vacations",
  ]);

const ALLOWED_FIELDS = useMemo(
  () => [
    // =====================
    // Basic / Identity
    // =====================
    "anrede",
    "firstName",
    "lastName",
    "email",
    "phone",
    "languages",
    "otherLanguage",

    // =====================
    // Request Person
    // =====================
    "requestFirstName",
    "requestLastName",
    "requestEmail",
    "requestPhone",

    // =====================
    // Care / Address
    // =====================
    "careFirstName",
    "careLastName",
    "carePhone",
    "careStreet",
    "carePostalCode",
    "careCity",
    "careArrivalConditions",
    "careHasParking",
    "careEntrance",
    "careEntranceDetails",
    "mailboxKeyLocation",
    "mailboxDetails",

    // =====================
    // Service / Contract
    // =====================
    "frequency",
    "duration",

    // =====================
    // Health – Physical
    // =====================
    "height",
    "weight",
    "physicalState",
    "mobility",
    "mobilityAids",

    // Pflegehilfsmittel (PRISMA)
    "toolsAvailable",
    "toolsOther",

    // Inkontinenz & Ernährung
    "incontinence",
    "incontinenceTypes",
    "foodSupport",
    "foodSupportTypes",

    // =====================
    // Health – Communication
    // =====================
    "communicationSehen",
    "communicationHören",
    "communicationSprechen",

    // =====================
    // Health – Medical
    // =====================
    "medicalFindings",
    "healthFindings",
    "hasAllergies",
    "allergyDetails",
    "allergyWhich",

    // =====================
    // Mental / Behaviour
    // =====================
    "mentalDiagnoses",
    "behaviorTraits",
    "mentalHealthNotes",
    "dayNightReversed",
    "personalityChange",

    // =====================
    // Household
    // =====================
    "householdRooms",
    "householdPeople",
    "householdTasks",
    "pets",

    // =====================
    // Activities / Freizeit
    // =====================
    "companionship",
    "jointCooking",
    "cooking",
    "biographyWork",
    "reading",
    "cardGames",
    "trips",

    // =====================
    // Shopping / Appointments
    // =====================
    "shoppingType",
    "shoppingWithClient",
    "shoppingItems",
    "appointmentTypes",
    "appointmentOther",
    "additionalAccompaniment",

    // =====================
    // Emergency
    // =====================
    "emergencyContactName",
    "emergencyContactPhone",

    // =====================
    // Misc
    // =====================
    "specialRequests",
  ],
  []
);


  const ALLOWED_SET = useMemo(() => new Set(ALLOWED_FIELDS), [ALLOWED_FIELDS]);

  // =========================================================
  // ✅ FIELD LABELS (RENAMED) — used inside Fragebogen + general
  // =========================================================
  const FIELD_LABELS = {
    // Persönliche Daten
    anrede: "Anrede",
    firstname: "Vorname",
    lastname: "Nachname",
firstName: "Vorname (zu betreuende Person)",
lastName: "Nachname (zu betreuende Person)",


    // Anfragende Person
    requestfirstname: "Vorname (anfragende Person)",
    requestlastname: "Nachname (anfragende Person)",

    role: "Rolle",
    status: "Status",

    // Kontakt
    email: "E-Mail",
    phone: "Telefonnummer",
    languages: "Sprachen",
    otherlanguage: "Sonstige Sprache",

    // Adresse (Einsatzort / Betreuung)
    carestreet: "Strasse",
    carepostalcode: "PLZ",
    carecity: "Ort",

    // Service / Vertrag
    frequency: "Häufigkeit",
    duration: "Dauer (Std.)",
    firstdate: "Erstes Einsatzdatum",

  

    // Sektion 1 – Ankunft / Eingang
    arrivalkeystored: "Schlüssel ist hinterlegt",
    arrivalsomeonehome: "Es ist jemand zu Hause",
    parkingavailable: "Parkplatz vorhanden?",
    entrancelocation: "Wo befindet sich der Eingang?",
    additionalinfo: "Zusätzliche Informationen",

    // Sektion 2 – Alltagsbegleitung & Besorgungen
    doctorvisits: "Begleitung zu Terminen: Arzt",
    physiovisits: "Begleitung zu Terminen: Physiotherapie",
    authorityvisits: "Begleitung zu Terminen: Behördengänge",
    shoppingwithclient: "Begleitung durch die PHC?",
    shoppingtype: "Art der Einkäufe",
    postkeywhere: "Wo ist der Briefkastenschlüssel?",
    mailboxDetails: "Welches Postfach?",
    otheraccompaniments: "Weitere Begleitungen",

    // Sektion 3 – Freizeit & soziale Aktivitäten
    companionship: "Gesellschaft leisten",
    jointcooking: "Gemeinsames Kochen",
    biographywork: "Biografiearbeit",
    reading: "Vorlesen",
    cardgames: "Gesellschaftsspiele / Kartenspiele",
    trips: "Ausflüge & Reisebegleitung",

    // Sektion 4 – Gesundheitsinformationen
    heightcm: "Grösse (cm)",
    weightkg: "Gewicht (kg)",
    mobility: "Zustand / Mobilität",
    mobilityaids: "Vorhandene Hilfsmittel",
    caretools: "Pflegehilfsmittel",
    incontinence: "Inkontinenz",
    communicationvision: "Sehen",
    communicationsehen: "Sehen",
    communicationhearing: "Hören",
    communicationhören: "Hören",
    communicationspeech: "Sprechen",
    communicationsprechen: "Sprechen",
    allergies: "Allergien vorhanden",
    allergydetails: "Allergiedetails",
    healthfindings: "Gesundheitliche Hinweise",
    medicalfindings: "Medizinische Befunde",
    foodsupport: "Nahrungsaufnahme: Unterstützung nötig",
    swallowingproblems: "Probleme beim Schlucken",
    appetiteloss: "Appetitlosigkeit",
    hygienessupport: "Grundpflege: Körperhygiene",

    restlessness: "Starke Unruhe",
    daynightreversed: "Gestörter Tag-/Nachtrhythmus",
    wandering: "Weglauftendenz",
    personalitychange: "Persönlichkeitsveränderungen",
    aggressiveness: "Aggressivität",
    apathy: "Apathie",
    mentalhealthnotes: "Geistiger Zustand / Hinweise",

    // Sektion 5 – Haushaltshilfe & Wohnpflege
    householdrooms: "Anzahl Zimmer",
    householdpeople: "Wieviel-Personen-Haushalt?",
    housetasksbalcony: "Balkon- & Blumenpflege",
    housetaskslaundry: "Waschen / Bügeln / Verräumen",
    housetaskscooking: "Kochen",
    housetaskswindows: "Fenster putzen",
    housetasksbedsheets: "Bettwäsche wechseln",
    housetaskstidyup: "Aufräumen",
    housetaskstrash: "Abfall trennen / entsorgen",
    housetasksdusting: "Abstauben",
    housetasksvacuum: "Staubsaugen",
    housetasksmop: "Boden wischen",
    housetaskscurtains: "Vorhänge reinigen",
    petsinhousehold: "Haustiere im Haushalt?",
  };

  function labelize(key) {
    const lower = (key || "").toLowerCase();
    if (FIELD_LABELS[lower]) return FIELD_LABELS[lower];

    return (key || "")
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (c) => c.toUpperCase());
  }

  function formatPrimitiveValue(key, value) {
    if (value === null || value === undefined) return "—";
    if (typeof value === "boolean") return value ? "Ja" : "Nein";
    if (typeof value === "number") return String(value);

    if (typeof value === "string") {
      if (value.trim() === "") return "—";
      if (key.toLowerCase().includes("date") || key.toLowerCase().includes("at")) {
        const d = new Date(value);
        if (!Number.isNaN(d.getTime())) return d.toLocaleString();
      }
      return value;
    }

    return "—";
  }

  function normalizeForInput(key, value) {
    // keep booleans as booleans, numbers as numbers, strings as strings
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value;
    if (typeof value === "string") return value;
    return "";
  }

  function isLongText(key) {
    const k = (key || "").toLowerCase();
    return (
      k.includes("details") ||
      k.includes("findings") ||
      k.includes("diagnos") ||
      k.includes("notes") ||
      k.includes("comment") ||
      k.includes("beschreibung") ||
      k.includes("bemerk") ||
      k.includes("allergy") ||
      k.includes("medical") ||
      k.includes("health") ||
      k.includes("additionalinfo") ||
      k.includes("otheraccompaniments") ||
      k.includes("mentalhealthnotes")
    );
  }

  function inferFieldType(key, value) {
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    return "string";
  }

const InputField = memo(function InputField({ fieldKey, value }) {
  const canEdit = ALLOWED_SET.has(fieldKey);
  const type = inferFieldType(fieldKey, value);

  if (!isEditing || !canEdit) {
    return (
      <span className="text-gray-900 break-words text-right flex-1">
        {formatPrimitiveValue(fieldKey, value)}
      </span>
    );
  }

  if (type === "boolean") {
    return (
      <select
        className="w-full max-w-[420px] border rounded-lg px-3 py-2 text-gray-900"
        value={
          formData[fieldKey] === true
            ? "true"
            : formData[fieldKey] === false
            ? "false"
            : ""
        }
        onChange={(e) => {
          const v = e.target.value;
          setFormData((p) => ({
            ...p,
            [fieldKey]: v === "true" ? true : v === "false" ? false : null,
          }));
        }}
      >
        <option value="">—</option>
        <option value="true">Ja</option>
        <option value="false">Nein</option>
      </select>
    );
  }

  if (type === "number") {
    return (
      <input
        type="number"
        className="w-full max-w-[420px] border rounded-lg px-3 py-2 text-gray-900"
        value={formData[fieldKey] ?? ""}
        onChange={(e) =>
          setFormData((p) => ({
            ...p,
            [fieldKey]: e.target.value === "" ? null : Number(e.target.value),
          }))
        }
      />
    );
  }

  if (isLongText(fieldKey)) {
    return (
      <textarea
        className="w-full border rounded-lg px-3 py-2 text-gray-900 min-h-[90px]"
        value={formData[fieldKey] ?? ""}
        onChange={(e) =>
          setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))
        }
      />
    );
  }

  return (
    <input
      type="text"
      className="w-full max-w-[520px] border rounded-lg px-3 py-2 text-gray-900"
      value={formData[fieldKey] ?? ""}
      onChange={(e) =>
        setFormData((p) => ({ ...p, [fieldKey]: e.target.value }))
      }
    />
  );
});

  function startEdit() {
    if (!client) return;

    // preload only allowed fields so form is clean
    const initial = {};
    for (const key of ALLOWED_FIELDS) {
      initial[key] = normalizeForInput(key, client[key]);
    }

    setFormData(initial);
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
    setSaving(false);
    setFormData({});
  }

  async function saveEdit() {
    if (!id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.message || "Speichern fehlgeschlagen");
        return;
      }

      // refresh client data (merge but also keep relations in UI)
      setClient((prev) => ({
        ...prev,
        ...data,
      }));

      setIsEditing(false);
      setFormData({});
    } catch (e) {
      alert("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // ✅ AUTO-FIELDS FROM PRISMA (flat primitive fields)
  // =========================================================

  const mergedClient = useMemo(() => {
    if (!client) return null;
    if (!isEditing) return client;
    // show edited values live
    return {
      ...client,
      ...formData,
    };
  }, [client, isEditing, formData]);

  const allClientFields = useMemo(() => {
    if (!mergedClient) return [];

    return Object.entries(mergedClient)
      .filter(([key, value]) => {
        if (EXCLUDE_KEYS.has(key)) return false;
        const t = typeof value;
        if (value === null) return true;
        if (t === "string" || t === "number" || t === "boolean") return true;
        return false;
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => ({
        key,
        label: labelize(key),
        rawValue: value,
        value: formatPrimitiveValue(key, value),
      }));
  }, [mergedClient]);

  // =========================================================
  // ✅ FRAGEBOGEN SECTIONS (like screenshot: Sektion 1..5)
  // =========================================================

const QUESTIONNAIRE_SECTIONS = useMemo(
  () => [
    {
      id: "sektion-1",
      title: "Persönliche Angaben (Zusammenfassung)",
      fields: [
        // Zu betreuende Person / Einsatzort
        { key: "firstName", label: "Vorname (zu betreuende Person)" },
        { key: "lastName", label: "Nachname (zu betreuende Person)" },
        { key: "carePhone", label: "Telefonnummer (zu betreuende Person)" },

        // Kontakt
        { key: "phone", label: "Telefonnummer" },
        { key: "email", label: "E-Mail" },

        // Adresse Einsatzort
        { key: "careStreet", label: "Strasse" },
        { key: "carePostalCode", label: "PLZ" },
        { key: "careCity", label: "Ort" },

        // Anfragende Person
        { key: "requestFirstName", label: "Vorname (anfragende Person)" },
        { key: "requestLastName", label: "Nachname (anfragende Person)" },
        { key: "requestPhone", label: "Telefonnummer (anfragende Person)" },
        { key: "requestEmail", label: "E-Mail (anfragende Person)" },

        // Ankunft / Eingang
        { key: "careArrivalConditions", label: "Ankunftsbedingungen" },
        { key: "careHasParking", label: "Parkplatz vorhanden?" },
        { key: "mailboxKeyLocation", label: "Wo ist der Briefkastenschlüssel?" },
        { key: "mailboxDetails", label: "Welches Postfach?" },
        { key: "careEntrance", label: "Wo befindet sich der Eingang?" },
        { key: "careEntranceDetails", label: "Eingang Details" },

      ],
    },

    {
      id: "sektion-2",
      title: "Alltagsbegleitung & Besorgungen",
      fields: [
        { key: "appointmentTypes", label: "Begleitung zu Terminen" },
        { key: "appointmentOther", label: "Sonstiges (Termine)" },

        { key: "shoppingWithClient", label: "Begleitung durch die PHC?" },
        { key: "shoppingItems", label: "Art der Einkäufe" },

        { key: "mailboxKeyLocation", label: "Wo ist der Briefkastenschlüssel?" },
        { key: "mailboxDetails", label: "Welches Postfach?" },

        { key: "additionalAccompaniment", label: "Weitere Begleitungen" },
      ],
    },

    {
      id: "sektion-3",
      title: "Freizeit & soziale Aktivitäten",
      fields: [
        { key: "jointCooking", label: "Gemeinsames Kochen" },
        { key: "biographyWork", label: "Biografiearbeit" },
        { key: "reading", label: "Vorlesen" },
        { key: "cardGames", label: "Gesellschaftsspiele" },
        { key: "trips", label: "Ausflüge & Reisebegleitung" },
      ],
    },

    {
      id: "sektion-4",
      title: "Gesundheitsinformationen",
      fields: [
        { key: "height", label: "Grösse (cm)" },
        { key: "weight", label: "Gewicht (kg)" },

        { key: "physicalState", label: "Zustand" },

        { key: "mobilityAids", label: "Vorhandene Hilfsmittel" },
        { key: "toolsAvailable", label: "Pflegehilfsmittel" },
        { key: "toolsOther", label: "Pflegehilfsmittel (Sonstige)" },


        { key: "incontinenceTypes", label: "Art der Inkontinenz" },
{ key: "communicationSehen", label: "Sehen" },
{ key: "communicationHören", label: "Hören" },
{ key: "communicationSprechen", label: "Sprechen" },

        { key: "foodSupportTypes", label: "Art der Unterstützung" },

        { key: "basicCareNeeds", label: "Grundpflege Bedarf" },
        { key: "basicCareOtherField", label: "Grundpflege Sonstiges" },

        { key: "mentalDiagnoses", label: "Diagnosen" },
        { key: "behaviorTraits", label: "Verhaltensmerkmale" },

        { key: "healthFindings", label: "Gesundheitliche Hinweise" },
      ],
    },

    {
      id: "sektion-5",
      title: "Haushaltshilfe & Wohnpflege",
      fields: [
        { key: "householdRooms", label: "Anzahl Zimmer" },
        { key: "householdPeople", label: "Wieviel-Personen-Haushalt?" },

        { key: "householdTasks", label: "Ihre Tätigkeiten" },

        { key: "languages", label: "Wunschsprache der Betreuungsperson" },
        { key: "otherLanguage", label: "Sonstige Sprache" },

        { key: "pets", label: "Haustiere im Haushalt?" },

        { key: "allergyWhich", label: "Welche Allergien?" },
      ],
    },
  ],
  []
);


  const questionnaireUsedKeys = useMemo(() => {
    const s = new Set();
    for (const sec of QUESTIONNAIRE_SECTIONS) {
      for (const f of sec.fields) s.add(f.key);
    }
    return s;
  }, [QUESTIONNAIRE_SECTIONS]);

  const remainingQuestionnaireFields = useMemo(() => {
    // show any other primitive fields that are NOT already displayed in Sektion 1..5
    // (so you "don't lose" anything)
    return (allClientFields || []).filter((f) => {
      const k = f.key;
      if (EXCLUDE_KEYS.has(k)) return false;
      if (questionnaireUsedKeys.has(k)) return false;

      // keep Prisma/meta + other fields too, but this "Weitere Felder" stays under Fragebogen
      // (so your request "dont remove something" is respected)
      return true;
    });
  }, [allClientFields, questionnaireUsedKeys]);

  function FieldRow({ label, fieldKey }) {
    return (
      <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
        <strong className="text-gray-700">{label}</strong>
        <div className="flex justify-end min-w-0">
          <InputField fieldKey={fieldKey} value={mergedClient?.[fieldKey]} />
        </div>
      </li>
    );
  }

  // =========================================================
  // ✅ RETURNS LAST
  // =========================================================

  if (loading) return <p className="p-6 text-gray-600">Loading client data...</p>;
  if (!client) return <p className="p-6 text-red-600">Client not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <div className="border-b pb-4 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-[#04436F]">Kundenprofil</h1>
          <p className="text-lg text-gray-600 mt-1">
            {client.firstName || "—"} {client.lastName || ""}
          </p>
        </div>

        {/* ✅ Edit actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSwapPersons}
            disabled={swapping}
            className="px-4 py-2 bg-yellow-50 border border-yellow-400 text-yellow-800 rounded-lg hover:bg-yellow-100 transition font-medium text-sm disabled:opacity-50"
          >
            {swapping ? "…" : "⇄ Positionswechsel"}
          </button>
          <button
            onClick={() => setShowAbschluss(true)}
            className="px-4 py-2 bg-red-50 border border-red-400 text-red-800 rounded-lg hover:bg-red-100 transition font-medium text-sm"
          >
            {abschlussData ? "✓ Abschluss anzeigen" : "Abschluss-Fragebogen"}
          </button>
          {!isEditing ? (
            <button
              onClick={startEdit}
              className="px-5 py-2 bg-white border border-[#04436F] text-[#04436F] rounded-lg hover:bg-[#f3f7fb] transition font-medium"
            >
              Bearbeiten
            </button>
          ) : (
            <>
              <button
                onClick={cancelEdit}
                disabled={saving}
                className="px-5 py-2 bg-white border rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60"
              >
                Abbrechen
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2 bg-[#04436F] text-white rounded-lg hover:bg-[#033350] transition font-medium disabled:opacity-60"
              >
                {saving ? "Speichern..." : "Speichern"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">
          <h2 className="text-2xl font-bold text-[#04436F]">Funnel & Persönliche Infos</h2>

          <div className="flex flex-col gap-8">
            <section className="bg-gray-50 rounded-xl border p-6 overflow-hidden">
              <h3 className="text-xl font-semibold text-[#04436F] mb-5">Persönliche Infos</h3>

              <ul className="grid gap-y-4 text-gray-800">
                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">E-Mail</span>
                  <div className="w-full min-w-0 break-words">
                    <InputField fieldKey="email" value={mergedClient?.email} className="w-full" />
                  </div>
                </li>

                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">Telefon</span>
                  <div className="w-full min-w-0">
                    <InputField fieldKey="phone" value={mergedClient?.phone} className="w-full" />
                  </div>
                </li>

                <li className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 sm:gap-4 items-start">
                  <span className="text-sm font-medium text-gray-500">Sprachen</span>
                  <div className="w-full min-w-0">
                    <InputField
                      fieldKey="languages"
                      value={mergedClient?.languages}
                      className="w-full"
                    />
                  </div>
                </li>
              </ul>
            </section>

      <section className="bg-gray-50 rounded-xl border p-6">
  <h3 className="text-xl font-semibold text-[#04436F] mb-4">Adresse</h3>

  <ul className="space-y-3 text-gray-800">
    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
      <strong className="text-gray-700">Strasse</strong>
      <div className="flex justify-end min-w-0">
        <InputField fieldKey="careStreet" value={mergedClient?.careStreet} />
      </div>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
      <strong className="text-gray-700">PLZ</strong>
      <div className="flex justify-end min-w-0">
        <InputField fieldKey="carePostalCode" value={mergedClient?.carePostalCode} />
      </div>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
      <strong className="text-gray-700">Ort</strong>
      <div className="flex justify-end min-w-0">
        <InputField fieldKey="careCity" value={mergedClient?.careCity} />
      </div>
    </li>
  </ul>
</section>


<section className="bg-gray-50 rounded-xl border p-6">
  <h3 className="text-xl font-semibold text-[#04436F] mb-4">Dienstleistungen</h3>

  <ul className="space-y-3 text-gray-800">
    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Hauptdienstleistungen</strong>
      <span className="text-gray-900 break-words text-right">
        {(client.services || []).map((s) => s.name).join(", ") || "—"}
      </span>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Nebendienstleistungen</strong>
      <span className="text-gray-900 break-words text-right">
        {(client.subServices || []).map((s) => s.name).join(", ") || "—"}
      </span>
    </li>
  </ul>

  {isEditing && (
    <p className="text-xs text-gray-500 mt-4">
      Dienstleistungen werden hier nicht bearbeitet (Relations).
    </p>
  )}
</section>


         <section className="bg-gray-50 rounded-xl border p-6">
  <h3 className="text-xl font-semibold text-[#04436F] mb-4">Service Präferenzen</h3>

  <ul className="space-y-3 text-gray-800">
    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Erstes Datum</strong>
      <span className="text-gray-900 break-words text-right">
        {formatDate(client.firstDate)}
      </span>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
      <strong className="text-gray-700">Häufigkeit</strong>
      <div className="flex justify-end min-w-0">
        <InputField fieldKey="frequency" value={mergedClient?.frequency} />
      </div>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-start">
      <strong className="text-gray-700">Dauer</strong>
      <div className="flex justify-end min-w-0">
        <InputField fieldKey="duration" value={mergedClient?.duration} />
      </div>
    </li>
  </ul>
</section>

<section className="bg-gray-50 rounded-xl border p-6">
  <h3 className="text-xl font-semibold text-[#04436F] mb-4">Meta</h3>

  <ul className="space-y-3 text-gray-800">
    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6 items-center">
      <strong className="text-gray-700">Status</strong>
      <StatusSetter type="client" id={client.id} currentStatus={client.status || "open"} onUpdated={(s) => setClient(prev => ({ ...prev, status: s }))} />
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Rolle</strong>
      <span className="text-right">{client.role || "—"}</span>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Angelegt</strong>
      <span className="text-right">
        {client.createdAt ? new Date(client.createdAt).toLocaleString() : "—"}
      </span>
    </li>

    <li className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-2 sm:gap-6">
      <strong className="text-gray-700">Aktualisiert</strong>
      <span className="text-right">
        {client.updatedAt ? new Date(client.updatedAt).toLocaleString() : "—"}
      </span>
    </li>
  </ul>
</section>


            {/* ✅ NEW: Fragebogen split into Sektion 1..5 (like screenshot) */}
            <section className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Fragebogen</h3>

              <div className="space-y-6">
                {QUESTIONNAIRE_SECTIONS.map((sec) => (
                  <div key={sec.id} className="bg-gray-50 p-6 rounded-xl border">
                    <h4 className="text-lg font-semibold text-[#04436F] mb-4">{sec.title}</h4>

                    <ul className="space-y-3 text-gray-800">
                      {sec.fields.map((f) => (
                        <FieldRow key={f.key} label={f.label} fieldKey={f.key} />
                      ))}
                    </ul>

                    {isEditing && (
                      <p className="text-xs text-gray-500 mt-4">
                        Nur Felder aus der erlaubten Liste sind editierbar. Andere bleiben read-only.
                      </p>
                    )}
                  </div>
                ))}

             
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-xl shadow p-8 border space-y-10">
          <h2 className="text-2xl font-bold text-[#04436F]">Einsatzinformationen</h2>

          {/* Persons Card */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-yellow-900">Personen</h3>
              <button
                onClick={handleSwapPersons}
                disabled={swapping}
                className="text-xs px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full hover:bg-yellow-300 disabled:opacity-50 transition"
              >
                {swapping ? "…" : "⇄ Positionswechsel"}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Anfragende Person</p>
                <p className="font-medium">{client.requestFirstName || "—"} {client.requestLastName || ""}</p>
                <p className="text-gray-500">{client.requestPhone || "—"}</p>
                <p className="text-gray-500 text-xs">{client.requestEmail || ""}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Betreuende Person</p>
                <p className="font-medium">{client.careFirstName || "—"} {client.careLastName || ""}</p>
                <p className="text-gray-500">{client.carePhone || "—"}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Zuweisungen</h3>

            {uniqueAssignments.length > 0 ? (
              <ul className="space-y-3">
                {uniqueAssignments.map((a) => (
                  <li key={a.id} className="p-4 bg-white border rounded shadow-sm">
                    <p>
                      <strong>Mitarbeiter:</strong> {a.employee?.firstName} {a.employee?.lastName}
                    </p>
                    <p>
                      <strong>Status:</strong> {a.status || "—"}
                    </p>
                    <p>
                      <strong>Zugewiesen am:</strong> {formatDate(a.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">Keine Einsätze gefunden</p>
            )}
          </div>

          {/* Schedules placeholder */}
          {showSchedules && (
            <div className="bg-gray-50 p-6 rounded-xl border">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Schedules</h3>
              <p className="text-gray-500 italic">Noch nicht implementiert…</p>
            </div>
          )}
        </div>
      </div>

      <div className="pt-8">
        <button
          onClick={() => router.push("/admin/kunden")}
          className="px-6 py-2 bg-[#04436F] text-white rounded hover:bg-[#033350] transition"
        >
          ← Zurück zu Kunden
        </button>
      </div>

      {/* Admin-Aktionen & Notizen Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-6 lg:px-8">
        {/* Interne Notizen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Interne Notizen</h3>
          <p className="text-xs text-gray-400 mb-3">Nicht sichtbar für Kunde</p>
          <textarea
            value={clientNoteText}
            onChange={(e) => setClientNoteText(e.target.value)}
            placeholder="Notiz hinzufügen..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[60px] focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 mb-2"
          />
          <button
            onClick={async () => {
              if (!clientNoteText.trim()) return;
              try {
                const res = await fetch("/api/admin/notes", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ text: clientNoteText, userId: client.id, author: "Admin" }),
                });
                if (res.ok) {
                  const note = await res.json();
                  setClientNotes(prev => [note, ...prev]);
                  setClientNoteText("");
                }
              } catch {}
            }}
            className="px-4 py-2 bg-[#04436F] text-white text-xs font-medium rounded-lg hover:bg-[#033558] transition"
          >
            Notiz speichern
          </button>
          {clientNotes.length > 0 && (
            <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
              {clientNotes.map(n => (
                <div key={n.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">{n.author}</span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString("de-CH")}</span>
                  </div>
                  <p className="text-sm text-gray-800">{n.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin-Aktionen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Admin-Aktionen</h3>
          <div className="space-y-2">
            <button onClick={() => router.push("/admin/einsaetze")} className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition text-sm font-medium text-gray-900">
              Betreuungsperson zuweisen / wechseln
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
            <button
              onClick={async () => {
                if (!confirm("Kunde wirklich temporär pausieren?")) return;
                await fetch("/api/admin/set-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "client", id: client.id, status: "inaktiv" }) });
                setClient(prev => ({ ...prev, status: "inaktiv" }));
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-amber-200 rounded-lg hover:bg-amber-50 transition text-sm font-medium text-amber-700"
            >
              Kunde temporär pausieren
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button
              onClick={() => setShowAbschluss(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm font-medium text-red-700"
            >
              Betreuung beenden
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Abschluss Modal */}
      {showAbschluss && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#04436F]">Abschluss-Fragebogen</h2>
              <button onClick={() => setShowAbschluss(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            {abschlussData ? (
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Enddatum:</strong> {new Date(abschlussData.endDate).toLocaleDateString("de-CH")}</p>
                <p><strong>Grund:</strong> {abschlussData.reason || "—"}</p>
                <p><strong>Zufriedenheit:</strong> {abschlussData.satisfaction || "—"}</p>
                <p><strong>Empfehlungen:</strong> {abschlussData.recommendations || "—"}</p>
                <p><strong>Notizen:</strong> {abschlussData.notes || "—"}</p>
                <p><strong>Ausgefüllt von:</strong> {abschlussData.completedBy || "—"}</p>
                <p className="text-xs text-gray-400">Erstellt: {new Date(abschlussData.createdAt).toLocaleString("de-CH")}</p>
                <button
                  onClick={() => setAbschlussData(null)}
                  className="mt-2 text-xs text-blue-600 underline"
                >
                  Neu ausfüllen
                </button>
              </div>
            ) : (
              <form onSubmit={handleAbschlussSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enddatum *</label>
                  <input type="date" required value={abschlussForm.endDate}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grund der Beendigung</label>
                  <select value={abschlussForm.reason}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, reason: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">— auswählen —</option>
                    <option value="Verstorben">Verstorben</option>
                    <option value="Umzug ins Heim">Umzug ins Heim</option>
                    <option value="Kündigung durch Kunde">Kündigung durch Kunde</option>
                    <option value="Kündigung durch PHC">Kündigung durch PHC</option>
                    <option value="Zustand verbessert">Zustand verbessert</option>
                    <option value="Anderer Grund">Anderer Grund</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kundenzufriedenheit</label>
                  <select value={abschlussForm.satisfaction}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, satisfaction: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm">
                    <option value="">— auswählen —</option>
                    <option value="Sehr zufrieden">Sehr zufrieden</option>
                    <option value="Zufrieden">Zufrieden</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Unzufrieden">Unzufrieden</option>
                    <option value="Keine Angabe">Keine Angabe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empfehlungen</label>
                  <textarea value={abschlussForm.recommendations}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, recommendations: e.target.value }))}
                    rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notizen / Besonderheiten</label>
                  <textarea value={abschlussForm.notes}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, notes: e.target.value }))}
                    rows={2} className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ausgefüllt von</label>
                  <input type="text" value={abschlussForm.completedBy}
                    onChange={(e) => setAbschlussForm((p) => ({ ...p, completedBy: e.target.value }))}
                    placeholder="Name des Mitarbeiters"
                    className="w-full border rounded-lg px-3 py-2 text-sm" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAbschluss(false)}
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">
                    Abbrechen
                  </button>
                  <button type="submit" disabled={savingAbschluss}
                    className="px-4 py-2 bg-[#04436F] text-white rounded-lg text-sm hover:bg-[#033350] disabled:opacity-60">
                    {savingAbschluss ? "Speichern…" : "Speichern"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
