import React from "react";

const Impressum = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">Impressum</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Angaben gemäss UWG Art. 3 Abs. 1 lit. s </h2>
        <p>
          Prime Home Care AG <br />
          Birkenstrasse 49 <br />
          6343 Rotkreuz <br />
          Schweiz
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
        <p>
          Telefon:{" "}
          <a href="tel:+41432001020" className="text-blue-600 hover:underline">
            +41 43 200 10 20
          </a>
          <br />
          E-Mail:{" "}
          <a href="mailto:info@phc.ch" className="text-blue-600 hover:underline">
            info@phc.ch
          </a>
          <br />
          Web:{" "}
          <a
            href="https://www.phc.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.phc.ch
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Vertretungsberechtigte Personen</h2>
        <p>
          Bettina Rykart, Geschäftsführerin <br />
          Silvain Kocher, Geschäftsführer
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Handelsregister</h2>
        <p>
          Eingetragen im Handelsregister des Kantons Zug <br />
          UID / Unternehmens-Identifikationsnummer: CHE-215.205.279 <br />
          Handelsregisternummer: CH-130-3031697-7
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Zuständige Aufsichtsbehörde</h2>
        <p>
          Soweit einzelne Dienstleistungen der Bewilligungspflicht unterliegen
          (z. B. Spitex, Pflegeleistungen nach KLV), gilt die Aufsicht des
          Kantons am Ort der Leistungserbringung. Für den Hauptsitz: Amt für
          Wirtschaft und Arbeit des Kantons Zug.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Datenschutz</h2>
        <p>
          Verantwortliche Stelle im Sinne des DSG: Prime Home Care AG, Adresse
          wie oben.
          <br />
          Kontakt für Datenschutzanliegen:{" "}
          <a href="mailto:info@phc.ch" className="text-blue-600 hover:underline">
            info@phc.ch
          </a>
          <br />
          Ausführliche Informationen zur Bearbeitung personenbezogener Daten
          finden Sie in unserer Datenschutzerklärung.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Haftungsausschluss</h2>
        <p className="mb-3">
          Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für
          Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernimmt die
          Prime Home Care AG keine Gewähr. Haftungsansprüche gegen die Prime
          Home Care AG wegen Schäden materieller oder immaterieller Art, die
          aus dem Zugriff, der Nutzung oder Nichtnutzung der Website entstehen,
          sind ausgeschlossen, soweit nicht nachweislich vorsätzliches oder
          grob fahrlässiges Verschulden vorliegt.
        </p>
        <p>
          Für Inhalte verlinkter externer Websites übernimmt die Prime Home
          Care AG keine Verantwortung. Für den Inhalt dieser Websites sind
          ausschliesslich deren Betreiber verantwortlich.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Drittdienstleister</h2>
        <p>
          Hosting: Hoststar – Multimedia Networks AG, Kirchgasse 30, CH-3312
          Fraubrunnen <br />
          Zahlungsdienstleister: Stripe.com, Dublin, Irland <br />
          Analytics: Google Analytics
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Urheberrecht</h2>
        <p>
          Sämtliche auf dieser Website veröffentlichten Inhalte wie Texte,
          Bilder, Grafiken, Logos, Marken und audiovisuelle Medien unterliegen
          dem Schweizer Urheberrechtsgesetz (URG) sowie weiteren anwendbaren
          Schutzgesetzen. Vervielfältigung, Bearbeitung, Verbreitung oder jede
          andere Form der Verwertung ausserhalb der gesetzlichen Schranken
          bedürfen der vorgängigen schriftlichen Zustimmung der Prime Home Care
          AG oder des jeweiligen Rechteinhabers.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Gerichtsstand und anwendbares Recht</h2>
        <p>
          Es gilt ausschliesslich Schweizer Recht. Gerichtsstand ist Rotkreuz,
          Schweiz, soweit gesetzlich zulässig.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Stand: April 2026</p>
    </div>
  );
};

export default Impressum;
