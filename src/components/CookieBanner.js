import { useEffect, useState } from "react";
import Link from "next/link";

// nDSG (Schweiz) / DSGVO: implied consent for strictly necessary cookies is OK,
// but we still need to inform the user and link to the privacy policy. This
// banner persists the user's choice in localStorage and won't reappear once
// answered.
const CONSENT_KEY = "phc_cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) setVisible(true);
    } catch {
      // localStorage blocked — show banner so user can choose anyway.
      setVisible(true);
    }
  }, []);

  function persist(value) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: new Date().toISOString() }));
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] px-4 pb-4 pointer-events-none">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 text-sm text-gray-700">
            <p className="font-semibold text-gray-900 mb-1">Cookies & Datenschutz</p>
            <p className="text-xs leading-relaxed">
              Diese Website verwendet ausschliesslich notwendige Cookies, um den Betrieb sicherzustellen.
              Weitere Informationen finden Sie in unserer{" "}
              <Link href="/datenschutz" className="underline text-[#04436F] font-medium">
                Datenschutzerklärung
              </Link>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => persist("necessary")}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Nur notwendige
            </button>
            <button
              onClick={() => persist("all")}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#04436F] rounded-lg hover:bg-[#033558] transition"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
