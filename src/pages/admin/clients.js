import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import ClientTable from "../../components/ClientTable";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    async function fetchClients() {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setClients(data.clients || []);
    }
    fetchClients();
  }, []);

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Kunden</h1>
            <p className="text-sm text-gray-500 mt-0.5">Alle aktiven Kunden</p>
          </div>
          <a
            href="/api/admin/export/clients"
            download
            className="flex items-center gap-2 px-4 py-2 bg-[#04436F] text-white rounded-lg text-sm font-medium hover:bg-[#033558] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV exportieren
          </a>
        </div>
        <ClientTable clients={clients} />
      </div>
    </AdminLayout>
  );
}
