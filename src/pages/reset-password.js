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
            className="border rounded p-3 w-full pr-12"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={0}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit" className="bg-[#04436F] text-white py-3 rounded">
Passwort zurücksetzen        </button>
      </form>
    </div>
  );
}
