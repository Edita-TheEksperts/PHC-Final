import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import EmployeeLayout from "../components/EmployeeLayout";

export default function EmployeeBank() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [payment, setPayment] = useState({ iban: "", accountHolder: "", bankName: "", bic: "" });
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);
  const [paymentTotals, setPaymentTotals] = useState(null);

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
        setEmployee(data);
        setPayment({
          iban: data.iban || "",
          accountHolder: data.accountHolder || "",
          bankName: data.bankName || "",
          bic: data.bic || "",
        });
        if (data.iban && data.accountHolder && data.bankName) setPaymentSaved(true);

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
      setPaymentSaved(true);
      setPaymentMsg({ type: "success", text: "Bankdaten erfolgreich gespeichert." });
    } catch {
      setPaymentMsg({ type: "error", text: "Fehler beim Speichern der Bankdaten." });
    }
  };

  const handlePaymentEditRequest = async () => {
    setPaymentMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/request-payment-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employee.email, name: `${employee.firstName} ${employee.lastName}` }),
      });
      if (!res.ok) throw new Error();
      setPaymentMsg({ type: "info", text: "Ihre Änderungsanfrage wurde an das Team gesendet." });
    } catch {
      setPaymentMsg({ type: "error", text: "Fehler beim Senden der Anfrage." });
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Service-Stunden", value: `${t.serviceHours ?? 0}h`, border: "border-l-blue-400" },
              { label: "Kilometer", value: `${t.kilometers ?? 0} km`, border: "border-l-purple-400" },
              { label: "Einkommen Service", value: `CHF ${t.serviceCost ?? 0}`, border: "border-l-emerald-400" },
              { label: "Einkommen Fahrt", value: `CHF ${t.travelCost ?? 0}`, border: "border-l-amber-400" },
            ].map(({ label, value, border }) => (
              <div key={label} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${border} p-4`}>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Total card */}
        {t && (
          <div className="bg-[#04436F] rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide mb-1">Gesamt diesen Monat</p>
              <p className="text-2xl font-bold text-white">CHF {t.total ?? 0}</p>
            </div>
            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}

        {!t && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-400">Keine Zahlungsdaten für diesen Monat.</p>
          </div>
        )}

        {/* Bank details card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bankverbindung</h2>
          </div>

          {paymentSaved ? (
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
                onClick={handlePaymentEditRequest}
                className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition"
              >
                Änderung der Bankdaten anfragen
              </button>
            </div>
          ) : (
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>IBAN</label>
                  <input type="text" name="iban" value={payment.iban} onChange={handlePaymentChange}
                    placeholder="CH56 0483 5012 3456 7800 9" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Kontoinhaber</label>
                  <input type="text" name="accountHolder" value={payment.accountHolder} onChange={handlePaymentChange}
                    placeholder="Vor- und Nachname" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Bankname</label>
                  <input type="text" name="bankName" value={payment.bankName} onChange={handlePaymentChange}
                    placeholder="z.B. UBS AG" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>BIC / SWIFT</label>
                  <input type="text" name="bic" value={payment.bic} onChange={handlePaymentChange}
                    placeholder="z.B. UBSWCHZH80A" className={inputCls} />
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

              <button type="submit"
                className="w-full py-2.5 bg-[#04436F] hover:bg-[#033558] text-white text-sm font-medium rounded-lg transition">
                Bankdaten speichern
              </button>
            </form>
          )}
        </div>

      </div>
    </EmployeeLayout>
  );
}
