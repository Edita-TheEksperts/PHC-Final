import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Eye, EyeOff, CheckCircle, Circle } from "lucide-react";

export default function SetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [form, setForm] = useState({ password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password checks
  const [passwordChecks, setPasswordChecks] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
    minLength: false,
  });

  useEffect(() => {
    const pw = form.password;
    setPasswordChecks({
      lowercase: /[a-z]/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      number: /\d/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
      minLength: pw.length >= 8,
    });
  }, [form.password]);

  const handlePasswordChange = (e) => {
    setForm({ ...form, password: e.target.value });
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirm = () => setShowConfirm(!showConfirm);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  if (form.password !== confirmPassword) {
    setError({ message: "❌ Passwörter stimmen nicht überein" });
    setLoading(false);
    return;
  }

  try {
    const res = await fetch("/api/setpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: form.password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(data); // store full object: { message, hint, resetUrl }
    }
  } catch (err) {
    setError({ message: "❌ Serverfehler. Bitte versuchen Sie es später erneut." });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto mt-10 mb-32 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        🔑 Passwort setzen
      </h1>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Password */}
            <div className="relative">
              <label className="block font-medium mb-1">Passwort*</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Passwort"
                  value={form.password}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border border-gray-300 p-3 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Validation List */}
              <ul className="mt-3 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  {passwordChecks.lowercase ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                  ein Kleinbuchstabe
                </li>
                <li className="flex items-center gap-2">
                  {passwordChecks.uppercase ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                  ein Grossbuchstabe
                </li>
                <li className="flex items-center gap-2">
                  {passwordChecks.number ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                  eine Zahl
                </li>
                <li className="flex items-center gap-2">
                  {passwordChecks.special ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                  Sonderzeichen
                </li>
                <li className="flex items-center gap-2">
                  {passwordChecks.minLength ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <Circle size={16} className="text-gray-300" />
                  )}
                  Mindestens 8 Zeichen
                </li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block font-medium mb-1">
                Passwort bestätigen*
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Passwort bestätigen"
                  value={confirmPassword}
                  onChange={handleConfirmChange}
                  className="w-full rounded-md border border-gray-300 p-3 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={toggleShowConfirm}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

      {/* Error */}
{error && (
  <div className="text-red-600 text-sm mt-4 bg-red-50 p-2 rounded">
    {error.message}

    {error.resetUrl && (
      <div className="mt-2">
        {error.hint}{" "}
        <a
          href={error.resetUrl}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {error.resetText}
        </a>
      </div>
    )}
  </div>
)}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B99B5F] text-white px-4 py-2 rounded w-full mt-6 hover:bg-[#a88a54] transition"
          >
            {loading ? "Speichern..." : "Speichern"}
          </button>
        </form>
      ) : (
        <p className="text-green-600 font-semibold bg-green-50 p-3 rounded">
          ✅ Passwort gespeichert! Sie werden zum Login weitergeleitet...
        </p>
      )}
    </div>
  );
}
