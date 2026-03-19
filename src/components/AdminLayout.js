import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

const navGroups = [
  {
    label: "Übersicht",
    items: [
      { label: "Dashboard", href: "/admin-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    ],
  },
  {
    label: "Personal",
    items: [
      { label: "Mitarbeiter", href: "/admin/employees", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
      { label: "New Mitarbeiter", href: "/admin/mitarbeiter", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
      { label: "Bewerber", href: "/admin/newEmployee", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    ],
  },
  {
    label: "Kunden",
    items: [
      { label: "Kunden", href: "/admin/clients", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
      { label: "New Kunden", href: "/admin/kunden", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
    ],
  },
  {
    label: "Betrieb",
    items: [
      { label: "Einsätze", href: "/admin/einsaetze", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
      { label: "Finanzen", href: "/admin/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    ],
  },
  {
    label: "Kommunikation",
    items: [
      { label: "Systemwartung", href: "/admin/system-email", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
      { label: "Feedback E-Mail", href: "/admin/feedback-email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
      { label: "E-Mail-Vorlagen", href: "/admin/email-templates", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
    ],
  },
  {
    label: "Verwaltung",
    items: [
      { label: "Gutschein", href: "/admin/create", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
      { label: "Blogs", href: "/admin/blogs", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
      { label: "Einstellungen", href: "/admin/settings", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
    ],
  },
];

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const [notifCount, setNotifCount] = useState(0);
  const [notifData, setNotifData] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);
  const lastCheckRef = useRef(new Date(Date.now() - 60 * 60 * 1000).toISOString());

  useEffect(() => {
    async function checkNotifications() {
      try {
        const r = await fetch(`/api/admin/notifications?since=${lastCheckRef.current}`);
        const d = await r.json();
        lastCheckRef.current = d.checkedAt;
        setNotifCount(d.total || 0);
        setNotifData(d);
      } catch {}
    }
    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("email");
      router.replace("/login");
    }
  }

  const isActive = (href) => router.pathname === href;

  const SidebarContent = () => (
    <>
      <div className="px-4 py-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-gray-900">PHC</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>
          {showNotif && notifData && (
            <div className="absolute left-0 top-11 bg-white border border-gray-200 rounded-xl shadow-xl w-64 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Benachrichtigungen</p>
                {notifCount > 0 && (
                  <span className="text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 rounded-full px-1.5 py-0.5">{notifCount} neu</span>
                )}
              </div>
              <div className="divide-y divide-gray-50">
                {notifData.newClients > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Neue Kunden</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-1.5 py-0.5">+{notifData.newClients}</span>
                  </div>
                )}
                {notifData.newEmployees > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Neue Bewerber</span>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-1.5 py-0.5">+{notifData.newEmployees}</span>
                  </div>
                )}
                {notifData.pendingEmployees > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">Ausstehend</span>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-1.5 py-0.5">{notifData.pendingEmployees}</span>
                  </div>
                )}
                {notifData.total === 0 && (
                  <div className="px-4 py-5 text-center">
                    <p className="text-xs text-gray-400">Keine neuen Aktivitäten</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <button
                  onClick={() => { setNotifCount(0); setShowNotif(false); }}
                  className="w-full text-xs text-gray-400 hover:text-gray-700 transition text-center py-0.5"
                >
                  Als gelesen markieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                    ${isActive(item.href)
                      ? "bg-[#0F1F38] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Abmelden
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shadow-sm">
        <p className="text-base font-bold text-gray-900">PHC Admin</p>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {menuOpen ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-64 bg-white flex flex-col shadow-xl mt-14">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setMenuOpen(false)} />
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-gray-200 flex-col flex-shrink-0 fixed top-0 bottom-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-56 mt-14 lg:mt-0 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
