import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("de-CH", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return "—";
  }
}

const STATUS_LABELS = {
  gekuendigt: "Gekündigt",
  canceled: "Storniert",
  cancelled: "Storniert",
};

export default function EhemaligeKundenPage() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/former-clients");
        const data = await res.json();
        if (!cancelled) setClients(Array.isArray(data.clients) ? data.clients : []);
      } catch {
        if (!cancelled) setClients([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchClients();
    return () => { cancelled = true; };
  }, []);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const haystack = `${c.firstName || ""} ${c.lastName || ""} ${c.email || ""} ${c.careCity || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="p-4 lg:p-6 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Ehemalige Kunden</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} {filtered.length === 1 ? "Kunde" : "Kunden"} · Verträge wurden gekündigt oder storniert
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Name, E-Mail oder Ort suchen…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#04436F] mx-auto" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Kunde</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Ort</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Vertragsbeginn</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Kündigung</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">Keine ehemaligen Kunden gefunden</td></tr>
                  ) : (
                    filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                          <p className="text-xs text-gray-500">{c.email || "—"}</p>
                          {c.phone && <p className="text-xs text-gray-400">{c.phone}</p>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <p>{c.careCity || "—"}</p>
                          {c.kanton && <p className="text-xs text-gray-400">{c.kanton}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium border bg-red-50 text-red-700 border-red-200">
                            {STATUS_LABELS[c.status] || c.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(c.firstDate)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          <p>{formatDate(c.terminationDate || c.updatedAt)}</p>
                          {c.terminationReason && (
                            <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate" title={c.terminationReason}>
                              {c.terminationReason}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/admin/clients/${c.id}`)}
                            className="px-2.5 py-1 bg-[#04436F] text-white rounded-md text-xs font-medium hover:bg-[#033558] transition"
                          >
                            Profil
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
