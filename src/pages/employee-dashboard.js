import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/router";
import AssignmentsList from "../components/AssignmentList";
import EmployeeLayout from "../components/EmployeeLayout";

export default function EmployeeDashboard() {
  const [vacations, setVacations] = useState([]);
  const [vacationStart, setVacationStart] = useState(null);
  const [vacationEnd, setVacationEnd] = useState(null);
  const [confirmedAssignments, setConfirmedAssignments] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectedAssignments, setRejectedAssignments] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [paymentTotals, setPaymentTotals] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [nachrichtText, setNachrichtText] = useState("");
  const [nachrichtType, setNachrichtType] = useState("Nachricht an PHC");
  const [nachrichtSending, setNachrichtSending] = useState(false);
  const [nachrichtFeedback, setNachrichtFeedback] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(null);
  const router = useRouter();

  // Handle tab from URL query
  useEffect(() => {
    const tab = router.query.tab;
    if (tab === "einsaetze") setActiveTab("confirmed");
    else if (tab === "urlaub") setActiveTab("vacation");
    else if (tab === "nachrichten") setActiveTab("nachrichten");
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
      .then(setEmployeeData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!employeeData?.email) return;
    const email = employeeData.email;
    const post = (url) => fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).then(r => r.json());

    Promise.all([
      post("/api/employee/rejected-assignments"),
      post("/api/employee/vacations"),
      post("/api/employee/pending-assignments"),
      post("/api/employee/confirmed-assignments"),
      post("/api/employee/total-payment"),
    ]).then(([rejected, vacList, pending, confirmed, totals]) => {
      setRejectedAssignments(rejected);
      setVacations(vacList);
      setPendingAssignments(pending);
      setConfirmedAssignments(confirmed);
      setPaymentTotals(totals);
    });

    // Load sent messages (excluding admin task entries)
    if (employeeData?.id) {
      fetch(`/api/admin/notes?employeeId=${employeeData.id}&messagesOnly=true`)
        .then(r => r.json())
        .then(d => setSentMessages(d.notes || []))
        .catch(() => {});
    }
  }, [employeeData]);

  const handleVacationSave = async () => {
    if (!vacationStart || !vacationEnd) return;
    const res = await fetch("/api/employee/save-vacation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: employeeData.email,
        start: vacationStart.toISOString(),
        end: vacationEnd.toISOString(),
      }),
    });
    if (res.ok) {
      setVacations(prev => [...prev, { start: vacationStart, end: vacationEnd, status: "Geplant" }]);
      setVacationStart(null);
      setVacationEnd(null);
    }
  };

  const handleAssignmentAction = async (assignmentId, action) => {
    const res = await fetch("/api/employee/confirm-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignmentId, action }),
    });
    if (res.ok) {
      const { assignment: updated } = await res.json();
      setPendingAssignments(prev => prev.filter(a => a.id !== assignmentId));
      if (action === "confirmed") setConfirmedAssignments(prev => [...prev, updated]);
      if (action === "rejected") setRejectedAssignments(prev => [...prev, updated]);
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#04436F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Lade Dashboard...</p>
        </div>
      </div>
    </EmployeeLayout>
  );

  if (!employeeData) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-500">Keine Daten gefunden.</p>
      </div>
    </EmployeeLayout>
  );

  const initials = `${employeeData.firstName?.[0] || ""}${employeeData.lastName?.[0] || ""}`.toUpperCase() || "M";

  // Aufgaben (missing data alerts)
  const aufgaben = [];
  if (!employeeData?.iban && !employeeData?.bankName) aufgaben.push("Bankdaten fehlen");
  if (!employeeData?.passportFile && !employeeData?.visaFile) aufgaben.push("Dokumente fehlen");
  if (!employeeData?.phone) aufgaben.push("Telefonnummer fehlt");

  const tabsWithCounts = [
    { id: "pending", label: "Ausstehend", count: pendingAssignments.length },
    { id: "confirmed", label: "Einsätze", count: confirmedAssignments.length },
    { id: "vacation", label: "Abwesenheiten", count: vacations.length },
    { id: "nachrichten", label: "Nachrichten", count: null },
    { id: "rejected", label: "Abgelehnt", count: rejectedAssignments.length },
  ];

  // Compute next upcoming shift from confirmed assignments
  const today = new Date();
  const allSchedules = confirmedAssignments.flatMap(a => {
    const client = a.user;
    return (client?.schedules || [])
      .filter(s => s.status !== "cancelled" && s.date && new Date(s.date) >= today)
      .map(s => ({
        date: new Date(s.date),
        startTime: s.startTime,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map(sv => sv.name).join(", ") || "—",
      }));
  });
  const nextShift = allSchedules.sort((a, b) => a.date - b.date)[0] || null;

  // Next approved vacation
  const nextVacation = vacations
    .filter(v => v.status === "approved" && new Date(v.start || v.startDate) >= today)
    .sort((a, b) => new Date(a.start || a.startDate) - new Date(b.start || b.startDate))[0] || null;

  const t = paymentTotals?.thisMonth;

  const statCards = [
    { label: "Ausstehend", value: pendingAssignments.length, border: "border-l-amber-400", tab: "pending" },
    { label: "Einsätze", value: confirmedAssignments.length, border: "border-l-emerald-400", tab: "confirmed" },
    { label: "Urlaub", value: vacations.length, border: "border-l-blue-400", tab: "vacation" },
  ];

  return (
    <EmployeeLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* Pending alert banner */}
        {pendingAssignments.length > 0 && !bannerDismissed && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
              <p className="text-sm text-amber-800 font-medium">
                {pendingAssignments.length === 1
                  ? "1 ausstehende Zuweisung wartet auf Ihre Antwort."
                  : `${pendingAssignments.length} ausstehende Zuweisungen warten auf Ihre Antwort.`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setActiveTab("pending")}
                className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-lg transition"
              >
                Jetzt ansehen
              </button>
              <button onClick={() => setBannerDismissed(true)} className="text-amber-500 hover:text-amber-700 transition p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Greeting + quick actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#04436F] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Hallo {employeeData.firstName} {employeeData.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {confirmedAssignments.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Sie sind aktuell eingeplant
                  </span>
                ) : pendingAssignments.length > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Anfrage offen - bitte reagieren
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Kein Einsatz geplant
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: "Profil", href: "/employee-info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
              { label: "Bankdaten", href: "/employee-bank", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
            ].map(({ label, href, icon }) => (
              <a key={href} href={href}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 transition">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                </svg>
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, border, tab }) => (
            <div
              key={label}
              onClick={() => tab && setActiveTab(tab)}
              className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} p-4 ${tab ? "cursor-pointer hover:shadow-sm transition" : ""}`}
            >
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Aufgaben (missing data) */}
        {aufgaben.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Offene Aufgaben</h3>
            <ul className="space-y-1.5">
              {aufgaben.map((task, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-red-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {task}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next shift + vacation row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Next shift */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Nächster Einsatz</p>
            {nextShift ? (
              <div className="space-y-1">
                <p className="font-semibold text-gray-900">{nextShift.clientName}</p>
                <p className="text-sm text-gray-500">{nextShift.service}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {nextShift.date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                  {nextShift.startTime && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {nextShift.startTime} Uhr
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Kein bevorstehender Einsatz</p>
            )}
          </div>

          {/* Next vacation */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Nächster Urlaub</p>
            {nextVacation ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="font-semibold text-gray-900">Genehmigt</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-2">
                  <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(nextVacation.start || nextVacation.startDate).toLocaleDateString("de-DE")}
                  {" – "}
                  {new Date(nextVacation.end || nextVacation.endDate).toLocaleDateString("de-DE")}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Kein genehmigter Urlaub</p>
                <button
                  onClick={() => setActiveTab("vacation")}
                  className="text-xs text-[#04436F] font-medium hover:underline"
                >
                  Urlaub anfragen →
                </button>
              </div>
            )}
          </div>
        </div>

          {/* Tab content card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Tab bar */}
            <div className="border-b border-gray-100 px-4 overflow-x-auto">
              <div className="flex min-w-max">
                {tabsWithCounts.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-[#04436F] text-[#04436F]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                        activeTab === tab.id ? "bg-[#04436F] text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {/* Ausstehend */}
              {activeTab === "pending" && (
                <div className="space-y-4">
                  {pendingAssignments.length === 0 ? (
                    <EmptyState message="Keine ausstehenden Zuweisungen" />
                  ) : (
                    pendingAssignments.map(a => (
                      <div key={a.id} className="border border-gray-200 rounded-xl p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-gray-900">Neuer Einsatz</p>
                            <p className="text-sm text-gray-500">{a.user?.services?.map(s => s.name).join(", ") || "—"}</p>
                          </div>
                          <span className="flex-shrink-0 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1">
                            Ausstehend
                          </span>
                        </div>

                        {/* Details button */}
                        <button
                          onClick={() => setDetailsOpen(detailsOpen === a.id ? null : a.id)}
                          className="text-xs font-medium text-[#04436F] hover:underline"
                        >
                          {detailsOpen === a.id ? "Details ausblenden" : "Details anzeigen"}
                        </button>

                        {/* Details panel (limited info - no client name/contact before accepting) */}
                        {detailsOpen === a.id && (
                          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-400 font-medium">Service</p>
                                <p className="text-gray-800">{a.user?.services?.map(s => s.name).join(", ") || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium">Subservice</p>
                                <p className="text-gray-800">{a.user?.subServices?.map(s => s.name).join(", ") || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium">PLZ</p>
                                <p className="text-gray-800">{a.user?.carePostalCode || a.user?.postalCode || "—"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 font-medium">Ort</p>
                                <p className="text-gray-800">{a.user?.careCity || "—"}</p>
                              </div>
                              {a.Schedule && (
                                <>
                                  <div>
                                    <p className="text-xs text-gray-400 font-medium">Datum</p>
                                    <p className="text-gray-800">{a.Schedule.date ? new Date(a.Schedule.date).toLocaleDateString("de-DE") : a.Schedule.day || "—"}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 font-medium">Uhrzeit</p>
                                    <p className="text-gray-800">{a.Schedule.startTime || "—"} Uhr</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 font-medium">Dauer</p>
                                    <p className="text-gray-800">{a.Schedule.hours || "—"} Std</p>
                                  </div>
                                </>
                              )}
                            </div>
                            {(a.user?.specialRequests || a.user?.mobility || a.user?.mobilityAids || a.user?.physicalState || a.user?.allergies || a.user?.allergyDetails || a.user?.mentalConditions || a.user?.mentalDiagnoses || a.user?.incontinence || a.user?.medicalFindings) && (
                              <div className="pt-2 border-t border-gray-200">
                                <p className="text-xs text-gray-400 font-medium mb-1">Fragebogen</p>
                                {a.user?.physicalState && <p className="text-xs text-gray-600">Zustand: {a.user.physicalState}</p>}
                                {a.user?.mobility && <p className="text-xs text-gray-600">Mobilität: {a.user.mobility}</p>}
                                {a.user?.mobilityAids && <p className="text-xs text-gray-600">Hilfsmittel: {a.user.mobilityAids}</p>}
                                {a.user?.allergies && <p className="text-xs text-gray-600">Allergien: {a.user.allergies}{a.user?.allergyDetails ? ` (${a.user.allergyDetails})` : ""}</p>}
                                {a.user?.incontinence && <p className="text-xs text-gray-600">Inkontinenz: {a.user.incontinence}</p>}
                                {a.user?.mentalConditions && <p className="text-xs text-gray-600">Psychisch: {a.user.mentalConditions}{a.user?.mentalDiagnoses ? ` (${a.user.mentalDiagnoses})` : ""}</p>}
                                {a.user?.medicalFindings && <p className="text-xs text-gray-600">Befunde: {a.user.medicalFindings}</p>}
                                {a.user?.specialRequests && <p className="text-xs text-gray-600">Hinweise: {a.user.specialRequests}</p>}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAssignmentAction(a.id, "confirmed")}
                            className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium transition"
                          >
                            Annehmen
                          </button>
                          <button
                            onClick={() => handleAssignmentAction(a.id, "rejected")}
                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition"
                          >
                            Ablehnen
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Einsätze */}
              {activeTab === "confirmed" && (
                <AssignmentsList confirmedAssignments={confirmedAssignments} />
              )}

              {/* Urlaub */}
              {activeTab === "vacation" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Startdatum</label>
                      <DatePicker
                        selected={vacationStart}
                        onChange={date => { setVacationStart(date); setVacationEnd(null); }}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Startdatum wählen"
                        minDate={new Date()}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Enddatum</label>
                      <DatePicker
                        selected={vacationEnd}
                        onChange={date => setVacationEnd(date)}
                        dateFormat="dd.MM.yyyy"
                        placeholderText="Enddatum wählen"
                        minDate={vacationStart || new Date()}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition"
                      />
                    </div>
                    <button
                      onClick={handleVacationSave}
                      disabled={!vacationStart || !vacationEnd}
                      className="py-2.5 bg-[#04436F] hover:bg-[#033558] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
                    >
                      Urlaubsanfrage senden
                    </button>
                  </div>

                  {vacations.length === 0 ? (
                    <EmptyState message="Kein Urlaub eingetragen" />
                  ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                      {vacations.map((v, i) => {
                        const start = new Date(v.start || v.startDate).toLocaleDateString("de-DE");
                        const end = new Date(v.end || v.endDate).toLocaleDateString("de-DE");
                        const isApproved = v.status === "approved";
                        const isDeclined = v.status === "declined";
                        const statusLabel = isApproved ? "Genehmigt" : isDeclined ? "Abgelehnt" : "Angefragt";
                        const statusCls = isApproved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isDeclined
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "bg-amber-50 text-amber-700 border-amber-200";
                        return (
                          <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                            <p className="text-sm text-gray-700">{start} – {end}</p>
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusCls}`}>{statusLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Abgelehnt */}
              {activeTab === "rejected" && (
                <div className="space-y-3">
                  {rejectedAssignments.length === 0 ? (
                    <EmptyState message="Keine abgelehnten Zuweisungen" />
                  ) : (
                    rejectedAssignments.map(a => (
                      <div key={a.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{a.user.firstName} {a.user.lastName}</p>
                          <p className="text-xs text-gray-500">{a.user.email}</p>
                        </div>
                        <span className="text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-1">Abgelehnt</span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Nachrichten Tab */}
              {activeTab === "nachrichten" && (
                <div className="max-w-lg space-y-5">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Kategorie wählen:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Nachricht an PHC", "Rückmeldung zu Einsätzen", "Probleme / Hinweise melden"].map(type => (
                        <button key={type} type="button" onClick={() => setNachrichtType(type)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${nachrichtType === type ? "bg-[#04436F] text-white border-[#04436F]" : "bg-white text-gray-600 border-gray-200"}`}>
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={nachrichtText} onChange={e => setNachrichtText(e.target.value)}
                    placeholder="Ihre Nachricht..." rows={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 resize-none" />
                  <button
                    disabled={nachrichtSending || !nachrichtText.trim()}
                    onClick={async () => {
                      setNachrichtSending(true); setNachrichtFeedback(null);
                      try {
                        const res = await fetch("/api/admin/notes", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ employeeId: employeeData.id, text: `[${nachrichtType}] ${nachrichtText}`, author: `${employeeData.firstName} ${employeeData.lastName}` }),
                        });
                        if (res.ok) {
                          const note = await res.json();
                          setNachrichtFeedback({ type: "success", text: "Nachricht gesendet." });
                          setNachrichtText("");
                          setSentMessages(prev => [note, ...prev]);
                        }
                        else setNachrichtFeedback({ type: "error", text: "Fehler beim Senden." });
                      } catch { setNachrichtFeedback({ type: "error", text: "Netzwerkfehler." }); }
                      finally { setNachrichtSending(false); }
                    }}
                    className="w-full py-3 bg-[#04436F] text-white rounded-xl text-sm font-medium hover:bg-[#033558] transition disabled:opacity-50">
                    {nachrichtSending ? "Wird gesendet..." : "Nachricht senden"}
                  </button>
                  {nachrichtFeedback && (
                    <div className={`p-3 rounded-xl text-sm ${nachrichtFeedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {nachrichtFeedback.text}
                    </div>
                  )}

                  {/* Conversation: own messages + admin replies */}
                  {sentMessages.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Nachrichten</p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {sentMessages.map(m => {
                          const isAdmin = m.author === "Admin";
                          return (
                            <div key={m.id} className={`border rounded-lg p-3 ${isAdmin ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-100"}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${isAdmin ? "text-blue-700" : "text-gray-500"}`}>{isAdmin ? "PHC Team" : m.author}</span>
                                <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                              <p className="text-sm text-gray-800">{m.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

      </div>
    </EmployeeLayout>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}
