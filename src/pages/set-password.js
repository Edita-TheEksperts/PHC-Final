import { useState } from "react";
import { useRouter } from "next/router";

export default function SetPassword() {
  const router = useRouter();
  // F-16: this route is the employee welcome / first-time password set.
  // Approve-employee.js generates a `resetToken` and links here with both
  // `email` and `token`. /api/set-password verifies the token (or, for legacy
  // links without one, accepts the first password the employee enters).
  const { email, token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return setMessage("Bitte beide Felder ausfüllen.");
    }

    if (password !== confirmPassword) {
      return setMessage("Passwörter stimmen nicht überein.");
    }

    const res = await fetch("/api/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setMessage(data.message || "Fehler beim Speichern.");
    }

    setMessage("✅ Passwort wurde gespeichert. Sie können sich jetzt einloggen.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-[#04436F]">Willkommen bei Prime Home Care</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Bitte erstellen Sie Ihr Passwort, um sich erstmals einzuloggen.</p>

        {message && <p className="text-sm mb-4 text-center text-red-600">{message}</p>}

        <input
          type="password"
          placeholder="Neues Passwort"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort bestätigen"
          className="w-full mb-4 p-2 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-[#04436F] text-white p-2 rounded hover:bg-[#033553]">
          Speichern
        </button>
      </form>
    </div>
  );
}
