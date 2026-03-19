// components/EmployeeScheduleList.jsx
import { useEffect, useState } from "react";

export default function EmployeeScheduleList({ email, onUpdate }) {
  const [employeeId, setEmployeeId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [cancelledSchedules, setCancelledSchedules] = useState([]);

  // get employeeId
  useEffect(() => {
    async function fetchEmployee() {
      const res = await fetch(`/api/auth/getEmployeeId?email=${email}`);
      const data = await res.json();
      setEmployeeId(data.id);
    }
    if (email) fetchEmployee();
  }, [email]);

  // get schedules
  useEffect(() => {
    async function fetchSchedules() {
      if (!employeeId) return;
      // Fetch all (active, done, etc.)
      const res = await fetch(`/api/employee/schedules?employeeId=${employeeId}`);
      const data = await res.json();
      setSchedules(data.filter(s => s.status !== "cancelled"));
      // Fetch cancelled
      const resCancelled = await fetch(`/api/employee/schedules?employeeId=${employeeId}&status=cancelled`);
      const dataCancelled = await resCancelled.json();
      setCancelledSchedules(dataCancelled);
    }
    fetchSchedules();
  }, [employeeId]);

  // update schedule
  async function handleUpdate(id, data) {
    await fetch(`/api/schedule/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // reload schedules
    const res = await fetch(`/api/employee/schedules?employeeId=${employeeId}`);
    setSchedules(await res.json());
    // notify parent to refresh totals
    if (onUpdate) onUpdate();
  }

  return (
    <section className="bg-whitep-2 rounded-2xl ">
      {schedules.length > 0 ? (
        <ul className="space-y-3">
          {schedules.map((s) => (
            <li key={s.id} className="flex justify-between items-center border p-4 rounded-lg">
              <div>
                <p className="font-medium">
                  {s.day} – {s.startTime}
                </p>
                <p className="text-sm text-gray-500">
                  {s.hours} Std – {s.kilometers ?? 0} km
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  defaultValue={s.hours}
                  className="border px-2 py-1 rounded w-20 text-sm"
                  onBlur={(e) => handleUpdate(s.id, { hours: parseInt(e.target.value) })}
                />
                <input
                  type="number"
                  defaultValue={s.kilometers ?? 0}
                  className="border px-2 py-1 rounded w-20 text-sm"
                  onBlur={(e) => handleUpdate(s.id, { kilometers: parseInt(e.target.value) })}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Keine Einsätze gefunden</p>
      )}

      <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-2">❌ Stornierte Einsätze</h4>
      {cancelledSchedules.length > 0 ? (
        <ul className="space-y-3">
          {cancelledSchedules.map((s) => (
            <li key={s.id} className="flex justify-between items-center border p-4 rounded-lg bg-red-50">
              <div>
                <p className="font-medium text-red-700">
                  {s.day} – {s.startTime}
                </p>
                <p className="text-sm text-gray-500">
                  {s.hours} Std – {s.kilometers ?? 0} km
                </p>
                <p className="text-xs text-red-500 mt-1">Storniert</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 italic">Keine stornierten Einsätze</p>
      )}
    </section>
  );
}
