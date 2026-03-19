import { useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function WorkingTimeTracking({ employees }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAssignedOnly, setShowAssignedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [minHours, setMinHours] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredEmployees = employees
    .filter((e) =>
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => {
      if (showAssignedOnly) {
        return e.assignments?.some((a) => a.user?.schedules?.length > 0);
      }
      return true;
    })
    .filter((e) => {
      const total = e.assignments
        ?.flatMap((a) => a.user?.schedules || [])
        .reduce((sum, s) => sum + (s.hours || 0), 0);
      return total >= minHours;
    });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#04436F]">⏱ Arbeitszeiterfassung</h2>
          <p className="text-sm text-gray-500">
            Arbeitsstunden erfassen, nach Zeitplan filtern und schnelle Einblicke erhalten.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="🔍 Suche nach Namen"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg text-sm w-48"
          />

          <div className="flex items-center gap-2">
            <label htmlFor="minHours" className="text-sm text-gray-600">
Mindeststunden:            
</label>
            <input
              type="range"
              id="minHours"
              min="0"
              max="60"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm font-medium text-gray-700 w-6 text-center">{minHours}</span>
          </div>

          <button
            onClick={() => setShowAssignedOnly((prev) => !prev)}
            className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition border"
          >
            <Filter size={16} className="mr-2" />
            {showAssignedOnly ? "Alle Mitarbeiter" : "Nur zugewiesen"}
          </button>
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm mb-4 text-gray-600">
        <strong>{filteredEmployees.length}</strong> passende Mitarbeiter werden angezeigt
      </p>

      {/* No result */}
      {filteredEmployees.length === 0 ? (
        <p className="text-gray-500 text-sm italic">Keine passenden Mitarbeiter gefunden.</p>
      ) : (
        <div className="space-y-4">
          {filteredEmployees.map((e, index) => {
            const isOpen = openIndex === index;

            const allSchedules =
              e.assignments?.flatMap((a) => a.user?.schedules || []) || [];

            const totalHours = allSchedules.reduce(
              (sum, s) => sum + (s.hours || 0),
              0
            );

            return (
              <div
                key={e.id}
                className="border rounded-xl p-4 shadow-sm bg-gray-50 hover:bg-gray-100 transition-all"
              >
                {/* Employee Header */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggle(index)}
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {e.firstName} {e.lastName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
Gesamtstunden:                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {totalHours} Std./Woche
                      </span>
                    </p>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </div>

                {/* Schedule List */}
                {isOpen && (
                  <ul className="mt-4 space-y-2 text-sm text-gray-700 pl-1">
                    {allSchedules.length > 0 ? (
                      allSchedules.map((s) => (
                        <li
                          key={s.id}
                          className="flex justify-between border rounded-lg px-4 py-2 bg-white hover:bg-gray-50"
                        >
                          <span>📅 {s.day}</span>
                          <span>
                            ⏰ {s.startTime} →{" "}
                            <span className="font-semibold">{s.hours}h</span>
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 italic">Kein Zeitplan zugewiesen</li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
