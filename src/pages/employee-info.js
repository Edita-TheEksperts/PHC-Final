import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmployeeLayout from "../components/EmployeeLayout";
import { SELECT_FIELDS } from "../lib/formOptions";

const fileFields = ["cvFile", "profilePhoto", "passportFile", "passportBackFile", "visaFile", "drivingLicenceFile", "policeLetterFile", "certificateFile"];

const hiddenFields = [
  "id", "password", "passwordHash", "salesforceId",
  "createdAt", "updatedAt", "resetToken", "resetTokenExpiry",
  "documentStatus", "invited", "inviteSentAt", "approvedAt",
  "experienceYears", "experienceWhere", "experienceCompany",
  "weekendReady", "nightShiftFrequency",
  "status", "smoker", "desiredWeeklyHours", "hasAllergies",
];

function formatLabel(key) {
  const labels = {
    salutation: "Anrede", firstName: "Vorname", lastName: "Nachname", email: "E-Mail", phone: "Telefonnummer",
    nationality: "Nationalität", residencePermit: "Aufenthaltsstatus", canton: "Kanton",
    zipCode: "PLZ", city: "Ort", address: "Strasse", houseNumber: "Hausnummer", country: "Land",
    iban: "IBAN", accountHolder: "Kontoinhaber", bankName: "Bankname", bic: "BIC / SWIFT",
    availabilityFrom: "Verfügbar ab", availabilityDays: "Verfügbarkeitstage",
    desiredWeeklyHours: "Gewünschte Wochenstunden", onCallAvailable: "Kurzfristige Einsätze möglich",
    languages: "Hauptsprachen", languageOther: "Weitere Sprachen", communicationTraits: "Kommunikation",
    hasLicense: "Führerschein vorhanden", licenseType: "Führerscheintyp",
    hasCar: "Eigenes Auto vorhanden", carAvailableForWork: "Auto für Arbeit nutzbar",
    howFarCanYouTravel: "Max. Einsatzdistanz",
    bodyCareSupport: "Unterstützung bei Körperpflege", nightShifts: "Nachtdienste möglich",
    nightShiftFrequency: "Nachtdienst-Häufigkeit", worksWithAnimals: "Arbeiten mit Tieren",
    hasAllergies: "Allergien", dietaryExperience: "Ernährungserfahrung",
    cvFile: "Lebenslauf", profilePhoto: "Profilfoto",
    passportFile: "Ausweis / Pass (Vorderseite)", passportBackFile: "Ausweis / Pass (Rückseite)",
    visaFile: "Aufenthaltsbewilligung / Visum", drivingLicenceFile: "Führerausweis",
    policeLetterFile: "Strafregisterauszug", certificateFile: "Zertifikate",
    experienceYears: "Erfahrung (Jahre)", experienceWhere: "Erfahrung (Wo)", experienceCompany: "Arbeitgeber",
    servicesOffered: "Angebotene Dienste", specialTrainings: "Spezielle Schulungen",
    smoker: "Raucher", weekendReady: "Wochenendbereitschaft", travelSupport: "Reisebegleitung",
    status: "Status",
  };
  return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Ja" : "Nein";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  if (typeof value === "object") {
    if (value instanceof Date || (typeof value === "string" && value.includes("T"))) {
      return new Date(value).toLocaleDateString("de-DE");
    }
    return JSON.stringify(value);
  }
  const str = value.toString();
  if (str.includes("T") && str.includes("Z")) {
    const d = new Date(str);
    if (!isNaN(d)) return d.toLocaleDateString("de-DE");
  }
  return str;
}

const BASE_GROUPS = [
  { label: "Persönliche Informationen", keys: ["salutation", "firstName", "lastName", "email", "phone"] },
  { label: "Adresse & Nationalität", keys: ["address", "houseNumber", "zipCode", "city", "canton", "country", "nationality", "residencePermit"] },
  { label: "Bankdaten", keys: ["iban", "accountHolder", "bankName", "bic"] },
  { label: "Verfügbarkeit", keys: ["availabilityFrom", "availabilityDays", "onCallAvailable"] },
  { label: "Angebotene Dienstleistungen", keys: ["servicesOffered", "specialTrainings"] },
  { label: "Sprachen & Kommunikation", keys: ["languages", "languageOther", "communicationTraits", "dietaryExperience"] },
  { label: "Führerschein & Mobilität", keys: ["hasLicense", "licenseType", "hasCar", "carAvailableForWork", "howFarCanYouTravel"] },
  { label: "Einsatzrelevante Fähigkeiten", keys: ["bodyCareSupport", "nightShifts", "travelSupport", "worksWithAnimals"] },
  { label: "Dokumente & Nachweise", keys: ["cvFile", "profilePhoto", "passportFile", "passportBackFile", "visaFile", "drivingLicenceFile", "policeLetterFile", "certificateFile"] },
];

export default function EmployeeInfo() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMsg, setSaveMsg] = useState({ type: "", text: "" });
  const [viewTab, setViewTab] = useState("profil");
  const router = useRouter();

  useEffect(() => {
    if (router.query.tab === "dokumente") setViewTab("dokumente");
    else setViewTab("profil");
  }, [router.query.tab]);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) { router.push("/login"); return; }

    fetch("/api/get-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(r => r.json())
      .then(data => { setEmployee(data); setFormData(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/update-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setEmployee(updated);
      setFormData(updated);
      setEditMode(false);
      setSaveMsg({ type: "success", text: "Daten erfolgreich gespeichert." });
      setTimeout(() => setSaveMsg({ type: "", text: "" }), 4000);
    } catch {
      setSaveMsg({ type: "error", text: "Fehler beim Speichern." });
    }
  };

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("field", fieldName);
    form.append("email", employee.email);
    try {
      const res = await fetch("/api/upload-employee-file", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      setFormData(prev => ({ ...prev, [fieldName]: url }));
    } catch {
      alert("Fehler beim Upload.");
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#04436F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Lade Informationen...</p>
        </div>
      </div>
    </EmployeeLayout>
  );

  if (!employee) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-500">Keine Daten gefunden.</p>
      </div>
    </EmployeeLayout>
  );

  const initials = `${employee.firstName?.[0] || ""}${employee.lastName?.[0] || ""}`.toUpperCase() || "M";

  // Build grouped entries — no module-level mutation
  const allKeys = Object.keys(formData).filter(k => !hiddenFields.includes(k));
  const usedKeys = new Set(BASE_GROUPS.flatMap(g => g.keys));
  // Only show fields that are in defined groups — no catch-all
  const allGroups = [...BASE_GROUPS];
  const fieldGroups = viewTab === "dokumente"
    ? allGroups.filter(g => g.label === "Dokumente & Nachweise")
    : allGroups.filter(g => g.label !== "Dokumente & Nachweise");

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition";

  return (
    <EmployeeLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-4xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#04436F] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{viewTab === "dokumente" ? "Dokumente & Nachweise" : "Persönliche Informationen"}</h1>
              <p className="text-sm text-gray-500">{employee.firstName} {employee.lastName} · {employee.email}</p>
            </div>
          </div>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex-shrink-0 px-4 py-2 bg-[#04436F] hover:bg-[#033558] text-white text-sm font-medium rounded-lg transition"
            >
              Bearbeiten
            </button>
          ) : (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#04436F] hover:bg-[#033558] text-white text-sm font-medium rounded-lg transition"
              >
                Speichern
              </button>
              <button
                onClick={() => { setFormData(employee); setEditMode(false); setSaveMsg({ type: "", text: "" }); }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>

        {saveMsg.text && (
          <div className={`p-3 rounded-lg text-sm border ${
            saveMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"
          }`}>
            {saveMsg.text}
          </div>
        )}

        {/* Field groups */}
        {fieldGroups.map(group => {
          const entries = group.keys
            .filter(k => k in formData)
            .map(k => [k, formData[k]]);

          if (entries.length === 0) return null;

          const isDocGroup = group.label === "Dokumente";

          return (
            <div key={group.label} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group.label}</h2>
              </div>
              <div className={`p-6 grid gap-4 ${isDocGroup ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
                {entries.map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                      {formatLabel(key)}
                    </label>

                    {fileFields.includes(key) ? (
                      editMode ? (
                        <label className="flex items-center gap-3 w-full border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-[#04436F] transition">
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#04436F] text-white hover:bg-[#033558]">
                            Datei auswählen
                          </span>
                          <span className="text-sm text-gray-500 truncate">
                            {value ? (typeof value === "string" ? value.split("/").pop() : "Datei ausgewählt") : "Keine Datei ausgewählt"}
                          </span>
                          <input
                            type="file"
                            onChange={e => handleFileUpload(e.target.files[0], key)}
                            className="sr-only"
                          />
                        </label>
                      ) : value ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[#04436F] underline underline-offset-2 font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Datei öffnen
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">Keine Datei</span>
                      )
                    ) : editMode ? (
                      SELECT_FIELDS[key] ? (
                        <select
                          className={inputCls}
                          value={value ?? ""}
                          onChange={e => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                        >
                          <option value="">Bitte wählen</option>
                          {SELECT_FIELDS[key].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          className={inputCls}
                          value={Array.isArray(value) ? value.join(", ") : value ?? ""}
                          onChange={e => setFormData(prev => ({
                            ...prev,
                            [key]: Array.isArray(prev[key])
                              ? e.target.value.split(",").map(v => v.trim())
                              : e.target.value,
                          }))}
                        />
                      )
                    ) : (
                      <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 min-h-[38px]">
                        {formatValue(value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>
    </EmployeeLayout>
  );
}
