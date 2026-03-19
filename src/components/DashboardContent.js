import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

export default function DashboardContent({ stats }) {
  const chartData = [
    { name: "Approved", value: stats.approved },
    { name: "Pending", value: stats.pending },
    { name: "Rejected", value: stats.rejected },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats.totalEmployees} bg="#04436F" />
        <StatCard title="Approved" value={stats.approved} bg="#4CAF50" />
        <StatCard title="Pending" value={stats.pending} bg="#FFC107" />
        <StatCard title="Rejected" value={stats.rejected} bg="#F44336" />
      </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4 text-[#04436F] text-center">Employee Status Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} label dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ title, value, bg }) {
  return (
    <div className={`p-4 rounded-xl text-white shadow`} style={{ backgroundColor: bg }}>
      <h2 className="text-sm">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
