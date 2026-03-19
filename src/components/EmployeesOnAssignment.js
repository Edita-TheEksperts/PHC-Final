import { useState } from "react";

export default function EmployeesOnAssignment({ employees }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter]         = useState("assigned");
  const [showAll, setShowAll]       = useState(false);

  const assignedEmployees = employees.filter((e) =>
    e.assignments?.some((a) => a.status === "active")
  );
  const freeEmployees = employees.filter(
    (e) => !e.assignments?.some((a) => a.status === "active")
  );

  const list = filter === "assigned" ? assignedEmployees : freeEmployees;
  const filtered = list.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Filter + Search row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => { setFilter("assigned"); setShowAll(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition
              ${filter === "assigned" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Zugewiesen
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === "assigned" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
              {assignedEmployees.length}
            </span>
          </button>
          <button
            onClick={() => { setFilter("free"); setShowAll(false); }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition
              ${filter === "free" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            Verfügbar
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === "free" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"}`}>
              {freeEmployees.length}
            </span>
          </button>
        </div>
        <div className="flex-1 min-w-40">
          <input
            type="text"
            placeholder="Name suchen…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20"
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Keine Mitarbeiter gefunden</p>
      ) : (
        <div className="space-y-2">
          {visible.map((emp) => {
            const initials      = `${emp.firstName?.[0] || ""}${emp.lastName?.[0] || ""}`.toUpperCase();
            const activeCount   = emp.assignments?.filter((a) => a.status === "active").length || 0;

            return (
              <div key={emp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0
                  ${filter === "assigned" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{emp.firstName} {emp.lastName}</p>
                  <p className="text-xs text-gray-400">
                    {filter === "assigned" ? `${activeCount} aktive${activeCount === 1 ? "r" : ""} Einsatz` : "Aktuell nicht zugewiesen"}
                  </p>
                </div>
                {filter === "assigned" && activeCount > 0 && (
                  <span className="text-xs font-medium bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0">
                    {activeCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-xs font-medium text-gray-500 hover:text-gray-800 py-1 transition"
        >
          {showAll ? "Weniger anzeigen" : `${filtered.length - 8} weitere anzeigen`}
        </button>
      )}
    </div>
  );
}
