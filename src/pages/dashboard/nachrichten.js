import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function NachrichtenPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [messageType, setMessageType] = useState("Allgemeine Bemerkung");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [sentMessages, setSentMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) { router.replace("/login"); return; }
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/getUserData", { headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 401) { localStorage.removeItem("userToken"); router.replace("/login"); return; }
        const data = await res.json();
        setUserData(data);
        // Load sent messages (excluding admin task entries)
        if (data?.id) {
          fetch(`/api/admin/notes?userId=${data.id}&messagesOnly=true`)
            .then(r => r.json())
            .then(d => setSentMessages(d.notes || []))
            .catch(() => {});
        }
      } catch {}
    }
    fetchUser();
  }, []);

  async function handleSend(e) {
    e.preventDefault();
    if (!messageText.trim()) return;
    setSending(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("userToken");
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData?.id,
          text: `[${messageType}] ${messageText}`,
          author: `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() || "Kunde",
        }),
      });
      if (res.ok) {
        const note = await res.json();
        setFeedback({ type: "success", text: "Nachricht gesendet. Wir melden uns so schnell wie möglich bei Ihnen." });
        setMessageText("");
        setSentMessages(prev => [note, ...prev]);
      } else {
        setFeedback({ type: "error", text: "Fehler beim Senden. Bitte versuchen Sie es erneut." });
      }
    } catch {
      setFeedback({ type: "error", text: "Netzwerkfehler. Bitte versuchen Sie es später erneut." });
    } finally {
      setSending(false);
    }
  }

  const navItems = [
    { label: "Dashboard", path: "/client-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Persönliche Informationen", path: "/dashboard/formular", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { label: "Finanzen", path: "/dashboard/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
    { label: "Nachrichten & Feedback", path: "/dashboard/nachrichten", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  ];

  const userInitials = `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex min-h-screen">

        {/* Mobile top bar */}
        <div className="lg:hidden bg-white border-b border-gray-200 w-full fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm">
          <span className="text-lg font-bold text-[#B99B5F]">PHC</span>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col flex-shrink-0 fixed top-0 bottom-0 left-0 z-30">
          <div className="px-6 py-6 border-b border-gray-100">
            <p className="text-lg font-bold text-[#B99B5F]">PHC</p>
            <p className="text-xs text-gray-400">Kunden Dashboard</p>
          </div>
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B99B5F]/10 flex items-center justify-center text-[#B99B5F] font-bold text-sm">{userInitials}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{userData?.firstName} {userData?.lastName}</p>
                <p className="text-xs text-gray-400 truncate">{userData?.email}</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4">
            {navItems.map(item => (
              <a key={item.path} href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-0.5 transition ${
                  router.pathname === item.path ? "bg-[#B99B5F]/10 text-[#B99B5F] border-l-2 border-[#B99B5F]" : "text-gray-600 hover:bg-gray-50"
                }`}>
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-gray-100">
            <button onClick={() => { localStorage.removeItem("userToken"); router.push("/"); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Abmelden
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 mt-14 lg:mt-0 overflow-auto">
          <div className="bg-white border-b border-gray-100 px-6 lg:px-10 py-4">
            <h2 className="text-xl font-bold text-gray-900">Nachrichten & Feedback</h2>
            <p className="text-sm text-gray-400 mt-0.5">Kontaktieren Sie uns direkt</p>
          </div>

          <div className="px-6 lg:px-10 py-8 max-w-2xl">
            {/* Message Form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-900">Nachricht an PHC</h3>
              </div>
              <form onSubmit={handleSend} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Haben Sie eine Bemerkung, Rückmeldung oder ein Anliegen?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Allgemeine Bemerkung", "Frage zur Betreuung", "Reklamation"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMessageType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          messageType === type
                            ? "bg-[#B99B5F] text-white border-[#B99B5F]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Ihre Nachricht..."
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B99B5F]/20 focus:border-[#B99B5F] resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="w-full py-3 bg-[#B99B5F] text-white rounded-xl text-sm font-medium hover:bg-[#a88a54] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? "Wird gesendet..." : "Nachricht senden"}
                </button>
              </form>

              {feedback && (
                <div className={`mx-6 mb-6 p-4 rounded-xl text-sm ${
                  feedback.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {feedback.text}
                </div>
              )}
            </div>

            {/* Conversation: own messages + admin replies */}
            {sentMessages.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-base font-semibold text-gray-900">Nachrichten</h3>
                </div>
                <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                  {sentMessages.map(m => {
                    const isAdmin = m.author === "Admin";
                    return (
                      <div key={m.id} className={`px-6 py-3 ${isAdmin ? "bg-blue-50/40" : ""}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium ${isAdmin ? "text-blue-700" : "text-gray-500"}`}>{isAdmin ? "PHC Team" : m.author}</span>
                          <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <p className="text-sm text-gray-800">{m.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info note */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Hinweis:</span> Wir melden uns so schnell wie möglich bei Ihnen.
                Ihre Nachricht wird intern an unser Team weitergeleitet.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
