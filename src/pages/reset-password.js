import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setResetToken(router.query.resetToken || "");
    }
  }, [router.isReady, router.query.resetToken]);

  async function handleReset(e) {
    e.preventDefault();

    if (!resetToken) {
      alert("Fehlender Reset-Token.");
      return;
    }

    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    if (res.ok) {
      alert("Passwort erfolgreich zurückgesetzt!");
      window.location.href = "/login";
    } else {
      const data = await res.json();
      alert(data.message || "Ein Fehler ist aufgetreten");
    }
  }

  if (!resetToken) {
    return <div className="text-center mt-20">Loading token...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#04436F]">Setzen Sie Ihr Passwort zurück</h1>
      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Neues Passwort"
            className="border rounded p-3 w-full pr-12 h-[48px]"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={0}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        </div>
        <button type="submit" className="bg-[#04436F] text-white py-3 rounded">
Passwort zurücksetzen        </button>
      </form>
    </div>
  );
}
