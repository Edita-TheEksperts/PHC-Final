import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmployeeLayout from "../components/EmployeeLayout";

const MARITAL_OPTIONS = ["Verheiratet", "Geschieden", "Ledig", "Verwitwet"];

function toDateInputValue(d) {
  if (!d) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function EmployeeBank() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [payment, setPayment] = useState({ iban: "", accountHolder: "", bankName: "", bic: "" });
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentEditing, setPaymentEditing] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState(null);
  const [bankLastChanged, setBankLastChanged] = useState(null);

  // Personal info (Birthday, Zivilstand, AHV, Kinder)
  const [personal, setPersonal] = useState({ birthDate: "", maritalStatus: "", ahvNumber: "", hasChildren: "" });
  const [personalEditing, setPersonalEditing] = useState(false);
  const [personalMsg, setPersonalMsg] = useState({ type: "", text: "" });

  const populateFromData = (data) => {
    setEmployee(data);
    setPayment({
      iban: data.iban || "",
      accountHolder: data.accountHolder || "",
      bankName: data.bankName || "",
      bic: data.bic || "",
    });
    if (data.iban && data.accountHolder && data.bankName) setPaymentSaved(true);
    setBankLastChanged(data.bankUpdatedAt || null);
    setPersonal({
      birthDate: toDateInputValue(data.birthDate),
      maritalStatus: data.maritalStatus || "",
      ahvNumber: data.ahvNumber || "",
      hasChildren: data.hasChildren === true ? "yes" : data.hasChildren === false ? "no" : "",
    });
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) { router.push("/login"); return; }

    const fetchData = async () => {
      try {
        const res = await fetch("/api/get-employee", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        populateFromData(data);

        const resTotals = await fetch("/api/employee/total-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setPaymentTotals(await resTotals.json());
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employee.email, ...payment }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      const updatedAt = json?.updated?.bankUpdatedAt || new Date().toISOString();
      setPaymentSaved(true);
      setPaymentEditing(false);
      setBankLastChanged(updatedAt);
      setPaymentMsg({ type: "success", text: "Bankdaten erfolgreich gespeichert." });
    } catch {
      setPaymentMsg({ type: "error", text: "Fehler beim Speichern der Bankdaten." });
    }
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonal(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    setPersonalMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/update-employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: employee.email,
          birthDate: personal.birthDate || null,
          maritalStatus: personal.maritalStatus || null,
          ahvNumber: personal.ahvNumber || null,
          hasChildren: personal.hasChildren === "yes" ? true : personal.hasChildren === "no" ? false : null,
        }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      populateFromData(updated);
      setPersonalEditing(false);
      setPersonalMsg({ type: "success", text: "Persönliche Angaben gespeichert." });
    } catch {
      setPersonalMsg({ type: "error", text: "Fehler beim Speichern." });
    }
  };

  if (loading) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#04436F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Lade Finanzdaten...</p>
        </div>
      </div>
    </EmployeeLayout>
  );

  if (!employee) return (
    <EmployeeLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sm text-gray-500">Keine Daten gefunden.</p>
      </div>
    </EmployeeLayout>
  );

  const t = paymentTotals?.thisMonth;
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition";
  const labelCls = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <EmployeeLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-2xl">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Finanzen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Zahlungsübersicht und Bankverbindung</p>
        </div>

        {/* Stat cards */}
        {t && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Service Stunden diesen Monat", value: `${t.serviceHours ?? 0}h`, border: "border-l-blue-400" },
              { label: "Gefahrene Kilometer diesen Monat", value: `${t.kilometers ?? 0} km`, border: "border-l-purple-400" },
            ].map(({ label, value, border }) => (
              <div key={label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} p-4`}>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {!t && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-400">Keine Zahlungsdaten für diesen Monat.</p>
          </div>
        )}

        {/* Persönliche Angaben */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Persönliche Angaben</h2>
            {!personalEditing && (
              <button
                onClick={() => setPersonalEditing(true)}
                className="text-xs font-medium text-[#04436F] hover:underline"
              >
                Bearbeiten
              </button>
            )}
          </div>
          {personalEditing ? (
            <form onSubmit={handlePersonalSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Geburtsdatum</label>
                  <input type="date" name="birthDate" value={personal.birthDate} onChange={handlePersonalChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Zivilstand</label>
                  <select name="maritalStatus" value={personal.maritalStatus} onChange={handlePersonalChange} className={inputCls}>
                    <option value="">Bitte wählen</option>
                    {MARITAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>AHV-Nummer</label>
                  <input type="text" name="ahvNumber" value={personal.ahvNumber} onChange={handlePersonalChange}
                    placeholder="756.XXXX.XXXX.XX" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Kinder</label>
                  <select name="hasChildren" value={personal.hasChildren} onChange={handlePersonalChange} className={inputCls}>
                    <option value="">Bitte wählen</option>
                    <option value="yes">Ja</option>
                    <option value="no">Nein</option>
                  </select>
                </div>
              </div>

              {personalMsg.text && (
                <div className={`p-3 rounded-lg text-sm border ${
                  personalMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                  "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {personalMsg.text}
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2.5 bg-[#04436F] hover:bg-[#033558] text-white text-sm font-medium rounded-lg transition">
                  Speichern
                </button>
                <button type="button"
                  onClick={() => {
                    setPersonalEditing(false);
                    populateFromData(employee);
                    setPersonalMsg({ type: "", text: "" });
                  }}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition">
                  Abbrechen
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Geburtsdatum", value: employee.birthDate ? new Date(employee.birthDate).toLocaleDateString("de-CH") : "—" },
                { label: "Zivilstand", value: employee.maritalStatus || "—" },
                { label: "AHV-Nummer", value: employee.ahvNumber || "—" },
                { label: "Kinder", value: employee.hasChildren === true ? "Ja" : employee.hasChildren === false ? "Nein" : "—" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className={labelCls}>{label}</p>
                  <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                    {value}
                  </div>
                </div>
              ))}
              {personalMsg.text && (
                <div className={`sm:col-span-2 p-3 rounded-lg text-sm border ${
                  personalMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                  "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {personalMsg.text}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bank details card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bankverbindung</h2>
          </div>

          {paymentSaved && !paymentEditing ? (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "IBAN", value: payment.iban },
                  { label: "Kontoinhaber", value: payment.accountHolder },
                  { label: "Bankname", value: payment.bankName },
                  { label: "BIC / SWIFT", value: payment.bic || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className={labelCls}>{label}</p>
                    <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {bankLastChanged && (
                <p className="text-xs text-gray-400">Letzte Änderung: {new Date(bankLastChanged).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              )}

              {paymentMsg.text && (
                <div className={`p-3 rounded-lg text-sm border ${
                  paymentMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                  paymentMsg.type === "info" ? "bg-blue-50 border-blue-200 text-blue-800" :
                  "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {paymentMsg.text}
                </div>
              )}

              <button
                onClick={() => setPaymentEditing(true)}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Bankdaten bearbeiten
              </button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>IBAN *</label>
                  <input type="text" name="iban" value={payment.iban} onChange={handlePaymentChange}
                    placeholder="CH56 0483 5012 3456 7800 9" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Kontoinhaber *</label>
                  <input type="text" name="accountHolder" value={payment.accountHolder} onChange={handlePaymentChange}
                    placeholder="Vor- und Nachname" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Bankname *</label>
                  <input type="text" name="bankName" value={payment.bankName} onChange={handlePaymentChange}
                    placeholder="z.B. UBS AG" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>BIC / SWIFT *</label>
                  <input type="text" name="bic" value={payment.bic} onChange={handlePaymentChange}
                    placeholder="z.B. UBSWCHZH80A" className={inputCls} required />
                </div>
              </div>

              {paymentMsg.text && (
                <div className={`p-3 rounded-lg text-sm border ${
                  paymentMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                  "bg-red-50 border-red-200 text-red-700"
                }`}>
                  {paymentMsg.text}
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#04436F] hover:bg-[#033558] text-white text-sm font-medium rounded-lg transition">
                  Speichern
                </button>
                {paymentEditing && (
                  <button type="button"
                    onClick={() => {
                      setPaymentEditing(false);
                      setPayment({ iban: employee.iban || "", accountHolder: employee.accountHolder || "", bankName: employee.bankName || "", bic: employee.bic || "" });
                      setPaymentMsg({ type: "", text: "" });
                    }}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition">
                    Abbrechen
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

      </div>
    </EmployeeLayout>
  );
}
