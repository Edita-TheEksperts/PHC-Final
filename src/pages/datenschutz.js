export const dynamic = "force-dynamic";

import React from "react";

const Datenschutz = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Datenschutzerklärung
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Verantwortlicher</h2>
        <p>
          Prime Home Care AG <br />
          6343 Rotkreuz <br />
          E-Mail: info@phc.ch
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Erhebung und Speicherung personenbezogener Daten
        </h2>
        <p>
          Wir erheben und speichern personenbezogene Daten, die Sie uns aktiv
          mitteilen (z. B. durch Kontaktformulare oder Newsletter-Anmeldung).
          Dazu gehören: Name, E-Mail-Adresse, Telefonnummer oder Angaben zu
          gebuchten Dienstleistungen oder Bewerbungsunterlagen welche für die
          Anstellung relevant sind.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Zweck der Datenverarbeitung
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Zur Bereitstellung unseres Online-Angebots</li>
          <li>Zur Bearbeitung Ihrer Anfragen</li>
          <li>Zum Versand unseres Newsletters (nur bei Anmeldung)</li>
          <li>Anstellung für eine Arbeit</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Weitergabe von Daten</h2>
        <p>
          Eine Weitergabe an Dritte erfolgt nur, wenn dies gesetzlich erlaubt ist
          oder Sie eingewilligt haben.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies</h2>
        <p>
          Unsere Website verwendet Cookies, um die Nutzung zu verbessern. Sie
          können in Ihrem Browser die Speicherung von Cookies deaktivieren.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Ihre Rechte</h2>
        <p>
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie das
          Recht auf Datenübertragbarkeit.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Newsletter</h2>
        <p>
          Wenn Sie unseren Newsletter abonnieren, speichern wir Ihre
          E-Mail-Adresse, um Ihnen regelmässig Informationen zuzusenden. Sie
          können sich jederzeit über den Abmeldelink im Newsletter abmelden.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Kontakt Datenschutz</h2>
        <p>
          Bei Fragen zum Datenschutz kontaktieren Sie uns unter: info@phc.ch
        </p>
      </section>
    </div>
  );
};

export default Datenschutz;
