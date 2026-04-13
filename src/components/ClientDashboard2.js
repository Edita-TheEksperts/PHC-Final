import { useState } from "react";
import useSWR from "swr";
import { FileText, TrendingUp, Calendar } from "lucide-react";

export default function ClientDashboard2({ userId }) {
  const { data, error } = useSWR(
    userId ? `/api/admin/finances?userId=${userId}` : null,
    (url) => fetch(url).then((r) => r.json())
  );

  const [downloading, setDownloading] = useState(null);

  // Opens the Stripe hosted invoice in a new tab (the API 302-redirects).
  function downloadInvoice(month) {
    setDownloading(month);
    try {
      window.open(`/api/client/invoice-pdf?userId=${userId}&month=${month}`, "_blank", "noopener");
    } finally {
      setTimeout(() => setDownloading(null), 500);
    }
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-red-500 font-medium">Fehler beim Laden der Finanzdaten.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const paymentHistory = data.paymentHistory || [];
  const totalPayment = data.totalPayment || 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-[#B99B5F]" />
        </div>
        <h3 className="text-sm font-bold text-gray-900">Monatsübersicht</h3>
        {paymentHistory.length > 0 && (
          <span className="ml-auto text-xs font-semibold text-[#B99B5F] bg-[#B99B5F]/10 px-2 py-0.5 rounded-full">
            {paymentHistory.length} {paymentHistory.length === 1 ? "Monat" : "Monate"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="divide-y divide-gray-50">
        {paymentHistory.length > 0 ? (
          paymentHistory.map((p, i) => (
            <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B99B5F]/8 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#B99B5F]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(p.month + "-01").toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs text-gray-400">Zahlungseingang</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">
                  CHF {p.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => downloadInvoice(p.month)}
                  disabled={downloading === p.month}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600 hover:bg-[#B99B5F]/10 hover:text-[#B99B5F] transition disabled:opacity-50"
                  title="Zahlungsbestätigung öffnen"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {downloading === p.month ? "…" : "Zahlungsbestätigung"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">Keine Zahlungen vorhanden</p>
            <p className="text-xs text-gray-300 mt-1">Zahlungen erscheinen hier nach dem ersten Termin</p>
          </div>
        )}
      </div>

      {/* Total footer */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Gesamtbetrag</p>
        <p className="text-lg font-extrabold text-[#B99B5F]">
          CHF {totalPayment.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
