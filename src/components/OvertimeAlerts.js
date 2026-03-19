export default function OvertimeAlerts({ employees, targetHours = 40 }) {
  const alerts = employees
    .map((employee) => {
      let totalHours = 0;
      let totalKm = 0;
      const kmPerClient = {};

      // Loop over each assignment (linked clients)
      employee.assignments?.forEach((assignment) => {
        const client = assignment.user;
        const clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim();

        client?.schedules?.forEach((schedule) => {
          // Check if this schedule was done by this employee
          if (String(schedule.employeeId) !== String(employee.id)) return;

          const hours = schedule.hours || 0;
          const km = schedule.kilometers || 0;

          totalHours += hours;
          totalKm += km;

          if (!kmPerClient[clientName]) kmPerClient[clientName] = 0;
          kmPerClient[clientName] += km;
        });
      });

      return {
        ...employee,
        totalHours,
        totalKm,
        kmPerClient,
      };
    })
    .filter((e) => e.totalHours > targetHours || e.totalKm > 0); // Show if worked overtime or used any km

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6">
<h2 className="text-xl font-bold text-red-700 mb-4">Überstunden- und Kilometerwarnungen</h2>

      {alerts.length === 0 ? (
<p className="text-gray-600 text-sm">Keine Überstunden erkannt.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((e) => (
            <li key={e.id} className="border p-4 rounded-md bg-red-50">
              <p className="font-semibold text-lg">{e.firstName} {e.lastName}</p>
              <p className="text-sm text-gray-700">
                🕒 {e.totalHours} Stunden<br />
                🚗 {e.totalKm} km gefahren
              </p>

              {Object.keys(e.kmPerClient).length > 0 && (
                <div className="ml-4 mt-2 text-sm text-gray-600">
                  <p className="font-medium underline">Kilometer pro Kunde:</p>
                  {Object.entries(e.kmPerClient).map(([clientName, km]) => (
                    <p key={clientName}>↳ {clientName}: {km} km</p>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
