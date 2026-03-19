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
  const router = useRouter();

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
          <div className="w-8 h-8 border-2 border-[#0F1F38] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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

  const tabsWithCounts = [
    { id: "pending", label: "Ausstehend", count: pendingAssignments.length },
    { id: "confirmed", label: "Einsätze", count: confirmedAssignments.length },
    { id: "vacation", label: "Urlaub", count: vacations.length },
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
    { label: "Verdienst (Monat)", value: t ? `CHF ${t.total ?? 0}` : "—", border: "border-l-purple-400", tab: null },
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
            <div className="w-12 h-12 rounded-full bg-[#0F1F38] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Willkommen, {employeeData.firstName} {employeeData.lastName}
              </h1>
              <p className="text-sm text-gray-500">Mitarbeiter Dashboard</p>
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
                  className="text-xs text-[#0F1F38] font-medium hover:underline"
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
                        ? "border-[#0F1F38] text-[#0F1F38]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${
                        activeTab === tab.id ? "bg-[#0F1F38] text-white" : "bg-gray-100 text-gray-600"
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
                            <p className="font-semibold text-gray-900">{a.user.firstName} {a.user.lastName}</p>
                            <p className="text-sm text-gray-500">{a.user.email}</p>
                          </div>
                          <span className="flex-shrink-0 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1">
                            Ausstehend
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18a9 9 0 100-18 9 9 0 000 18z" />
                          </svg>
                          <p className="text-xs text-blue-700">Beim Kunden muss evtl. auch bei der Körperpflege geholfen werden.</p>
                        </div>
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
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
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
                      />
                    </div>
                    <button
                      onClick={handleVacationSave}
                      disabled={!vacationStart || !vacationEnd}
                      className="py-2.5 bg-[#0F1F38] hover:bg-[#1a3050] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
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
