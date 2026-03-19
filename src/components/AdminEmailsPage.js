import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";

function AdminEmailsPage() {
  const [clients, setClients] = useState([]);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // Feedback email states
  const [caregiverName, setCaregiverName] = useState("");
  const [feedbackLink, setFeedbackLink] = useState("");

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

  const feedbackSubject = "Wie zufrieden sind Sie mit unserer Betreuung?";
  const feedbackBody = (client) => `
Guten Tag ${client.firstName} ${client.lastName},

Wir hoffen, dass Sie mit der Betreuung durch ${caregiverName} zufrieden waren.

Wir freuen uns über Ihre Rückmeldung: ${feedbackLink}

Ihr Feedback hilft uns, unsere Dienstleistung weiter zu verbessern.

Danke für Ihr Vertrauen!

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

  async function sendFeedbackEmail() {
    if (!caregiverName || !feedbackLink) {
      setMessage("Bitte Betreuername und Feedback-Link ausfüllen.");
      return;
    }
    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/send-feedback-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caregiverName, feedbackLink }),
      });

      if (res.ok) {
        setMessage(`✅ Feedback-Mail wurde an ${clients.length} Kunden gesendet.`);
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
          <h1 className="text-xl font-semibold text-gray-900">Feedback E-Mail</h1>
          <p className="text-sm text-gray-500 mt-0.5">Feedbackanfrage an alle Kunden senden</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">E-Mail konfigurieren</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className={labelCls}>Betreuername</label>
              <input
                type="text"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                placeholder="Name der Betreuungsperson"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Feedback-Link</label>
              <input
                type="url"
                value={feedbackLink}
                onChange={(e) => setFeedbackLink(e.target.value)}
                placeholder="https://example.com/feedback"
                className={inputCls}
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Vorschau</p>
              <p className="text-xs text-gray-500 mb-1"><span className="font-medium text-gray-700">Betreff:</span> {feedbackSubject}</p>
              <hr className="border-gray-200 my-2" />
              {caregiverName && feedbackLink ? (
                clients.length > 0 ? (
                  clients.map(client => (
                    <div key={client.id}>
                      {feedbackBody(client)}
                      <hr className="my-3 border-gray-200" />
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400">Keine Kunden gefunden.</span>
                )
              ) : (
                <span className="text-gray-400">Bitte Betreuername und Feedback-Link eingeben.</span>
              )}
            </div>

            <button
              onClick={sendFeedbackEmail}
              disabled={sending || clients.length === 0}
              className={`w-full py-2.5 rounded-lg text-sm text-white font-medium transition ${
                sending || clients.length === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F1F38] hover:bg-[#1a3050]"
              }`}
            >
              {sending ? "Sende E-Mail..." : `Feedback-E-Mail an alle ${clients.length} Kunden senden`}
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

export default AdminEmailsPage;
