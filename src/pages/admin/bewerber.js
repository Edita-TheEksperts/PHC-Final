import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useRouter } from "next/router";

function daysSince(dateStr) {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const STATUS_CONFIG = {
  pending:       { label: "Neu",                    color: "bg-amber-50 text-amber-700 border-amber-200", order: 1 },
  geprueft:      { label: "Geprüft",                color: "bg-cyan-50 text-cyan-700 border-cyan-200", order: 2 },
  invited:       { label: "Eingeladen",              color: "bg-blue-50 text-blue-700 border-blue-200", order: 3 },
  interview:     { label: "Interview durchgeführt",  color: "bg-indigo-50 text-indigo-700 border-indigo-200", order: 4 },
  entscheid:     { label: "Entscheid offen",         color: "bg-purple-50 text-purple-700 border-purple-200", order: 5 },
  approved:      { label: "Genehmigt",               color: "bg-emerald-50 text-emerald-700 border-emerald-200", order: 6 },
  rejected:      { label: "Abgelehnt",               color: "bg-red-50 text-red-700 border-red-200", order: 7 },
};

function getDisplayStatus(emp) {
  if (emp.status === "approved") return "approved";
  if (emp.status === "rejected") return "rejected";
  // Map documentStatus or other fields to intermediate statuses
  if (emp.status === "geprueft") return "geprueft";
  if (emp.status === "interview") return "interview";
  if (emp.status === "entscheid") return "entscheid";
  if (emp.invited) return "invited";
  return "pending";
}

export default function BewerberPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [daysFilter, setDaysFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    try {
      const res = await fetch("/api/admin/employees");
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  const handleApproval = async (emp) => {
    if (!confirm(`${emp.firstName} ${emp.lastName} genehmigen?`)) return;
    try {
      const res = await fetch("/api/approve-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      if (!res.ok) { const d = await res.json(); alert(`Fehler: ${d.message}`); return; }
      alert(`${emp.firstName} ${emp.lastName} wurde genehmigt.`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "approved" } : e));
    } catch (err) { alert(`Fehler: ${err.message}`); }
  };

  const handleRejection = async (emp) => {
    if (!confirm(`${emp.firstName} ${emp.lastName} ablehnen?`)) return;
    try {
      const res = await fetch("/api/reject-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      if (!res.ok) { const d = await res.json(); alert(`Fehler: ${d.message}`); return; }
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "rejected" } : e));
    } catch (err) { alert(`Fehler: ${err.message}`); }
  };

  const handleInvite = async (emp) => {
    try {
      await fetch("/api/invite-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email, firstName: emp.firstName }) });
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, invited: true } : e));
    } catch { alert("Fehler beim Einladen."); }
  };

  const handleStatusChange = async (emp, newStatus) => {
    try {
      await fetch("/api/admin/set-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "employee", id: emp.id, status: newStatus }),
      });
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: newStatus } : e));
    } catch { alert("Fehler beim Statuswechsel."); }
  };

  // Apply filters
  const filtered = employees
    .filter(emp => {
      if (statusFilter === "all") return true;
      return getDisplayStatus(emp) === statusFilter;
    })
    .filter(emp => {
      if (!searchTerm) return true;
      return `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(emp => {
      if (!daysFilter) return true;
      return daysSince(emp.createdAt) >= parseInt(daysFilter);
    })
    .filter(emp => {
      if (!regionFilter) return true;
      const region = `${emp.city || ""} ${emp.canton || ""}`.toLowerCase();
      return region.includes(regionFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "overdue") return daysSince(b.createdAt) - daysSince(a.createdAt);
      return 0;
    });

  // Stats
  const countByStatus = {};
  employees.forEach(e => {
    const s = getDisplayStatus(e);
    countByStatus[s] = (countByStatus[s] || 0) + 1;
  });

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Bewerber</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} von {employees.length} Bewerbern</p>
        </div>

        {/* Status overview cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`rounded-xl border p-3 text-left transition ${statusFilter === key ? "ring-2 ring-[#04436F] border-[#04436F]" : "border-gray-200 hover:border-gray-300"}`}
            >
              <p className="text-lg font-bold text-gray-900">{countByStatus[key] || 0}</p>
              <p className="text-xs text-gray-500">{cfg.label}</p>
            </button>
          ))}
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-xl border p-3 text-left transition ${statusFilter === "all" ? "ring-2 ring-[#04436F] border-[#04436F]" : "border-gray-200 hover:border-gray-300"}`}
          >
            <p className="text-lg font-bold text-gray-900">{employees.length}</p>
            <p className="text-xs text-gray-500">Alle</p>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text" placeholder="Name suchen..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20"
            />
            <input
              type="text" placeholder="Region..."
              value={regionFilter} onChange={e => setRegionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20"
            />
            <select value={daysFilter} onChange={e => setDaysFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="">Alter: Alle</option>
              <option value="3">Älter als 3 Tage</option>
              <option value="7">Älter als 7 Tage</option>
              <option value="14">Älter als 14 Tage</option>
              <option value="30">Älter als 30 Tage</option>
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
              <option value="overdue">Entscheid überfällig</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">Alle Status</option>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#04436F] mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seit Bewerbung</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verfügbarkeit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">Keine Bewerber gefunden</td></tr>
                  ) : filtered.slice(0, visibleCount).map(emp => {
                    const days = daysSince(emp.createdAt);
                    const displayStatus = getDisplayStatus(emp);
                    const cfg = STATUS_CONFIG[displayStatus];
                    return (
                      <tr key={emp.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{emp.city || emp.canton || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm font-medium ${days > 7 ? "text-red-600" : days > 3 ? "text-amber-600" : "text-gray-700"}`}>
                            {days} Tage
                          </span>
                          <p className="text-xs text-gray-400">{formatDate(emp.createdAt)}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {(emp.servicesOffered || []).slice(0, 2).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={displayStatus}
                            onChange={(e) => handleStatusChange(emp, e.target.value)}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border appearance-none cursor-pointer ${cfg.color}`}
                          >
                            {Object.entries(STATUS_CONFIG).map(([key, c]) => (
                              <option key={key} value={key}>{c.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {emp.status === "pending" && !emp.invited && (
                              <button onClick={() => handleInvite(emp)} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium hover:bg-blue-100 transition">Einladen</button>
                            )}
                            {(emp.status === "pending" || emp.status === "geprueft" || emp.status === "interview" || emp.status === "entscheid") && (
                              <>
                                <button onClick={() => handleApproval(emp)} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 transition">Genehmigen</button>
                                <button onClick={() => handleRejection(emp)} className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition">Ablehnen</button>
                              </>
                            )}
                            <button onClick={() => router.push(`/admin/employees/${emp.id}`)} className="px-2.5 py-1 bg-[#04436F] text-white rounded-md text-xs font-medium hover:bg-[#033558] transition">Details</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {visibleCount < filtered.length && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button onClick={() => setVisibleCount(v => v + 20)} className="px-4 py-1.5 text-sm text-[#04436F] font-medium hover:bg-gray-50 rounded-lg transition">
                Mehr laden ({filtered.length - visibleCount} verbleibend)
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
