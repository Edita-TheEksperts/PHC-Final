import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function StatusBadge({ status }) {
  if (status === "Open")     return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Offen</span>;
  if (status === "Done")     return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />Erledigt</span>;
  if (status === "Canceled") return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" />Abgesagt</span>;
  return null;
}

export default function ClientTable({ clients }) {
  const router = useRouter();
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [assignedMap, setAssignedMap]           = useState({});
  const [message, setMessage]                   = useState("");
  const [employees, setEmployees]               = useState([]);
  const [searchTerm, setSearchTerm]             = useState("");
  const [sortBy, setSortBy]                     = useState("name");
  const [recommended, setRecommended]           = useState({});
  const [showModal, setShowModal]               = useState(false);
  const [modalRecs, setModalRecs]               = useState([]);

  useEffect(() => {
    async function fetchRecommendations() {
      for (const client of clients) {
        try {
          const res  = await fetch(`/api/admin/matchmaking?clientId=${client.id}`);
          const data = await res.json();
          setRecommended(prev => ({ ...prev, [client.id]: data }));
        } catch {}
      }
    }
    if (clients.length > 0) fetchRecommendations();
  }, [clients]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res  = await fetch("/api/admin/employees");
        const data = await res.json();
        setEmployees(data);
      } catch {}
    }
    fetchEmployees();
  }, []);

  useEffect(() => {
    const initialMap = {};
    clients.forEach((client) => {
      const assigned = client.assignments?.[0];
      if (assigned?.employeeId) initialMap[client.id] = assigned.employeeId;
    });
    setSelectedEmployee(initialMap);
    setAssignedMap(initialMap);
  }, [clients]);

  function getStatus(client) {
    if (client.status === "canceled") return "Canceled";
    return new Date(client.firstDate) < new Date() ? "Done" : "Open";
  }

  function isCancelable(client) {
    return (new Date(client.firstDate) - new Date()) / (1000 * 60 * 60) >= 24;
  }

  async function handleCancel(clientId) {
    if (!window.confirm("Service wirklich stornieren?")) return;
    try {
      const res  = await fetch("/api/admin/cancel-service", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId }) });
      const data = await res.json();
      setMessage(res.ok ? "Service storniert." : `Fehler: ${data.message}`);
      if (res.ok) router.reload();
    } catch { setMessage("Fehler beim Stornieren."); }
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleAssign(userId) {
    const employeeId = selectedEmployee[userId];
    if (!employeeId) return;
    const res  = await fetch("/api/admin/assign-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, employeeId }) });
    const data = await res.json();
    if (res.ok) { setAssignedMap({ ...assignedMap, [userId]: employeeId }); setMessage("Mitarbeiter zugewiesen."); }
    else setMessage(`Fehler: ${data.message}`);
    setTimeout(() => setMessage(""), 3000);
  }

  function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  const acceptedEmployees = employees.filter(e => ["approved","accepted"].includes((e.status||"").toLowerCase()));

  const filteredClients = clients
    .filter(c => c.status !== "gekuendigt")
    .filter(c => {
      const name = `${c.firstName||""} ${c.lastName||""}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || (c.email||"").toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => sortBy === "date"
      ? new Date(b.firstDate||0) - new Date(a.firstDate||0)
      : (a.firstName||"").localeCompare(b.firstName||"")
    );

  function AssignCell({ client }) {
    const recs = recommended[client.id] || [];
    return (
      <div className="space-y-2 min-w-[220px]">
        {recs.filter(r => r.score >= 60).slice(0, 1).map(rec => (
          <div key={rec.employeeId} className="flex items-center justify-between px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs">
            <span className="font-medium text-green-800">⭐ {rec.firstName} {rec.lastName} <span className="text-green-600">({rec.score}%)</span></span>
            <button onClick={() => { setModalRecs([rec]); setShowModal(true); }} className="text-blue-600 hover:underline">Warum?</button>
          </div>
        ))}
        <select
          value={selectedEmployee[client.id] || ""}
          onChange={(e) => setSelectedEmployee({ ...selectedEmployee, [client.id]: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
        >
          <option value="">Mitarbeiter auswählen</option>
          {recs.filter(r => r.score >= 80).length > 0 && <optgroup label="⭐ Super Match (80–100%)">{recs.filter(r => r.score >= 80).map(rec => { const emp = acceptedEmployees.find(e => e.id === rec.employeeId); return emp ? <option key={rec.employeeId} value={rec.employeeId}>⭐ {emp.firstName} {emp.lastName} — {rec.score}%</option> : null; })}</optgroup>}
          {recs.filter(r => r.score >= 60 && r.score < 80).length > 0 && <optgroup label="👍 Gut (60–79%)">{recs.filter(r => r.score >= 60 && r.score < 80).map(rec => { const emp = employees.find(e => e.id === rec.employeeId); return emp ? <option key={rec.employeeId} value={rec.employeeId}>👍 {emp.firstName} {emp.lastName} — {rec.score}%</option> : null; })}</optgroup>}
          {recs.filter(r => r.score >= 40 && r.score < 60).length > 0 && <optgroup label="👌 Mittel (40–59%)">{recs.filter(r => r.score >= 40 && r.score < 60).map(rec => { const emp = employees.find(e => e.id === rec.employeeId); return emp ? <option key={rec.employeeId} value={rec.employeeId}>👌 {emp.firstName} {emp.lastName} — {rec.score}%</option> : null; })}</optgroup>}
          <optgroup label="👤 Andere">{acceptedEmployees.filter(emp => !recs.some(r => r.employeeId === emp.id)).map(emp => <option key={emp.id} value={emp.id}>👤 {emp.firstName} {emp.lastName}</option>)}</optgroup>
        </select>
        <div className="flex gap-1.5">
          <button
            disabled={!!assignedMap[client.id] || !selectedEmployee[client.id]}
            onClick={() => handleAssign(client.id)}
            className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition
              ${assignedMap[client.id] ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : selectedEmployee[client.id] ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {assignedMap[client.id] ? "✓ Zugewiesen" : "Zuordnen"}
          </button>
        </div>
        {client.assignments?.length > 0 && (
          <p className="text-xs text-blue-600">
            → {client.assignments[0].employee?.firstName || "—"} ({client.assignments[0].confirmationStatus || "pending"})
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-gray-500 mb-1">Name / E-Mail suchen</label>
            <input
              type="text"
              placeholder="Suchen…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
            />
          </div>
          <div className="min-w-40">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sortieren</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
            >
              <option value="name">Nach Name</option>
              <option value="date">Nach Datum</option>
            </select>
          </div>
          <button
            onClick={() => { setSearchTerm(""); setSortBy("name"); }}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Löschen
          </button>
          <span className="text-xs text-gray-400 self-end pb-2">{filteredClients.length} Einträge</span>
        </div>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2.5 rounded-lg">{message}</div>
      )}

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-[960px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Erstellt</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">E-Mail</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Mitarbeiter</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredClients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50 transition align-top">
                <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(client.createdAt)}</td>
                <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{client.firstName} {client.lastName}</td>
                <td className="px-5 py-4 text-gray-600 max-w-[160px] truncate">{client.email}</td>
                <td className="px-5 py-4 text-gray-600 text-xs">{(client.services||[]).map(s=>s.name).join(", ") || "—"}</td>
                <td className="px-5 py-4"><AssignCell client={client} /></td>
                <td className="px-5 py-4"><StatusBadge status={getStatus(client)} /></td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      className="px-3 py-1.5 text-xs font-medium bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition whitespace-nowrap"
                    >
                      Details
                    </button>
                    {getStatus(client) === "Open" && (
                      <button
                        onClick={() => handleCancel(client.id)}
                        disabled={!isCancelable(client)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap
                          ${isCancelable(client) ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                      >
                        Stornieren
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredClients.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">Keine Kunden gefunden</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{client.firstName} {client.lastName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>
              </div>
              <StatusBadge status={getStatus(client)} />
            </div>
            <div className="text-xs text-gray-500">
              Service: {(client.services||[]).map(s=>s.name).join(", ") || "—"}
            </div>
            <AssignCell client={client} />
            <div className="flex gap-2 pt-1">
              <button onClick={() => router.push(`/admin/clients/${client.id}`)} className="flex-1 px-3 py-2 text-xs font-medium bg-[#0F1F38] text-white rounded-lg">Details</button>
              {getStatus(client) === "Open" && (
                <button onClick={() => handleCancel(client.id)} disabled={!isCancelable(client)} className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg ${isCancelable(client) ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>Stornieren</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Why recommended modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Warum empfohlen?</h3>
            <ul className="space-y-3">
              {modalRecs.map((rec) => (
                <li key={rec.employeeId} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="font-medium text-sm text-gray-900">⭐ {rec.firstName} {rec.lastName} — {rec.score}%</p>
                  <ul className="mt-2 space-y-1">
                    {rec.reasons.map((r, i) => (
                      <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-500 mt-0.5">•</span>{r}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button onClick={() => setShowModal(false)} className="mt-4 w-full px-4 py-2 bg-[#0F1F38] text-white text-sm font-medium rounded-lg hover:bg-[#1a3050] transition">
              Schliessen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
