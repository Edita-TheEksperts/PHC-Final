import Link from "next/link";
import { CheckCircle } from "lucide-react";

// F-06: dedicated landing page after a job application is successfully submitted.
// The application flow used to loop back to the same step 4 view with no clear
// "done" state — this page is the explicit end state and stops the loop.

export default function BewerbungErfolgreichPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Bewerbung erfolgreich übermittelt</h1>
        <p className="text-gray-600 leading-relaxed mb-6">
          Vielen Dank für Ihre Bewerbung bei der Prime Home Care AG. Wir haben Ihre
          Unterlagen erhalten und prüfen diese sorgfältig.
        </p>
        <p className="text-gray-600 leading-relaxed mb-8">
          Sie erhalten in Kürze eine Bestätigungs-E-Mail mit einem Link zur
          Vereinbarung Ihres Interview-Termins. Bitte prüfen Sie auch Ihren
          Spam-Ordner.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            Zur Startseite
          </Link>
          <Link
            href="/FAQ"
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-[#04436F] hover:bg-[#033558] transition"
          >
            Häufige Fragen
          </Link>
        </div>
      </div>
    </div>
  );
}
