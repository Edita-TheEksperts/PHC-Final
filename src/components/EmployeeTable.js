import { useRouter } from "next/router";
import { useState } from "react";

const STATUS_BADGE = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};
const STATUS_LABEL = { approved: "Genehmigt", pending: "Ausstehend", rejected: "Abgelehnt" };

export default function EmployeeTable({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [inviteFilter, setInviteFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder]     = useState("");

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d) ? "—" : d.toLocaleDateString("de-DE");
  };

  const handleSendDocument = (emp, type) => {
    fetch("/api/send-documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee: emp, documentType: type }),
    })
      .then((res) => res.json())
      .then(() => alert(`📧 ${type} wurde an ${emp.email} gesendet.`))
      .catch(() => {});
  };

  const filtered = employees
    .filter((emp) => emp.status === "approved")
    .filter((emp) => {
      const matchesName = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? emp.status === statusFilter : true;
      const matchesInvite = inviteFilter === "invited" ? emp.invited : inviteFilter === "not_invited" ? !emp.invited : true;
      return matchesName && matchesStatus && matchesInvite;
    });

  const sorted = [...filtered].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : sortOrder === "oldest"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : 0;
  });

  const visible = sorted.slice(0, visibleCount);

  return (
    <div className="space-y-4">

      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-xs font-medium text-gray-500 mb-1">Name suchen</label>
            <input
              type="text"
              placeholder="Vor- oder Nachname…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
            />
          </div>
          <div className="min-w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Einladung</label>
            <select
              value={inviteFilter}
              onChange={(e) => setInviteFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
            >
              <option value="">Alle</option>
              <option value="invited">Eingeladen</option>
              <option value="not_invited">Nicht eingeladen</option>
            </select>
          </div>
          <div className="min-w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Datum</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
            >
              <option value="">Standard</option>
              <option value="newest">Neueste zuerst</option>
              <option value="oldest">Älteste zuerst</option>
            </select>
          </div>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter(""); setInviteFilter(""); setSortOrder(""); }}
            className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Filter löschen
          </button>
          <span className="text-xs text-gray-400 self-end pb-2">{filtered.length} Einträge</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white rounded-xl border border-gray-200 overflow-x-auto">
        <table className="min-w-[860px] w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Erstellt</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">E-Mail</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Telefon</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Dokumente</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(emp.createdAt)}</td>
                <td className="px-5 py-3 font-medium text-gray-900 whitespace-nowrap">{emp.firstName} {emp.lastName}</td>
                <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">{emp.email}</td>
                <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{emp.phone || "—"}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_BADGE[emp.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    {STATUS_LABEL[emp.status] || emp.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600 text-xs">{emp.documentStatus || "—"}</td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => router.push(`/admin/employees/${emp.id}`)}
                      className="px-2.5 py-1 text-xs font-medium bg-[#0F1F38] text-white rounded-lg hover:bg-[#1a3050] transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => window.confirm("Auflösungschreiben senden?") && handleSendDocument(emp, "Auflösungschreiben")}
                      className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-200 transition"
                    >
                      Auflösung
                    </button>
                    <button
                      onClick={() => window.confirm("Kündigung MA senden?") && handleSendDocument(emp, "KündigungMA")}
                      className="px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200 rounded-lg hover:bg-orange-200 transition"
                    >
                      Kündigung MA
                    </button>
                    <button
                      onClick={() => window.confirm("Fristlose Kündigung senden?") && handleSendDocument(emp, "KündigungMAFristlos")}
                      className="px-2.5 py-1 text-xs font-medium bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 transition"
                    >
                      Fristlos
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">
                  Keine Mitarbeiter gefunden
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {visible.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{emp.email}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_BADGE[emp.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {STATUS_LABEL[emp.status] || emp.status}
              </span>
            </div>
            <div className="text-xs text-gray-500 flex gap-4">
              <span>Tel: {emp.phone || "—"}</span>
              <span>Erstellt: {formatDate(emp.createdAt)}</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => router.push(`/admin/employees/${emp.id}`)} className="flex-1 px-3 py-2 text-xs font-medium bg-[#0F1F38] text-white rounded-lg">Details</button>
              <button onClick={() => handleSendDocument(emp, "Auflösungschreiben")} className="flex-1 px-3 py-2 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg">Auflösung</button>
              <button onClick={() => handleSendDocument(emp, "KündigungMA")} className="flex-1 px-3 py-2 text-xs font-medium bg-orange-100 text-orange-700 rounded-lg">Kündigung MA</button>
              <button onClick={() => handleSendDocument(emp, "KündigungMAFristlos")} className="flex-1 px-3 py-2 text-xs font-medium bg-red-100 text-red-700 rounded-lg">Fristlos</button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filtered.length && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount((prev) => prev + 10)}
            className="px-5 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Mehr laden ({filtered.length - visibleCount} verbleibend)
          </button>
        </div>
      )}
    </div>
  );
}
