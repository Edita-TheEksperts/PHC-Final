import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import PaymentModal from "../components/PaymentModal";

export default function FinanzenPage() {
  const [payments, setPayments] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (payment) => {
    setModalData(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/finances/list");
      const data = await res.json();
      setPayments(data);

      const voucherRes = await fetch("/api/finances/vouchers");
      const voucherJson = await voucherRes.json();
      setVouchers(voucherJson.vouchers || []);

      setLoading(false);
    };

    load();
  }, []);

  if (loading) return <AdminLayout>Laden…</AdminLayout>;

  const bezahlt = payments.filter((p) => p.status === "bezahlt");
  const offen = payments.filter((p) => p.status === "offen");
  const fehler = payments.filter((p) => p.status === "fehler");

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          Finanzübersicht
        </h1>

        {/* Example: PAID SECTION */}
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="bg-white shadow rounded-lg p-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-medium mb-3">Bezahlte Zahlungen</h2>
            {bezahlt.map((p) => (
              <div
                key={p.userId}
                onClick={() => openModal(p)}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <strong>{p.name}</strong>
                <p>CHF {p.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="bg-white shadow rounded-lg p-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-medium mb-3">Offene Zahlungen</h2>
            {offen.map((p) => (
              <div
                key={p.userId}
                onClick={() => openModal(p)}
                className="p-3 border rounded cursor-pointer hover:bg-gray-50"
              >
                <strong>{p.name}</strong>
                <p>CHF {p.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MODAL */}
        <PaymentModal open={modalOpen} onClose={closeModal} data={modalData} />
      </div>
    </AdminLayout>
  );
}
