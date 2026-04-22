export const dynamic = "force-dynamic";

import React from "react";

const Datenschutz = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Datenschutzerklärung
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Bearbeitung Ihrer Personendaten im Sinne des
          Schweizer Datenschutzgesetzes (DSG) ist:
        </p>
        <p className="mt-3">
          Prime Home Care AG <br />
          Birkenstrasse 49, 6343 Rotkreuz, Schweiz <br />
          E-Mail:{" "}
          <a href="mailto:info@phc.ch" className="text-blue-600 hover:underline">
            info@phc.ch
          </a>
          <br />
          Telefon:{" "}
          <a href="tel:+41432001020" className="text-blue-600 hover:underline">
            +41 43 200 10 20
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          2. Grundsätze der Datenbearbeitung
        </h2>
        <p>
          Wir bearbeiten Personendaten rechtmässig, nach Treu und Glauben und in
          verhältnismässiger Weise. Wir beschaffen nur diejenigen Personendaten,
          die für die Erfüllung unserer Dienstleistungen, die Vertragsabwicklung
          und die Einhaltung gesetzlicher Pflichten erforderlich sind.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3. Welche Personendaten wir bearbeiten
        </h2>
        <p className="mb-3">
          Im Rahmen unserer Tätigkeit bearbeiten wir folgende Kategorien von
          Personendaten:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Stammdaten:</strong> Vor- und Nachname, Adresse,
            Geburtsdatum, Geschlecht
          </li>
          <li>
            <strong>Kontaktdaten:</strong> Telefonnummer, E-Mail-Adresse
          </li>
          <li>
            <strong>Vertrags- und Buchungsdaten:</strong> gebuchte
            Dienstleistungen, Termine, Leistungsort, Dauer und Häufigkeit der
            Einsätze
          </li>
          <li>
            <strong>Zahlungsdaten:</strong> Rechnungsadresse, Zahlungsmittel
            (bei Kreditkarten werden vollständige Kartennummern nicht auf
            unseren Servern gespeichert, sondern durch den Zahlungsdienstleister
            verarbeitet)
          </li>
          <li>
            <strong>
              Gesundheits- und Pflegedaten (besonders schützenswerte
              Personendaten nach Art. 5 lit. c DSG):
            </strong>{" "}
            Angaben zu Pflegebedarf, Mobilität, Medikation, Allergien,
            kognitiven Einschränkungen, Notfallkontakten, soweit für die sichere
            und qualifizierte Leistungserbringung erforderlich
          </li>
          <li>
            <strong>Technische Daten bei Website-Nutzung:</strong> IP-Adresse,
            Browsertyp, Betriebssystem, Zugriffszeitpunkt, besuchte Seiten
          </li>
          <li>
            <strong>Bewerbungsdaten bei Mitarbeiter-Registrierung:</strong>{" "}
            Lebenslauf, Qualifikationen, Zeugnisse, Sozialversicherungsnummer,
            Bankverbindung
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          4. Zwecke und Rechtsgrundlagen der Bearbeitung
        </h2>
        <p className="mb-3">Wir bearbeiten Ihre Daten zu folgenden Zwecken:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Abschluss und Abwicklung von Betreuungs- und
            Dienstleistungsverträgen
          </li>
          <li>
            Planung, Organisation und Durchführung von Einsätzen durch unsere
            Mitarbeitenden
          </li>
          <li>Abrechnung und Zahlungsabwicklung</li>
          <li>
            Erfüllung gesetzlicher Aufbewahrungs-, Melde- und Auskunftspflichten
            (insbesondere OR, MWSTG, Sozialversicherungsrecht)
          </li>
          <li>Kommunikation mit Kunden und Mitarbeitenden</li>
          <li>Qualitätssicherung und Weiterentwicklung unseres Angebots</li>
          <li>
            Versand des Newsletters, sofern Sie diesen abonniert haben
            (Einwilligung, jederzeit widerrufbar)
          </li>
          <li>Durchsetzung rechtlicher Ansprüche</li>
        </ul>
        <p className="mt-3">
          Die Bearbeitung stützt sich je nach Kontext auf die Vertragserfüllung,
          gesetzliche Pflichten, Ihre Einwilligung oder unser überwiegendes
          berechtigtes Interesse.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Empfänger Ihrer Daten</h2>
        <p className="mb-3">
          Wir geben Personendaten nur an folgende Empfänger weiter, soweit dies
          zur Zweckerfüllung erforderlich ist oder gesetzlich vorgeschrieben:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Mitarbeitende der Prime Home Care AG, die zur Auftragsabwicklung
            eingesetzt werden
          </li>
          <li>
            Partnerorganisationen (z. B. Spitex-Dienste), sofern Leistungen über
            diese abgerechnet oder koordiniert werden
          </li>
          <li>Zahlungsdienstleister: Stripe</li>
          <li>Hosting- und IT-Dienstleister: Hoststar</li>
          <li>Buchhaltungs- und Treuhanddienstleister</li>
          <li>Versicherungen im Schadenfall</li>
          <li>Behörden und Gerichte, soweit gesetzlich verpflichtet</li>
        </ul>
        <p className="mt-3">
          Mit allen Auftragsbearbeitern bestehen Auftragsbearbeitungsverträge,
          die ein angemessenes Datenschutzniveau sicherstellen.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          6. Datenübermittlung ins Ausland
        </h2>
        <p className="mb-3">
          Soweit personenbezogene Daten an Empfänger ausserhalb der Schweiz
          übermittelt werden, erfolgt dies nur in Länder mit angemessenem
          Datenschutzniveau gemäss Liste des Bundesrats oder unter Anwendung
          geeigneter Garantien (Standardvertragsklauseln,
          Datenschutzzusicherungen).
        </p>
        <p className="mb-2">
          Konkret werden Daten insbesondere in folgende Länder übermittelt:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>USA:</strong> Hosting-Dienstleister Vercel Inc. Die
            Angemessenheit wird über das Swiss-US Data Privacy Framework oder
            Standardvertragsklauseln abgesichert.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Aufbewahrungsdauer</h2>
        <p className="mb-3">
          Wir bewahren Personendaten nur so lange auf, wie dies für die
          jeweiligen Zwecke erforderlich ist oder gesetzliche
          Aufbewahrungspflichten bestehen:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Vertrags- und Abrechnungsdaten: 10 Jahre nach Vertragsende
            (Art. 958f OR, MWSTG)
          </li>
          <li>Kontaktanfragen ohne Vertragsabschluss: 12 Monate</li>
          <li>Newsletter-Daten: bis zum Widerruf der Einwilligung</li>
          <li>
            Bewerbungsunterlagen nicht eingestellter Personen: 6 Monate nach
            Abschluss des Verfahrens, sofern keine Zustimmung zur längeren
            Aufbewahrung vorliegt
          </li>
          <li>Technische Logdaten: 90 Tage</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Ihre Rechte</h2>
        <p className="mb-3">Sie haben nach DSG folgende Rechte:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Auskunft über die bearbeiteten Personendaten (Art. 25 DSG)</li>
          <li>Berichtigung unrichtiger Daten (Art. 32 DSG)</li>
          <li>Löschung, soweit keine Aufbewahrungspflichten entgegenstehen</li>
          <li>Einschränkung der Bearbeitung</li>
          <li>Datenherausgabe oder -übertragung (Art. 28 DSG)</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft</li>
          <li>
            Beschwerde beim Eidgenössischen Datenschutz- und
            Öffentlichkeitsbeauftragten (EDÖB),{" "}
            <a
              href="https://www.edoeb.admin.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              www.edoeb.admin.ch
            </a>
          </li>
        </ul>
        <p className="mt-3">
          Zur Ausübung Ihrer Rechte wenden Sie sich an{" "}
          <a href="mailto:info@phc.ch" className="text-blue-600 hover:underline">
            info@phc.ch
          </a>
          . Wir beantworten Ihr Auskunftsgesuch grundsätzlich innert 30 Tagen
          und kostenlos.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          9. Cookies und Tracking-Technologien
        </h2>
        <p className="mb-3">
          Unsere Website verwendet Cookies und vergleichbare Technologien. Wir
          unterscheiden zwischen:
        </p>
        <ul className="list-disc list-inside space-y-1 mb-3">
          <li>
            technisch notwendigen Cookies, die für den Betrieb der Website
            erforderlich sind
          </li>
          <li>
            Analyse- und Marketing-Cookies, die nur mit Ihrer Einwilligung
            gesetzt werden
          </li>
        </ul>
        <p className="mb-3">
          Beim ersten Besuch informieren wir Sie über ein Cookie-Banner und
          holen Ihre Einwilligung für nicht zwingend notwendige Cookies ein. Sie
          können Ihre Einstellungen jederzeit anpassen oder widerrufen.
        </p>
        <p>
          <strong>Eingesetzte Dienste:</strong> Google Analytics, Meta Pixel
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          10. Automatisierte Einzelentscheidung
        </h2>
        <p>
          Wir treffen keine ausschliesslich automatisierten Entscheidungen, die
          für Sie rechtliche Wirkung haben oder Sie erheblich beeinträchtigen.
          Die Zuteilung von Betreuungspersonen erfolgt immer unter Einbezug
          einer qualifizierten Person.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Datensicherheit</h2>
        <p>
          Wir treffen angemessene technische und organisatorische Massnahmen
          zum Schutz Ihrer Daten gegen unbefugten Zugriff, Verlust oder
          Manipulation. Dazu gehören TLS-Verschlüsselung bei der
          Datenübertragung, Zugriffskontrollen, regelmässige Sicherheitsupdates
          und Schulung der Mitarbeitenden.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          12. Änderungen dieser Erklärung
        </h2>
        <p>
          Wir können diese Datenschutzerklärung anpassen, um Änderungen unserer
          Dienste oder gesetzlicher Vorgaben zu berücksichtigen. Die jeweils
          aktuelle Fassung finden Sie auf unserer Website.
        </p>
      </section>

      <p className="text-sm text-gray-500 mt-8">Stand: April 2026</p>
    </div>
  );
};

export default Datenschutz;
