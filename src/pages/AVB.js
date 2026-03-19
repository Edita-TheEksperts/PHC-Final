import React, { useState } from "react";

const AVB = () => {
  const [searchTerm, setSearchTerm] = useState("");

 const sections = [
  {
    title: "1. Zweck und Geltungsbereich der allgemeinen Vertragsbedingungen",
    content: (
      <>
        <p>
          Die Prime Home Care AG (nachfolgend „PHC AG“) bietet eine Plattform,
          über die Kunden verschiedene Dienstleistungen buchen und abrechnen
          können. Diese Allgemeinen Vertragsbedingungen (AVB) regeln den Zugang
          und die Nutzung der Plattform und legen die Rechte und Pflichten der
          PHC AG, ihrer Mitarbeitenden und der Kunden im Rahmen der
          Plattformnutzung fest.
        </p>
        <p>
          Die PHC AG agiert als Dienstleistungsanbieter und Arbeitgeber und
          stellt Kunden Unterstützung in Form von Begleitung, Einkäufen &
          Erledigungen, Freizeit & Kultur, Gesellschaft & Betreuung,
          Haushaltshilfe, Unterstützung bei der Grundpflege und Leistungen von
          Partnerunternehmen zur Verfügung.
        </p>
      </>
    ),
    text:
      "PHC AG bietet Plattform für Buchung/Abrechnung. AVB regeln Zugang/Nutzung sowie Rechte/Pflichten. Leistungen: Begleitung, Einkäufe, Freizeit, Betreuung, Haushalt, Grundpflege, Partnerleistungen.",
  },
  {
    title: "2. Definitionen",
    content: (
      <>
        <p>Für die AVB gelten folgende Begriffsbestimmungen:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>„Mitarbeiter“:</strong> Personen, die in einem
            Anstellungsverhältnis zur PHC AG stehen. Personenbezeichnungen gelten
            für weibliche und männliche Form.
          </li>
          <li>
            <strong>„PHC AG“:</strong> Prime Home Care AG mit Sitz in Rotkreuz,
            Schweiz.
          </li>
          <li>
            <strong>„Kunde“:</strong> Natürliche oder juristische Personen, die
            über die Plattform Dienstleistungen in Anspruch nehmen.
          </li>
          <li>
            <strong>„Dienstleistung“:</strong> Alle Leistungen, die die PHC AG
            für Kunden anbietet, darunter auch alle Partnerleistungen.
          </li>
        </ul>
      </>
    ),
    text:
      "Mitarbeiter: angestellt bei PHC AG (Bezeichnungen gelten für w/m). PHC AG: Sitz Rotkreuz. Kunde: natürliche/juristische Personen. Dienstleistung: alle Leistungen inkl. Partnerleistungen.",
  },
  {
    title: "3. Registrierung und Zustimmung zu den AVB",
    content: (
      <p>
        Zur Nutzung der Dienstleistungen muss der Kunde ein persönliches Konto
        erstellen und bei der Registrierung die erforderlichen Daten angeben.
        Der Kunde bestätigt mit der Erstellung seines Kontos die AVB und stimmt
        diesen zu, indem er das Kästchen „Ich akzeptiere die AVB“ anklickt. Der
        Kunde erhält nach Registrierung eine Bestätigungs-E-Mail.
      </p>
    ),
    text:
      "Konto erstellen und Daten angeben. Zustimmung durch Anklicken „Ich akzeptiere die AVB“. Bestätigungs-E-Mail nach Registrierung.",
  },
  {
    title: "4. Urheberrecht und geistiges Eigentum",
    content: (
      <p>
        Die Inhalte der Plattform, darunter Texte, Marken, Logos, Bilder und
        audiovisuelle Medien, sind Eigentum der PHC AG oder werden mit
        Genehmigung Dritter verwendet und sind durch geistige Eigentumsrechte
        geschützt. Kein Teil der Website darf ohne Genehmigung als Lizenz zur
        Nutzung interpretiert werden.
      </p>
    ),
    text:
      "Inhalte (Texte/Marken/Logos/Bilder/Medien) sind geschützt. Keine Nutzung ohne Genehmigung. Keine Lizenz durch Nutzung der Website.",
  },
  {
    title: "5. Weiterentwicklung der Dienstleistungen und Änderungen der AVB",
    content: (
      <>
        <p>
          Die PHC AG behält sich das Recht vor, die AVB und die Plattform
          entsprechend technischen Anforderungen und zur Optimierung des Angebots
          anzupassen. Über wesentliche Änderungen werden Kunden per E-Mail
          informiert. Stimmt der Kunde den Änderungen nicht zu, kann der Vertrag
          beendet werden.
        </p>
        <p>
          Sollte der Benutzer innerhalb von 30 Tagen keinen Einspruch erheben,
          gelten die Änderungen als zur Kenntnis genommen und akzeptiert. Bei
          einem Widerspruch oder einer Ablehnung werden die Verträge jedoch
          sofort beendet, und der Benutzer stellt die Nutzung der Plattform und
          Dienstleistungen ein. Dies erfolgt unbeschadet der vollständigen
          Erfüllung bestehender Verpflichtungen, insbesondere der Einhaltung
          aller bereits vereinbarten Dienstleistungsbuchungen durch den Benutzer
          und PHC AG.
        </p>
      </>
    ),
    text:
      "PHC AG darf AVB/Plattform anpassen. Info per E-Mail bei wesentlichen Änderungen. Kein Einspruch 30 Tage = akzeptiert. Widerspruch = sofortige Beendigung; bestehende Buchungen/Verpflichtungen bleiben zu erfüllen.",
  },
  {
    title: "6. Zugang zum Konto und Sicherheit",
    content: (
      <p>
        Der Zugang zur Plattform ist nur registrierten Nutzern gestattet. Jeder
        Benutzer ist für die Sicherheit seiner Zugangsdaten verantwortlich. Im
        Falle des Verdachts auf Missbrauch oder Verlust der Zugangsdaten ist die
        PHC AG unverzüglich zu benachrichtigen, um geeignete Massnahmen zu
        ergreifen.
      </p>
    ),
    text:
      "Zugang nur für registrierte Nutzer. Jeder schützt Zugangsdaten. Missbrauch/Verdacht sofort melden.",
  },
  {
    title: "7. Buchung und Durchführung der Dienstleistungen",
    content: (
      <p>
        Kunden können Dienstleistungen der PHC AG ausschliesslich über die
        Plattform buchen. Die Buchung wird durch Auswahl der Dienstleistung und
        Angabe von Ort und Zeit abgeschlossen.
      </p>
    ),
    text:
      "Buchung ausschliesslich über Plattform: Dienstleistung wählen, Ort und Zeit angeben.",
  },
  {
    title: "8. Stornierung und Kündigung einer Buchung",
    content: (
      <>
        <h3 className="font-semibold mb-1">8.1 Stornierungsfristen</h3>
        <p>
         Kunden können ihre Buchung bis zu 14 Tage vor der gebuchten Dienstleistung stornieren, ohne dass ihnen Kosten entstehen. 
      Stornierungen, die weniger als 14 Tage vor der gebuchten Dienstleistung eingehen, werden mit einer Gebühr von 50% belastet. 
      Stornierung die weniger als 7 Tage vor der gebuchten Dienstleistung eingehen, werden mit dem gesamten Betrag für die gebuchte Dienstleistung belastet.
        </p>

        <h3 className="font-semibold mt-4 mb-1">8.2 Rückerstattungen</h3>
        <p>
          Bei Stornierung wird der volle bzw. der Teilbetrag gemäss 8.1 innerhalb
          von 48 Stunden über die ursprüngliche Zahlungsmethode zurückerstattet.
        </p>

        <h3 className="font-semibold mt-4 mb-1">8.3 Fehlbuchung</h3>
        <p>
          Haben Sie irrtümlich eine falsche Buchung getätigt (Datum, Monat, Zeit
          etc.), kontaktieren Sie uns bitte direkt über unser Kontaktformular.
        </p>

        <h3 className="font-semibold mt-4 mb-1">8.4 Nicht stornierbare Buchungen</h3>
        <p>
          In bestimmten Fällen, wie z. B. bei Sonderaktionen oder Rabatten,
          können Buchungen nicht storniert werden. Dies wird den Kunden vor der
          Buchung klar mitgeteilt und wird in vollem Umfang verrechnet.
        </p>

        <h3 className="font-semibold mt-4 mb-1">8.5 Kündigungsfrist</h3>
        <p>
         Das Vertragsverhältnis beginnt mit der Buchung der Dienstleistung und ist auf unbestimmte Zeit abgeschlossen.
         Der Kunde erklärt sich mit den AVBs der Prime Home Care AG einverstanden mit Abschluss der Buchung. 
         Das Vertragsverhältnis kann von beiden Parteien jederzeit unter Einhaltung einer Kündigungsfrist von 14 Tagen über das online Portal gekündigt werden.
        </p>
        <p>
          Das Recht zur fristlosen Kündigung aus wichtigen Gründen gemäss Art.
          404 OR bleibt ausdrücklich vorbehalten. Aus wichtigen Gründen können
          die Vertragsparteien den Vertrag jederzeit auflösen. Bei Auflösung
          durch den Kunden wird eine Aufwandsentschädigung von CHF 300.– exkl.
          MwSt. fällig.
        </p>
      </>
    ),
    text:
      "Storno: bis 14 Tage kostenlos; <14 Tage 50%; <7 Tage voller Betrag. Rückerstattung innerhalb 48h über ursprüngliche Zahlungsmethode. Fehlbuchung via Kontaktformular. Sonderaktionen/Rabatte evtl. nicht stornierbar. Kündigung: jederzeit mit 14 Tagen über Online-Portal; fristlos aus wichtigen Gründen (Art. 404 OR); bei Auflösung durch Kunden CHF 300 exkl. MwSt.",
  },
  {
    title: "9. Zahlungsbedingungen",
    content: (
      <p>
        Der Preis für jede Dienstleistung wird auf der Plattform angegeben. Die
        Zahlung erfolgt über die auf der Plattform akzeptierten Zahlungsmethoden
        (z. B. Kreditkarte). Die Zahlungsbelege für die dem Kunden erbrachten
        Dienstleistungen sind jederzeit auf seinem persönlichen Konto verfügbar.
        Die Rechnung wird dem Kunden auf der Plattform und via E-Mail zur
        Verfügung gestellt.
      </p>
    ),
    text:
      "Preis pro Dienstleistung auf Plattform. Zahlung über akzeptierte Methoden (z.B. Kreditkarte). Belege jederzeit im Konto. Rechnung auf Plattform und per E-Mail.",
  },
  {
    title: "10. Verpflichtungen der PHC AG",
    content: (
      <p>
        Die PHC AG ist bemüht, die Plattform und Dienstleistungen kontinuierlich
        verfügbar zu halten und einen hochwertigen Service zu gewährleisten. Bei
        Störungen oder Anomalien unternimmt die PHC AG geeignete Massnahmen zur
        Behebung.
      </p>
    ),
    text:
      "PHC AG bemüht sich um Verfügbarkeit und hochwertigen Service; behebt Störungen/Anomalien mit geeigneten Massnahmen.",
  },
  {
    title: "11. Haftungsbeschränkung der PHC AG",
    content: (
      <>
        <p>
       Die Benutzer bestätigen und akzeptieren, dass sie die Website, www.phc.ch, auf eigenes Risiko aufrufen, nutzen, erkunden und durchsuchen.
      Sie erkennen zudem an und akzeptieren, dass die Prime Home Care AG sowie ihre nationalen und internationalen Tochtergesellschaften, Geschäftsführer, Führungskräfte, Mitarbeiter, Vertreter oder Anteilseigner sowie alle weiteren Beteiligten an der Erstellung, Produktion oder Bereitstellung der Website, im Rahmen der geltenden gesetzlichen Bestimmungen, in keinem Fall für direkte oder indirekte Schäden haften.
      Dazu zählen auch Rufschädigungen oder sonstige Kosten, Verluste, Umsatz- oder Gewinneinbussen, selbst wenn diese vorhersehbar gewesen wären. 
      Diese Haftungsbeschränkung gilt für alle Schäden, die sich aus dem Zugang der Benutzer zur Website, deren Nutzung oder der Unmöglichkeit der Nutzung ergeben.
        </p>
        <p>
        Sämtliche Dokumente, die während der Nutzung der Website heruntergeladen oder auf andere Weise erhalten werden, liegen in der alleinigen Verantwortung des Benutzers, unabhängig davon, ob es sich um einen Kunden, Vertreter oder regulären Nutzer handelt. Zudem übernimmt die PHC AG keine Haftung für zeitweilige Zugangsprobleme oder -ausfälle der Plattform, des Kontos oder der Dienstleistungen, die auf Benutzerfehler, unkontrollierbare Umstände, höhere Gewalt oder Ausfälle der Telekommunikationsnetze sowie Einschränkungen der Internetdienstleistung zurückzuführen sind.
        </p>
        <p>
          Bei unangemessenem Verhalten, beispielsweise rassistischen Äusserungen, behält sich die PHC AG das Recht vor, die Funktionalitäten der Website teilweise oder vollständig zu unterbrechen oder auszusetzen.
Die Prime Home Care AG übernimmt keine Haftung für Unterbrechungen oder Aussetzungen der Website-Funktionalitäten, die durch Handlungen oder Unterlassungen von PHC AG oder ihren verbundenen Unternehmen oder Dritten verursacht werden.
        </p>
      </>
    ),
    text:
      "Website-Nutzung www.phc.ch auf eigenes Risiko. Keine Haftung für direkte/indirekte Schäden im gesetzlichen Rahmen. Downloads in Verantwortung des Nutzers. Keine Haftung für Zugangsprobleme/-ausfälle (Benutzerfehler, höhere Gewalt, Netzausfälle). Unangemessenes Verhalten kann zur (Teil-)Sperrung führen.",
  },
{
  title: "12. Allgemeine Pflichten für alle Benutzer",
  content: (
    <>
      <p>
        Der Benutzer verpflichtet sich, die Plattform verantwortungsvoll und in
        Übereinstimmung mit geltenden Gesetzen und Vorschriften zu nutzen.
        Insbesondere sind folgende Handlungen untersagt:
      </p>

      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>
          Verstösse gegen Gesetze, die öffentliche Ordnung oder die Rechte
          Dritter, sowie Verstösse gegen moralische und ethische Normen.
        </li>
        <li>
          Dritten den Zugang zum eigenen Konto zu gewähren oder zu übertragen.
        </li>
        <li>
          Inhalte zu veröffentlichen, die beleidigend, verleumderisch oder
          rufschädigend sind oder die Rechte, den Ruf oder das Ansehen von PHC AG
          oder anderen Nutzern beeinträchtigen könnten.
        </li>
        <li>
          Die Plattform oder Dienstleistungen betrügerisch zu nutzen,
          beispielsweise durch falsche Identitäten, und das Interesse von PHC AG
          oder anderen Benutzern zu schädigen.
        </li>
        <li>
          Alle für die Dienstleistungserbringung erforderlichen Informationen an
          PHC AG zu übermitteln und deren Richtigkeit sicherzustellen.
        </li>
        <li>
          Die Plattform und Dienstleistungen ordnungsgemäss zu nutzen,
          einschliesslich der Teilnahme an den vorgesehenen Registrierungs-,
          Buchungs- und Bewertungsprozessen.
        </li>
        <li>
          PHC AG über auftretende Schwierigkeiten oder Probleme mit anderen
          Benutzern oder in Bezug auf die Nutzung der Plattform, des Kontos und
          der Dienstleistungen zu informieren.
        </li>
        <li>
          Vertraulichkeit zu wahren und keine Informationen oder Inhalte im
          Zusammenhang mit den Dienstleistungen, Buchungen oder Interaktionen an
          Dritte weiterzugeben.
        </li>
      </ul>

      <p className="mt-4 font-semibold">
        Die folgenden Handlungen sind ausdrücklich verboten:
      </p>

      <ul className="list-disc list-inside space-y-1">
        <li>
          Jede Handlung, die den kontinuierlichen Betrieb der Plattform oder
          Dienstleistungen unterbricht, verzögert oder behindert.
        </li>
        <li>
          Jeder Versuch, in die Systeme von PHC AG einzudringen.
        </li>
        <li>
          Jede missbräuchliche Umleitung von Ressourcen der Plattform oder des
          Kontos.
        </li>
        <li>
          Jede übermässige Belastung der digitalen Infrastruktur von PHC AG.
        </li>
        <li>
          Verletzungen der Sicherheits- und Authentifizierungsmassnahmen.
        </li>
        <li>
          Handlungen, die die finanziellen, geschäftlichen oder moralischen
          Interessen von PHC AG und anderen Nutzern schädigen.
        </li>
        <li>
          Verstösse gegen die AVB sowie jede missbräuchliche Nutzung der
          Plattform und der Dienstleistungen für Zwecke, die über den
          vorgesehenen Rahmen hinausgehen.
        </li>
      </ul>
    </>
  ),
  text:
    "Benutzer müssen die Plattform gesetzeskonform, verantwortungsvoll und korrekt nutzen. Untersagt sind Gesetzesverstösse, Weitergabe von Konten, rufschädigende Inhalte, betrügerische Nutzung, falsche Angaben und Verletzung der Vertraulichkeit. Ausdrücklich verboten sind Störungen des Betriebs, Systemeingriffe, Ressourcenmissbrauch, Überlastung der Infrastruktur, Sicherheitsverstösse, Schädigung der Interessen von PHC AG oder Nutzern sowie missbräuchliche Nutzung der Plattform.",
},
{
  title: "13. Pflichten des Kunden",
  content: (
    <>
      <p>
        Der Kunde hat gegenüber den Mitarbeitenden der Prime Home Care AG kein arbeitsrechtliches Weisungsrecht. Anweisungen zur Einsatzplanung, Arbeitsorganisation und Leistungserbringung erfolgen ausschliesslich durch die PHC AG als Arbeitgeberin. Wünsche des Kunden zur konkreten Ausführung der gebuchten Dienstleistung sind der PHC AG mitzuteilen.
      </p>
      <p>
        Der Kunde verpflichtet sich zu einem respektvollen, höflichen und angemessenen Umgang mit den Mitarbeitern. Dies beinhaltet unter anderem:
      </p>

      <ul className="list-disc list-inside space-y-1">
        <li>
          Keine wiederholten und unberechtigten Stornierungen von Buchungen
          gemäss den Stornobedingungen.
        </li>
        <li>
          Sicherzustellen, dass die Mitarbeiter alle notwendigen Ausstattungen
          und Materialien zur Verfügung haben, um die Dienstleistungen unter
          optimalen Bedingungen zu erbringen.
        </li>
        <li>
          Die Mitarbeiter vorab über spezifische Gegebenheiten am Leistungsort
          zu informieren, z. B. über das Vorhandensein von Haustieren, die
          mögliche Allergien oder Ängste auslösen könnten.
        </li>
        <li>
          Nach Abschluss einer Dienstleistung keinen direkten Kontakt mit dem
          Mitarbeiter aufzunehmen, um Leistungen ausserhalb der Plattform zu
          organisieren.
        </li>
      </ul>

      <p className="mt-4">
        Die Benutzer sind verantwortlich für jede Form der Nutzung der Plattform
        und der Dienstleistungen sowie für alle daraus resultierenden Schäden.
        Sie tragen die alleinige Verantwortung für ungenaue, unvollständige oder
        veraltete Angaben, die sie bei der Registrierung machen, und deren
        Konsequenzen:
      </p>

      <p className="mt-2 font-semibold">Dies umfasst:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>
          Die Inhalte und Informationen, die sie in ihrem Konto veröffentlichen
          oder über die Plattform bereitstellen.
        </li>
        <li>
          Die ordnungsgemässe Durchführung von Dienstleistungsbuchungen auf der
          Plattform.
        </li>
      </ul>

      <p className="mt-4 font-semibold">
        Die Benutzer verstehen und akzeptieren, dass folgende Handlungen
        ausdrücklich untersagt sind:
      </p>

      <ul className="list-disc list-inside space-y-1">
        <li>
          Verhaltensweisen, die die Funktionalität der Plattform oder
          Dienstleistungen unterbrechen, verlangsamen oder behindern.
        </li>
        <li>
          Versuche des unautorisierten Zugriffs auf die Systeme von PHC AG.
        </li>
        <li>
          Missbrauch von Systemressourcen der Plattform oder des Kontos.
        </li>
        <li>
          Handlungen, die zu einer übermässigen Belastung der Infrastruktur
          führen.
        </li>
        <li>
          Verletzung von Sicherheits- und Authentifizierungsmassnahmen.
        </li>
        <li>
          Jede Handlung, die den wirtschaftlichen, geschäftlichen oder
          moralischen Interessen von PHC AG oder anderen Nutzern schadet.
        </li>
        <li>
          Verstösse gegen die AVB sowie die missbräuchliche Verwendung der
          digitalen Infrastruktur von PHC AG oder jegliche Form der
          Zweckentfremdung der Plattform und Dienstleistungen.
        </li>
      </ul>
    </>
  ),
},

  {
    title: "14. Schadensersatz und Vertragsverstösse",
    content: (
      <>
        <p>
          Verstösst ein Benutzer oder Kunde gegen diese AVB, gesetzliche Vorschriften
          oder vertragliche Pflichten gegenüber der PHC AG, haftet der Kunde für
          sämtliche daraus entstehenden direkten und indirekten Schäden.
        </p>
        <p className="mt-2 font-semibold">Dies umfasst insbesondere:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>zusätzliche administrative Aufwände,</li>
          <li>Kosten für Ersatzorganisationen oder Neuvermittlungen,</li>
          <li>Ausfälle von vereinbarten Dienstleistungen oder Einnahmen,</li>
          <li>Schäden an Ruf, Vertrauen oder Geschäftsbeziehungen,</li>
          <li>allfällige Forderungen Dritter infolge des Vertragsverstosses.</li>
        </ul>
        <p className="mt-4">
          Die PHC AG ist berechtigt, nachgewiesene Schäden sowie pauschalisierte
          Aufwandsentschädigungen geltend zu machen, sofern diese den üblichen
          branchen- und marktkonformen Ansätzen entsprechen.
        </p>
        <p className="mt-4 font-semibold">Bei schweren oder wiederholten Verstössen kann PHC AG:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>den Zugang zur Plattform vorübergehend oder dauerhaft sperren,</li>
          <li>bestehende Vertragsverhältnisse fristlos kündigen,</li>
          <li>rechtliche Schritte einleiten.</li>
        </ul>
        <p className="mt-4">
        Die Geltendmachung von weitergehenden gesetzlichen Ansprüchen,
        insbesondere Schadenersatz- und Genugtuungsansprüchen nach
        schweizerischem Recht, bleibt ausdrücklich vorbehalten.
      </p>
      </>
    ),
    text:
      "Bei Verstoss: Haftung für direkte/indirekte Schäden (Adminaufwand, Ersatzorganisation, Ausfälle, Rufschäden, Drittforderungen). PHC darf nachgewiesene Schäden + pauschalisierte Entschädigungen geltend machen. Bei schweren/wiederholten Verstössen: Sperrung, fristlose Kündigung, rechtliche Schritte.",
  },
  {
    title: "15. Dauer der Vereinbarung",
    content: (
      <p>
        Diese AVB gelten auf unbestimmte Zeit ab der Annahme durch den Benutzer
        und bleiben bis zur Kündigung durch eine der Parteien in Kraft.
      </p>
    ),
    text:
      "AVB gelten unbestimmte Zeit ab Annahme und bis zur Kündigung durch eine Partei.",
  },
  {
    title: "16. Versicherung",
    content: (
      <p>
        Die PHC AG unterhält eine Haftpflichtversicherung, die nachgewiesene
        Schäden während der Dienstleistung abdeckt. Schäden müssen detailliert
        mit Fotodokumentation und innerhalb von 48 Stunden nach dem
        Schadensereignis gemeldet werden.
      </p>
    ),
    text:
      "Haftpflichtversicherung deckt nachgewiesene Schäden während Dienstleistung. Schaden mit Foto/Details innerhalb 48h melden.",
  },
  {
    title: "17. Datenschutz",
    content: (
      <p>
        Die PHC AG behandelt alle Benutzerdaten gemäss den geltenden
        Datenschutzbestimmungen und in Übereinstimmung mit der Datenschutzrichtlinie,
        die auf der Website verfügbar ist.
      </p>
    ),
    text:
      "Datenverarbeitung gemäss Datenschutzbestimmungen und Datenschutzrichtlinie auf der Website.",
  },
  {
    title: "18. Anwendbares Recht",
    content: <p>Diese AVB unterliegen dem schweizerischen Recht.</p>,
    text: "Schweizerisches Recht gilt.",
  },
  {
    title: "19. Streitbeilegung und Gerichtsstand",
    content: (
      <p>
        Im Falle von Streitigkeiten verfolgt die PHC AG eine Politik der gütlichen
        Einigung. Benutzer werden gebeten, sich bei Problemen an die PHC AG zu
        wenden, um eine für beide Parteien zufriedenstellende Lösung zu finden.
      </p>
    ),
    text:
      "Streitigkeiten: gütliche Einigung; bei Problemen an PHC AG wenden.",
  },
  {
    content: <p>Rotkreuz, im Januar 2026</p>,
    text: "Rotkreuz, im Januar 2026",
  },
];


  // Filter
  const filteredSections = sections.filter((s) => {
    const title = s.title?.toLowerCase() || "";
    const text = s.text?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return title.includes(term) || text.includes(term);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 leading-relaxed">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Allgemeine Vertragsbedingungen (AVB) der Prime Home Care AG (PHC AG)
      </h1>

      {/* 🔍 Suchleiste */}
      <div className="max-w-[1110px] mx-auto mt-6 mb-10 relative">
        <input
          type="text"
          placeholder="Suchen Sie nach Stichworten (z. B. Kündigung, Zahlung, Datenschutz)..."
          className="w-full rounded-full p-4 pl-12 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* Ergebnisse */}
      <div className="space-y-6">
        {filteredSections.length > 0 ? (
          filteredSections.map((section, idx) => (
            <section key={idx} className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
              <div>{section.content}</div>
            </section>
          ))
        ) : (
          <p className="text-center text-gray-500">
            Keine passenden Ergebnisse gefunden.
          </p>
        )}
      </div>
    </div>
  );
};

export default AVB;
