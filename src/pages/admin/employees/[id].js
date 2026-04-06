import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EMPLOYEE_STATUSES = ["pending", "approved", "rejected", "inaktiv"];

function StatusSetter({ type, id, currentStatus, onUpdated }) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const statuses = type === "employee" ? EMPLOYEE_STATUSES : ["open", "aktiv", "inaktiv", "storniert", "gekuendigt"];

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

export default function EmployeeDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
const [termineFilter, setTermineFilter] = useState("all"); // ✅ default
const [isEditing, setIsEditing] = useState(false);
const [editData, setEditData] = useState({});

const [editPersonal, setEditPersonal] = useState(false);
const [docConfirm, setDocConfirm] = useState(null);
const [docSending, setDocSending] = useState(false);
const [docToast, setDocToast] = useState(null);
const [editAddress, setEditAddress] = useState(false);
const [editAvailability, setEditAvailability] = useState(false);

const [personalData, setPersonalData] = useState({});
const [addressData, setAddressData] = useState({});
const [editServices, setEditServices] = useState(false);
const [servicesData, setServicesData] = useState({});
const [editConditions, setEditConditions] = useState(false);
const [conditionsData, setConditionsData] = useState({});
const [editSkills, setEditSkills] = useState(false);
const [skillsData, setSkillsData] = useState({});
const [availabilityData, setAvailabilityData] = useState({});
const [editLicense, setEditLicense] = useState(false);
const [licenseData, setLicenseData] = useState({});


const [einsatzFilter, setEinsatzFilter] = useState("all");
const [noteText, setNoteText] = useState("");
const [notes, setNotes] = useState([]);
const [notesLoaded, setNotesLoaded] = useState(false);
const [activeTab, setActiveTab] = useState("profil");
const [feedbackList, setFeedbackList] = useState([]);
const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/admin/employee/${id}`);
        const data = await res.json();
        setEmployee(data);
      } catch { setEmployee(null); }
    }
    fetchEmployee();
    async function fetchNotes() {
      try {
        const res = await fetch(`/api/admin/notes?employeeId=${id}`);
        const data = await res.json();
        setNotes(data.notes || []);
      } catch { setNotes([]); }
      setNotesLoaded(true);
    }
    fetchNotes();
    async function fetchFeedback() {
      try {
        const res = await fetch(`/api/admin/feedback?employeeId=${id}`);
        const data = await res.json();
        setFeedbackList(data.feedback || []);
        const avg = data.averages?.find(a => a.employeeId === id);
        if (avg) setAvgRating(avg);
      } catch {}
    }
    fetchFeedback();
  }, [id]);

  if (!employee) return <p className="p-6 text-gray-600">Loading...</p>;
// === AFTER employee is loaded ===
if (!employee) return <p className="p-6 text-gray-600">Loading...</p>;

const filteredAssignments =
  einsatzFilter === "all"
    ? employee.assignments
    : employee.assignments?.filter(a => {
        if (einsatzFilter === "pending") {
          return a.status === "pending" || a.status === "active";
        }
        return a.status === einsatzFilter;
      });

async function saveSkills() {
  const payload = {
    specialTrainings: skillsData.specialTrainings
      .split(",")
      .map((x) => x.trim()),
    languages: skillsData.languages
      .split(",")
      .map((x) => x.trim()),
    communicationTraits: skillsData.communicationTraits
      .split(",")
      .map((x) => x.trim()),
    dietaryExperience: skillsData.dietaryExperience
      .split(",")
      .map((x) => x.trim()),
  };

  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditSkills(false);
}


async function saveLicenseCar() {
  const payload = {
    hasLicense: licenseData.hasLicense === "Ja",
    licenseType: licenseData.licenseType,
    hasCar: licenseData.hasCar === "Ja",
    carAvailableForWork: licenseData.carAvailableForWork === "Ja",
  };



  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditLicense(false);
}

async function saveAvailability() {
  const payload = {
    ...availabilityData,
    availabilityDays: availabilityData.availabilityDays.split(",").map((d) => d.trim()),
  };

  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditAvailability(false);
}

async function saveAddress() {
  const res = await fetch(`/api/admin/employee/${id}`, {
method: "PATCH",

headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addressData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditAddress(false);
}

async function savePersonal() {
  const res = await fetch(`/api/admin/employee/${id}`, {
  method: "PATCH",

    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personalData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setEditPersonal(false);
}

async function saveServices() {
  const payload = {
    servicesOffered: typeof servicesData.servicesOffered === "string"
      ? servicesData.servicesOffered.split(",").map(s => s.trim()).filter(Boolean)
      : servicesData.servicesOffered || [],
    specialTrainings: typeof servicesData.specialTrainings === "string"
      ? servicesData.specialTrainings.split(",").map(s => s.trim()).filter(Boolean)
      : servicesData.specialTrainings || [],
  };
  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const updated = await res.json();
  setEmployee(updated);
  setEditServices(false);
}

async function saveConditions() {
  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conditionsData),
  });
  const updated = await res.json();
  setEmployee(updated);
  setEditConditions(false);
}

async function saveSkills() {
  const toArr = (v) => typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : v || [];
  const payload = {
    languages: toArr(skillsData.languages),
    languageOther: skillsData.languageOther || "",
    communicationTraits: toArr(skillsData.communicationTraits),
    dietaryExperience: toArr(skillsData.dietaryExperience),
  };
  const res = await fetch(`/api/admin/employee/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const updated = await res.json();
  setEmployee(updated);
  setEditSkills(false);
}

async function saveChanges() {
  const res = await fetch(`/api/admin/employee/${id}`, {
 method: "PATCH",

    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editData),
  });

  const updated = await res.json();
  setEmployee(updated);
  setIsEditing(false);
}

// Filtered Termine now computed safely
const filteredTermine =
  termineFilter === "all"
    ? employee.schedules
    : employee.schedules?.filter((t) => t.status === termineFilter);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatUrl = (file, label) =>
    file ? (
      <a
        className="text-blue-600 underline"
        href={file}
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
    ) : (
      "—"
    );

  const STATUS_LABELS = {
    approved: "Genehmigt",
    pending: "Ausstehend",
    rejected: "Abgelehnt",
  };

  const fileLinks = [
    { key: "passportFile", label: "Reisepass" },
    { key: "passportBackFile", label: "Ausweis / Pass (Rückseite)" },
    { key: "visaFile", label: "Aufenthaltsbewilligung / Visum" },
    { key: "policeLetterFile", label: "Polizeiliches Führungszeugnis" },
    { key: "cvFile", label: "Lebenslauf" },
    { key: "certificateFile", label: "Zertifikat" },
    { key: "drivingLicenceFile", label: "Führerschein" },
    { key: "profilePhoto", label: "Profilfoto" },
  ];

  const tabs = [
    { key: "profil",    label: "Profil" },
    { key: "einsaetze", label: `Einsätze${employee.assignments?.length ? ` (${employee.assignments.length})` : ""}` },
    { key: "termine",   label: `Termine${employee.schedules?.length ? ` (${employee.schedules.length})` : ""}` },
    { key: "urlaube",   label: `Urlaube${employee.vacations?.length ? ` (${employee.vacations.length})` : ""}` },
    { key: "notizen",   label: "Notizen" },
    { key: "bewertungen", label: `Bewertungen${feedbackList.length ? ` (${feedbackList.length})` : ""}` },
    { key: "aktionen",  label: "Admin-Aktionen" },
  ];

  const statusBadgeClass = {
    approved: "bg-green-100 text-green-700 border border-green-200",
    pending:  "bg-yellow-100 text-yellow-700 border border-yellow-200",
    rejected: "bg-red-100 text-red-700 border border-red-200",
    inaktiv:  "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/admin/bewerber")}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition text-gray-500"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900">{employee.firstName} {employee.lastName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{employee.email}</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass[employee.status] || statusBadgeClass.pending}`}>
          {employee.status === "approved" ? "Genehmigt" : employee.status === "rejected" ? "Abgelehnt" : employee.status === "inaktiv" ? "Inaktiv" : "Ausstehend"}
        </span>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 -mb-px
                ${activeTab === t.key ? "border-[#04436F] text-[#04436F]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {/* ── PROFIL TAB ── */}
          {activeTab === "profil" && (
            <div className="grid md:grid-cols-2 gap-6">

              {/* Persönliche Informationen */}
              <InfoCard
                title="Persönliche Informationen"
                onEdit={() => { setPersonalData({ email: employee.email, phone: employee.phone }); setEditPersonal(true); }}
              >
                <InfoRow label="E-Mail" value={employee.email} />
                <InfoRow label="Telefon" value={employee.phone} />
                <InfoRow label="Erstellt am" value={formatDate(employee.createdAt)} />
                <div className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-medium text-gray-500 w-32 flex-shrink-0">Status</span>
                  <StatusSetter
                    type="employee"
                    id={employee.id}
                    currentStatus={employee.status || "pending"}
                    onUpdated={(s) => setEmployee(prev => ({ ...prev, status: s }))}
                  />
                </div>
              </InfoCard>

              {/* Adresse */}
              <InfoCard
                title="Adresse & Nationalität"
                onEdit={() => {
                  setAddressData({ address: employee.address, houseNumber: employee.houseNumber, city: employee.city, zipCode: employee.zipCode, country: employee.country, canton: employee.canton, nationality: employee.nationality });
                  setEditAddress(true);
                }}
              >
                <InfoRow label="Adresse" value={`${employee.address || "—"} ${employee.houseNumber || ""}`} />
                <InfoRow label="Stadt / PLZ" value={`${employee.city || "—"}, ${employee.zipCode || "—"}`} />
                <InfoRow label="Land" value={`${employee.country || "—"} (${employee.canton || "—"})`} />
                <InfoRow label="Nationalität" value={employee.nationality} />
              </InfoCard>

              {/* Verfügbarkeit */}
              <InfoCard
                title="Verfügbarkeit"
                onEdit={() => {
                  setAvailabilityData({ availabilityFrom: employee.availabilityFrom, availabilityDays: (employee.availabilityDays || []).join(", ") });
                  setEditAvailability(true);
                }}
              >
                <InfoRow label="Verfügbar ab" value={formatDate(employee.availabilityFrom)} />
                <InfoRow label="Tage" value={(employee.availabilityDays || []).join(", ")} />
              </InfoCard>

              {/* Angebotene Dienstleistungen */}
              <InfoCard title="Dienstleistungen" className="md:col-span-2" onEdit={() => {
                setServicesData({
                  servicesOffered: (employee.servicesOffered || []).join(", "),
                  specialTrainings: (employee.specialTrainings || []).join(", "),
                });
                setEditServices(true);
              }}>
                <InfoRow label="Angebotene Services" value={Array.isArray(employee.servicesOffered) && employee.servicesOffered.length ? employee.servicesOffered.join(", ") : "—"} />
                <InfoRow label="Spezialausbildungen" value={Array.isArray(employee.specialTrainings) && employee.specialTrainings.length ? employee.specialTrainings.join(", ") : "—"} />
              </InfoCard>

              {/* Fähigkeiten & Sprachen */}
              <InfoCard title="Fähigkeiten & Sprachen" onEdit={() => {
                setSkillsData({
                  languages: (employee.languages || []).join(", "),
                  languageOther: employee.languageOther || "",
                  communicationTraits: (employee.communicationTraits || []).join(", "),
                  dietaryExperience: (employee.dietaryExperience || []).join(", "),
                });
                setEditSkills(true);
              }}>
                <InfoRow label="Sprachen" value={Array.isArray(employee.languages) && employee.languages.length ? employee.languages.join(", ") : "—"} />
                <InfoRow label="Weitere Sprache" value={employee.languageOther} />
                <InfoRow label="Kommunikation" value={Array.isArray(employee.communicationTraits) && employee.communicationTraits.length ? employee.communicationTraits.join(", ") : "—"} />
                <InfoRow label="Ernährungserfahrung" value={Array.isArray(employee.dietaryExperience) && employee.dietaryExperience.length ? employee.dietaryExperience.join(", ") : "—"} />
              </InfoCard>

              {/* Arbeitsbedingungen */}
              <InfoCard title="Arbeitsbedingungen" onEdit={() => {
                setConditionsData({
                  hasLicense: employee.hasLicense, licenseType: employee.licenseType || "",
                  hasCar: employee.hasCar || "", carAvailableForWork: employee.carAvailableForWork || "",
                  smoker: employee.smoker || "", onCallAvailable: employee.onCallAvailable || "",
                  nightShifts: employee.nightShifts || "", travelSupport: employee.travelSupport || "",
                  bodyCareSupport: employee.bodyCareSupport || "", worksWithAnimals: employee.worksWithAnimals || "",
                  desiredWeeklyHours: employee.desiredWeeklyHours || "", howFarCanYouTravel: employee.howFarCanYouTravel || "",
                });
                setEditConditions(true);
              }}>
                <InfoRow label="Führerschein" value={employee.hasLicense ? "Ja" : "Nein"} />
                <InfoRow label="Führerscheintyp" value={employee.licenseType} />
                <InfoRow label="Auto vorhanden" value={employee.hasCar} />
                <InfoRow label="Auto für Arbeit" value={employee.carAvailableForWork} />
                <InfoRow label="Raucher" value={employee.smoker} />
                <InfoRow label="Bereitschaftsdienst" value={employee.onCallAvailable} />
                <InfoRow label="Nachtschichten" value={employee.nightShifts} />
                <InfoRow label="Reisebegleitung" value={employee.travelSupport} />
                <InfoRow label="Körperpflege" value={employee.bodyCareSupport} />
                <InfoRow label="Arbeitet mit Tieren" value={employee.worksWithAnimals} />
                <InfoRow label="Gewünschte Wochenstunden" value={employee.desiredWeeklyHours} />
                <InfoRow label="Reisebereitschaft" value={employee.howFarCanYouTravel} />
              </InfoCard>

              {/* Aufenthaltserlaubnis */}
              <InfoCard title="Aufenthalt & Sonstiges">
                <InfoRow label="Aufenthaltsbewilligung" value={employee.residencePermit} />
                <InfoRow label="Wie erfahren" value={employee.howDidYouHearAboutUs} />
              </InfoCard>

              {/* Dokumente senden */}
              <InfoCard title="Dokumente senden" className="md:col-span-2">
                {docToast && (
                  <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    docToast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" :
                    docToast.type === "error" ? "bg-red-50 text-red-800 border border-red-200" :
                    "bg-gray-50 text-gray-700 border border-gray-200"
                  }`}>
                    <span>{docToast.type === "success" ? "✓" : docToast.type === "error" ? "✕" : "..."}</span>
                    <span>{docToast.text}</span>
                  </div>
                )}
                {docConfirm ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-amber-900 font-medium mb-3">
                      Möchten Sie &quot;{docConfirm.label}&quot; an <span className="font-bold">{employee.email}</span> senden?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDocConfirm(null)}
                        className="px-4 py-2 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                      >
                        Abbrechen
                      </button>
                      <button
                        disabled={docSending}
                        onClick={async () => {
                          setDocSending(true);
                          setDocToast(null);
                          try {
                            const res = await fetch("/api/send-documents", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ employee: { id: employee.id }, documentType: docConfirm.type }),
                            });
                            const data = await res.json();
                            if (res.ok) {
                              setDocToast({ type: "success", text: `${docConfirm.label} wurde erfolgreich an ${employee.email} gesendet.` });
                            } else {
                              setDocToast({ type: "error", text: data.error || "Fehler beim Senden" });
                            }
                          } catch {
                            setDocToast({ type: "error", text: "Netzwerkfehler beim Senden des Dokuments." });
                          } finally {
                            setDocSending(false);
                            setDocConfirm(null);
                          }
                        }}
                        className={`px-4 py-2 text-xs font-medium rounded-lg text-white transition ${docConfirm.color} ${docSending ? "opacity-50" : ""}`}
                      >
                        {docSending ? "Wird gesendet..." : "Ja, senden"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { type: "Auflösungschreiben", label: "Auflösungsschreiben", color: "bg-yellow-500 hover:bg-yellow-600" },
                      { type: "KündigungMA", label: "Kündigung (ordentlich)", color: "bg-orange-500 hover:bg-orange-600" },
                      { type: "KündigungMAFristlos", label: "Kündigung (fristlos)", color: "bg-red-500 hover:bg-red-600" },
                    ].map((doc) => (
                      <button
                        key={doc.type}
                        onClick={() => { setDocConfirm(doc); setDocToast(null); }}
                        className={`px-4 py-2 text-white text-xs font-medium rounded-lg transition ${doc.color}`}
                      >
                        {doc.label} senden
                      </button>
                    ))}
                  </div>
                )}
                {employee.documentStatus && employee.documentStatus !== "not_sent" && (
                  <p className="text-xs text-gray-500">Letztes gesendetes Dokument: <span className="font-medium">{employee.documentStatus}</span></p>
                )}
              </InfoCard>

              {/* Hochgeladene Dateien */}
              <InfoCard title="Hochgeladene Dateien" className="md:col-span-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1">
                  {fileLinks.map((f) => (
                    <div key={f.key} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${employee[f.key] ? "bg-green-500" : "bg-gray-300"}`} />
                      {employee[f.key] ? (
                        <a href={employee[f.key]} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate">{f.label}</a>
                      ) : (
                        <span className="text-sm text-gray-400">{f.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>
          )}

          {/* ── EINSÄTZE TAB ── */}
          {activeTab === "einsaetze" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500">Filter:</span>
                <div className="flex gap-1 flex-wrap">
                  {[["all","Alle"],["pending","Offen"],["active","Aktiv"],["accepted","Angenommen"],["rejected","Abgelehnt"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setEinsatzFilter(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition
                        ${einsatzFilter === val ? "bg-[#04436F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredAssignments?.length > 0 ? filteredAssignments.map(a => (
                  <div key={a.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">Kunde: {a.user?.firstName} {a.user?.lastName}</p>
                      <p className="text-xs text-gray-500">Zugewiesen am {formatDate(a.createdAt)} · {a.serviceName || "—"}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border
                      ${a.status === "accepted" ? "bg-green-100 text-green-700 border-green-200"
                      : a.status === "rejected" ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                      {a.status === "accepted" ? "Angenommen" : a.status === "rejected" ? "Abgelehnt" : "Offen"}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-8">Keine Einsätze für diesen Filter</p>
                )}
              </div>
            </div>
          )}

          {/* ── TERMINE TAB ── */}
          {activeTab === "termine" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500">Filter:</span>
                <div className="flex gap-1 flex-wrap">
                  {[["all","Alle"],["active","Ausstehend"],["completed","Abgeschlossen"],["cancelled","Abgelehnt"]].map(([val, lbl]) => (
                    <button key={val} onClick={() => setTermineFilter(val)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition
                        ${termineFilter === val ? "bg-[#04436F] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {filteredTermine?.length > 0 ? filteredTermine.map(a => (
                  <div key={a.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">Kunde: {a.user?.firstName} {a.user?.lastName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(a.date).toLocaleDateString("de-DE")} · {a.startTime} · {a.hours}h
                      </p>
                      {a.user?.services?.length > 0 && <p className="text-xs text-gray-500">{a.user.services.map(s => s.name).join(", ")}</p>}
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border
                      ${a.status === "completed" ? "bg-green-100 text-green-700 border-green-200"
                      : a.status === "cancelled" ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                      {a.status === "completed" ? "Abgeschlossen" : a.status === "cancelled" ? "Abgelehnt" : "Ausstehend"}
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-gray-400 text-center py-8">Keine Termine für diesen Filter</p>
                )}
              </div>
            </div>
          )}

          {/* ── URLAUBE TAB ── */}
          {activeTab === "urlaube" && (
            <div className="space-y-2">
              {employee.vacations?.length > 0 ? employee.vacations.map(v => (
                <div key={v.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{formatDate(v.startDate)} – {formatDate(v.endDate)}</p>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border
                    ${v.status === "approved" ? "bg-green-100 text-green-700 border-green-200"
                    : v.status === "rejected" ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"}`}>
                    {v.status === "approved" ? "Genehmigt" : v.status === "rejected" ? "Abgelehnt" : "Ausstehend"}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-8">Keine Urlaube gefunden</p>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Edit Modals */}
      {editPersonal    && <EditModal title="Persönliche Informationen" data={personalData}    onChange={setPersonalData}    onSave={savePersonal}    onClose={() => setEditPersonal(false)} />}
      {editAddress     && <EditModal title="Adresse & Nationalität"    data={addressData}     onChange={setAddressData}     onSave={saveAddress}     onClose={() => setEditAddress(false)} />}
      {/* Notizen Tab */}
      {activeTab === "notizen" && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Interne Notizen (Admin-only)</h3>
            <p className="text-xs text-gray-400 mb-3">Nicht sichtbar für Mitarbeiter</p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Notiz hinzufügen..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#04436F]/20"
            />
            <button
              onClick={async () => {
                if (!noteText.trim()) return;
                try {
                  const res = await fetch("/api/admin/notes", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: noteText, employeeId: employee.id, author: "Admin" }),
                  });
                  if (res.ok) {
                    const note = await res.json();
                    setNotes(prev => [note, ...prev]);
                    setNoteText("");
                  }
                } catch {}
              }}
              className="mt-2 px-4 py-2 bg-[#04436F] text-white text-sm font-medium rounded-lg hover:bg-[#033558] transition"
            >
              Notiz speichern
            </button>
          </div>
          <div className="space-y-2">
            {notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Keine Notizen vorhanden</p>
            ) : notes.map((n) => (
              <div key={n.id || n.createdAt} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">{n.author}</span>
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString("de-CH")} {new Date(n.createdAt).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <p className="text-sm text-gray-800">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bewertungen Tab */}
      {activeTab === "bewertungen" && (
        <div className="space-y-4">
          {avgRating && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 flex items-center gap-4">
              <div className="text-3xl font-bold text-[#B99B5F]">{avgRating.averageRating}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Durchschnittsbewertung</p>
                <p className="text-xs text-gray-500">{avgRating.totalRatings} Bewertung{avgRating.totalRatings !== 1 ? "en" : ""}</p>
              </div>
            </div>
          )}
          {feedbackList.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Keine Bewertungen vorhanden</p>
          ) : (
            feedbackList.map(f => (
              <div key={f.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{f.user?.firstName} {f.user?.lastName}</span>
                  <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString("de-CH")}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5,6].map(s => (
                    <span key={s} className="text-lg">{s <= f.rating ? "⭐" : "☆"}</span>
                  ))}
                </div>
                {f.comment && <p className="text-sm text-gray-600">{f.comment}</p>}
              </div>
            ))
          )}
        </div>
      )}

      {/* Admin-Aktionen Tab */}
      {activeTab === "aktionen" && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Admin-Aktionen</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push(`/admin/einsaetze`)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-gray-900">Einsatz vorschlagen</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button
                onClick={async () => {
                  if (!confirm("Profil wirklich deaktivieren? Der Mitarbeiter kann sich nicht mehr einloggen.")) return;
                  await fetch("/api/admin/set-status", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ type: "employee", id: employee.id, status: "inaktiv" }),
                  });
                  setEmployee(prev => ({ ...prev, status: "inaktiv" }));
                }}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                <span className="text-sm font-medium text-red-700">Profil deaktivieren</span>
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
              </button>
            </div>
          </div>

          {/* Bewerbungsverlauf */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Bewerbungs- & Entscheidungsverlauf</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="text-sm text-gray-700">Bewerbung eingegangen: {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString("de-CH") : "—"}</span>
              </div>
              {employee.invited && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Interview eingeladen: {employee.inviteSentAt ? new Date(employee.inviteSentAt).toLocaleDateString("de-CH") : "—"}</span>
                </div>
              )}
              {employee.status === "approved" && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Genehmigt</span>
                </div>
              )}
              {employee.status === "rejected" && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Abgelehnt</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {editAvailability && <EditModal title="Verfügbarkeit" data={availabilityData} onChange={setAvailabilityData} onSave={saveAvailability} onClose={() => setEditAvailability(false)} />}
      {editServices    && <EditModal title="Dienstleistungen"          data={servicesData}    onChange={setServicesData}    onSave={saveServices}    onClose={() => setEditServices(false)} />}
      {editSkills      && <EditModal title="Fähigkeiten & Sprachen"    data={skillsData}      onChange={setSkillsData}      onSave={saveSkills}      onClose={() => setEditSkills(false)} />}
      {editConditions  && <EditModal title="Arbeitsbedingungen"        data={conditionsData}  onChange={setConditionsData}  onSave={saveConditions}  onClose={() => setEditConditions(false)} />}
    </div>
  );
}

function InfoCard({ title, children, onEdit, className = "" }) {
  return (
    <div className={`bg-gray-50 rounded-xl border border-gray-100 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-[#04436F] font-medium px-2.5 py-1 rounded-lg border border-[#04436F]/20 hover:bg-[#04436F]/5 transition">
            Bearbeiten
          </button>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <span className="text-xs font-medium text-gray-400 w-36 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-gray-800">{value || "—"}</span>
    </div>
  );
}

const FIELD_LABELS_DE = {
  email: "E-Mail", phone: "Telefon", salutation: "Anrede", firstName: "Vorname", lastName: "Nachname",
  address: "Adresse", houseNumber: "Hausnummer", zipCode: "PLZ", city: "Stadt", country: "Land",
  canton: "Kanton", nationality: "Nationalität", residencePermit: "Aufenthaltsbewilligung",
  availabilityFrom: "Verfügbar ab", availabilityDays: "Verfügbare Tage",
  experienceYears: "Jahre Erfahrung", experienceWhere: "Erfahrungsort", experienceCompany: "Unternehmen",
  hasLicense: "Führerschein", licenseType: "Führerscheintyp", hasCar: "Auto vorhanden",
  carAvailableForWork: "Auto für Arbeit", smoker: "Raucher", onCallAvailable: "Bereitschaftsdienst",
  nightShifts: "Nachtschichten", travelSupport: "Reisebegleitung", bodyCareSupport: "Körperpflege",
  worksWithAnimals: "Arbeitet mit Tieren", desiredWeeklyHours: "Gewünschte Wochenstunden",
  howFarCanYouTravel: "Reisebereitschaft", howDidYouHearAboutUs: "Wie erfahren",
  languages: "Sprachen", languageOther: "Weitere Sprache",
  communicationTraits: "Kommunikation", dietaryExperience: "Ernährungserfahrung",
  servicesOffered: "Angebotene Services", specialTrainings: "Spezialausbildungen",
};

function EditModal({ title, data, onChange, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-3 overflow-y-auto">
          {Object.keys(data).map((key) => {
            const label = FIELD_LABELS_DE[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                <input
                  name={key}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20"
                  value={data[key] ?? ""}
                  onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                  placeholder={label}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">Abbrechen</button>
          <button onClick={onSave}  className="flex-1 py-2 text-sm font-medium bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition">Speichern</button>
        </div>
      </div>
    </div>
  );
}
