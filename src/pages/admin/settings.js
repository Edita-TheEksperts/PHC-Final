import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import EmailTemplatesAdmin from "../../components/EmailTemplatesAdmin";
import BlogsTab from "../../components/BlogsTab";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profil");
  const [admin, setAdmin] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        const data = await res.json();
        setAdmin(data);
      } catch {}
    }
    fetchProfile();
  }, []);

  async function handlePasswordChange(e) {
    e.preventDefault();
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      setPwMsg({ type: "error", text: "Bitte alle Felder ausfüllen." });
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "Passwörter stimmen nicht überein." });
      return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: "Passwort muss mindestens 6 Zeichen lang sein." });
      return;
    }
    setPwLoading(true);
    setPwMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      if (res.ok) {
        setPwMsg({ type: "success", text: "Passwort erfolgreich aktualisiert." });
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        const d = await res.json();
        setPwMsg({ type: "error", text: d.message || "Fehler beim Aktualisieren des Passworts." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Serverfehler." });
    } finally {
      setPwLoading(false);
    }
  }

  const initials = `${admin.firstName?.[0] || ""}${admin.lastName?.[0] || ""}`.toUpperCase() || "A";

  // System maintenance state
  const [sending, setSending] = useState(false);
  const [maintMsg, setMaintMsg] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  async function sendMaintenance() {
    if (!dateStart || !dateEnd || !timeStart || !timeEnd) { setMaintMsg("Bitte alle Felder ausfüllen."); return; }
    setSending(true); setMaintMsg("");
    try {
      const res = await fetch("/api/admin/send-maintenance-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date: `${dateStart} bis ${dateEnd}`, timeStart, timeEnd }) });
      setMaintMsg(res.ok ? "Wartungs-Mail gesendet." : "Fehler beim Senden.");
    } catch { setMaintMsg("Serverfehler."); } finally { setSending(false); }
  }

  const tabs = [
    { id: "profil", label: "Profil & Zugang" },
    { id: "email", label: "E-Mail-Vorlagen" },
    { id: "system", label: "Systemwartung" },
    { id: "blogs", label: "Blogs" },
  ];

  return (
    <AdminLayout>
      <div className="px-4 lg:px-8 py-6 space-y-6 max-w-4xl mx-auto">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Einstellungen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Profil, E-Mail-Vorlagen und Systemwartung</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profil" && <>
        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Profilinformationen</h2>
          </div>
          <div className="p-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#04436F] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {admin.firstName} {admin.lastName}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Vorname</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {admin.firstName || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Nachname</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {admin.lastName || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">E-Mail</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {admin.email || "—"}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Telefon</label>
                <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900">
                  {admin.phone || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Password card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Passwort ändern</h2>
          </div>
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Aktuelles Passwort</label>
              <input
                type="password"
                value={pwForm.current}
                onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Neues Passwort</label>
              <input
                type="password"
                value={pwForm.next}
                onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Neues Passwort bestätigen</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]/20 focus:border-[#04436F] transition"
              />
            </div>

            {pwMsg.text && (
              <div className={`p-3 rounded-lg text-sm border ${pwMsg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                {pwMsg.text}
              </div>
            )}

            <div className="pt-1">
              <button
                type="submit"
                disabled={pwLoading}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition ${pwLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#033558]"}`}
              >
                {pwLoading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
              </button>
            </div>
          </form>
        </div>

        </>}

        {/* Email Templates Tab */}
        {activeTab === "email" && (
          <EmailTemplatesAdmin />
        )}

        {/* Blogs Tab */}
        {activeTab === "blogs" && (
          <BlogsTab />
        )}

        {/* System Maintenance Tab */}
        {activeTab === "system" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Systemwartung E-Mail</h2>
              <p className="text-xs text-gray-500 mt-0.5">E-Mail an alle Kunden über geplante Wartungsarbeiten</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-1.5">Startdatum</span>
                  <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-1.5">Enddatum</span>
                  <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-1.5">Startzeit</span>
                  <input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </label>
                <label className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-1.5">Endzeit</span>
                  <input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </label>
              </div>
              <button onClick={sendMaintenance} disabled={sending}
                className={`w-full py-2.5 rounded-lg text-sm text-white font-medium transition ${sending ? "bg-gray-300 cursor-not-allowed" : "bg-[#04436F] hover:bg-[#033558]"}`}>
                {sending ? "Wird gesendet..." : "E-Mail an alle Kunden senden"}
              </button>
              {maintMsg && <p className={`text-center text-sm ${maintMsg.includes("Fehler") ? "text-red-600" : "text-emerald-600"}`}>{maintMsg}</p>}
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
