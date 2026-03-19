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
const [editAddress, setEditAddress] = useState(false);
const [editAvailability, setEditAvailability] = useState(false);

const [personalData, setPersonalData] = useState({});
const [addressData, setAddressData] = useState({});
const [availabilityData, setAvailabilityData] = useState({});
const [editLicense, setEditLicense] = useState(false);
const [licenseData, setLicenseData] = useState({});

const [editSkills, setEditSkills] = useState(false);
const [skillsData, setSkillsData] = useState({});
const [einsatzFilter, setEinsatzFilter] = useState("all");



  useEffect(() => {
    if (!id) return;
    async function fetchEmployee() {
      const res = await fetch(`/api/admin/employee/${id}`);
      const data = await res.json();
      setEmployee(data);
    }
    fetchEmployee();
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
    { key: "visaFile", label: "Visum" },
    { key: "policeLetterFile", label: "Polizeiliches Führungszeugnis" },
    { key: "cvFile", label: "Lebenslauf" },
    { key: "certificateFile", label: "Zertifikat" },
    { key: "drivingLicenceFile", label: "Führerschein" },
    { key: "profilePhoto", label: "Profilfoto" },
  ];

  const [activeTab, setActiveTab] = useState("profil");

  const tabs = [
    { key: "profil",    label: "Profil" },
    { key: "einsaetze", label: `Einsätze${employee.assignments?.length ? ` (${employee.assignments.length})` : ""}` },
    { key: "termine",   label: `Termine${employee.schedules?.length ? ` (${employee.schedules.length})` : ""}` },
    { key: "urlaube",   label: `Urlaube${employee.vacations?.length ? ` (${employee.vacations.length})` : ""}` },
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
          onClick={() => router.push("/admin/employees")}
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
                ${activeTab === t.key ? "border-[#0F1F38] text-[#0F1F38]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
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
                title="Verfügbarkeit & Erfahrung"
                onEdit={() => {
                  setAvailabilityData({ availabilityFrom: employee.availabilityFrom, availabilityDays: (employee.availabilityDays || []).join(", "), experienceYears: employee.experienceYears, experienceWhere: employee.experienceWhere, experienceCompany: employee.experienceCompany });
                  setEditAvailability(true);
                }}
              >
                <InfoRow label="Verfügbar ab" value={formatDate(employee.availabilityFrom)} />
                <InfoRow label="Tage" value={(employee.availabilityDays || []).join(", ")} />
                <InfoRow label="Jahre Erfahrung" value={employee.experienceYears} />
                <InfoRow label="Erfahrungsort" value={employee.experienceWhere} />
                <InfoRow label="Unternehmen" value={employee.experienceCompany} />
              </InfoCard>

              {/* Fähigkeiten */}
              <InfoCard title="Fähigkeiten & Sprachen">
                <InfoRow label="Sprachen" value={Array.isArray(employee.languages) && employee.languages.length ? employee.languages.join(", ") : "—"} />
                <InfoRow label="Kommunikation" value={Array.isArray(employee.communicationTraits) && employee.communicationTraits.length ? employee.communicationTraits.join(", ") : "—"} />
                <InfoRow label="Ernährungserfahrung" value={Array.isArray(employee.dietaryExperience) && employee.dietaryExperience.length ? employee.dietaryExperience.join(", ") : "—"} />
              </InfoCard>

              {/* Dokumente */}
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
                        ${einsatzFilter === val ? "bg-[#0F1F38] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
                        ${termineFilter === val ? "bg-[#0F1F38] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
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
      {editAvailability && <EditModal title="Verfügbarkeit & Erfahrung" data={availabilityData} onChange={setAvailabilityData} onSave={saveAvailability} onClose={() => setEditAvailability(false)} />}
      {editLicense     && <EditModal title="Führerschein & Fahrzeug"   data={licenseData}     onChange={setLicenseData}     onSave={saveLicenseCar}  onClose={() => setEditLicense(false)} />}
      {editSkills      && <EditModal title="Schulungen & Sprachen"     data={skillsData}      onChange={setSkillsData}      onSave={saveSkills}      onClose={() => setEditSkills(false)} />}
    </div>
  );
}

function InfoCard({ title, children, onEdit, className = "" }) {
  return (
    <div className={`bg-gray-50 rounded-xl border border-gray-100 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-[#0F1F38] font-medium px-2.5 py-1 rounded-lg border border-[#0F1F38]/20 hover:bg-[#0F1F38]/5 transition">
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

function EditModal({ title, data, onChange, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 space-y-3">
          {Object.keys(data).map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{key}</label>
              <input
                name={key}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
                value={data[key] || ""}
                onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                placeholder={key}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition">Abbrechen</button>
          <button onClick={onSave}  className="flex-1 py-2 text-sm font-medium bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition">Speichern</button>
        </div>
      </div>
    </div>
  );
}
