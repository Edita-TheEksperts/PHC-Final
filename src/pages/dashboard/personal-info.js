import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Menu, X } from "lucide-react";
export default function PersonalInfoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    languages: [],
    pets: "",
    allergies: "",
    specialRequests: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    otherLanguage: "",
  });
  const [initialForm, setInitialForm] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isNotifVisible, setIsNotifVisible] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setNotification({
            message: "❌ Kein Token gefunden. Bitte erneut einloggen.",
            type: "error",
          });
          return;
        }

        const res = await axios.get("/api/get-user-info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          const data = res.data;
          const hasPersonalData =
            (data.languages && data.languages.trim() !== "") ||
            (data.pets && data.pets.trim() !== "") ||
            (data.allergies && data.allergies.trim() !== "") ||
            (data.specialRequests && data.specialRequests.trim() !== "") ||
            (data.emergencyContactName && data.emergencyContactName.trim() !== "") ||
            (data.emergencyContactPhone && data.emergencyContactPhone.trim() !== "");

          setIsNotifVisible(!hasPersonalData);

          const languagesArray = data.languages
            ? data.languages.split(",").map((l) => l.trim()).filter(Boolean)
            : [];

          const formData = {
            languages: languagesArray,
            pets: data.pets || "",
            allergies: data.allergies || "",
            specialRequests: data.specialRequests || "",
            emergencyContactName: data.emergencyContactName || "",
            emergencyContactPhone: data.emergencyContactPhone || "",
            otherLanguage: data.otherLanguage || "",
          };

          setForm(formData);
          setInitialForm(formData);
          setIsEditing(!hasPersonalData);

          if (!hasPersonalData) {
            setNotification({
              message: "⚠️ Bitte füllen Sie Ihre persönlichen Informationen aus.",
              type: "warning",
            });
          } else {
            setNotification({ message: "", type: "" });
          }
        }
      } catch (error) {
      }
    }

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    if (!isEditing) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLanguageToggle = (lang) => {
    if (!isEditing) return;
    const updated = form.languages.includes(lang)
      ? form.languages.filter((l) => l !== lang)
      : [...form.languages, lang];
    setForm({ ...form, languages: updated });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setNotification({
          message: "❌ Kein Token gefunden. Bitte erneut einloggen.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      await axios.post("/api/update-user-info", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({
        message: "✅ Ihre Daten wurden erfolgreich gespeichert.",
        type: "success",
      });
      setInitialForm(form);
      setIsEditing(false);
      setLoading(false);

      setTimeout(() => router.push("/client-dashboard"), 1500);
    } catch (error) {
      setNotification({ message: "❌ Fehler beim Speichern.", type: "error" });
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setIsEditing(false);
    setNotification({ message: "", type: "" });
  };

  const languagesText = form.languages.length ? form.languages.join(", ") : "—";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
    <>
  {/* --- MOBILE TOP NAVBAR --- */}
  <div className="lg:hidden bg-[#B99B5F] text-white shadow-lg w-full fixed top-0 left-0 z-50">
    {/* Top bar */}
    <div className="flex items-center justify-between p-4">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push("/client-dashboard")}
      >
        PHC
      </h1>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
    </div>
  </div>

  {/* Fullscreen Mobile Menu Overlay */}
  {isOpen && (
    <div className="lg:hidden fixed inset-0 bg-[#B99B5F] text-white z-40 flex flex-col">
      {/* Top bar inside overlay */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => {
            router.push("/client-dashboard");
            setIsOpen(false);
          }}
        >
          PHC
        </h1>
        <button onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Menu items */}
      <ul className="flex flex-col space-y-6 px-6 py-8 text-lg font-medium">
        <li
          onClick={() => {
            router.push("/client-dashboard");
            setIsOpen(false);
          }}
          className="cursor-pointer hover:text-[#A6884A]"
        >
          Dashboard
        </li>
        <li
          onClick={() => {
            router.push("/dashboard/personal-info");
            setIsOpen(false);
          }}
          className="cursor-pointer hover:text-[#A6884A]"
        >
          Persönliche Informationen
        </li>
        <li
          onClick={() => {
            router.push("/dashboard/formular");
            setIsOpen(false);
          }}
          className="cursor-pointer hover:text-[#A6884A]"
        >
          Formular
        </li>
      </ul>
    </div>
  )}

  {/* --- DESKTOP SIDEBAR --- */}
  <nav className="hidden lg:flex bg-[#B99B5F] text-white p-4 flex-col shadow-lg lg:w-72">
    <h1
      className="text-4xl font-bold text-center mb-12 select-none cursor-pointer"
      onClick={() => router.push("/client-dashboard")}
    >
      PHC
    </h1>

    <ul className="space-y-6 flex-grow">
      <li
        onClick={() => router.push("/client-dashboard")}
        className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
      >
        Dashboard
      </li>
      <li
        onClick={() => router.push("/dashboard/personal-info")}
        className="relative flex items-center gap-3 text-lg font-medium cursor-pointer hover:text-[#A6884A] transition"
      >
        Persönliche Informationen
        {isNotifVisible && (
          <span className="w-4 h-4 bg-[#04436F] rounded-full animate-pulse"></span>
        )}
      </li>
      <li
        onClick={() => router.push("/dashboard/formular")}
        className="text-lg font-medium hover:text-[#A6884A] cursor-pointer transition"
      >
        Formular
      </li>
    </ul>
  </nav>
</>
     <main className="flex-1 p-2 mt-[50px] lg:mt-0 lg:p-10 max-w-5xl mx-auto">
  <div className="bg-white rounded-3xl shadow-lg p-6 lg:p-12">
    <h2 className="text-4xl font-bold mb-12 text-gray-900 border-b pb-4">Persönliche Informationen</h2>

    {notification.message && (
      <div
        className={`mb-8 px-6 py-4 rounded-lg ${
          notification.type === "success"
            ? "bg-green-100 text-green-800"
            : notification.type === "error"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
        role="alert"
      >
        {notification.message}
      </div>
    )}

    {!isEditing ? (
      <section className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-gray-800">
        {[ // Two-column grid for label and value pairs
          { label: "Sprachen", value: languagesText },
          { label: "Sonstige Sprache", value: form.otherLanguage || "—" },
          { label: "Allergien", value: form.allergies || "—" },
          { label: "Besondere Wünsche", value: form.specialRequests || "—" },
          { label: "Haustiere", value: form.pets || "—" },
          { label: "Notfallkontakt Name", value: form.emergencyContactName || "—" },
          { label: "Notfallkontakt Telefon", value: form.emergencyContactPhone || "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col border-b border-gray-200 pb-4 last:border-b-0">
            <span className="font-semibold text-lg mb-1 text-gray-700">{label}</span>
            <span className="text-base text-gray-900">{value}</span>
          </div>
        ))}

        <div className="col-span-full mt-8 flex justify-start">
          <button
            onClick={() => setIsEditing(true)}
            className="px-10 py-3 bg-[#B99B5F] text-white rounded-2xl font-semibold hover:bg-[#A6884A] transition-shadow shadow-md"
          >
            Bearbeiten
          </button>
        </div>
      </section>
    ) : (
      <section>
        <div className="mb-10">
          <label className="block text-xl font-semibold mb-4">Sprachen</label>
          <div className="flex flex-wrap gap-5 mb-6">
            {["CH-Deutsch", "Deutsch", "Englisch", "Französisch", "Italienisch"].map((lang) => (
              <label
                key={lang}
                className={`cursor-pointer select-none rounded-lg border px-6 py-3 flex items-center gap-3 text-base font-medium ${
                  form.languages.includes(lang)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6"
                  checked={form.languages.includes(lang)}
                  onChange={() => handleLanguageToggle(lang)}
                  disabled={!isEditing}
                />
                <span>{lang}</span>
              </label>
            ))}
          </div>
          <input
            name="otherLanguage"
            placeholder="Sonstige – Freitext"
            value={form.otherLanguage}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border border-gray-300 rounded-xl px-6 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          />
        </div>

        {[ // Inputs with consistent styling and spacing
          { label: "Allergien", name: "allergies", placeholder: "z. B. Pollen, Nüsse..." },
          { label: "Besondere Wünsche", name: "specialRequests", placeholder: "z. B. vegetarische Mahlzeiten" },
          { label: "Haustiere", name: "pets", placeholder: "z. B. Katze, Hund, Vogel..." },
          { label: "Notfallkontakt Name", name: "emergencyContactName", placeholder: "z. B. Maria Muster" },
          { label: "Notfallkontakt Telefon", name: "emergencyContactPhone", placeholder: "z. B. +41 79 123 45 67" },
        ].map(({ label, name, placeholder }) => (
          <div className="mb-8" key={name}>
            <label className="block text-xl font-semibold mb-3">{label}</label>
            <input
              name={name}
              value={form[name]}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder={placeholder}
              className="w-full border border-gray-300 rounded-xl px-6 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
            />
          </div>
        ))}

        <div className="flex gap-8 mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-10 py-3 bg-[#B99B5F] text-white rounded-2xl font-semibold hover:bg-[#A6884A] transition-shadow shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-10 py-3 bg-gray-300 rounded-2xl font-semibold hover:bg-gray-400 transition-shadow shadow-sm"
          >
            Abbrechen
          </button>
        </div>
      </section>
    )}
  </div>
</main>

    </div>
  );
}
