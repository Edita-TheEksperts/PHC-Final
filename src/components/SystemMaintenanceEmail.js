import { useState } from "react";

export default function SystemMaintenanceEmail({ clientsCount = 0, employeesCount = 0 }) {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [recipientType, setRecipientType] = useState("clients"); // clients or employees

  const portalLabel = recipientType === "clients" ? "Kundenportal" : "Mitarbeiterportal";
  const greetingLabel = recipientType === "clients" ? "Guten Tag," : "Liebe/r Mitarbeiter/in,";

  const emailSubject = "Information: Vorübergehende Systemwartung";
  const emailBody = `
${greetingLabel}

Am ${date || "____"} zwischen ${timeStart || "____"} und ${timeEnd || "____"} führen wir geplante Wartungsarbeiten an unserem System durch.

In diesem Zeitraum ist das ${portalLabel} vorübergehend nicht erreichbar. 
Bei dringenden Anliegen erreichen Sie uns telefonisch unter ${
    process.env.NEXT_PUBLIC_SUPPORT_PHONE || "[Telefonnummer]"
  }.

Vielen Dank für Ihr Verständnis.

Freundliche Grüsse
Ihr Prime Home Care Team
`.trim();

  async function sendMaintenanceEmail() {
    if (!date || !timeStart || !timeEnd) {
      setMessage("Bitte Datum und Uhrzeiten ausfüllen.");
      return;
    }

    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/send-maintenance-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, timeStart, timeEnd, recipientType }),
      });

      if (res.ok) {
        const count = recipientType === "clients" ? clientsCount : employeesCount;
        setMessage(`✅ Wartungs-Mail wurde an ${count} ${recipientType === "clients" ? "Kunden" : "Mitarbeiter"} gesendet.`);
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

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#04436F]">
        Systemwartung E-Mail an {recipientType === "clients" ? "alle Kunden" : "alle Mitarbeiter"}
      </h2>

      {/* Zgjedhja e llojit të marrësit */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="recipientType"
            value="clients"
            checked={recipientType === "clients"}
            onChange={() => setRecipientType("clients")}
          />
          <span>Kunden</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="recipientType"
            value="employees"
            checked={recipientType === "employees"}
            onChange={() => setRecipientType("employees")}
          />
          <span>Mitarbeiter</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Datum (z.B. 25.07.2025)</span>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded px-3 py-2"
            placeholder="TT.MM.JJJJ"
          />
        </label>
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Startzeit</span>
          <input
            type="time"
            value={timeStart}
            onChange={(e) => setTimeStart(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col">
          <span className="font-semibold mb-1">Endzeit</span>
          <input
            type="time"
            value={timeEnd}
            onChange={(e) => setTimeEnd(e.target.value)}
            className="border rounded px-3 py-2"
          />
        </label>
      </div>

      <div className="bg-gray-50 border border-gray-300 rounded p-4 whitespace-pre-wrap text-gray-800 text-sm">
        <strong>Betreff:</strong> {emailSubject}
        <br />
        <br />
        {emailBody}
      </div>

      <button
        onClick={sendMaintenanceEmail}
        disabled={sending}
        className={`w-full py-3 rounded-lg text-white font-semibold ${
          sending ? "bg-gray-400 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#03314f]"
        } transition-colors duration-200`}
      >
        {sending
          ? "Sende E-Mail..."
          : `E-Mail an alle ${
              recipientType === "clients" ? clientsCount + " Kunden" : employeesCount + " Mitarbeiter"
            } senden`}
      </button>

      {message && (
        <p
          className={`text-center text-sm mt-2 ${
            message.startsWith("❌") ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
