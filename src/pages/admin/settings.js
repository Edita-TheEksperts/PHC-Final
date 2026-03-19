import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";

export default function SettingsPage() {
  const [admin, setAdmin] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState({ type: "", text: "" });
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      setAdmin(data);
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

  return (
    <AdminLayout>
      <div className="px-6 lg:px-8 py-6 space-y-6 max-w-2xl">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Einstellungen</h1>
          <p className="text-sm text-gray-500 mt-0.5">Profil und Sicherheitseinstellungen</p>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Profilinformationen</h2>
          </div>
          <div className="p-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#0F1F38] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
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
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Neues Passwort</label>
              <input
                type="password"
                value={pwForm.next}
                onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Neues Passwort bestätigen</label>
              <input
                type="password"
                value={pwForm.confirm}
                onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F1F38]/20 focus:border-[#0F1F38] transition"
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
                className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition ${pwLoading ? "bg-gray-300 cursor-not-allowed" : "bg-[#0F1F38] hover:bg-[#1a3050]"}`}
              >
                {pwLoading ? "Wird aktualisiert..." : "Passwort aktualisieren"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}
