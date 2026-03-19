export default function CurrentRevenue({ clients }) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter clients that actually have assignments
  const activeClients = clients.filter(
    (c) => c.assignments && c.assignments.length > 0
  );

  // 💰 Income (All Time)
  const totalIncomeAllTime = activeClients.reduce(
    (sum, c) => sum + (c.totalPayment || 0),
    0
  );

  // 💰 Income (This Month)
  const totalIncomeThisMonth = activeClients.reduce((sum, c) => {
    const paymentsThisMonth =
      c.transactions?.filter((t) => {
        const d = new Date(t.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }) || [];

    return (
      sum +
      paymentsThisMonth.reduce(
        (pSum, t) => pSum + (t.amountClient || 0),
        0
      )
    );
  }, 0);

  // 💸 Costs (All Time)
  const totalCostAllTime = activeClients.reduce((sum, c) => {
    return (
      sum +
      (c.schedules?.reduce((sSum, s) => {
        const hoursCost = (s.hours || 0) * 30;
        const kmCost = (s.kilometers || 0) * 0.5;
        return sSum + hoursCost + kmCost;
      }, 0) || 0)
    );
  }, 0);

  // 💸 Costs (This Month)
  const totalCostThisMonth = activeClients.reduce((sum, c) => {
    return (
      sum +
      (c.schedules?.reduce((sSum, s) => {
        if (!s.date) return sSum;
        const d = new Date(s.date);
        if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
          return sSum;
        }
        const hoursCost = (s.hours || 0) * 30;
        const kmCost = (s.kilometers || 0) * 0.5;
        return sSum + hoursCost + kmCost;
      }, 0) || 0)
    );
  }, 0);

  // 📊 Revenue = Income − Costs
  const revenueThisMonth = totalIncomeThisMonth - totalCostThisMonth;
  const revenueAllTime = totalIncomeAllTime - totalCostAllTime;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border my-6 max-w-7xl">
      <h2 className="text-xl font-bold text-green-700 mb-4">📊 Umsatz</h2>

      {/* 🔥 NEW Revenue Summary Div */}
      <div className="bg-purple-50 border border-purple-300 rounded-xl p-6 mb-6 text-center">
        <h3 className="text-purple-700 font-bold text-lg mb-2">Umsatz (Hervorhebung)</h3>
        <p className="text-4xl font-extrabold text-gray-900">
          CHF {revenueAllTime.toLocaleString("de-CH", { minimumFractionDigits: 2 })}
        </p>
        <p className="text-sm text-gray-500">
Gesamter Nettoumsatz (Einnahmen – Kosten) seit Systemstart        </p>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue This Month */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <h3 className="text-green-700 font-semibold text-lg mb-1">
            💰 Umsatz diesen Monat
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            CHF {revenueThisMonth.toLocaleString("de-CH", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Einnahmen: CHF {totalIncomeThisMonth.toLocaleString("de-CH", { minimumFractionDigits: 2 })} – 
            Ausgaben: CHF {totalCostThisMonth.toLocaleString("de-CH", { minimumFractionDigits: 2 })} = Gewinn
          </p>
        </div>

        {/* Revenue All Time */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h3 className="text-blue-700 font-semibold text-lg mb-1">
            💰 Umsatz aller Zeiten
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            CHF {revenueAllTime.toLocaleString("de-CH", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-1">
           Einnahmen: CHF {totalIncomeAllTime.toLocaleString("de-CH", { minimumFractionDigits: 2 })} – 
           Ausgaben: CHF {totalCostAllTime.toLocaleString("de-CH", { minimumFractionDigits: 2 })} = Gewinn
          </p>
        </div>
      </div>
    </div>
  );
}
