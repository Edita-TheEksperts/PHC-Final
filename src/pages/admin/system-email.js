import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";

function SystemMaintenanceEmailPage() {
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/admin/clients");
        if (!res.ok) throw new Error("Fehler beim Laden der Clients");
        const data = await res.json();
        setClients(data.clients || []);
      } catch (error) {
        setMessage("Fehler beim Laden der Kunden.");
      }
    }
    fetchClients();
  }, []);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const emailSubject = "Information: Vorübergehende Systemwartung";

  const emailBody = `
Grüezi  

Vom ${formatDate(dateStart)} bis zum ${formatDate(dateEnd)} zwischen ${timeStart} und ${timeEnd}  
führen wir geplante Wartungsarbeiten an unserem System durch.  

In diesem Zeitraum ist das Kundenportal vorübergehend nicht erreichbar.  
Bei dringenden Anliegen erreichen Sie uns telefonisch unter 043 200 10 20.  

Vielen Dank für Ihr Verständnis.  

Freundliche Grüsse  

<p>
  Prime Home Care AG<br/>
  Birkenstrasse 49<br/>
  CH-6343 Rotkreuz<br/>
  info@phc.ch<br/>
  www.phc.ch
</p>

<p>
  <a
    href="https://phc.ch/AVB"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: "underline",
      color: "#04436F",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    AVB und Nutzungsbedingungen
  </a>
</p>

`.trim();

  async function sendMaintenanceEmail() {
    if (!dateStart || !dateEnd || !timeStart || !timeEnd) {
      setMessage("Bitte Start- und Enddatum sowie Uhrzeiten ausfüllen.");
      return;
    }

    setSending(true);
    setMessage("");

    const date = `${dateStart} bis ${dateEnd}`;

    try {
      const res = await fetch("/api/admin/send-maintenance-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, timeStart, timeEnd }),
      });

      if (res.ok) {
        setMessage(`✅ Wartungs-Mail wurde an ${clients.length} Kunden gesendet.`);
      } else {
        const err = await res.json();
        setMessage("❌ Fehler: " + err.message);
      }
    } catch (error) {
      setMessage("❌ Serverfehler. Bitte später erneut versuchen.");
    } finally {
      setSending(false);
    }
  }

  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition";
  const labelCls = "block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-2xl">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Systemwartung E-Mail</h1>
          <p className="text-sm text-gray-500 mt-0.5">Wartungsbenachrichtigung an alle Kunden senden</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Wartungszeitraum</h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelCls}>Startdatum</label>
                <input
                  type="date"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Enddatum</label>
                <input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Startzeit</label>
                <input
                  type="time"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Endzeit</label>
                <input
                  type="time"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Vorschau</p>
              <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-gray-700">Betreff:</span> {emailSubject}</p>
              <hr className="border-gray-200 my-2" />
              {emailBody}
            </div>

            <button
              onClick={sendMaintenanceEmail}
              disabled={sending || clients.length === 0}
              className={`w-full py-2.5 rounded-lg text-sm text-white font-medium transition ${
                sending || clients.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F1F38] hover:bg-[#1a3050]"
              }`}
            >
              {sending ? "Sende E-Mail..." : `E-Mail an alle ${clients.length} Kunden senden`}
            </button>

            {message && (
              <div className={`p-3 rounded-lg text-sm border ${
                message.startsWith("❌")
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-800"
              }`}>
                {message.replace(/^[✅❌]\s*/, "")}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default SystemMaintenanceEmailPage;
