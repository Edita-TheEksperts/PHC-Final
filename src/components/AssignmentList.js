import { useState } from "react";

const STATUS_CONFIG = {
  inProgress: { label: "Aktiv",         dot: "bg-blue-400",   badge: "bg-blue-50 text-blue-700 border-blue-200" },
  done:       { label: "Erledigt",      dot: "bg-emerald-400",badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  future:     { label: "Geplant",       dot: "bg-gray-400",   badge: "bg-gray-100 text-gray-600 border-gray-200" },
  cancelled:  { label: "Storniert",     dot: "bg-red-400",    badge: "bg-red-50 text-red-600 border-red-200" },
  noSchedule: { label: "Kein Termin",   dot: "bg-orange-400", badge: "bg-orange-50 text-orange-600 border-orange-200" },
};

export default function AssignmentsList({ confirmedAssignments = [], onUpdate }) {
  const today = new Date();
  const [updates, setUpdates] = useState({});

  const handleCancel = async (s) => {
    if (!window.confirm("Sind Sie sicher, dass Sie diesen Einsatz stornieren möchten?")) return;
    try {
      const res = await fetch("/api/schedule/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId: s.scheduleId }),
      });
      if (!res.ok) throw new Error();
      alert("Einsatz wurde storniert und alle Parteien informiert.");
      if (onUpdate) onUpdate();
    } catch {
      alert("Fehler beim Stornieren des Einsatzes.");
    }
  };

  const handleSave = async (s) => {
    const { extraHours, extraKm } = updates[s.id] || {};
    if ((extraHours && extraHours < 0) || (extraKm && extraKm < 0)) {
      alert("Negative Werte sind nicht erlaubt.");
      return;
    }
    if ((extraHours === "" || extraHours === undefined) && (extraKm === "" || extraKm === undefined)) return;
    try {
      const res = await fetch("/api/employee/update-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: s.scheduleId,
          hours: Number(extraHours || 0),
          kilometers: Number(extraKm || 0),
          employeeId: s.employeeId,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUpdates(prev => ({ ...prev, [s.id]: {} }));
      confirmedAssignments.forEach(a => {
        a.user.schedules?.forEach(sch => {
          if (sch.id === s.scheduleId) {
            sch.hours = data.schedule.hours;
            sch.kilometers = data.schedule.kilometers;
          }
        });
      });
      if (onUpdate) onUpdate();
    } catch {
      alert("Fehler beim Speichern der Daten.");
    }
  };

  const schedules = confirmedAssignments.flatMap(assignment => {
    const client = assignment.user;
    if (!client?.schedules || client.schedules.length === 0) {
      return [{
        id: assignment.id,
        assignmentId: assignment.id,
        scheduleId: null,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map(s => s.name).join(", ") || "—",
        date: null,
        startTime: null,
        status: "noSchedule",
        baseHours: 0,
        baseKm: 0,
      }];
    }
    return client.schedules.map(schedule => {
      const date = schedule.date ? new Date(schedule.date) : null;
      let status = "future";
      if (schedule.status === "cancelled") status = "cancelled";
      else if (date) {
        if (date.toDateString() === today.toDateString()) status = "inProgress";
        else if (date < today) status = "done";
      }
      return {
        id: `${assignment.id}-${schedule.id}`,
        assignmentId: assignment.id,
        scheduleId: schedule.id,
        employeeId: assignment.employeeId,
        clientName: `${client.firstName} ${client.lastName}`,
        service: client.services?.map(s => s.name).join(", ") || "—",
        date,
        startTime: schedule.startTime,
        status,
        baseHours: schedule.hours || 0,
        baseKm: schedule.kilometers || 0,
      };
    });
  });

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition";

  const renderCard = (s) => {
    const cfg = STATUS_CONFIG[s.status] || STATUS_CONFIG.future;
    return (
      <div key={s.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-sm text-gray-900">{s.clientName}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.service}</p>
          </div>
          <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          {s.date ? (
            <span>
              {s.date.toLocaleDateString("de-DE", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" })}
              {s.startTime && ` · ${s.startTime} Uhr`}
            </span>
          ) : (
            <span className="italic text-gray-400">Kein Datum gesetzt</span>
          )}
        </div>

        <div className="flex gap-4 text-xs text-gray-500 pb-1">
          <span>{s.baseHours} Std</span>
          <span>·</span>
          <span>{s.baseKm} km</span>
        </div>

        {s.status === "done" && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Zusätzliche Einträge</p>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number" min="0" placeholder="+ Stunden"
                className={inputCls}
                value={updates[s.id]?.extraHours || ""}
                onChange={e => setUpdates(prev => ({ ...prev, [s.id]: { ...prev[s.id], extraHours: e.target.value } }))}
              />
              <input
                type="number" min="0" placeholder="+ km"
                className={inputCls}
                value={updates[s.id]?.extraKm || ""}
                onChange={e => setUpdates(prev => ({ ...prev, [s.id]: { ...prev[s.id], extraKm: e.target.value } }))}
              />
            </div>
            <button
              onClick={() => handleSave(s)}
              className="w-full py-2 bg-[#0F1F38] hover:bg-[#1a3050] text-white text-sm font-medium rounded-lg transition"
            >
              Speichern
            </button>
          </div>
        )}

        {(s.status === "inProgress" || s.status === "future") && (
          <div className="pt-1 border-t border-gray-100">
            <button
              onClick={() => handleCancel(s)}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition"
            >
              Stornieren
            </button>
          </div>
        )}
      </div>
    );
  };

  if (schedules.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-gray-400">Keine bestätigten Einsätze.</p>
      </div>
    );
  }

  const groups = [
    { key: "inProgress", label: "Aktiv" },
    { key: "done",       label: "Erledigt" },
    { key: "future",     label: "Geplant" },
    { key: "cancelled",  label: "Storniert" },
    { key: "noSchedule", label: "Kein Termin" },
  ];

  return (
    <div className="space-y-6">
      {groups.map(({ key, label }) => {
        const items = schedules.filter(s => s.status === key);
        if (items.length === 0) return null;
        const cfg = STATUS_CONFIG[key];
        return (
          <div key={key}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</h4>
              <span className="text-xs text-gray-400">({items.length})</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map(renderCard)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
