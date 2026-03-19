import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, X, AlertTriangle } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/client-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Persönliche Informationen", path: "/dashboard/formular", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Finanzen", path: "/dashboard/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Kündigung", path: "/dashboard/kundigung", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", danger: true },
];

export default function KundigungPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [confirmTermination, setConfirmTermination] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("userToken");
    if (!token) { router.replace("/login"); return; }
    fetch("/api/user/getUserData", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setUserData(d); })
      .catch(() => {});
  }, [router]);

  const handleTerminate = async () => {
    if (!confirmTermination || !terminationReason) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("userToken");
      await fetch("/api/terminate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: terminationReason }),
      });
      localStorage.removeItem("userToken");
      router.replace("/login");
    } catch {
      alert("❌ Fehler bei der Kündigung. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const userInitials = `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`.toUpperCase() || "?";
  const canSubmit = confirmTermination && terminationReason.trim().length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm">
        <span className="text-lg font-bold text-[#B99B5F]">PHC</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          {isOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 flex flex-col pt-16">
          <ul className="flex flex-col p-4 space-y-1">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => { router.push(item.path); setIsOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-sm font-medium transition
                  ${item.danger ? "text-red-500 hover:bg-red-50" : "text-gray-700 hover:bg-gray-100"}`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0 shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#B99B5F] flex items-center justify-center cursor-pointer flex-shrink-0" onClick={() => router.push("/client-dashboard")}>
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 cursor-pointer select-none" onClick={() => router.push("/client-dashboard")}>PHC</h1>
            <p className="text-xs text-gray-400">Kundenportal</p>
          </div>
        </div>

        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 px-3 py-3 bg-[#B99B5F]/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B99B5F] to-[#8a7040] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userData?.firstName} {userData?.lastName}</p>
              <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition
                  ${item.danger
                    ? isActive ? "bg-red-50 text-red-600 font-semibold" : "text-red-500 hover:bg-red-50"
                    : isActive ? "bg-[#B99B5F]/10 text-[#B99B5F] font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <svg className={`w-4 h-4 flex-shrink-0 ${isActive && !item.danger ? "text-[#B99B5F]" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="truncate">{item.label}</span>
                {isActive && !item.danger && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B99B5F]" />}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => { localStorage.removeItem("userToken"); localStorage.removeItem("selectedService"); router.push("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Abmelden
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-auto mt-14 lg:mt-0">

        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-4">
          <h2 className="text-xl font-bold text-gray-900">Kündigung</h2>
          <p className="text-sm text-gray-400 mt-0.5">Vertragsbeendigung beantragen</p>
        </div>

        <div className="px-6 lg:px-10 py-8 max-w-2xl">

          {/* Warning banner */}
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">Wichtige Information</p>
              <p className="text-sm text-red-600">
                Bei Kündigung wird Ihr Profil dauerhaft gelöscht. Sie verlieren den Zugriff auf Ihr Konto sowie alle Services und gebuchten Termine.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1">Vertrag kündigen</h3>
              <p className="text-sm text-gray-500">Bitte füllen Sie das Formular aus, um Ihren Vertrag zu beenden.</p>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grund der Kündigung <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={terminationReason}
                onChange={(e) => setTerminationReason(e.target.value)}
                placeholder="Bitte teilen Sie uns den Grund Ihrer Kündigung mit…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 resize-none transition"
              />
              <p className="text-xs text-gray-400 mt-1">{terminationReason.length} Zeichen</p>
            </div>

            {/* Confirm checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition
                ${confirmTermination ? "bg-red-500 border-red-500" : "border-gray-300 group-hover:border-red-400"}`}>
                {confirmTermination && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={confirmTermination}
                onChange={(e) => setConfirmTermination(e.target.checked)}
                className="sr-only"
              />
              <span className="text-sm text-gray-700">
                Ja, ich bestätige, dass ich den Vertrag <strong>endgültig kündigen</strong> möchte und alle Daten werden unwiderruflich gelöscht.
              </span>
            </label>

            {/* Submit */}
            <button
              onClick={handleTerminate}
              disabled={!canSubmit || isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white transition
                ${canSubmit && !isSubmitting
                  ? "bg-red-600 hover:bg-red-700 shadow-sm"
                  : "bg-gray-300 cursor-not-allowed"}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Wird verarbeitet…
                </span>
              ) : "Vertrag endgültig kündigen"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Nach der Kündigung erhalten Sie eine Bestätigungs-E-Mail an <strong>{userData?.email}</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
