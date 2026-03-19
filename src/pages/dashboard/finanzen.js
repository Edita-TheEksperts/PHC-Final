import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClientDashboard2 from "../../components/ClientDashboard2";
import { ChevronDown, ChevronUp, Menu, X, CreditCard } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const navItems = [
  { label: "Dashboard", path: "/client-dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Persönliche Informationen", path: "/dashboard/formular", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { label: "Finanzen", path: "/dashboard/finanzen", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Kündigung", path: "/dashboard/kundigung", icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16", danger: true },
];

export default function FinanzenPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("userToken");
    if (!token) { router.replace("/login"); return; }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/getUserData", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Unauthorized");
        const user = await res.json();
        setUserData(user);
      } catch {
        localStorage.removeItem("userToken");
        router.replace("/login");
      }
    };
    fetchUser();
  }, [router]);

  const fetchPaymentMethod = async () => {
    if (!userData?.stripeCustomerId) return;
    try {
      const res = await fetch(`/api/get-payment-method?customerId=${userData.stripeCustomerId}`);
      const data = await res.json();
      setPaymentMethod(data.paymentMethod || null);
    } catch {}
  };

  useEffect(() => {
    if (userData?.stripeCustomerId) fetchPaymentMethod();
  }, [userData]);

  const handleUpdateCard = async () => {
    if (!stripe || !elements) return;
    setCardLoading(true);
    const { paymentMethod: pm, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (error) { alert(error.message); setCardLoading(false); return; }
    try {
      const res = await fetch("/api/update-payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData.id, customerId: userData.stripeCustomerId, newPaymentMethodId: pm.id }),
      });
      const data = await res.json();
      setCardLoading(false);
      if (data.success) {
        alert("Zahlungsmethode erfolgreich aktualisiert!");
        setEditingCard(false);
        fetchPaymentMethod();
      } else {
        alert("Fehler beim Speichern der Zahlungsmethode.");
      }
    } catch {
      alert("Serverfehler bei Zahlungsupdate");
      setCardLoading(false);
    }
  };

  const userInitials = `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`.toUpperCase() || "?";

  const cardBrandIcon = (brand) => {
    const b = (brand || "").toLowerCase();
    if (b === "visa") return "💳 Visa";
    if (b === "mastercard") return "💳 Mastercard";
    if (b === "amex") return "💳 Amex";
    return `💳 ${brand}`;
  };

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
                  ${item.danger ? "text-red-500 hover:bg-red-50"
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
          <h2 className="text-xl font-bold text-gray-900">Finanzen</h2>
          <p className="text-sm text-gray-400 mt-0.5">Zahlungsübersicht und Zahlungsmethode</p>
        </div>

        <div className="px-6 lg:px-10 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

          {/* Monthly overview */}
          <div>
            <ClientDashboard2 userId={userData?.id} />
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#B99B5F]/10 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#B99B5F]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Zahlungsmethode</h3>
            </div>
            <div className="p-6 space-y-4">
              {paymentMethod ? (
                <div className="bg-gradient-to-br from-[#B99B5F] to-[#8a7040] rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Zahlungskarte</span>
                    <span className="text-sm font-bold opacity-90">{paymentMethod.brand?.toUpperCase()}</span>
                  </div>
                  <p className="text-lg font-mono tracking-widest mb-4">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs opacity-70">Gültig bis</p>
                      <p className="text-sm font-semibold">{paymentMethod.exp_month}/{paymentMethod.exp_year}</p>
                    </div>
                    <div className="w-10 h-7 bg-white/20 rounded" />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <CreditCard className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">Keine Zahlungsmethode gespeichert</p>
                </div>
              )}

              <button
                onClick={() => setEditingCard(true)}
                className="w-full bg-[#B99B5F] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#a78a50] transition"
              >
                {paymentMethod ? "Karte ändern" : "Karte hinzufügen"}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── CARD MODAL ── */}
      {editingCard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Neue Zahlungsmethode</h3>
              <button
                onClick={() => setEditingCard(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 mb-5">
              <CardElement />
            </div>
            <button
              disabled={cardLoading}
              onClick={handleUpdateCard}
              className="w-full bg-gradient-to-r from-[#04436F] to-[#065a96] text-white py-3 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {cardLoading ? "Wird gespeichert…" : "Zahlungsmethode aktualisieren"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
