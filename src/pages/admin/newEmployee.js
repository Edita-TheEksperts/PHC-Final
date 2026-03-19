import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { useRouter } from "next/router";

export default function NewEmployeePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ firstName: "", lastName: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [statusFilter, setStatusFilter] = useState("all");
  const [createdDate, setCreatedDate] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setEmployees(data.employees || []);
    }
    fetchEmployees();
  }, []);

  const handleApproval = async (emp) => {
    try {
      const response = await fetch("/api/approve-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      const data = await response.json();
      if (!response.ok) { alert(`Fehler bei der Genehmigung: ${data.message || "Unbekannter Fehler"}`); return; }
      alert(`✅ ${emp.firstName} ${emp.lastName} wurde genehmigt und die E-Mail wurde gesendet.`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "approved" } : e));
    } catch (error) { alert(`Fehler beim Genehmigen: ${error.message}`); }
  };

  const handleRejection = async (emp) => {
    try {
      const response = await fetch("/api/reject-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email }) });
      const data = await response.json();
      if (!response.ok) { alert(`Fehler bei der Ablehnung: ${data.message || "Unbekannter Fehler"}`); return; }
      alert(`✅ ${emp.firstName} ${emp.lastName} wurde abgelehnt und die E-Mail wurde gesendet.`);
      setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: "rejected" } : e));
    } catch (error) { alert(`Fehler beim Ablehnen: ${error.message}`); }
  };

  const handleInvite = async (emp) => {
    await fetch("/api/invite-employee", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: emp.email, firstName: emp.firstName }) });
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, invited: true } : e));
  };

  const filteredEmployees = employees
    .filter(emp => emp.status !== "approved")
    .filter(emp => `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(emp => {
      if (statusFilter === "invited") return emp.invited === true;
      if (statusFilter === "pending") return emp.status === "pending";
      return true;
    })
    .filter(emp => {
      if (!createdDate) return true;
      return new Date(emp.createdAt).toISOString().split("T")[0] === createdDate;
    });

  const statusBadge = (emp) => {
    const base = "px-2 py-0.5 rounded-full text-xs font-medium border";
    if (emp.status === "approved") return <span className={`${base} bg-emerald-50 text-emerald-700 border-emerald-200`}>Genehmigt</span>;
    if (emp.status === "rejected") return <span className={`${base} bg-red-50 text-red-700 border-red-200`}>Abgelehnt</span>;
    return <span className={`${base} bg-amber-50 text-amber-700 border-amber-200`}>Ausstehend</span>;
  };

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Bewerber</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredEmployees.length} Bewerber — nicht genehmigte Mitarbeiter
            </p>
          </div>
          <a
            href="/api/admin/export/employees"
            download
            className="flex items-center gap-2 px-4 py-2 bg-[#0F1F38] text-white rounded-lg text-sm font-medium hover:bg-[#1a3050] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV exportieren
          </a>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Name suchen</label>
              <input
                type="text"
                placeholder="Vor- oder Nachname..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]"
              >
                <option value="all">Alle</option>
                <option value="invited">Eingeladen</option>
                <option value="pending">Ausstehend</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Erstellungsdatum</label>
              <input
                type="date"
                value={createdDate}
                onChange={e => setCreatedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38]"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">E-Mail</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Telefon</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Erstellt am</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-500">
                      Keine Bewerber gefunden
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.slice(0, visibleCount).map(emp => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{emp.firstName} {emp.lastName}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{emp.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(emp.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td className="px-4 py-3">{statusBadge(emp)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {emp.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApproval(emp)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-xs font-medium hover:bg-emerald-100 transition"
                              >
                                Genehmigen
                              </button>
                              <button
                                onClick={() => handleRejection(emp)}
                                className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition"
                              >
                                Ablehnen
                              </button>
                              {!emp.invited && (
                                <button
                                  onClick={() => handleInvite(emp)}
                                  className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium hover:bg-blue-100 transition"
                                >
                                  Einladen
                                </button>
                              )}
                            </>
                          )}
                          <button
                            onClick={() => router.push(`/admin/employees/${emp.id}`)}
                            className="px-2.5 py-1 bg-[#0F1F38] text-white rounded-md text-xs font-medium hover:bg-[#1a3050] transition"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {visibleCount < filteredEmployees.length && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="px-4 py-1.5 text-sm text-[#0F1F38] font-medium hover:bg-gray-50 rounded-lg transition"
              >
                Mehr laden ({filteredEmployees.length - visibleCount} verbleibend)
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
