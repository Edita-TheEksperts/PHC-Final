import React, { useState, useRef, useEffect } from "react";

export default function DateEmployee({ form, setForm, handleChange, hidden, errors }) {
  const [openStartIndex, setOpenStartIndex] = useState(null);
  const [openEndIndex, setOpenEndIndex] = useState(null);
  const sectionRef = useRef(null);

  const availableDays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];

  useEffect(() => {
    if (errors?.availabilityDays && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h <= 23; h++) {
    const hour = h.toString().padStart(2, "0");
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  return times;
};

  const addDay = () => {
    if (!form.newAvailableDay) return;
    const updated = [
      ...(form.availabilityDays || []),
      { day: form.newAvailableDay, startTime: "08:00", endTime: "17:00" },
    ];
    setForm((prev) => ({
      ...prev,
      availabilityDays: updated,
      newAvailableDay: "",
    }));
  };

  const updateTime = (index, field, value) => {
    const updated = [...form.availabilityDays];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, availabilityDays: updated }));
  };

  const removeDay = (index) => {
    const updated = form.availabilityDays.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, availabilityDays: updated }));
  };

  return (
    <div ref={sectionRef} className="mb-14" hidden={hidden}>
<h3 className="font-semibold mb-2 text-lg text-gray-900 tracking-wide">
  Ihre Verfügbarkeit
</h3>

<p className="text-sm text-gray-600 mb-6">
 Info: Um Ihre Verfügbarkeit anzugeben Wochentag auswählen und die gewünschte Einsatzzeit auswählen.
</p>

      {/* Add new day */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        <select
          value={form.newAvailableDay || ""}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, newAvailableDay: e.target.value }))
          }
          className="border border-gray-300 bg-white px-4 py-2 rounded-full w-56 text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none transition"
        >
          <option value="">Wochentag wählen</option>
          {availableDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addDay}
          className="px-5 py-2 bg-[#0C243C] text-white text-sm font-medium rounded-full hover:bg-[#123a60] transition"
        >
          Hinzufügen
        </button>
      </div>

      {/* Availability cards */}
      <div className="flex flex-wrap gap-4">
        {form.availabilityDays?.map((entry, index) => (
          <div
            key={index}
            className="flex gap-4 items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300 relative"
          >
            {/* Day name */}
            <span className="min-w-[80px] font-medium">{entry.day}</span>

            {/* Start time dropdown */}
            <div className="relative">
              <button
                type="button"
                className="border px-4 py-2 rounded-md bg-white w-28 text-sm text-gray-700 shadow-sm"
                onClick={() => {
                  setOpenStartIndex(openStartIndex === index ? null : index);
                  setOpenEndIndex(null);
                }}
              >
                {entry.startTime}
              </button>

              {openStartIndex === index && (
                <div className="absolute left-0 top-12 z-20 bg-white border border-gray-200 rounded-xl shadow-lg grid grid-cols-4 gap-3 p-4 max-h-64 overflow-y-auto w-72">
                  {generateTimeOptions().map((time) => (
                    <button
                      key={time}
                      className={`px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                        entry.startTime === time
                          ? "bg-[#0C243C] text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => {
                        updateTime(index, "startTime", time);
                        setOpenStartIndex(null);
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* End time dropdown */}
            <div className="relative">
              <button
                type="button"
                className="border px-4 py-2 rounded-md bg-white w-28 text-sm text-gray-700 shadow-sm"
                onClick={() => {
                  setOpenEndIndex(openEndIndex === index ? null : index);
                  setOpenStartIndex(null);
                }}
              >
                {entry.endTime}
              </button>

              {openEndIndex === index && (
                <div className="absolute left-0 top-12 z-20 bg-white border border-gray-200 rounded-xl shadow-lg grid grid-cols-4 gap-3 p-4 max-h-64 overflow-y-auto w-72">
                  {generateTimeOptions().map((time) => (
                    <button
                      key={time}
                      className={`px-4 py-2 rounded-lg text-sm transition-all font-medium ${
                        entry.endTime === time
                          ? "bg-[#0C243C] text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => {
                        updateTime(index, "endTime", time);
                        setOpenEndIndex(null);
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Remove button */}
            <button
              onClick={() => removeDay(index)}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition ml-auto"
              aria-label="Entfernen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* 🔴 Error message */}
      {errors?.availabilityDays && (
        <p className="text-red-600 text-sm mt-3">{errors.availabilityDays}</p>
      )}
    </div>
  );
}
