import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  approved: "#10B981", // green
  pending: "#F59E0B",  // yellow
  rejected: "#EF4444", // red
};

// 🌍 Përkthim EN → DE
const STATUS_LABELS = {
  approved: "Genehmigt",
  pending: "Ausstehend",
  rejected: "Abgelehnt",
};

export default function ApplicationOverview({ employees }) {
  const [filter, setFilter] = useState("all");

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 my-6">
        <h2 className="text-xl font-bold text-[#04436F] mb-4">📋 Application Overview</h2>
        <p className="text-gray-500">No employee data available.</p>
      </div>
    );
  }

  // Count statuses
  const counts = {
    approved: 0,
    pending: 0,
    rejected: 0,
  };

  employees.forEach((e) => {
    const s = e.status || "pending";
    if (counts[s] !== undefined) counts[s]++;
  });

  const data = Object.entries(counts).map(([status, value]) => ({
    name: STATUS_LABELS[status] || status, // 🔑 përdor gjermanisht
    value,
    fill: STATUS_COLORS[status],
  }));

  const filteredEmployees = employees.filter((e) =>
    filter === "all" ? true : (e.status || "pending") === filter
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 my-6 w-full">
      {/* Layout split */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart section */}
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Status Count */}
          <div className="mt-6 space-y-2 text-base text-gray-700 text-center">
            <p><strong className="text-green-600">🟢 Genehmigt:</strong> {counts.approved}</p>
            <p><strong className="text-yellow-500">🟡 Ausstehend:</strong> {counts.pending}</p>
            <p><strong className="text-red-500">🔴 Abgelehnt:</strong> {counts.rejected}</p>
          </div>
        </div>

        {/* List + Filters */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Filters */}
          <div className="flex justify-center gap-3 mb-4 flex-wrap">
            {["all", "approved", "pending", "rejected"].map((status) => {
              const labels = {
                all: "Alle anzeigen",
                approved: "Genehmigt",
                pending: "Ausstehend",
                rejected: "Abgelehnt",
              };

              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    filter === status
                      ? "bg-[#04436F] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>

          {/* Employee list */}
          <div className="overflow-y-auto max-h-[320px] pr-1">
            {filteredEmployees.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-6">No employees found.</p>
            ) : (
              <ul className="space-y-2 text-sm text-gray-800">
                {filteredEmployees.map((e) => (
                  <li
                    key={e.id}
                    className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-md border"
                  >
                    <span className="truncate">
                      {e.firstName} {e.lastName}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${
                        e.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : e.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {STATUS_LABELS[e.status] || STATUS_LABELS["pending"]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
