
import { useState } from "react";

export default function RegisterForm4({ onComplete }) {
   const [form, setForm] = useState({
    mobility: [],
    transport: [],
    appointments: [],
    appointmentsOther: "",
    shoppingAssist: "",
    shoppingType: [],
    briefkasten: "",
    postfach: "",
    sonstige: ""
  });

  const handleCheckbox = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Token fehlt.");
      return;
    }

    try {
      const res = await fetch("/api/user/saveForm4", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mobility: form.mobility.join(", "),
          transport: form.transport.join(", "),
          appointments: form.appointments.join(", "),
          shoppingType: form.shoppingType.join(", "),
          appointmentsOther: form.appointmentsOther,
          shoppingAssist: form.shoppingAssist,
          briefkasten: form.briefkasten,
          postfach: form.postfach,
          sonstige: form.sonstige,
        }),
      });

      if (res.ok) {
        // Save completion flag in localStorage
        localStorage.setItem("form4Completed", "true");
        onComplete();
      } else {
        alert("Fehler beim Speichern des Formulars");
      }
    } catch (err) {
      alert("Netzwerkfehler – bitte versuche es erneut.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Alltagsbegleitung und Besorgungen</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobilitätsmittel */}
        <div>
          <label className="font-semibold">Sind Mobilitätsmittel vorhanden?</label>
          <div className="space-y-2 mt-2">
            {["Rollstuhl", "Rollator", "Gehstock"].map((item) => (
              <label key={item} className="block">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox("mobility", item)}
                  checked={form.mobility.includes(item)}
                />{" "}
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Transportmittel */}
        <div>
          <label className="font-semibold">Wie kommen wir von A nach B?</label>
          <div className="space-y-2 mt-2">
            {["Eigenes Auto", "Automatik", "Manuell", "Mitarbeiter Auto", "ÖV", "Taxi"].map((item) => (
              <label key={item} className="block">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox("transport", item)}
                  checked={form.transport.includes(item)}
                />{" "}
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Termine */}
        <div>
          <label className="font-semibold">Begleitung zu Terminen</label>
          <div className="space-y-2 mt-2">
            {["Arzt", "Physiotherapie", "Behörde"].map((item) => (
              <label key={item} className="block">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox("appointments", item)}
                  checked={form.appointments.includes(item)}
                />{" "}
                {item}
              </label>
            ))}
            <label className="block mt-2">Andere:
              <input
                type="text"
                name="appointmentsOther"
                value={form.appointmentsOther}
                onChange={handleChange}
                className="border w-full mt-1 px-3 py-2 rounded"
              />
            </label>
          </div>
        </div>

        {/* Einkäufe */}
        <div>
          <label className="font-semibold">Einkäufe erledigen</label>
          <div className="mt-2 space-y-2">
            <label className="block">
              Begleiten Sie die Betreuungskraft?
              <select
                name="shoppingAssist"
                value={form.shoppingAssist}
                onChange={handleChange}
                className="w-full border mt-1 px-3 py-2 rounded"
              >
                <option value="">Bitte wählen</option>
                <option value="Ja">Ja</option>
                <option value="Nein">Nein</option>
              </select>
            </label>

            <label className="block font-medium mt-2">Welche Einkäufe?</label>
            {["Lebensmittel", "Apotheke", "Garten", "Kleidung"].map((item) => (
              <label key={item} className="block">
                <input
                  type="checkbox"
                  onChange={() => handleCheckbox("shoppingType", item)}
                  checked={form.shoppingType.includes(item)}
                />{" "}
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Postgänge */}
        <div>
          <label className="font-semibold">Postgänge</label>
          <div className="space-y-2 mt-2">
            <input
              type="text"
              name="briefkasten"
              value={form.briefkasten}
              onChange={handleChange}
              placeholder="Wo befindet sich der Briefkastenschlüssel?"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="postfach"
              value={form.postfach}
              onChange={handleChange}
              placeholder="Welches Postfach gehört Ihnen?"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Sonstiges */}
        <div>
          <label className="font-semibold">Sonstige Begleitungen</label>
          <textarea
            name="sonstige"
            value={form.sonstige}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-2"
            rows="3"
            placeholder="Andere Wünsche oder Informationen"
          ></textarea>
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full">
          Speichern & Fortfahren
        </button>
      </form>
    </div>
  );
}
