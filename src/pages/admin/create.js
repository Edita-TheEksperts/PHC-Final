
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ✅ Server-side fetch to avoid build-time crash
export async function getServerSideProps() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "phc.ch";
    const res = await fetch(`${baseUrl}/api/admin/vouchers`);
    const data = await res.json();

    return {
      props: {
        initialVouchers: data.vouchers || [],
      },
    };
  } catch (error) {
    return { props: { initialVouchers: [] } };
  }
}

export default function CreateVoucher({ initialVouchers }) {
  const router = useRouter();
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [filtered, setFiltered] = useState(initialVouchers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    maxUses: 100,
    validFrom: new Date().toISOString().slice(0, 10),
    validUntil: "2025-12-31",
    isActive: true,
  });

  // ✅ Refresh vouchers (client-side)
  async function fetchVouchers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/vouchers");
      const data = await res.json();
      if (Array.isArray(data.vouchers)) {
        setVouchers(data.vouchers);
        setFiltered(data.vouchers);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (search.trim() === "") setFiltered(vouchers);
    else {
      const s = search.toLowerCase();
      setFiltered(
        vouchers.filter(
          (v) =>
            v.code.toLowerCase().includes(s) ||
            v.discountType.toLowerCase().includes(s)
        )
      );
    }
  }, [search, vouchers]);

  // ✅ Create or update voucher
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/vouchers/${editing}`
        : "/api/admin/vouchers";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editing ? "✏️ Gutschein aktualisiert!" : "✅ Gutschein erstellt!");
        setFormData({
          code: "",
          discountType: "percent",
          discountValue: "",
          maxUses: 100,
          validFrom: new Date().toISOString().slice(0, 10),
          validUntil: "2025-12-31",
          isActive: true,
        });
        setEditing(null);
        fetchVouchers();
      } else {
        alert("❌ Fehler: " + (data.error || "Operation fehlgeschlagen."));
      }
    } catch (error) {
    }
  }

  // ✅ Delete voucher
  async function handleDelete(id) {
    if (!confirm("⚠️ Diesen Gutschein wirklich löschen?")) return;
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("🗑️ Gutschein gelöscht!");
        fetchVouchers();
      } else {
        alert("❌ Löschen fehlgeschlagen!");
      }
    } catch (err) {
    }
  }

  function handleEdit(voucher) {
    setEditing(voucher.id);
    setFormData({
      code: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      maxUses: voucher.maxUses,
      validFrom:
        voucher.validFrom?.slice(0, 10) ||
        new Date().toISOString().slice(0, 10),
      validUntil: voucher.validUntil?.slice(0, 10) || "2025-12-31",
      isActive: voucher.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition";
  const labelCls = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Gutscheinverwaltung</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gutscheine erstellen, bearbeiten und verwalten</p>
          </div>
          <div className="relative max-w-xs w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Gutschein suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
            />
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              {editing ? "Gutschein bearbeiten" : "Neuer Gutschein"}
            </h2>
            {editing && (
              <button
                onClick={() => {
                  setEditing(null);
                  setFormData({
                    code: "",
                    discountType: "percent",
                    discountValue: "",
                    maxUses: 100,
                    validFrom: new Date().toISOString().slice(0, 10),
                    validUntil: "2025-12-31",
                    isActive: true,
                  });
                }}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition"
              >
                <XCircle size={14} /> Abbrechen
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="WELCOME10"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Rabatt-Typ</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className={inputCls}
              >
                <option value="percent">Prozent (%)</option>
                <option value="fixed">Fixbetrag (CHF)</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Wert</label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder="10"
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Max. Verwendung</label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                className={inputCls}
                required
              />
            </div>

            <div>
              <label className={labelCls}>Gültig von</label>
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Gültig bis</label>
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className={inputCls}
              />
            </div>

            <div className="flex items-center gap-2.5 md:col-span-1">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 accent-[#0F1F38]"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Aktiv</label>
            </div>

            <div className="flex items-end md:col-span-1">
              <button
                type="submit"
                className="w-full bg-[#0F1F38] hover:bg-[#1a3050] text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                {editing ? (
                  <><CheckCircle2 size={16} /> Aktualisieren</>
                ) : (
                  <><PlusCircle size={16} /> Gutschein erstellen</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Alle Gutscheine</h2>
          </div>
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Wird geladen...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              <p className="text-sm font-medium text-gray-500">Keine Gutscheine gefunden</p>
              <p className="text-xs mt-1 text-gray-400">Erstellen Sie oben Ihren ersten Gutschein.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Code</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Typ</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Wert</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Max.</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gültig bis</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Erstellt am</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 font-medium text-gray-900">{v.code}</td>
                      <td className="px-6 py-3 capitalize text-gray-600">{v.discountType}</td>
                      <td className="px-6 py-3 text-gray-600">{v.discountValue}</td>
                      <td className="px-6 py-3 text-gray-600">{v.maxUses}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                          v.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                          {v.isActive ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{new Date(v.validUntil).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-gray-600">{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(v)}
                            title="Bearbeiten"
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#0F1F38] hover:text-white transition"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(v.id)}
                            title="Löschen"
                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
