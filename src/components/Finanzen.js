import { useEffect, useState } from "react";

export default function FinanzenPage() {
  const [payments, setPayments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucherFilter, setVoucherFilter] = useState("all");
  const [voucherDateFrom, setVoucherDateFrom] = useState("");
  const [voucherDateTo, setVoucherDateTo] = useState("");
  const [voucherClient, setVoucherClient] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (payment) => { setSelectedPayment(payment); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setSelectedPayment(null); };

  const clientList = Object.values(
    vouchers.flatMap((v) => v.usedBy || []).reduce((map, user) => { map[user.id] = user; return map; }, {})
  );

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/finances/list");
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
        const voucherRes = await fetch("/api/finances/vouchers");
        const voucherJson = await voucherRes.json();
        setVouchers(voucherJson.vouchers || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="px-6 py-6 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
    </div>
  );

  const filterPaymentsByDate = (list) => {
    if (filter === "all") return list;
    const now = new Date();
    return list.filter((p) => {
      if (!p.paymentDate) return false;
      const d = new Date(p.paymentDate);
      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return d >= startOfWeek;
      }
      if (filter === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      if (filter === "year") return d.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const filterVouchers = (list) => {
    const now = new Date();
    return list.filter((v) => {
      const start = new Date(v.validFrom);
      const end = new Date(v.validUntil);
      if (voucherFilter === "today") {
        const today = new Date().toDateString();
        if (start.toDateString() !== today && end.toDateString() !== today) return false;
      }
      if (voucherFilter === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        if (end < weekStart) return false;
      }
      if (voucherFilter === "month") {
        if (start.getMonth() !== now.getMonth() || start.getFullYear() !== now.getFullYear()) return false;
      }
      if (voucherFilter === "nextMonth") {
        const next = new Date(now.getFullYear(), now.getMonth() + 1);
        if (start.getMonth() !== next.getMonth() || start.getFullYear() !== next.getFullYear()) return false;
      }
      if (voucherDateFrom && new Date(v.validFrom) < new Date(voucherDateFrom)) return false;
      if (voucherDateTo && new Date(v.validUntil) > new Date(voucherDateTo)) return false;
      if (voucherClient) {
        const usedByIds = v.usedBy?.map((u) => u.id) || [];
        if (!usedByIds.includes(String(voucherClient))) return false;
      }
      return true;
    });
  };

  const safePayments = Array.isArray(payments) ? payments : [];
  const bezahlt = filterPaymentsByDate(safePayments.filter((p) => p.status === "bezahlt" || p.status === "manuell"));
  const offen = filterPaymentsByDate(safePayments.filter((p) => p.status === "offen"));
  const fehler = filterPaymentsByDate(safePayments.filter((p) => p.status === "fehler"));

  const totalBezahlt = bezahlt.reduce((sum, p) => sum + p.amount, 0);
  const totalOffen = offen.reduce((sum, p) => sum + p.amount, 0);
  const totalFehler = fehler.reduce((sum, p) => sum + p.amount, 0);

  const now = new Date();
  const totalMonth = bezahlt.reduce((sum, p) => {
    const d = new Date(p.paymentDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() ? sum + p.amount : sum;
  }, 0);
  const totalYear = bezahlt.reduce((sum, p) => new Date(p.paymentDate).getFullYear() === now.getFullYear() ? sum + p.amount : sum, 0);
  const currentQuarter = Math.floor(now.getMonth() / 3);
  const totalQuarter = bezahlt.reduce((sum, p) => {
    const d = new Date(p.paymentDate);
    return d.getFullYear() === now.getFullYear() && Math.floor(d.getMonth() / 3) === currentQuarter ? sum + p.amount : sum;
  }, 0);
  const umsatzProKunde = bezahlt.reduce((map, p) => {
    if (!map[p.userId]) map[p.userId] = { name: p.name, total: 0 };
    map[p.userId].total += p.amount;
    return map;
  }, {});

  const PaymentModal = () => {
    if (!modalOpen || !selectedPayment) return null;
    const { name, email, amount, status, stripeStatus, schedules, lastError, manualPaid, id: transactionId } = selectedPayment;
    const isPaid = status === "bezahlt" || stripeStatus === "succeeded";
    const isFailed = stripeStatus === "failed" || stripeStatus === "canceled";
    const isOpen = status === "offen" || stripeStatus === "requires_payment_method" || stripeStatus === "requires_capture";

    const handleManualPay = async () => {
      const res = await fetch("/api/finances/manual-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: selectedPayment.paymentIntentId, userId: selectedPayment.userId }),
      });
      if (res.ok) { alert("Zahlung wurde manuell als bezahlt markiert!"); closeModal(); window.location.reload(); }
      else alert("Fehler beim Aktualisieren der Zahlung.");
    };

    const badgeClass = manualPaid ? "bg-blue-50 text-blue-700 border-blue-200"
      : isPaid ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : isFailed ? "bg-red-50 text-red-700 border-red-200"
      : isOpen ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-gray-50 text-gray-600 border-gray-200";

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
        <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl border border-gray-100 relative">
          <button onClick={closeModal} className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-lg">×</button>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Zahlungsdetails</h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full border text-xs font-medium mb-4 ${badgeClass}`}>
            {manualPaid ? "Manuell bezahlt" : isPaid ? "Bezahlt" : isFailed ? "Fehlgeschlagen" : isOpen ? "Offen" : stripeStatus}
          </span>
          <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">E-Mail</span><span className="font-medium">{email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Betrag</span><span className="font-semibold">CHF {amount.toFixed(2)}</span></div>
            {lastError && <div className="pt-1 text-red-600 text-xs">{lastError}</div>}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Buchungen</p>
            <div className="max-h-40 overflow-y-auto border border-gray-100 p-3 rounded-lg bg-gray-50 space-y-2">
              {schedules.length === 0 ? (
                <p className="text-gray-400 text-sm italic">Keine Buchungen</p>
              ) : (
                schedules.map((s, i) => (
                  <div key={i} className="text-xs pb-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium">{s.day}</span> · {s.hours}h · {s.date ? new Date(s.date).toLocaleDateString("de-DE") : "—"} · {s.captured ? <span className="text-emerald-600">Bezahlt</span> : <span className="text-amber-600">Ausstehend</span>}
                  </div>
                ))
              )}
            </div>
          </div>
          {isPaid && !manualPaid && <p className="mt-4 text-emerald-600 text-sm font-medium">Zahlung automatisch bezahlt</p>}
          {manualPaid && <p className="mt-4 text-emerald-600 text-sm font-medium">Zahlung manuell bezahlt</p>}
          {!isPaid && !manualPaid && (isOpen || isFailed) && (
            <button onClick={handleManualPay} className="mt-4 w-full bg-[#0F1F38] hover:bg-[#1a3050] text-white font-medium py-2 px-4 rounded-lg text-sm transition">
              Manuell bezahlt markieren
            </button>
          )}
        </div>
      </div>
    );
  };

  const paymentRow = (p) => (
    <div
      key={p.userId + p.amount}
      onClick={() => openModal(p)}
      className="cursor-pointer p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-white transition flex justify-between items-center"
    >
      <div>
        <p className="text-sm font-medium text-gray-900">{p.name}</p>
        {p.lastError && <p className="text-xs text-red-500 mt-0.5">{p.lastError}</p>}
      </div>
      <span className="text-sm font-semibold text-gray-900">CHF {p.amount.toFixed(2)}</span>
    </div>
  );

  const filterBtns = [
    { id: "week", label: "Diese Woche" },
    { id: "month", label: "Dieser Monat" },
    { id: "year", label: "Dieses Jahr" },
    { id: "all", label: "Alle" },
  ];

  return (
    <div className="px-6 lg:px-8 py-6 space-y-6">
      <PaymentModal />

      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Finanzübersicht</h1>
        <p className="text-sm text-gray-500 mt-0.5">Zahlungen, Gutscheine und Umsatz</p>
      </div>

      {/* Umsatz stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Umsatz (Dieser Monat)</p>
          <p className="text-2xl font-bold text-gray-900">CHF {totalMonth.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Umsatz (Quartal)</p>
          <p className="text-2xl font-bold text-gray-900">CHF {totalQuarter.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Umsatz (Jahr)</p>
          <p className="text-2xl font-bold text-gray-900">CHF {totalYear.toFixed(2)}</p>
        </div>
      </div>

      {/* Payment summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-l-4 border-l-emerald-400 border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Bezahlt</p>
          <p className="text-xl font-bold text-emerald-700">CHF {totalBezahlt.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-l-amber-400 border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Ausstehend</p>
          <p className="text-xl font-bold text-amber-700">CHF {totalOffen.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl border border-l-4 border-l-red-400 border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total Fehlgeschlagen</p>
          <p className="text-xl font-bold text-red-700">CHF {totalFehler.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {filterBtns.map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
              ${filter === btn.id ? "bg-[#0F1F38] text-white border-[#0F1F38]" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Payment sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fehlgeschlagen */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Fehlgeschlagen / Storniert</h2>
            <span className="ml-auto text-xs text-gray-400">{fehler.length}</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {fehler.length === 0 ? <p className="text-sm text-gray-400 italic">Keine fehlerhaften Zahlungen</p> : fehler.map(paymentRow)}
          </div>
        </div>

        {/* Ausstehend */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Ausstehend</h2>
            <span className="ml-auto text-xs text-gray-400">{offen.length}</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {offen.length === 0 ? <p className="text-sm text-gray-400 italic">Keine offenen Zahlungen</p> : offen.map(paymentRow)}
          </div>
        </div>

        {/* Bezahlt */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Bezahlt</h2>
            <span className="ml-auto text-xs text-gray-400">{bezahlt.length}</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {bezahlt.length === 0 ? <p className="text-sm text-gray-400 italic">Keine bezahlten Zahlungen</p> : bezahlt.map(p => (
              <div key={p.userId + p.amount} onClick={() => openModal(p)} className="cursor-pointer p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-white transition flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.status === "manuell" ? "Manuell bezahlt" : "Bezahlt"}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">CHF {p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gutscheine */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Gutscheine</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <select value={voucherFilter} onChange={(e) => setVoucherFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20">
              <option value="all">Alle Zeiten</option>
              <option value="today">Heute</option>
              <option value="week">Diese Woche</option>
              <option value="month">Dieser Monat</option>
              <option value="nextMonth">Nächster Monat</option>
            </select>
            <input type="date" value={voucherDateFrom} onChange={(e) => setVoucherDateFrom(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
            <input type="date" value={voucherDateTo} onChange={(e) => setVoucherDateTo(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none" />
            <select value={voucherClient} onChange={(e) => setVoucherClient(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none">
              <option value="">Alle Kunden</option>
              {clientList.map((c) => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
            </select>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {vouchers.length === 0 ? (
              <p className="text-sm text-gray-400 italic">Keine Gutscheine vorhanden</p>
            ) : (
              filterVouchers(vouchers).map((v) => (
                <div key={v.id} className="p-3 border border-gray-100 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm font-semibold text-gray-900">{v.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${v.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                      {v.isActive ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                    <span>Wert: <strong className="text-gray-900">{v.discountType === "percentage" ? `${v.discountValue}%` : `CHF ${v.discountValue}`}</strong></span>
                    <span>Verwendet: <strong className="text-gray-900">{v.usedCount}/{v.maxUses}</strong></span>
                    <span>Von: {new Date(v.validFrom).toLocaleDateString("de-DE")}</span>
                    <span>Bis: {new Date(v.validUntil).toLocaleDateString("de-DE")}</span>
                  </div>
                  {v.usedBy && v.usedBy.length > 0 && (
                    <div className="mt-2 border-t border-gray-100 pt-2 space-y-1">
                      {v.usedBy.map((u) => (
                        <div key={u.id} className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-800">{u.firstName} {u.lastName}</span>
                          <span className="text-gray-400">{u.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Umsatz per Kunde */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Umsatz pro Kunde</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Kunde</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Umsatz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.values(umsatzProKunde).length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-6 text-center text-sm text-gray-400 italic">Keine Daten</td></tr>
              ) : (
                Object.values(umsatzProKunde).sort((a, b) => b.total - a.total).map((k, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{k.name}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">CHF {k.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
