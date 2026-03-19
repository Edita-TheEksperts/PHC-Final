import { useState } from "react";

export default function RegisterForm1({ onComplete }) {
  const [form, setForm] = useState({
    rooms: "",
    people: "",
    tasks: {} // key: task name, value: { answer: "Ja"/"Nein", details: "", extra: "" }
  });

  const tasksList = [
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung Abfall",
    "Kleider waschen/Bügeln/verräumen",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen"
  ];

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskChange = (task, field, value) => {
    setForm(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task]: {
          ...prev.tasks[task],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      alert("Token fehlt.");
      return;
    }

    try {
      const res = await fetch("/api/user/saveForm1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        localStorage.setItem("form1Completed", "true");
        onComplete();
      } else {
        const text = await res.text();
        alert("Fehler beim Speichern des Formulars");
      }
    } catch (err) {
      alert("Netzwerkfehler – bitte versuche es erneut.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Haushaltshilfe & Wohnpflege</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Allgemeine Angaben */}
        <div>
          <label className="font-semibold block mb-1">Anzahl Zimmer</label>
          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="z. B. 3"
            value={form.rooms}
            onChange={(e) => handleChange("rooms", e.target.value)}
          />

          <label className="font-semibold block mt-4 mb-1">Wieviel-Personen-Haushalt?</label>
          <input
            type="number"
            className="w-full border px-4 py-2 rounded"
            placeholder="z. B. 2"
            value={form.people}
            onChange={(e) => handleChange("people", e.target.value)}
          />
        </div>

        {/* Aufgaben */}
        {tasksList.map((task) => (
          <div key={task}>
            <label className="font-semibold block mb-1">{task}</label>
            <select
              className="w-full border px-4 py-2 rounded mb-2"
              value={form.tasks[task]?.answer || ""}
              onChange={(e) => handleTaskChange(task, "answer", e.target.value)}
            >
              <option value="">Bitte wählen</option>
              <option value="Ja">Ja</option>
              <option value="Nein">Nein</option>
            </select>

            {task === "Kochen" && (
              <input
                type="text"
                className="w-full border px-4 py-2 rounded"
                placeholder="Für wieviele Personen?"
                value={form.tasks[task]?.extra || ""}
                onChange={(e) => handleTaskChange(task, "extra", e.target.value)}
              />
            )}

            <input
              type="text"
              className="w-full border px-4 py-2 rounded mt-2"
              placeholder="Weitere Details (optional)"
              value={form.tasks[task]?.details || ""}
              onChange={(e) => handleTaskChange(task, "details", e.target.value)}
            />
          </div>
        ))}

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern
        </button>
      </form>
    </div>
  );
}
