import { useEffect, useState } from "react";
import Link from "next/link";
import { formatMatchBreakdown } from "../lib/statusLabels";

export default function Einsaetze() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("aktive");
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [allServices, setAllServices] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  const [assignMsg, setAssignMsg] = useState({ type: "", text: "" });
  const [assignLoading, setAssignLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoaded, setRecsLoaded] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Fetch matchmaking when an unassigned schedule is selected
  useEffect(() => {
    if (!selectedItem?.user?.id || selectedItem?.employee) {
      setRecommendations([]);
      setRecsLoaded(false);
      return;
    }
    setRecsLoaded(false);
    fetch(`/api/admin/matchmaking?clientId=${selectedItem.user.id}`, {
      credentials: "include"
    })
      .then(r => r.json())
      .then(d => { setRecommendations(Array.isArray(d) ? d.slice(0, 5) : []); setRecsLoaded(true); })
      .catch(() => { setRecommendations([]); setRecsLoaded(true); });
  }, [selectedItem?.id]);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "—";
    return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  };

  const isAcceptedStatus = (status) => {
    const s = (status || "").toLowerCase();
    return s === "approved" || s === "accepted";
  };

  const applyFilter = (list) => {
    if (!list) return [];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return list.filter((item) => {
      if (!item.date) return false;
      const d = new Date(item.date);
      switch (filter) {
        case "today":
          if (d.toDateString() !== today.toDateString()) return false;
          break;
        case "thisWeek": {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          if (d < weekStart || d > weekEnd) return false;
          break;
        }
        case "thisMonth":
          if (d.getMonth() !== today.getMonth() || d.getFullYear() !== today.getFullYear()) return false;
          break;
        case "nextMonth": {
          const nextMonth = (today.getMonth() + 1) % 12;
          const nextYear = nextMonth === 0 ? today.getFullYear() + 1 : today.getFullYear();
          if (d.getMonth() !== nextMonth || d.getFullYear() !== nextYear) return false;
          break;
        }
        default: break;
      }
      if (dateFrom && d < new Date(dateFrom)) return false;
      if (dateTo && d > new Date(dateTo)) return false;
      if (clientSearch) {
        const fullName = `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.toLowerCase().trim();
        if (!fullName.includes(clientSearch.toLowerCase().trim())) return false;
      }
      if (employeeSearch) {
        const empName = `${item.employee?.firstName || ""} ${item.employee?.lastName || ""}`.toLowerCase().trim();
        if (!empName.includes(employeeSearch.toLowerCase().trim())) return false;
      }
      return true;
    });
  };

  const saveEditedEinsatz = async () => {
    setEditError("");
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/schedules/${editItem.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editItem),
      });
      const updated = await res.json();
      if (!res.ok || !updated || updated.error) {
        setEditError(updated?.error || updated?.message || `Speichern fehlgeschlagen (HTTP ${res.status}).`);
        return;
      }
      setData((prev) => {
        const newData = { ...prev };
        for (const key of Object.keys(newData)) {
          if (Array.isArray(newData[key])) {
            newData[key] = newData[key].map((e) => e.id === editItem.id ? { ...e, status: "storniert" } : e);
          }
        }
        newData.aktive = [updated, ...(newData.aktive || [])];
        newData.aktive.sort((a, b) => new Date(a.date) - new Date(b.date));
        return newData;
      });
      setEditItem(null);
    } catch (err) {
      setEditError(err?.message || "Netzwerkfehler beim Speichern.");
    } finally {
      setEditSaving(false);
    }
  };

  const assignEmployeeToSchedule = async (empId) => {
    const employeeId = empId || selectedItem?.employeeId;
    if (!selectedItem?.id || !employeeId) {
      setAssignMsg({ type: "error", text: "Bitte Mitarbeiter auswählen!" });
      return;
    }
    setAssignLoading(true);
    setAssignMsg({ type: "", text: "" });
    try {
      const payload = {
        appointmentId: Number(selectedItem.id),
        userId: String(selectedItem.user?.id || ""),
        employeeId: String(employeeId),
      };
      const res = await fetch("/api/admin/assign-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const updatedSchedule = await res.json();
      if (!res.ok) {
        setAssignMsg({ type: "error", text: updatedSchedule.message || updatedSchedule.error || `Fehler (${res.status})` });
        return;
      }
      setAssignMsg({ type: "success", text: "Mitarbeiter wurde zugewiesen." });
      // Refetch all data to get updated relations
      try {
        const freshRes = await fetch("/api/einsaetze");
        const freshData = await freshRes.json();
        setData(freshData);
      } catch {}
      setSelectedItem(null);
    } catch (err) {
      console.error("[Einsaetze] Assign error:", err);
      setAssignMsg({ type: "error", text: err.message || "Serverfehler beim Zuweisen." });
    } finally {
      setAssignLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/einsaetze");
        const json = await res.json();
        setData(json);
      } catch {
        setData({ aktive: [], vergangene: [], stornierte: [], abgeänderte: [], offeneZuweisungen: [], rejected: [] });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/admin/services", { credentials: "include" });
        const data = await res.json();
        setAllServices(Array.isArray(data) ? data : []);
      } catch { setAllServices([]); }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/admin/employees", { credentials: "include" });
        const employees = await res.json();
        const safe = Array.isArray(employees) ? employees : [];
        setAllEmployees(safe.filter((e) => isAcceptedStatus(e.status)));
      } catch { setAllEmployees([]); }
    }
    fetchEmployees();
  }, []);

  if (loading) return (
    <div className="px-6 py-6">
      <div className="h-8 bg-gray-100 rounded-lg animate-pulse w-48 mb-4" />
      <div className="h-64 bg-gray-50 rounded-xl animate-pulse" />
    </div>
  );
  if (!data) return <div className="px-6 py-6 text-sm text-gray-500">Keine Daten gefunden.</div>;

  const STATUS_LABELS = {
    active: "Aktiv",
    pending: "Ausstehend",
    approved: "Genehmigt",
    rejected: "Abgelehnt",
    completed: "Abgeschlossen",
    done: "Abgeschlossen",
    cancelled: "Storniert",
    canceled: "Storniert",
    storniert: "Storniert",
    terminated: "Beendet",
    modified: "Geändert",
    confirmed: "Bestätigt",
  };
  const labelFor = (s) => STATUS_LABELS[s] || s || "—";

  const statusBadge = (status) => {
    const isCancelled = status === "storniert" || status === "cancelled" || status === "canceled";
    const base = "px-2 py-0.5 rounded-full text-xs font-medium border";
    const label = labelFor(status);
    if (isCancelled) return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>{label}</span>;
    if (status === "completed" || status === "done") return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>{label}</span>;
    if (status === "active") return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200`}>{label}</span>;
    return <span className={`${base} bg-gray-50 text-gray-600 border-gray-200`}>{label}</span>;
  };

  const renderList = (list) => {
    if (!list || list.length === 0)
      return <p className="text-sm text-gray-400 italic py-6 text-center">Keine Einträge vorhanden</p>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Datum</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Zeit</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Std.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Kunde</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Mitarbeiter</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((item) => (
              <tr
                key={item.id}
                onClick={() => {
                  setSelectedItem(item); setAssignMsg({ type: "", text: "" }); setAssignLoading(false); setRecommendations([]);
                }}
                className={`cursor-pointer transition hover:bg-gray-50 ${item.status === "storniert" || item.status === "cancelled" ? "opacity-60" : ""}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.date)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.startTime || "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{item.hours || "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {item.user ? (
                    <a
                      href={`/admin/clients/${item.user.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#04436F] hover:underline"
                    >
                      {item.user.firstName} {item.user.lastName}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.employee ? (
                    <a
                      href={`/admin/employees/${item.employee.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-[#04436F] hover:underline"
                    >
                      {item.employee.firstName} {item.employee.lastName}
                    </a>
                  ) : (
                    // Explicit call to action — the whole row is clickable, but
                    // that isn't discoverable, so surface the primary action.
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        setAssignMsg({ type: "", text: "" });
                        setAssignLoading(false);
                        setRecommendations([]);
                      }}
                      className="text-xs px-3 py-1.5 rounded-md border border-[#04436F] text-[#04436F] font-medium hover:bg-[#04436F] hover:text-white transition whitespace-nowrap"
                    >
                      Mitarbeiter zuweisen
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">{statusBadge(item.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = [
    { id: "aktive", label: "Aktiv" },
    { id: "vergangene", label: "Vergangen" },
    { id: "stornierte", label: "Storniert" },
    { id: "abgeänderte", label: "Abgeändert" },
    { id: "offeneZuweisungen", label: "Offen" },
    { id: "rejected", label: "Abgelehnt" },
  ];

  const filterBtns = [
    { id: "all", label: "Alle" },
    { id: "today", label: "Heute" },
    { id: "thisWeek", label: "Diese Woche" },
    { id: "thisMonth", label: "Dieser Monat" },
    { id: "nextMonth", label: "Nächster Monat" },
  ];

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Einsätze Übersicht</h1>
        <p className="text-sm text-gray-500 mt-0.5">Alle Buchungen und Einsätze verwalten</p>
      </div>

      {/* Filters card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        {/* Time filter pills */}
        <div className="flex flex-wrap gap-2">
          {filterBtns.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                ${filter === btn.id
                  ? "bg-[#04436F] text-white border-[#04436F]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search + date range */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Kunde suchen..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Mitarbeiter suchen..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
            value={employeeSearch}
            onChange={(e) => setEmployeeSearch(e.target.value)}
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <input
            type="date"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs + table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition
                ${activeTab === tab.id
                  ? "border-[#04436F] text-[#04436F] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              {tab.label}
              {data[tab.id] && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? "bg-[#04436F] text-white" : "bg-gray-100 text-gray-500"}`}>
                  {data[tab.id].length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table content */}
        <div>
          {activeTab === "aktive" && renderList(applyFilter(data.aktive))}
          {activeTab === "vergangene" && renderList(applyFilter(data.vergangene))}
          {activeTab === "stornierte" && renderList(applyFilter(data.stornierte))}
          {activeTab === "abgeänderte" && renderList(applyFilter(data.abgeänderte))}
          {activeTab === "offeneZuweisungen" && renderList(applyFilter(data.offeneZuweisungen))}
          {activeTab === "rejected" && renderList(applyFilter(data.rejected))}
        </div>
      </div>

      {/* Details modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          {/* Capped to the viewport and scrollable — with 5 recommendations the
              card used to grow past the screen with no way to reach the footer. */}
          <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Einsatz Details</h2>

            <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Datum</span>
                <span className="font-medium text-gray-900">{formatDate(selectedItem.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Zeit</span>
                <span className="font-medium text-gray-900">{selectedItem.startTime || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Stunden</span>
                <span className="font-medium text-gray-900">{selectedItem.hours || "—"}</span>
              </div>
              {selectedItem.user && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kunde</span>
                  <Link
                    href={`/admin/clients/${selectedItem.user.id}`}
                    className="font-medium text-[#04436F] hover:underline"
                  >
                    {selectedItem.user.firstName} {selectedItem.user.lastName}
                  </Link>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Mitarbeiter</span>
                {selectedItem.employee ? (
                  <Link
                    href={`/admin/employees/${selectedItem.employee.id}`}
                    className="font-medium text-[#04436F] hover:underline"
                  >
                    {selectedItem.employee.firstName} {selectedItem.employee.lastName}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">Nicht zugewiesen</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span>{statusBadge(selectedItem.status)}</span>
              </div>
            </div>

            {assignMsg.text && (
              <div className={`mt-4 p-3 rounded-lg text-sm border ${assignMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`}>
                {assignMsg.text}
              </div>
            )}

            {!selectedItem.employee && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                {/* Matchmaking recommendations */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Empfohlene Mitarbeiter</p>
                  {!recsLoaded && <p className="text-xs text-gray-400 italic">Lade Empfehlungen...</p>}
                  {recsLoaded && recommendations.length === 0 && <p className="text-xs text-amber-600 italic">Keine passenden Empfehlungen gefunden.</p>}
                  {recommendations.length > 0 && (
                    // Own scroll area so a long candidate list can't push the
                    // Schliessen/Bearbeiten footer out of reach.
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {recommendations.map((r) => {
                        const score = Math.max(0, Math.min(100, r.score || 0));
                        const tone = score >= 70 ? "emerald" : score >= 40 ? "amber" : "gray";
                        const tones = {
                          emerald: { box: "bg-emerald-50 border-emerald-200", text: "text-emerald-900", soft: "text-emerald-700", bar: "bg-emerald-500" },
                          amber:   { box: "bg-amber-50 border-amber-200",   text: "text-amber-900",   soft: "text-amber-700",   bar: "bg-amber-500"   },
                          gray:    { box: "bg-gray-50 border-gray-200",     text: "text-gray-800",    soft: "text-gray-600",    bar: "bg-gray-400"    },
                        }[tone];
                        return (
                          <div key={r.employeeId} className={`p-2.5 border rounded-lg ${tones.box}`}>
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${tones.text} truncate`}>{r.firstName} {r.lastName}</span>
                                  <span className={`text-xs font-bold ${tones.soft} flex-shrink-0`}>{score}%</span>
                                </div>
                                <div className="mt-1 h-1.5 w-full rounded-full bg-white/60 overflow-hidden">
                                  <div className={`h-full ${tones.bar}`} style={{ width: `${score}%` }} />
                                </div>
                                {(r.city || r.canton) && (
                                  <p className={`text-[11px] mt-1 ${tones.soft}`}>📍 {[r.city, r.canton].filter(Boolean).join(" · ")}</p>
                                )}
                                {formatMatchBreakdown(r.breakdown, r.reasons) && (
                                  <p className={`text-[11px] mt-0.5 ${tones.soft}`}>
                                    {formatMatchBreakdown(r.breakdown, r.reasons)}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedItem((prev) => ({ ...prev, employeeId: r.employeeId }));
                                  assignEmployeeToSchedule(r.employeeId);
                                }}
                                className="text-xs px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition flex-shrink-0"
                                title="Anfrage an Mitarbeiter senden – wird erst nach Bestätigung zur Zuweisung"
                              >
                                Anfragen
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Anfrage an Mitarbeiter senden</p>
                <p className="text-[11px] text-gray-400 -mt-1 mb-2 leading-tight">Der Mitarbeiter erhält eine Anfrage. Erst nach Bestätigung gilt der Einsatz als zugewiesen.</p>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F]"
                  value={selectedItem.employeeId || ""}
                  onChange={(e) => { setAssignMsg({ type: "", text: "" }); setSelectedItem((prev) => ({ ...prev, employeeId: e.target.value })); }}
                >
                  <option value="" disabled>— Mitarbeiter auswählen —</option>
                  {allEmployees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                  ))}
                </select>
                <button
                  onClick={() => assignEmployeeToSchedule()}
                  disabled={!selectedItem.employeeId || assignLoading}
                  className="mt-3 w-full bg-[#04436F] hover:bg-[#033558] text-white py-2 rounded-lg text-sm disabled:bg-gray-200 disabled:text-gray-400 transition"
                >
                  {assignLoading ? "Sendet…" : "Anfrage senden"}
                </button>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setSelectedItem(null); setAssignMsg({ type: "", text: "" }); setAssignLoading(false); }}
                className="flex-1 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              >
                Schliessen
              </button>
              <button
                onClick={() => { setEditItem({ ...selectedItem, userId: selectedItem.user?.id, employeeId: selectedItem.employee?.id || null }); setSelectedItem(null); setAssignMsg({ type: "", text: "" }); }}
                className="flex-1 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition"
              >
                Bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Einsatz bearbeiten</h3>
            <div className="space-y-3">
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="date" value={editItem.date?.split("T")[0] || ""} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} />
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="time" value={editItem.startTime || ""} onChange={(e) => setEditItem({ ...editItem, startTime: e.target.value })} />
              <input className="border border-gray-200 p-2.5 rounded-lg w-full text-sm" type="number" placeholder="Stunden" value={editItem.hours || ""} onChange={(e) => setEditItem({ ...editItem, hours: e.target.value })} />
              <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg w-full text-sm text-gray-700">
                <span className="text-xs text-gray-400">Service: </span>{editItem.serviceName || "—"}
              </div>
              <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg w-full text-sm text-gray-700">
                <span className="text-xs text-gray-400">Unterdienst: </span>{editItem.subServiceName || "—"}
              </div>
            </div>
            {editError && (
              <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{editError}</p>
            )}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setEditItem(null); setEditError(""); }}
                disabled={editSaving}
                className="flex-1 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={saveEditedEinsatz}
                disabled={editSaving}
                className="flex-1 py-2 text-sm bg-[#04436F] text-white rounded-lg hover:bg-[#033558] transition disabled:opacity-60"
              >
                {editSaving ? "Speichert…" : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
