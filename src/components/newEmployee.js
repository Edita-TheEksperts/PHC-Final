import { useRouter } from "next/router";
import { useState } from "react";

export default function NewEmployee({ employees, onApprove, onReject, onInvite }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [inviteFilter, setInviteFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder] = useState("");

  const statusLabels = {
    approved: "Genehmigt",
    pending: "Ausstehend",
    rejected: "Abgelehnt",
  };

  const statusColors = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };

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

  const filteredEmployees = employees
    .filter(emp => emp.status !== "approved")
    .filter(emp => {
      const matchesName = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter ? emp.status === statusFilter : true;
      const matchesInvite = inviteFilter === "invited" ? emp.invited : inviteFilter === "not_invited" ? !emp.invited : true;
      return matchesName && matchesStatus && matchesInvite;
    });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (sortOrder === "newest") return dateB - dateA;
    if (sortOrder === "oldest") return dateA - dateB;
    return 0;
  });

  const visibleEmployees = sortedEmployees.slice(0, visibleCount);

  return (
    <div className="p-6 space-y-6">
<h2 className="text-3xl font-bold text-[#1E3A8A]">Bewerberübersicht</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <input
          type="text"
          placeholder="Nach Name suchen..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2 w-60 focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-44 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Alle Status</option>
          <option value="approved">Genehmigt</option>
          <option value="pending">Ausstehend</option>
          <option value="rejected">Abgelehnt</option>
        </select>
        <select
          value={inviteFilter}
          onChange={e => setInviteFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-44 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Alle Einladungen</option>
          <option value="invited">Eingeladen</option>
          <option value="not_invited">Nicht eingeladen</option>
        </select>
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          className="border rounded-lg px-3 py-2 w-44 focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Stornieren</option>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
        <button
          onClick={() => { setSearchTerm(""); setStatusFilter(""); setInviteFilter(""); setSortOrder(""); }}
          className="bg-gray-200 hover:bg-gray-300 rounded-lg px-4 py-2 font-medium"
        >
          Filter löschen
        </button>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleEmployees.map(emp => (
          <div key={emp.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-[#1E3A8A]">{emp.firstName} {emp.lastName}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[emp.status]}`}>
                {statusLabels[emp.status]}
              </span>
            </div>
            <p className="text-sm mb-1"><strong>E-Mail:</strong> {emp.email}</p>
            <p className="text-sm mb-1"><strong>Telefon:</strong> {emp.phone || "—"}</p>
            <p className="text-sm mb-3"><strong>Erstellt:</strong> {formatDate(emp.createdAt)}</p>

            <div className="flex flex-wrap gap-2 mt-2">
              {emp.status === "pending" && (
                <>
                  <button onClick={() => onApprove(emp)} className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm w-full">Genehmigen</button>
                  <button onClick={() => onReject(emp)} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm w-full">Ablehnen</button>
                  {!emp.invited && <button onClick={() => onInvite(emp)} className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm w-full">Einladen</button>}
                </>
              )}
              <button onClick={() => router.push(`/admin/employees/${emp.id}`)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm w-full">Details</button>
              <button onClick={() => handleSendDocument(emp, 'Auflösungschreiben')} className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg text-sm w-full">Auflösung</button>
              <button onClick={() => handleSendDocument(emp, 'KündigungMA')} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-3 py-2 rounded-lg text-sm w-full">Kündigung MA</button>
              <button onClick={() => handleSendDocument(emp, 'KündigungMAFristlos')} className="bg-gradient-to-r from-red-700 to-red-800 text-white px-3 py-2 rounded-lg text-sm w-full">Fristlos</button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredEmployees.length && (
        <div className="text-center mt-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 10)}
            className="px-6 py-2 bg-[#1E3A8A] hover:bg-[#162E61] text-white rounded-lg font-semibold shadow"
          >
            Mehr laden
          </button>
        </div>
      )}
    </div>
  );
}
