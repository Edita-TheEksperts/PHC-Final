import { useState } from "react";

export default function RegisterForm2({ onComplete }) {
  const [form, setForm] = useState({
    mobility: [],
    transport: [],
    companionship: "",
    cooking: "",
    hasAllergies: "",
    allergyDetails: "",
    hasTech: "",
    reads: "",
    playsCards: "",
    outings: []
  });

  const handleCheckbox = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value]
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
      const res = await fetch("/api/user/saveForm2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        localStorage.setItem("form2Completed", "true");
        onComplete();
      } else {
        alert("Fehler beim Speichern des Formulars");
      }
    } catch (err) {
      alert("Netzwerkfehler – bitte versuche es erneut.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-[#04436F]">Form für Freizeit & Soziale Aktivitäten</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Mobilitätsmittel */}
        <div>
          <label className="font-semibold">Sind Mobilitätsmittel vorhanden?</label>
          {["Rollstuhl", "Rollator", "Gehstock"].map((item) => (
            <label key={item} className="block">
              <input
                type="checkbox"
                checked={form.mobility.includes(item)}
                onChange={() => handleCheckbox("mobility", item)}
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>

        {/* Transportmittel */}
        <div>
          <label className="font-semibold">Wie kommen wir von A nach B?</label>
          {[
            "Eigenes Auto (Automat)",
            "Eigenes Auto (Manuell)",
            "Auto vom Mitarbeiter (CHF 1.--/km)",
            "ÖV (Kosten vom Kunden)",
            "Taxi"
          ].map((item) => (
            <label key={item} className="block">
              <input
                type="checkbox"
                checked={form.transport.includes(item)}
                onChange={() => handleCheckbox("transport", item)}
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>

        {/* Gesellschaft leisten */}
        <div>
          <label className="font-semibold">Gesellschaft leisten?</label>
          <select
            name="companionship"
            value={form.companionship}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Kochen */}
        <div>
          <label className="font-semibold">Gemeinsames Kochen?</label>
          <select
            name="cooking"
            value={form.cooking}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Allergien */}
        <div>
          <label className="font-semibold">Leiden Sie an Allergien?</label>
          <select
            name="hasAllergies"
            value={form.hasAllergies}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
          <input
            type="text"
            name="allergyDetails"
            value={form.allergyDetails}
            onChange={handleChange}
            placeholder="Welche?"
            className="w-full border mt-2 px-4 py-2 rounded"
          />
        </div>

        {/* Biographiearbeit */}
        <div>
          <label className="font-semibold">Biographiearbeit – Technische Mittel vorhanden?</label>
          <select
            name="hasTech"
            value={form.hasTech}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Vorlesen */}
        <div>
          <label className="font-semibold">Vorlesen?</label>
          <select
            name="reads"
            value={form.reads}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Kartenspiele */}
        <div>
          <label className="font-semibold">Kartenspiele?</label>
          <select
            name="playsCards"
            value={form.playsCards}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Bitte wählen</option>
            <option>Ja</option>
            <option>Nein</option>
          </select>
        </div>

        {/* Ausflüge */}
        <div>
          <label className="font-semibold">Ausflüge & Reisebegleitung (Kosten vom Kunden)</label>
          {[
            "Theaterbesuch",
            "Kinobesuch",
            "Konzertbesuch",
            "Fussballspiel",
            "Urlaubsbegleitung"
          ].map((item) => (
            <label key={item} className="block">
              <input
                type="checkbox"
                checked={form.outings.includes(item)}
                onChange={() => handleCheckbox("outings", item)}
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern
        </button>
      </form>
    </div>
  );
}
