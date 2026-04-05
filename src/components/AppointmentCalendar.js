import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useMemo } from "react";
import { useRouter } from "next/router";

export default function AppointmentCalendar({ schedules }) {

  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const router = useRouter();

  // ✅ FIX: compare dates in LOCAL timezone (avoids UTC day shifting)
  const toLocalISO = (d) => {
    if (!d) return null;
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString("sv-SE"); // YYYY-MM-DD
  };

  const selectedISO = selectedDate ? toLocalISO(selectedDate) : null;

  // ✅ highlight ALL appointments (not only assigned)
  const appointmentsForCalendar = useMemo(() => schedules, [schedules]);

  const filteredAppointments = useMemo(() => {
    if (!selectedISO) return schedules;
    return schedules.filter((s) => s.date && toLocalISO(s.date) === selectedISO);
  }, [selectedISO, schedules]);

  function formatDate(d) {
    return new Date(d).toLocaleDateString("de-DE");
  }

  function handleAppointmentClick(id) {
    router.push(`/appointments/${id}`);
  }

  return (
    <div>
      <style jsx>{`
        /* keep weekends normal (not red) */
        :global(.react-calendar__month-view__days__day--weekend) {
          color: #1f2937 !important;
        }

        /* ✅ circle highlight for days that have appointments */
        :global(.react-calendar__tile.has-appointment abbr) {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          border: 2px solid #2563eb;
          font-weight: 700;
        }
      `}</style>

      {/* Title handled by parent */}

      <Calendar
        onChange={(date) => {
          setCalendarDate(date);
          setSelectedDate(date);
        }}
        value={calendarDate}
        className="w-full mb-4 border rounded-xl p-6"
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          const iso = toLocalISO(date);

          const hasAppointment = appointmentsForCalendar.some(
            (s) => s.date && toLocalISO(s.date) === iso
          );

          return hasAppointment ? "has-appointment" : "";
        }}
        tileContent={({ date }) => {
          const iso = toLocalISO(date);

          const hasAppointment = appointmentsForCalendar.some(
            (s) => s.date && toLocalISO(s.date) === iso
          );

          return hasAppointment ? (
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 mx-auto" />
          ) : null;
        }}
      />

      <button
        onClick={() => setIsOpen((p) => !p)}
        className="mt-4 px-4 py-2 bg-[#04436F] text-white text-sm font-semibold rounded-xl hover:bg-[#033252] transition-all"
      >
        {isOpen ? "🔽 Termine ausblenden" : `📂 Termine (${filteredAppointments.length})`}
      </button>

      {selectedDate && (
        <button
          onClick={() => setSelectedDate(null)}
          className="ml-4 text-xs underline text-gray-500 hover:text-gray-700"
        >
          Reset date filter
        </button>
      )}

      {isOpen && (
        <div className="mt-4">
          {filteredAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Keine Termine geplant.</p>
          ) : (
            <ul className="max-h-[400px] overflow-auto pr-1 space-y-2">
              {filteredAppointments.map((a) => (
                <li
                  key={a.id}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex-1">
                    <p onClick={() => handleAppointmentClick(a.id)} className="font-medium text-gray-900 text-sm hover:text-[#04436F] hover:underline cursor-pointer">
                      {a.user?.firstName || "—"} {a.user?.lastName || ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.serviceName || a.subServiceName || "Service"} · {a.date ? formatDate(a.date) : `${a.day || ""} ${a.startTime || ""}`}
                    </p>
                    {a.employee ? (
                      <p className="text-xs text-emerald-600 mt-0.5">{a.employee.firstName} {a.employee.lastName}</p>
                    ) : (
                      <p className="text-xs text-red-500 mt-0.5 font-medium">Kein Mitarbeiter zugewiesen</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                      a.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" :
                      a.status === "terminated" ? "bg-gray-100 text-gray-600 border-gray-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>{a.status || "active"}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/appointments/${a.id}`);
                      }}
                      className="text-xs bg-[#04436F] text-white px-3 py-1.5 rounded-lg hover:bg-[#033558] transition"
                    >
                      Details
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
