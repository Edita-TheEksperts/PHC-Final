import { useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export default function ActiveClients({ clients }) {
  const [open, setOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const baseClients = (clients || []).filter(
    (c) =>
      Array.isArray(c.services) &&
      c.services.length > 0
  );

  const filteredClients = baseClients.filter((client) => {
    const fullName = `${client.firstName || ""} ${client.lastName || ""}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const visibleClients = showAll
    ? filteredClients
    : filteredClients.slice(0, 5);

  return (
    <div className="my-6 bg-white rounded-2xl shadow-md border">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-[#04436F] font-bold text-lg border-b hover:bg-gray-50 rounded-t-2xl"
      >
        <div className="flex items-center gap-2">
          Kunden
          <span className="text-sm font-medium text-gray-500">
            ({baseClients.length})
          </span>
        </div>
        {open ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {open && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Suche nach Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm pl-10 pr-3 py-2 text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* List */}
          {visibleClients.length === 0 ? (
            <p className="text-sm text-gray-500">
              Keine Clients gefunden.
            </p>
          ) : (
            visibleClients.map((client) => {
              const initials = `${client.firstName?.[0] || ""}${client.lastName?.[0] || ""}`;
              const isTerminated = client.status === "gekuendigt";

              return (
                <div
                  key={client.id}
                  className={`flex items-center justify-between gap-4 p-3 rounded-xl border transition shadow-sm
                    ${
                      isTerminated
                        ? "bg-red-50 border-red-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm uppercase
                        ${
                          isTerminated
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {initials || "?"}
                    </div>

                    <div>
                      <p className="text-base font-semibold text-gray-800">
                        {client.firstName || "—"} {client.lastName || ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {client.firstDate ? `Nächster Einsatz: ${new Date(client.firstDate).toLocaleDateString("de-CH")}` : "Kein Einsatz geplant"}
                      </p>
                    </div>
                  </div>

                  {/* Zuweisungsstatus */}
                  <div className="flex items-center gap-2">
                    {(() => {
                      const assignments = client.assignments || [];
                      const hasEmployee = assignments.some(a => a.employee);
                      const hasPending = assignments.some(a => a.status === "pending" || a.confirmationStatus === "pending");
                      if (isTerminated) return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-600 text-white">Gekündigt</span>;
                      if (hasEmployee) return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Zugewiesen</span>;
                      if (hasPending) return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">Vorschlag offen</span>;
                      return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">Kein Mitarbeiter</span>;
                    })()
                    }
                  </div>
                </div>
              );
            })
          )}

          {filteredClients.length > 5 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                {showAll
                  ? "Weniger anzeigen"
                  : `Mehr anzeigen (${filteredClients.length - 5})`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
