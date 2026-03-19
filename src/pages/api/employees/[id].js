import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  async function fetchData() {
    const res = await fetch("/api/admin/dashboard");
    const data = await res.json();
    setEmployees(data.employees || []);
    setClients(data.clients || []);
  }

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  }

  async function handleApproval(employee) {
    const res = await fetch("/api/approve-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, status: "approved" } : e))
      );
      setMessage(`${employee.firstName} approved ✅`);
      fetchStats();
    }
  }

  async function handleRejection(employee) {
    const res = await fetch("/api/reject-employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: employee.email }),
    });
    if (res.ok) {
      setEmployees((prev) =>
        prev.map((e) => (e.id === employee.id ? { ...e, status: "rejected" } : e))
      );
      setMessage(`${employee.firstName} rejected ❌`);
      fetchStats();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-4xl font-bold text-[#04436F] text-center mb-8">Admin Dashboard</h1>

      {/* === Stats Cards === */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Employees" value={stats.totalEmployees} color="bg-blue-600" />
          <StatCard label="Approved" value={stats.approved} color="bg-green-600" />
          <StatCard label="Pending" value={stats.pending} color="bg-yellow-500" />
          <StatCard label="Rejected" value={stats.rejected} color="bg-red-600" />
        </div>
      )}

      {/* === Pie Chart === */}
      {stats && (
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-xl font-semibold text-[#04436F] mb-4 text-center">Employee Status Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Approved", value: stats.approved },
                  { name: "Pending", value: stats.pending },
                  { name: "Rejected", value: stats.rejected },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#FFC107" />
                <Cell fill="#F44336" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* === Employees Table === */}
      <Section title="Employees">
        <Table
          headers={["Name", "Email", "Phone", "Status", "Action"]}
          rows={employees.map((emp) => ({
            cells: [
              `${emp.firstName} ${emp.lastName}`,
              emp.email,
              emp.phone,
              emp.status,
              <div className="flex gap-2 flex-wrap">
                {emp.status === "pending" && (
                  <>
                    <button onClick={() => handleApproval(emp)} className="btn-green">Approve</button>
                    <button onClick={() => handleRejection(emp)} className="btn-red">Reject</button>
                  </>
                )}
                <button onClick={() => router.push(`/employees/${emp.id}`)} className="btn-blue">Details</button>
              </div>,
            ],
          }))}
        />
      </Section>

      {/* === Clients Table === */}
      <Section title="Clients">
        <Table
          headers={["Name", "Email", "Phone", "Action"]}
          rows={clients.map((client) => ({
            cells: [
              `${client.firstName} ${client.lastName}`,
              client.email,
              client.phone,
              <button onClick={() => router.push(`/clients/${client.id}`)} className="btn-blue">Details</button>,
            ],
          }))}
        />
      </Section>

      {/* === Message === */}
      {message && <p className="text-center text-lg mt-6 text-[#04436F]">{message}</p>}
    </div>
  );
}

// === Reusable Components ===

function StatCard({ label, value, color }) {
  return (
    <div className={`${color} text-white p-6 rounded-xl shadow text-center`}>
      <p className="text-sm uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-[#04436F] mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-auto rounded-xl shadow bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#04436F]">
          <tr>{headers.map((h, i) => <th key={i} className="p-3">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              {row.cells.map((cell, j) => (
                <td key={j} className="p-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
