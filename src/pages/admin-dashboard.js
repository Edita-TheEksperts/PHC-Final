import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../components/AdminLayout";

function DashboardSection({ title, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {count !== undefined && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#04436F] text-white">
              {count}
            </span>
          )}
        </div>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function StatusBadge({ status, map }) {
  const cfg = map[status] || { label: status, color: "bg-gray-50 text-gray-600 border-gray-200" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function EmptyRow({ text }) {
  return <p className="px-5 py-8 text-sm text-gray-400 text-center">{text}</p>;
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return diff;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("de-CH", { weekday: "short", day: "2-digit", month: "2-digit" });
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ buchungenSort: "newest", bewerbungenDays: "" });
  const [dueTasks, setDueTasks] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }
    fetchDashboard();
    fetchDueTasks();
    fetchUnreadMessages();
  }, []);

  async function fetchDueTasks() {
    try {
      const res = await fetch("/api/admin/due-tasks");
      const json = await res.json();
      setDueTasks(json.tasks || []);
    } catch {
      setDueTasks([]);
    }
  }

  async function fetchUnreadMessages() {
    try {
      const res = await fetch("/api/admin/unread-messages");
      const json = await res.json();
      setUnreadMessages(json.messages || []);
    } catch {
      setUnreadMessages([]);
    }
  }

  async function markMessageRead(id) {
    try {
      await fetch("/api/admin/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, readByAdmin: true }),
      });
      setUnreadMessages(prev => prev.filter(m => m.id !== id));
    } catch {}
  }

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/admin/dashboard-overview");
      const json = await res.json();
      // Even on error, API returns fallback data
      setData(json);
    } catch {
      // Network error — set empty defaults
      setData({
        neueBuchungen: [], offeneBewerbungen: [], aktiveEinsaetze: [],
        offeneZuweisungen: [], ausstehend: [], interviews: [], offeneAbwesenheiten: [],
        stats: { totalClients: 0, totalEmployees: 0, pendingEmployees: 0, approvedEmployees: 0 },
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04436F]" />
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">Daten konnten nicht geladen werden.</div>
      </AdminLayout>
    );
  }

  const neueBuchungen = data.neueBuchungen || [];
  const offeneBewerbungen = data.offeneBewerbungen || [];
  const aktiveEinsaetze = data.aktiveEinsaetze || [];
  const offeneZuweisungen = data.offeneZuweisungen || [];
  const ausstehend = data.ausstehend || [];
  const interviews = data.interviews || [];
  const offeneAbwesenheiten = data.offeneAbwesenheiten || [];
  const stats = data.stats || { totalClients: 0, totalEmployees: 0, pendingEmployees: 0, approvedEmployees: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const einsaetzeHeute = aktiveEinsaetze.filter(s => {
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
  const einsaetzeDieseWoche = aktiveEinsaetze.filter(s => {
    const d = new Date(s.date);
    return d >= today && d <= weekEnd;
  });

  // Buchungen sorted
  const sortedBuchungen = [...neueBuchungen].sort((a, b) => {
    if (filter.buchungenSort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Bewerbungen filtered by age
  const filteredBewerbungen = offeneBewerbungen.filter(e => {
    if (!filter.bewerbungenDays) return true;
    const days = daysSince(e.createdAt);
    return days >= parseInt(filter.bewerbungenDays);
  });

  const assignmentStatusMap = {
    pending: { label: "Offen", color: "bg-amber-50 text-amber-700 border-amber-200" },
    active: { label: "Aktiv", color: "bg-blue-50 text-blue-700 border-blue-200" },
    completed: { label: "Abgeschlossen", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Abgelehnt", color: "bg-red-50 text-red-700 border-red-200" },
  };

  const empStatusMap = {
    pending: { label: "Neu", color: "bg-amber-50 text-amber-700 border-amber-200" },
    invited: { label: "Eingeladen", color: "bg-blue-50 text-blue-700 border-blue-200" },
    approved: { label: "Genehmigt", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { label: "Abgelehnt", color: "bg-red-50 text-red-700 border-red-200" },
  };

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Header + Stats */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Übersicht aller offenen Vorgänge</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Kunden</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Mitarbeiter</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.approvedEmployees}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Offene Bewerbungen</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingEmployees}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Einsätze heute</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{einsaetzeHeute.length}</p>
          </div>
        </div>

        {/* Neue Nachrichten (unread from clients/employees) */}
        {unreadMessages.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Neue Nachrichten ({unreadMessages.length})
            </h3>
            <div className="space-y-2">
              {unreadMessages.map(m => (
                <div key={m.id} className="flex items-center justify-between bg-white border border-blue-100 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{m.text}</p>
                    <p className="text-xs text-gray-400">
                      {m.userName || m.employeeName || m.author || "—"} · {new Date(m.createdAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      markMessageRead(m.id);
                      if (m.userId) router.push(`/admin/clients/${m.userId}#notes`);
                      else if (m.employeeId) router.push(`/admin/employees/${m.employeeId}#notes`);
                    }}
                    className="ml-3 text-xs font-medium text-[#04436F] hover:underline flex-shrink-0"
                  >
                    Anzeigen →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offene Aufgaben (due tasks from notes) */}
        {dueTasks.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Fällige Aufgaben ({dueTasks.length})
            </h3>
            <div className="space-y-2">
              {dueTasks.map(t => (
                <div key={t.id} className="flex items-center justify-between bg-white border border-amber-100 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 truncate">{t.text}</p>
                    <p className="text-xs text-gray-400">
                      {t.userName || t.employeeName || "—"} · Fällig: {new Date(t.dueDate).toLocaleDateString("de-CH")}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (t.userId) router.push(`/admin/clients/${t.userId}`);
                      else if (t.employeeId) router.push(`/admin/employees/${t.employeeId}`);
                    }}
                    className="ml-3 text-xs font-medium text-[#04436F] hover:underline flex-shrink-0"
                  >
                    Anzeigen →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. Neue Buchungen */}
        <DashboardSection title="Neue Buchungen" count={sortedBuchungen.length}>
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <select
              value={filter.buchungenSort}
              onChange={e => setFilter(p => ({ ...p, buchungenSort: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
            >
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
          <div className="divide-y divide-gray-50">
            {sortedBuchungen.length === 0 ? <EmptyRow text="Keine neuen Buchungen" /> :
              sortedBuchungen.slice(0, 15).map(c => {
                const days = daysSince(c.createdAt);
                const hasAssignment = c.assignments?.some(a => a.employeeId);
                return (
                  <div key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {c.kanton || c.careCity || "—"} · Einsatzbeginn: {formatDate(c.firstDate)} · Seit {days} Tagen offen
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!hasAssignment ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">Keine Zuweisung</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">Zugewiesen</span>
                      )}
                      <button
                        onClick={() => router.push(`/admin/clients/${c.id}`)}
                        className="px-2.5 py-1 bg-[#04436F] text-white rounded-md text-xs font-medium hover:bg-[#033558] transition"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </DashboardSection>

        {/* 2. Offene Bewerbungen */}
        <DashboardSection title="Offene Bewerbungen" count={filteredBewerbungen.length}>
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <select
              value={filter.bewerbungenDays}
              onChange={e => setFilter(p => ({ ...p, bewerbungenDays: e.target.value }))}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5"
            >
              <option value="">Alle</option>
              <option value="3">Älter als 3 Tage</option>
              <option value="7">Älter als 7 Tage</option>
              <option value="14">Älter als 14 Tage</option>
            </select>
          </div>
          <div className="divide-y divide-gray-50">
            {filteredBewerbungen.length === 0 ? <EmptyRow text="Keine offenen Bewerbungen" /> :
              filteredBewerbungen.slice(0, 15).map(e => (
                <div key={e.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{e.firstName} {e.lastName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(e.createdAt)} · {e.city || e.canton || "—"} · {(e.servicesOffered || []).slice(0, 2).join(", ") || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={e.status} map={empStatusMap} />
                    <button
                      onClick={() => router.push(`/admin/employees/${e.id}`)}
                      className="px-2.5 py-1 bg-[#04436F] text-white rounded-md text-xs font-medium hover:bg-[#033558] transition"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </DashboardSection>

        {/* 3. Aktive / bevorstehende Einsätze */}
        <DashboardSection title="Aktive & bevorstehende Einsätze" count={einsaetzeDieseWoche.length}>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* Heute */}
            <div>
              <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Heute laufend ({einsaetzeHeute.length})</p>
              </div>
              <div className="divide-y divide-gray-50">
                {einsaetzeHeute.length === 0 ? <EmptyRow text="Keine Einsätze heute" /> :
                  einsaetzeHeute.map(s => (
                    <div key={s.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {s.user ? `${s.user.firstName} ${s.user.lastName}` : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {s.startTime || "—"} · {s.hours ? `${s.hours}h` : ""} · {s.employee ? `${s.employee.firstName} ${s.employee.lastName}` : "Kein Mitarbeiter"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            {/* Diese Woche */}
            <div>
              <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Diese Woche startend ({einsaetzeDieseWoche.length})</p>
              </div>
              <div className="divide-y divide-gray-50">
                {einsaetzeDieseWoche.length === 0 ? <EmptyRow text="Keine Einsätze diese Woche" /> :
                  einsaetzeDieseWoche.slice(0, 8).map(s => (
                    <div key={s.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {s.user ? `${s.user.firstName} ${s.user.lastName}` : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateShort(s.date)} · {s.startTime || ""} · {s.employee ? `${s.employee.firstName} ${s.employee.lastName}` : "Kein MA"}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </DashboardSection>

        {/* 4. Offene Zuweisungen */}
        <DashboardSection title="Offene Zuweisungen" count={offeneZuweisungen.length}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Mitarbeiter</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Ersatz nötig?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {offeneZuweisungen.length === 0 ? (
                  <tr><td colSpan={4}><EmptyRow text="Keine offenen Zuweisungen" /></td></tr>
                ) : offeneZuweisungen.slice(0, 15).map(a => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium text-gray-900">{a.user ? `${a.user.firstName} ${a.user.lastName}` : "—"}</td>
                    <td className="px-5 py-3 text-gray-600">{a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : <span className="text-amber-600 font-medium">Nicht zugewiesen</span>}</td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} map={assignmentStatusMap} /></td>
                    <td className="px-5 py-3">{!a.employee ? <span className="text-red-600 font-medium text-xs">Ja</span> : <span className="text-gray-400 text-xs">Nein</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardSection>

        {/* 5. Ausstehende Entscheidungen von Bewerbern */}
        <DashboardSection title="Ausstehende Entscheidungen von Bewerbern" count={ausstehend.length}>
          <div className="divide-y divide-gray-50">
            {ausstehend.length === 0 ? <EmptyRow text="Keine ausstehenden Entscheidungen" /> :
              ausstehend.map(a => {
                const days = daysSince(a.createdAt);
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "—"}
                        <span className="text-gray-400 mx-2">→</span>
                        {a.user ? `${a.user.firstName} ${a.user.lastName}` : "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Gesendet vor {days} Tagen · Status: Zusage ausstehend
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {days > 2 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${days > 3 ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                          {days > 3 ? "Überfällig" : "Frist läuft ab"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </DashboardSection>

        {/* 6. Bevorstehende Interviews */}
        <DashboardSection title="Bevorstehende Interviews" count={interviews.length} defaultOpen={interviews.length > 0}>
          <div className="divide-y divide-gray-50">
            {interviews.length === 0 ? <EmptyRow text="Keine bevorstehenden Interviews" /> :
              interviews.map(e => (
                <div key={e.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.firstName} {e.lastName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Eingeladen am: {formatDate(e.inviteSentAt)} · Rolle: Bewerber
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-medium">
                      Offen
                    </span>
                    <button
                      onClick={() => router.push(`/admin/employees/${e.id}`)}
                      className="px-2.5 py-1 bg-[#04436F] text-white rounded-md text-xs font-medium hover:bg-[#033558] transition"
                    >
                      Profil
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </DashboardSection>

        {/* 7. Offene Krank- oder Ferienmeldungen */}
        <DashboardSection title="Offene Krank- oder Ferienmeldungen" count={offeneAbwesenheiten.length} defaultOpen={offeneAbwesenheiten.length > 0}>
          <div className="divide-y divide-gray-50">
            {offeneAbwesenheiten.length === 0 ? <EmptyRow text="Keine offenen Meldungen" /> :
              offeneAbwesenheiten.map(v => {
                const person = v.employee || v.user;
                const name = person ? `${person.firstName} ${person.lastName}` : "—";
                return (
                  <div key={v.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(v.startDate)} – {formatDate(v.endDate)} · Ferien
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium">
                        Ausstehend
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </DashboardSection>

        {/* Quick Export Links */}
        <div className="flex flex-wrap gap-2 pt-2">
          <a href="/api/admin/export/clients" download className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Kunden CSV
          </a>
          <a href="/api/admin/export/employees" download className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Mitarbeiter CSV
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
