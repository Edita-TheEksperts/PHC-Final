import { useState } from "react";

export default function RegisterForm3({ onComplete }) {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    mobility: [],
    aids: [],
    aidsOther: "",
    incontinence: [],
    communication: {
      Sehen: "",
      Hören: "",
      Sprechen: ""
    },
    foodSupport: [],
    allergies: "",
    basicCare: [],
    basicCareOther: "",
    healthActivities: [],
    healthActivitiesOther: "",
    mentalSupport: "",
    mentalConditions: [],
    medicalFindings: ""
  });

  const handleCheckbox = (name, value) => {
    setForm(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(v => v !== value)
        : [...prev[name], value]
    }));
  };

  const handleCommChange = (sense, value) => {
    setForm(prev => ({
      ...prev,
      communication: {
        ...prev.communication,
        [sense]: value
      }
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");

    if (!token) {
      alert("Token fehlt.");
      return;
    }

    try {
      const res = await fetch("/api/user/saveForm3", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
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
      <h2 className="text-xl font-bold text-[#04436F]">Form für Gesundheitsführsorge</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Körperliche Unterstützung */}
        <div>
          <label className="font-semibold block mb-1">Größe (cm)</label>
          <input name="height" value={form.height} onChange={handleChange} type="number" className="w-full border px-4 py-2 rounded" />

          <label className="font-semibold block mt-4 mb-1">Gewicht (kg)</label>
          <input name="weight" value={form.weight} onChange={handleChange} type="number" className="w-full border px-4 py-2 rounded" />
        </div>

        <div>
          <label className="font-semibold block mb-1">Person ist / braucht:</label>
          {[
            "vollständig mobil", "sturzgefährdet", "Bettlägerig", "Hilfe beim Aufstehen",
            "Hilfe beim Toilettengang", "Hilfe beim Umlagern"
          ].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("mobility", item)} checked={form.mobility.includes(item)} /> {item}
            </label>
          ))}
        </div>

        {/* Hilfsmittel */}
        <div>
          <label className="font-semibold block mb-1">Hilfsmittel vorhanden:</label>
          {[
            "Gehstock", "Rollator", "Rollstuhl", "Hebesitz",
            "Pflegebett", "Patientenlift", "Badewannenlift", "Toilettenstuhl"
          ].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("aids", item)} checked={form.aids.includes(item)} /> {item}
            </label>
          ))}
          <input name="aidsOther" value={form.aidsOther} onChange={handleChange} placeholder="Sonstige Hilfsmittel" className="w-full border px-4 py-2 rounded mt-2" />
        </div>

        {/* Inkontinenz */}
        <div>
          <label className="font-semibold block mb-1">Inkontinenz</label>
          {["Urin", "Stuhl", "Dauerkatheter", "Stoma"].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("incontinence", item)} checked={form.incontinence.includes(item)} /> {item}
            </label>
          ))}
        </div>

        {/* Kommunikationsfähigkeiten */}
        <div>
          <label className="font-semibold block mb-2">Kommunikationsfähigkeiten</label>
          {["Sehen", "Hören", "Sprechen"].map(sense => (
            <div key={sense}>
              <label>{sense}</label>
              <select value={form.communication[sense]} onChange={(e) => handleCommChange(sense, e.target.value)} className="w-full border px-4 py-2 rounded">
                <option value="">Bitte wählen</option>
                <option value="gut">Keine Probleme</option>
                <option value="eingeschränkt">Eingeschränkt</option>
                <option value="schlecht">{sense === "Sehen" ? "Nahezu blind" : sense === "Hören" ? "Nahezu taub" : "Kaum möglich"}</option>
              </select>
            </div>
          ))}
        </div>

        {/* Nahrungsaufnahme */}
        <div>
          <label className="font-semibold block mb-1">Nahrungsaufnahme</label>
          {[
            "Unterstützung notwendig", "Nahrung anreichen notwendig",
            "Flüssigkeitsaufnahme kontrollieren", "Probleme beim Schlucken", "Appetitlosigkeit"
          ].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("foodSupport", item)} checked={form.foodSupport.includes(item)} /> {item}
            </label>
          ))}
        </div>

        {/* Allergien */}
        <div>
          <label className="font-semibold block mb-1">Leiden Sie an Allergien?</label>
          <input name="allergies" value={form.allergies} onChange={handleChange} type="text" className="w-full border px-4 py-2 rounded" />
        </div>

        {/* Grundpflege */}
        <div>
          <label className="font-semibold block mb-1">Grundpflegerische Tätigkeiten</label>
          {["Körperhygiene", "An-/Auskleiden"].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("basicCare", item)} checked={form.basicCare.includes(item)} /> {item}
            </label>
          ))}
          <input name="basicCareOther" value={form.basicCareOther} onChange={handleChange} placeholder="Sonstige Tätigkeiten" className="w-full border px-4 py-2 rounded mt-2" />
        </div>

        {/* Gesundheitsfördernde Aktivitäten */}
        <div>
          <label className="font-semibold block mb-1">Gesundheitsfördernde Aktivitäten</label>
          {["Gymnastik", "Spaziergänge", "Aktivierende Betreuung"].map(item => (
            <label key={item} className="block">
              <input type="checkbox" onChange={() => handleCheckbox("healthActivities", item)} checked={form.healthActivities.includes(item)} /> {item}
            </label>
          ))}
          <input name="healthActivitiesOther" value={form.healthActivitiesOther} onChange={handleChange} placeholder="Sonstiges" className="w-full border px-4 py-2 rounded mt-2" />
        </div>

        {/* Geistige Unterstützung */}
        <div>
          <label className="font-semibold block mb-1">Geistige Unterstützung notwendig?</label>
          <select name="mentalSupport" value={form.mentalSupport} onChange={handleChange} className="w-full border px-4 py-2 rounded">
            <option value="">Bitte wählen</option>
            <option value="Ja">Ja</option>
            <option value="Nein">Nein</option>
          </select>

          <div className="mt-2">
            {[
              "Depressionen", "Demenz-Diagnose", "Alzheimer-Diagnose",
              "Gestörter Tag-/Nachtrhythmus", "Weglauf Tendenz", "Persönlichkeitsveränderungen",
              "Aggressivität", "Apathie", "Starke Unruhe"
            ].map(item => (
              <label key={item} className="block">
                <input type="checkbox" onChange={() => handleCheckbox("mentalConditions", item)} checked={form.mentalConditions.includes(item)} /> {item}
              </label>
            ))}
          </div>
        </div>

        {/* Gesundheitsbefunde */}
        <div>
          <label className="font-semibold block mb-1">Gesundheitsbefunde</label>
          <textarea name="medicalFindings" value={form.medicalFindings} onChange={handleChange} className="w-full border px-4 py-2 rounded" rows="3" />
        </div>

        <button type="submit" className="bg-[#04436F] text-white px-6 py-3 rounded w-full mt-4">
          Speichern & Fortfahren
        </button>
      </form>
    </div>
  );
}
