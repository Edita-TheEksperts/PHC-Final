const faqData = [
  {
    category: "AGB - Allgemeine Geschäftsbedingungen",
    questions: [
      {
        question: "Für wen gelten die AVB?",
        answer: "Die Allgemeinen Vertragsbedingungen (AVB) gelten für alle Nutzer und Kunden der Prime Home Care AG (PHC AG), die Dienstleistungen über die Plattform in Anspruch nehmen."
      },
      {
        question: "Wie kommt ein Vertrag mit PHC AG zustande?",
        answer: "Ein Vertrag kommt durch die Buchung einer Dienstleistung über die Plattform und die Annahme der AVB zustande. Die Bestätigung erfolgt per E-Mail."
      },
      {
        question: "Wie kann ich meine Buchung stornieren oder kündigen?",
        answer: "Stornierungen sind bis 14 Tage vor dem Termin kostenlos, zwischen 14 und 7 Tagen werden 50% berechnet, weniger als 7 Tage vor dem Termin der volle Betrag. Kündigungen sind jederzeit mit 14 Tagen Frist über das Online-Portal möglich."
      },
      {
        question: "Wie erfolgt die Zahlung?",
        answer: "Die Zahlung erfolgt über die auf der Plattform akzeptierten Zahlungsmethoden (z.B. Kreditkarte). Rechnungen und Belege sind im Kundenkonto und per E-Mail verfügbar."
      },
      {
        question: "Welche Pflichten habe ich als Nutzer?",
        answer: "Nutzer müssen die Plattform verantwortungsvoll, gesetzeskonform und korrekt nutzen. Verboten sind u.a. Gesetzesverstöße, Weitergabe von Konten, rufschädigende Inhalte, betrügerische Nutzung, falsche Angaben und Verletzung der Vertraulichkeit."
      },
      {
        question: "Welche Haftung übernimmt die PHC AG?",
        answer: "Die Nutzung der Website erfolgt auf eigenes Risiko. PHC AG haftet im gesetzlichen Rahmen nicht für direkte oder indirekte Schäden, Zugangsprobleme oder Ausfälle. Downloads erfolgen auf eigene Verantwortung."
      },
      {
        question: "Wie ist der Datenschutz geregelt?",
        answer: "Alle Benutzerdaten werden gemäß den geltenden Datenschutzbestimmungen und der auf der Website veröffentlichten Datenschutzrichtlinie verarbeitet."
      },
      {
        question: "Welche Versicherung besteht?",
        answer: "PHC AG unterhält eine Haftpflichtversicherung, die nachgewiesene Schäden während der Dienstleistung abdeckt. Schäden müssen mit Fotodokumentation innerhalb von 48 Stunden gemeldet werden."
      },
      {
        question: "Was passiert bei Vertragsverstößen?",
        answer: "Bei Verstößen gegen die AVB oder gesetzliche Vorschriften haftet der Kunde für alle daraus entstehenden Schäden. PHC AG kann den Zugang sperren, Verträge kündigen und rechtliche Schritte einleiten."
      },
      {
        question: "Welches Recht gilt und wie werden Streitigkeiten gelöst?",
        answer: "Es gilt schweizerisches Recht. Im Streitfall wird eine gütliche Einigung angestrebt. Bei Problemen wenden Sie sich bitte an die PHC AG."
      }
    ]
  },
  {
    category: "FAQ - Frequently asked questions",
    questions: [
      {
        question: "Was sind unsere Stornierungsbedingungen?",
        answer: "Um eine reibungslose Planung sicherzustellen und Änderungen im Einsatz möglichst gering zu halten, gelten folgende Stornierungsregelungen: Stornierungen, die mindestens 14 Tage vor dem Termin erfolgen, sind kostenlos. Für Stornierungen zwischen 14 und 7 Tagen vor dem Betreuungstermin fällt eine Gebühr von 50% der Buchung an. Für Stornierungen weniger als 7 Tage vor der gebuchten Dienstleistung wird der gesamte Betrag belastet."
      },
      {
        question: "Kann ich meine Buchung bearbeiten?",
        answer: "Loggen Sie sich in Ihr Kundenprofil ein. Änderungen sind nur möglich, wenn Ihre Buchung mindestens 48 Stunden im Voraus geplant ist. Eine Anpassung der Uhrzeit kann dazu führen, dass eine andere Betreuungskraft zugewiesen wird."
      },
      {
        question: "Wie kann ich eine Buchung vornehmen?",
        answer: "Besuchen Sie unsere Webseite phc.ch, geben Sie Ihre Postleitzahl ein, wählen Sie Ihre gewünschten Dienstleistungen und die gewünschte Häufigkeit aus, legen Sie den Zeitpunkt fest, geben Sie Ihre persönlichen Daten ein und wählen Sie eine Zahlungsmethode. Anschließend erhalten Sie eine Bestätigung per E-Mail."
      },
      {
        question: "Kann ich meine Buchung stornieren?",
        answer: "Melden Sie sich in Ihrem Profil an. Gehen Sie zu 'Meine Buchungen', wählen Sie 'Bevorstehende Settings' und klicken Sie auf 'Buchung stornieren'. Durch das Aktualisieren Ihrer Verfügbarkeiten mehr als 14 Tage vor der Buchung können Stornierungsgebühren vermieden werden."
      },
      {
        question: "Wie kann ich eine Betreuungsdienstleistung umbuchen?",
        answer: "Loggen Sie sich in Ihr Prime Home Care AG-Konto ein und greifen Sie auf 'Meine Betreuungen' zu. Unter 'Bevorstehende' klicken Sie auf 'Mehr' und wählen 'Betreuung bearbeiten'. Eine Änderung der Dauer oder des Zeitplans kann dazu führen, dass Ihre Betreuungskraft Ihre Anfrage nicht mehr erfüllen kann."
      },
      {
        question: "Kann ich die Adresse meiner gebuchten Betreuung ändern?",
        answer: "Sie können Ihre Adresse online unter 'Adressänderung' anpassen. Es kann sein, dass Ihnen danach nicht mehr dieselbe Betreuungskraft zur Verfügung steht."
      },
      {
        question: "Kann ich kurzfristig eine Betreuungskraft buchen?",
        answer: "Für die Bereitstellung einer neuen Betreuungskraft benötigen wir eine Vorlaufzeit von 14 Tagen. Bei kurzfristigem Bedarf nutzen Sie bitte das Kontaktformular. Es können zusätzliche Gebühren anfallen."
      },
      {
        question: "Kann ich bei meiner Buchung Zeit und Datums-Präferenzen angeben?",
        answer: "Geben Sie die gewünschten Dienstleistungen und die bevorzugte Häufigkeit an. Überprüfen Sie die Verfügbarkeiten, bevor Sie Datum und Uhrzeit festlegen. Nicht alle Zeitfenster sind immer verfügbar, da das System die aktuellen Kapazitäten in Echtzeit anzeigt."
      },
      {
        question: "Wie setzt sich der Preis zusammen?",
        answer: "Der Preis richtet sich nach der Anzahl der gebuchten Stunden und dem Stundensatz. Mindestbuchung: 2 Stunden. Alle Kosten sind inklusive Mehrwertsteuer, ohne versteckte Gebühren."
      },
      {
        question: "Kann ich eine Betreuungskraft, die bereits bei mir war, nochmals anfragen?",
        answer: "Für regelmäßige Betreuungseinsätze wird immer, wenn möglich, dieselbe Betreuungskraft eingesetzt. Bei Abwesenheit wird ein Ersatz angeboten. Bei monatlichen Buchungen kann der Einsatz derselben Betreuungskraft nicht garantiert werden."
      },
      {
        question: "Kann ich meiner Betreuungskraft zusätzliche Aufgaben zuweisen?",
        answer: "Sie können Ihrer Betreuungskraft während des Buchungsvorgangs oder vor jedem Einsatz unter 'Spezialanweisungen' besondere Anweisungen geben."
      },
      {
        question: "Wie erhält meine Betreuungskraft einen Hausschlüssel?",
        answer: "Sie können direkt mit Ihrer Betreuungskraft eine sichere Übergabemethode vereinbaren oder die von Prime Home Care AG angebotenen Lösungen nutzen."
      },
      {
        question: "Wie bewerte ich meine Betreuungsdienstleistung?",
        answer: "Sie können Ihre Betreuungskraft über die Prime Home Care AG Plattform bewerten. Nach jedem Einsatz haben Sie die Möglichkeit, eine Bewertung abzugeben und Feedback zu hinterlassen."
      },
      {
        question: "Was passiert, nachdem ich gebucht habe?",
        answer: "Sobald die Zahlung autorisiert und bestätigt wurde, erhalten Sie eine Bestätigungs-E-Mail mit der Uhrzeit, zu der Ihre Betreuungskraft eintreffen wird."
      },
      {
        question: "Kann ich Betreuung für mehrere Adressen buchen?",
        answer: "Ja, Sie können Betreuungseinsätze für mehrere Adressen buchen. Geben Sie bei der Buchung die jeweiligen Adressen und spezifischen Anforderungen an."
      },
      {
        question: "Was ist Ihre Schadenversicherungspolice?",
        answer: "Bitte kontaktieren Sie uns für Details zu unserer Schadenversicherungspolice."
      },
      {
        question: "Was tun, wenn ich mit der stundenweisen Betreuung unzufrieden bin?",
        answer: "Sollten Sie mit dem Betreuung Service nicht zufrieden sein, senden Sie uns bitte direkt eine Nachricht über Ihr Kundenprofil. Wir werden die Situation mit Ihrer Betreuungskraft überprüfen und eine geeignete Lösung finden."
      },
      {
        question: "Wie kann ich mich auf der Plattform einloggen?",
        answer: "Nachdem Sie Ihre erste Buchung abgeschlossen haben, wird Ihr Konto automatisch erstellt. Um sich anzumelden, klicken Sie einfach auf die Schaltfläche 'Login'."
      },
      {
        question: "Wie kann ich mein Passwort ändern?",
        answer: "Gehen Sie in Ihr Konto und wählen Sie Ihr Profil aus. Dort können Sie Ihr Passwort ändern."
      },
      {
        question: "Was beinhaltet mein Konto?",
        answer: "Ihr Konto hat 3 Seiten: 'Meine Buchungen', 'Profil' und 'Optionen'. Sie können Buchungen einsehen, persönliche Daten ändern, Adressen auswählen, Zahlungsdetails aktualisieren und Benachrichtigungen verwalten."
      },
      {
        question: "Wie kann ich meine Zahlungsmethode anpassen?",
        answer: "Sie können Ihre Zahlungsmethode auf unserer Online-Plattform in Ihrem Kundenkonto unter 'Zahlungen' anpassen."
      },
      {
        question: "Welche Zahlungsmethoden stehen mir zur Verfügung?",
        answer: "Sie können alle gängigen Kreditkarten als Zahlungsmethode verwenden. Dazu gehören Visa, MasterCard, American Express."
      },
      {
        question: "Wie wird meine Zahlung abgewickelt?",
        answer: "Bei der Prime Home Care AG setzen wir auf ein sicheres Zahlungssystem. Der Betrag wird 24 Stunden nach der Betreuung automatisch von Ihrer Kreditkarte abgebucht."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft zu spät kommt?",
        answer: "Sollte sich Ihre Betreuungskraft verspäten, kontaktieren Sie bitte unseren Kundenservice. Wir werden unser Bestes tun, um die bestmögliche Lösung für Sie zu finden."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft nicht erscheint?",
        answer: "Bitte kontaktieren Sie uns unter 043 200 10 20, damit wir die Betreuung kostenfrei stornieren und Ihnen die bestmögliche Lösung anbieten können."
      },
      {
        question: "Was kann ich tun, wenn meine Betreuungskraft mehr Zeit benötigt?",
        answer: "Sollte eine längere Betreuungsdauer notwendig sein, können Sie dies direkt mit der Betreuungskraft besprechen. Wenn sie länger bleiben kann, können die zusätzlichen Stunden direkt in der App angepasst werden."
      },
      {
        question: "Was kann ich tun, wenn etwas beschädigt wurde?",
        answer: "Wir bieten Ihnen die Schadenversicherung Baloise mit Batmaid an. Sie deckt bis zu 1000 CHF pro Jahr im Falle eines anerkannten Schadens. Bitte reichen Sie ein Bild des beschädigten Gegenstandes und einen Kaufbeleg ein."
      },
      {
        question: "Was kann ich tun, wenn ich das Gefühl habe, bestohlen worden zu sein?",
        answer: "Bitte setzen Sie sich umgehend mit uns in Verbindung. Wir werden die Situation mit Ihrer Betreuungskraft besprechen und Sie zeitnah über die nächsten Schritte informieren."
      },
      {
        question: "Wie erreiche ich die Prime Home Care AG am besten?",
        answer: "Sie können uns eine E-Mail an info@phc.ch senden oder uns unter der Nummer 043 200 10 20 anrufen. Wir nehmen Ihre Anrufe von Montag bis Freitag, zwischen 8:30 und 11:00 und 13:30 und 16:00 Uhr, entgegen."
      },
      {
        question: "Wie wählt die Prime Home Care AG professionelle Betreuungskräfte aus?",
        answer: "Alle unsere Betreuungskräfte durchlaufen Eignungsprüfungen, eine Interviewrunde und müssen ein Strafregisterauszug einreichen."
      },
      {
        question: "Kann ich Betreuung für mehrere Adressen buchen?",
        answer: "Ja, Sie können Betreuungseinsätze für mehrere Adressen buchen. Geben Sie bei der Buchung die jeweiligen Adressen und spezifischen Anforderungen an."
      },
      {
        question: "Kann ich mit meiner Betreuungskraft in die Ferien fahren?",
        answer: "Ja, es ist möglich, dass Sie Ihre Betreuungskraft mit in den Urlaub nehmen. Bitte besprechen Sie Ihre Pläne rechtzeitig mit uns, damit wir alle Details und notwendigen Vorkehrungen gemeinsam klären können."
      },
      {
        question: "Stundenweise Seniorenbetreuung: Was bedeutet das?",
        answer: "Stundenweise Seniorenbetreuung bezieht sich auf eine Art von Pflege- und Unterstützungsdienst, bei dem Betreuungspersonen für eine bestimmte Anzahl von Stunden pro Tag oder Woche bei hilfsbedürftigen Menschen zu Hause im Einsatz sind. Die Betreuung erfolgt nicht rund um die Uhr, sondern für eine im Voraus festgelegte Anzahl von Stunden, die je nach Bedarf variieren kann."
      },
      {
        question: "Was kann ich tun, wenn ich den Schlüssel vergessen habe bereitzulegen?",
        answer: "Bitte benachrichtigen Sie Ihre Betreuungskraft umgehend. In diesem Fall wird der volle Betrag berechnet, um die Betreuungskraft zu entschädigen."
      }
    ]
  },
  {
    category: "MEIN KONTO",
    questions: [
      {
        question: "Wie erstelle ich eine Zusammenfassung meiner Betreuungsdienstleistungen?",
        answer: "Melden Sie sich auf phc.ch an. Unter 'Optionen' -> 'Betreuungszusammenfassung' können Sie PDF-Übersichten erstellen."
      },
      {
        question: "Wie kann ich die Checkliste für die stundenweise Betreuung nutzen?",
        answer: "Die Checkliste finden Sie in Ihrem Profil unter 'Meine Betreuungen' oder 'Optionen'."
      },
      {
        question: "Wie kann ich mich auf der Plattform einloggen?",
        answer: "Nach Ihrer ersten Buchung wird Ihr Konto automatisch erstellt. Klicken Sie einfach auf 'Login'."
      },
      {
        question: "Wie kann ich mein Passwort ändern?",
        answer: "Gehen Sie in Ihr Konto -> Profil -> Passwort ändern."
      },
      {
        question: "Was beinhaltet mein Konto?",
        answer: "Ihr Konto umfasst 'Meine Buchungen', 'Profil' und 'Optionen' mit allen Verwaltungsfunktionen."
      },
      {
        question: "Wo kann ich melden, wenn ich im Urlaub bin?",
        answer: "Unter 'Optionen' -> 'Urlaub' -> 'Urlaub hinzufügen'."
      },
      {
        question: "Wo sehe ich meine Buchungen?",
        answer: "Im Konto unter 'Buchungen' -> 'Bevorstehend' oder 'Vorhergehend'."
      }
    ]
  },
  {
    category: "DRINGENDE FRAGEN",
    questions: [
      {
        question: "Ich benötige dringend Hilfe, kann ich kurzfristig eine Betreuung buchen?",
        answer: "Rufen Sie direkt den Kundendienst unter 043 200 10 20 an."
      },
      {
        question: "Was tun, wenn meine Betreuungskraft zu spät kommt?",
        answer: "Bitte kontaktieren Sie den Kundenservice."
      },
      {
        question: "Was tun, wenn meine Betreuungskraft nicht erscheint?",
        answer: "Bitte rufen Sie uns unter 043 200 10 20 an. Die Betreuung wird kostenfrei storniert."
      },
      {
        question: "Was tun, wenn meine Betreuungskraft mehr Zeit benötigt?",
        answer: "Zusätzliche Stunden können in der App angepasst werden."
      },
      {
        question: "Was tun, wenn etwas beschädigt wurde?",
        answer: "Die Versicherung Baloise mit Batmaid deckt bis 1000 CHF pro Jahr ab."
      },
      {
        question: "Was tun, wenn ich bestohlen worden bin?",
        answer: "Bitte kontaktieren Sie uns umgehend."
      },
      {
        question: "Was tun, wenn ich den Schlüssel vergessen habe?",
        answer: "Bitte benachrichtigen Sie sofort die Betreuungskraft. Der volle Betrag wird berechnet."
      },
      {
        question: "Wie erreiche ich die Prime Home Care AG?",
        answer: "E-Mail an info@phc.ch oder Telefon 043 200 10 20 (Mo-Fr, 8:30–11:00 & 13:30–16:00)."
      }
    ]
  },
  {
    category: "MEINE ZAHLUNGEN",
    questions: [
      {
        question: "Zahlungsabwicklung, wie funktioniert dies genau?",
        answer: "Eine gültige Kreditkarte ist erforderlich. Der Betrag wird 24 Stunden nach der Betreuung automatisch abgebucht."
      },
      {
        question: "Welche Zahlungsmethoden stehen mir zur Verfügung?",
        answer: "Visa, MasterCard, American Express."
      },
      {
        question: "Kann ich meine Zahlungsmethode anpassen?",
        answer: "Ja, in Ihrem Kundenkonto unter 'Zahlungen'."
      },
      {
        question: "Stundenweise Seniorenbetreuung: Was bedeutet das?",
        answer: "Pflege und Unterstützung für eine bestimmte Anzahl Stunden pro Woche oder Tag."
      },
      {
        question: "Flexible Einsatzzeiten",
        answer: "Die Betreuung erfolgt für vorher festgelegte Stunden, je nach Bedarf."
      },
      {
        question: "Individuell angepasste Unterstützung",
        answer: "Aufgaben wie Körperpflege, Haushaltsarbeiten, Arztbegleitung oder Gesellschaft."
      },
      {
        question: "Entlastung für Angehörige",
        answer: "Bietet Angehörigen eine Pause und Sicherheit für ihre Lieben."
      },
      {
        question: "Erhaltung der Selbstständigkeit",
        answer: "Hilft Senioren länger in ihrer vertrauten Umgebung zu bleiben."
      },
      {
        question: "Soziale Interaktion",
        answer: "Betreuungspersonen bieten Gespräche, Spaziergänge oder Spiele gegen Einsamkeit."
      }
    ]
  }
];

export default faqData;
