import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    minLength: false,
  });

  useEffect(() => {
    if (router.isReady) {
      setResetToken(router.query.resetToken || "");
    }
  }, [router.isReady, router.query.resetToken]);

  useEffect(() => {
    setPasswordChecks({
      lowercase: /[a-z]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
      minLength: newPassword.length >= 8,
    });
  }, [newPassword]);

  async function handleReset(e) {
    e.preventDefault();
    setMessage(null);

    if (!resetToken) {
      setIsError(true);
      setMessage("Fehlender Reset-Token.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("Passwörter stimmen nicht überein.");
      return;
    }

    const allChecked = Object.values(passwordChecks).every(Boolean);
    if (!allChecked) {
      setIsError(true);
      setMessage("Bitte erfüllen Sie alle Passwort-Anforderungen.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });

      if (res.ok) {
        setIsError(false);
        setMessage("Passwort erfolgreich zurückgesetzt! Sie werden zum Login weitergeleitet...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        setIsError(true);
        setMessage(data.message || "Ein Fehler ist aufgetreten.");
      }
    } catch {
      setIsError(true);
      setMessage("Serverfehler. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (!resetToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-[#04436F] text-lg">Token wird geladen...</p>
      </div>
    );
  }

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
    </svg>
  );

  const CheckIcon = ({ checked }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${checked ? "text-green-600" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {checked ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ) : (
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
      )}
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFCFF] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center text-[#04436F]">
          Setzen Sie Ihr Passwort zurück
        </h1>

        <form onSubmit={handleReset} className="flex flex-col gap-5">
          {/* New Password */}
          <div>
            <label className="block text-[#04436F] font-semibold text-sm mb-1">Neues Passwort</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Neues Passwort"
                className="border border-gray-300 rounded-lg p-3 w-full pr-12 h-[48px] text-[16px]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Password strength checks */}
            {newPassword.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <CheckIcon checked={passwordChecks.minLength} />
                  Mindestens 8 Zeichen
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon checked={passwordChecks.lowercase} />
                  Ein Kleinbuchstabe
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon checked={passwordChecks.uppercase} />
                  Ein Grossbuchstabe
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon checked={passwordChecks.number} />
                  Eine Zahl
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon checked={passwordChecks.special} />
                  Ein Sonderzeichen
                </li>
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[#04436F] font-semibold text-sm mb-1">Passwort bestätigen</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Passwort bestätigen"
                className="border border-gray-300 rounded-lg p-3 w-full pr-12 h-[48px] text-[16px]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showConfirm ? "Passwort verbergen" : "Passwort anzeigen"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">Passwörter stimmen nicht überein</p>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-lg text-center text-sm ${
                isError
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#04436F] text-white py-3 rounded-lg text-[16px] font-medium hover:bg-[#033558] transition-colors disabled:opacity-60"
          >
            {loading ? "Wird zurückgesetzt..." : "Passwort zurücksetzen"}
          </button>
        </form>
      </div>
    </div>
  );
}
