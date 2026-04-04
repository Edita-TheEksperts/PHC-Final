import { useState, useEffect } from "react";
import EmployeesOnAssignment from "../components/EmployeesOnAssignment";
import AppointmentCalendar from "../components/AppointmentCalendar";
import EmployeeTable from "../components/EmployeeTable";

export default function MitarbeiterVerwaltungPage() {
  const [employees, setEmployees] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editSchedule, setEditSchedule] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [cancelQuestion, setCancelQuestion] = useState(null);
  const employeeVacations = vacations.filter((v) => v.employee);
  const [bookingFilter, setBookingFilter] = useState("");

  async function fetchVacations() {
    try {
      const res = await fetch("/api/admin/vacations");
      const data = await res.json();
      if (Array.isArray(data)) setVacations(data);
      else if (Array.isArray(data.vacations)) setVacations(data.vacations);
      else setVacations([]);
    } catch {
      setVacations([]);
    }
  }

  function matchesBookingFilter(schedule) {
    if (!bookingFilter) return true;
    if (!schedule.date) return false;
    const date = new Date(schedule.date);
    const today = new Date();
    if (bookingFilter === "today") return date.toDateString() === today.toDateString();
    if (bookingFilter === "week") {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      return date >= start && date < end;
    }
    if (bookingFilter === "month") {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }
    if (bookingFilter === "next_month") {
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);
      return date.getMonth() === nextMonth.getMonth() && date.getFullYear() === nextMonth.getFullYear();
    }
    return true;
  }

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      const allEmployees = data.employees || [];
      setEmployees(allEmployees);
      setApprovedEmployees(allEmployees.filter((emp) => emp.status === "approved"));
      setClients(data.clients || []);
      setSchedules(data.schedules || []);
    } catch {
      setEmployees([]); setApprovedEmployees([]); setClients([]); setSchedules([]);
    }
  }

  useEffect(() => {
    fetchData();
    fetchVacations();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/admin/services");
        const data = await res.json();
        setAllServices(Array.isArray(data) ? data : []);
      } catch { setAllServices([]); }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSchedules(data.schedules || []);
      } catch {
        setSchedules([]);
      }
    }
    fetchSchedules();
  }, []);

  async function saveEditedSchedule() {
    try {
      const res = await fetch(`/api/admin/schedules/${editSchedule.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSchedule),
      });
      const newSchedule = await res.json();
      setSchedules(prev => [newSchedule, ...prev.map(s => s.id === editSchedule.id ? { ...s, status: "cancelled" } : s)]);
      setEditSchedule(null);
    } catch { alert("Fehler beim Speichern."); }
  }

  async function handleCancelWithEmail(schedule, cancelledBy) {
    try {
      await fetch(`/api/admin/schedules/${schedule.id}/cancel?cancelledBy=${cancelledBy}`, { method: "PATCH" });
      setCancelQuestion(null);
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, status: "cancelled" } : s));
    } catch {}
  }

  async function handleApproval(emp) {
    try {
      const response = await fetch("/api/approve-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      const data = await response.json();
      if (!response.ok) { alert(`Fehler bei der Genehmigung: ${data.message || "Unbekannter Fehler"}`); return; }
      alert(`✅ ${emp.firstName} ${emp.lastName} wurde genehmigt und die E-Mail wurde gesendet.`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "approved" } : e));
    } catch (error) { alert(`Fehler beim Genehmigen: ${error.message}`); }
  }

  async function handleRejection(emp) {
    try {
      const response = await fetch("/api/reject-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      const data = await response.json();
      if (!response.ok) { alert(`Fehler bei der Ablehnung: ${data.message || "Unbekannter Fehler"}`); return; }
      alert(`✅ ${emp.firstName} ${emp.lastName} wurde abgelehnt und die E-Mail wurde gesendet.`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "rejected" } : e));
    } catch (error) { alert(`Fehler beim Ablehnen: ${error.message}`); }
  }

  async function handleInvite(emp) {
    try {
      await fetch("/api/invite-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email, firstName: emp.firstName }) });
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, invited: true } : e));
    } catch { alert("Fehler beim Einladen."); }
  }

  const filterBtns = [
    { id: "today", label: "Heute" },
    { id: "week", label: "Diese Woche" },
    { id: "month", label: "Dieser Monat" },
    { id: "next_month", label: "Nächster Monat" },
  ];

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Mitarbeiter Verwaltung</h1>
        <p className="text-sm text-gray-500 mt-0.5">Übersicht über Mitarbeiter, Einsätze und Termine</p>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Urlaub Anträge */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col max-h-[680px]">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Urlaub Anträge</h2>
          {employeeVacations.length > 0 ? (
            <ul className="space-y-3 overflow-auto flex-grow pr-1">
              {employeeVacations.map((v) => (
                <li key={v.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-900 text-sm">
                    {v.employee?.firstName} {v.employee?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 mb-3">
                    {new Date(v.startDate).toLocaleDateString("de-DE")} → {new Date(v.endDate).toLocaleDateString("de-DE")}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {v.employee?.phone && (
                      <button
                        onClick={() => window.open(`tel:${v.employee.phone}`)}
                        className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition"
                      >
                        Anruf
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        const res = await fetch(`/api/admin/vacations/suggestions?vacationId=${v.id}`);
                        const data = await res.json();
                        v.suggestions = data;
                        setVacations([...vacations]);
                      }}
                      className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition"
                    >
                      Vorschläge
                    </button>
                    {v.status === "pending" && (
                      <>
                        <button
                          onClick={async () => {
                            await fetch("/api/employee/update-vacation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vacationId: v.id, action: "approve" }) });
                            setVacations(prev => prev.map(x => x.id === v.id ? { ...x, status: "approved" } : x));
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 hover:bg-emerald-100 transition"
                        >
                          Genehmigen
                        </button>
                        <button
                          onClick={async () => {
                            await fetch("/api/employee/update-vacation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vacationId: v.id, action: "decline" }) });
                            setVacations(prev => prev.map(x => x.id === v.id ? { ...x, status: "declined" } : x));
                          }}
                          className="px-2.5 py-1 text-xs font-medium bg-red-50 border border-red-200 rounded-md text-red-700 hover:bg-red-100 transition"
                        >
                          Ablehnen
                        </button>
                      </>
                    )}
                  </div>

                  {v.suggestions && v.suggestions.length > 0 && (
                    <div className="bg-white border border-gray-200 p-2 rounded-lg text-xs mt-2">
                      <p className="font-medium text-gray-700 mb-1">Alternativen:</p>
                      <ul className="space-y-2">
                        {v.suggestions.map((s, i) => (
                          <li key={i} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-100 rounded-lg">
                            <div>
                              <p>{new Date(s.startDate).toLocaleDateString("de-DE")} → {new Date(s.endDate).toLocaleDateString("de-DE")}</p>
                              <p className="font-medium">{s.employee.firstName} {s.employee.lastName}</p>
                            </div>
                            <div className="flex gap-1.5">
                              {s.employee.phone && (
                                <button onClick={() => window.open(`tel:${s.employee.phone}`)} className="px-2 py-1 text-[10px] bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50">
                                  Anruf
                                </button>
                              )}
                              <button
                                onClick={async () => {
                                  await fetch("/api/admin/vacation/assign", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vacationId: v.id, newEmployeeId: s.employee.id }) });
                                  setVacations(prev => prev.map(x => x.id === v.id ? { ...x, employee: s.employee } : x));
                                  alert("Mitarbeiter zugewiesen!");
                                }}
                                className="px-2 py-1 text-[10px] bg-[#04436F] text-white rounded hover:bg-[#033558]"
                              >
                                Zuweisen
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full border font-medium
                    ${v.status === "approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : v.status === "declined" ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                    {v.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Keine Urlaubsanträge</p>
          )}
        </div>

        {/* Buchungen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Buchungen</h2>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {filterBtns.map(btn => (
              <button
                key={btn.id}
                onClick={() => setBookingFilter(bookingFilter === btn.id ? "" : btn.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                  ${bookingFilter === btn.id
                    ? "bg-[#04436F] text-white border-[#04436F]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <ul className="max-h-[550px] overflow-auto pr-1 space-y-2">
            {schedules.filter(matchesBookingFilter).slice(0, 10).map((s) => (
              <li key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <p
                    onClick={() => window.open(`/admin/clients/${s.user?.id}`, "_blank")}
                    className="font-medium text-gray-900 text-sm hover:text-[#04436F] hover:underline cursor-pointer"
                  >
                    {s.user ? `${s.user.firstName} ${s.user.lastName}` : "— Kein Kunde —"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.serviceName || s.subServiceName || "Service"} · {s.date ? new Date(s.date).toLocaleDateString("de-DE") : `${s.day || ""} ${s.startTime || ""}`}
                  </p>
                  {s.employee && <p className="text-xs text-gray-400 mt-0.5">{s.employee.firstName} {s.employee.lastName}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full border font-medium
                    ${s.status === "active" ? "bg-blue-50 text-blue-700 border-blue-200"
                      : s.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : s.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {s.status || "pending"}
                  </span>
                  <button
                    onClick={() => setSelectedSchedule(s)}
                    className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition"
                  >
                    Stornieren
                  </button>
                </div>
              </li>
            ))}
            {schedules.filter(matchesBookingFilter).length === 0 && (
              <p className="text-sm text-gray-400 italic py-4">Keine Buchungen</p>
            )}
          </ul>
        </div>

        {/* Termine */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Termine</h2>
          <AppointmentCalendar schedules={schedules} />
        </div>

        {/* Mitarbeiter Zuweisung */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <EmployeesOnAssignment employees={employees} />
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <EmployeeTable employees={employees} onApprove={handleApproval} onReject={handleRejection} onInvite={handleInvite} />
      </div>

      {/* Stornieren modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Was möchten Sie tun?</h3>
            <p className="text-sm text-gray-600 mb-5">Möchten Sie diesen Termin stornieren oder einen neuen Termin erstellen?</p>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition"
                onClick={() => { setCancelQuestion(selectedSchedule); setSelectedSchedule(null); }}
              >
                Stornieren
              </button>
              <button
                className="flex-1 px-4 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition"
                onClick={() => { setSelectedSchedule(null); setEditSchedule({ ...selectedSchedule, createNew: true }); }}
              >
                Neu erstellen
              </button>
            </div>
            <button className="mt-3 w-full py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setSelectedSchedule(null)}>
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editSchedule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Termin bearbeiten</h3>
            <div className="space-y-3">
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="date" value={editSchedule.date?.split("T")[0] || ""} onChange={(e) => setEditSchedule({ ...editSchedule, date: e.target.value })} />
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="time" value={editSchedule.startTime || ""} onChange={(e) => setEditSchedule({ ...editSchedule, startTime: e.target.value })} />
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="number" placeholder="Stunden" value={editSchedule.hours || ""} onChange={(e) => setEditSchedule({ ...editSchedule, hours: e.target.value })} />
              <select className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" value={editSchedule.serviceName || ""} onChange={(e) => setEditSchedule({ ...editSchedule, serviceName: e.target.value, subServiceName: "" })}>
                <option value="">Service auswählen</option>
                {allServices.map((service) => <option key={service.id} value={service.name}>{service.name}</option>)}
              </select>
              <select className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" value={editSchedule.subServiceName || ""} onChange={(e) => setEditSchedule({ ...editSchedule, subServiceName: e.target.value })}>
                <option value="">Unterdienst auswählen</option>
                {allServices.find((s) => s.name === editSchedule.serviceName)?.subServices?.map((sub) => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditSchedule(null)} className="flex-1 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition">Abbrechen</button>
              <button onClick={saveEditedSchedule} className="flex-1 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition">Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel question modal */}
      {cancelQuestion && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Wer storniert diesen Termin?</h3>
            <p className="text-sm text-gray-600 mb-5">Bitte wählen Sie, wer die Stornierung durchführt.</p>
            <div className="flex gap-3">
              <button className="flex-1 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition" onClick={() => handleCancelWithEmail(cancelQuestion, "kunde")}>Kunde</button>
              <button className="flex-1 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition" onClick={() => handleCancelWithEmail(cancelQuestion, "employee")}>Mitarbeiter</button>
            </div>
            <button className="mt-3 w-full py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setCancelQuestion(null)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
