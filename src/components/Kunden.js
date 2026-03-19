import { useEffect, useState } from "react";
import ClientTable from "../components/ClientTable";
import AppointmentCalendar from "../components/AppointmentCalendar";
import ActiveClients from "../components/ActiveClients";

export default function AdminKundenPage() {
  const [clients, setClients] = useState([]);
  const [vacations, setVacations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [editSchedule, setEditSchedule] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [cancelQuestion, setCancelQuestion] = useState(null);
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setClients(data.clients || []);
      } catch {}
    }
    fetchClients();
  }, []);

  useEffect(() => {
    async function fetchVacations() {
      try {
        const res = await fetch("/api/admin/vacations");
        const data = await res.json();
        if (Array.isArray(data)) setVacations(data);
        else if (Array.isArray(data.vacations)) setVacations(data.vacations);
        else setVacations([]);
      } catch { setVacations([]); }
    }
    fetchVacations();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setAllServices(Array.isArray(data) ? data : []);
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
      } catch { setSchedules([]); }
    }
    fetchSchedules();
  }, []);

  async function saveEditedSchedule() {
    const res = await fetch(`/api/admin/schedules/${editSchedule.id}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editSchedule),
    });
    const newSchedule = await res.json();
    setSchedules(prev => [newSchedule, ...prev.map(s => s.id === editSchedule.id ? { ...s, status: "cancelled" } : s)]);
    setEditSchedule(null);
  }

  async function handleCancelWithEmail(schedule, cancelledBy) {
    try {
      await fetch(`/api/admin/schedules/${schedule.id}/cancel?cancelledBy=${cancelledBy}`, { method: "PATCH" });
      setCancelQuestion(null);
      setSchedules(prev => prev.map(s => s.id === schedule.id ? { ...s, status: "cancelled" } : s));
    } catch {}
  }

  const filteredSchedules = schedules.filter((s) => {
    const d = new Date(s.date);
    const now = new Date();
    if (filter === "today") return d.toDateString() === now.toDateString();
    if (filter === "thisWeek") {
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 7);
      return d >= weekStart && d < weekEnd;
    }
    if (filter === "thisMonth") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (filter === "nextMonth") return d.getMonth() === now.getMonth() + 1 && d.getFullYear() === now.getFullYear();
    return true;
  });

  const filterBtns = [
    { id: "today", label: "Heute" },
    { id: "thisWeek", label: "Diese Woche" },
    { id: "thisMonth", label: "Diesen Monat" },
    { id: "nextMonth", label: "Nächsten Monat" },
  ];

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Kunden Verwaltung</h1>
        <p className="text-sm text-gray-500 mt-0.5">Übersicht über Kunden, Urlaubsanfragen, Buchungen und Aktivitäten</p>
      </div>

      {/* Top grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Aktive Kunden */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Aktive Kunden</h2>
          <ActiveClients clients={clients} />
        </div>

        {/* Urlaub Anträge */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Urlaub Anträge</h2>
          {vacations?.length > 0 ? (
            <ul className="space-y-3 max-h-[400px] overflow-auto pr-1">
              {vacations.filter((v) => v.user).map((v) => (
                <li key={v.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                  <p className="font-medium text-gray-900 text-sm">{v.user.firstName} {v.user.lastName}</p>
                  <p className="text-xs text-gray-500 mt-0.5 mb-3">
                    {new Date(v.startDate).toLocaleDateString("de-DE")} → {new Date(v.endDate).toLocaleDateString("de-DE")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {v.user?.phone && (
                      <button
                        onClick={() => window.open(`tel:${v.user.phone}`)}
                        className="px-2.5 py-1 text-xs font-medium bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition"
                      >
                        Anruf
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Keine Urlaubsanträge</p>
          )}
        </div>

        {/* Termine */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Termine</h2>
          <AppointmentCalendar schedules={schedules} />
        </div>

        {/* Buchungen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Buchungen</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {filterBtns.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                  ${filter === id ? "bg-[#0F1F38] text-white border-[#0F1F38]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {schedules.length > 0 ? (
            <ul className="max-h-[400px] overflow-auto pr-1 space-y-2">
              {filteredSchedules.slice(0, 20).map((s) => (
                <li key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex-1">
                    <p onClick={() => window.open(`/admin/clients/${s.user?.id}`, "_blank")} className="font-medium text-gray-900 text-sm hover:text-[#0F1F38] hover:underline cursor-pointer">
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
                    <button onClick={() => setSelectedSchedule(s)} className="px-2.5 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-md hover:bg-amber-100 transition">
                      Stornieren
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">Keine Buchungen verfügbar</p>
          )}
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Kundenübersicht</h2>
        <ClientTable clients={clients} />
      </div>

      {/* Stornieren modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-2">Was möchten Sie tun?</h3>
            <p className="text-sm text-gray-600 mb-5">Möchten Sie diesen Termin stornieren oder einen neuen Termin erstellen?</p>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition" onClick={() => { setCancelQuestion(selectedSchedule); setSelectedSchedule(null); }}>Stornieren</button>
              <button className="flex-1 px-4 py-2 text-sm bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition" onClick={() => { setSelectedSchedule(null); setEditSchedule({ ...selectedSchedule, createNew: true }); }}>Neu erstellen</button>
            </div>
            <button className="mt-3 w-full py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setSelectedSchedule(null)}>Abbrechen</button>
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
              <button onClick={saveEditedSchedule} className="flex-1 py-2 text-sm bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition">Speichern</button>
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
              <button className="flex-1 py-2 text-sm bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition" onClick={() => handleCancelWithEmail(cancelQuestion, "kunde")}>Kunde</button>
              <button className="flex-1 py-2 text-sm bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition" onClick={() => handleCancelWithEmail(cancelQuestion, "employee")}>Mitarbeiter</button>
            </div>
            <button className="mt-3 w-full py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setCancelQuestion(null)}>Abbrechen</button>
          </div>
        </div>
      )}
    </div>
  );
}
