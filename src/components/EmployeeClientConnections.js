import { useState } from "react";
import { ChevronDown, ChevronRight, Filter } from "lucide-react";

export default function EmployeeClientConnections({ employees }) {
  const [openIds, setOpenIds] = useState([]);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);

  const toggle = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredEmployees = showAssignedOnly
    ? employees.filter((e) => (e.assignments?.length || 0) > 0)
    : employees;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#04436F]">
          Employee/Client Connections
        </h2>
        <button
          onClick={() => setShowAssignedOnly((prev) => !prev)}
          className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-100 transition"
        >
          <Filter className="h-4 w-4 mr-1" />
          {showAssignedOnly ? "Show All" : "Show Assigned Only"}
        </button>
      </div>

      {filteredEmployees.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No employees found for this filter.
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredEmployees.map((e) => {
            const isOpen = openIds.includes(e.id);
            const assignments = e.assignments || [];

            return (
              <li key={e.id} className="rounded-lg border bg-gray-50 shadow-sm">
                <button
                  onClick={() => toggle(e.id)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100 transition rounded-lg"
                >
                  <div className="text-gray-800 font-medium">
                    👤 {e.firstName} {e.lastName}
                    <span className="ml-2 text-sm text-gray-500">
                      ({assignments.length} assigned)
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
                    {assignments.map((a, i) => (
                      <div
                        key={i}
                        className="border p-3 rounded-md bg-white shadow-sm"
                      >
                    <p>
  <strong>Client:</strong>{" "}
  {a.user?.firstName || "Unnamed"}
</p>
<p>
  <strong>Service:</strong>{" "}
  {a.serviceName ?? "—"}
</p>
<p>
  <strong>Start:</strong>{" "}
  {a.firstDate
    ? new Date(a.firstDate).toLocaleDateString("de-DE")
    : "—"}
</p>

                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
