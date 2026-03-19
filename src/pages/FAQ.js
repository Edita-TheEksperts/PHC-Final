
import { useState } from "react";

// New FAQ data for Kunden and Mitarbeiter (replace with your provided content)
const kundenFAQ = [
  {
    question: "Was sind unsere Stornierungsbedingungen?",
    answer: `Um eine reibungslose Planung sicherzustellen und Änderungen im Einsatz Unserer Betreuungskräfte möglichst gering zu halten, gelten folgende Stornierungsregelungen:\n\nStornierungen, die mindestens 14 Tage vor dem Termin erfolgen, sind kostenlos.\n\nFür Stornierungen zwischen 14 und 7 Tagen vor dem Betreuungstermin fällt eine Gebühr von 50% der Buchung an. Und für Stornierungen weniger als 7 Tage vor der gebuchten Dienstleistung werden mit dem gesamten Betrag belastet.\n\nFalls Sie Ihren Betreuungsplan beenden möchten, finden Sie dazu Informationen im Artikel: „Wie kann ich meinen Betreuungsplan kündigen?“ Wenn Sie Ihren Vertrag auflösen möchten, beachten Sie bitte den Artikel: „Wie kann ich meinen Vertrag kündigen?“`
  },
  {
    question: "Kann ich meine Buchung bearbeiten?",
    answer: `Um eine Änderung an einer bestehenden Buchung vorzunehmen, loggen Sie sich bitte in Ihr Kundenprofil ein.\n\nNavigieren Sie zu „Meine Buchungen“ und wählen Sie anschliessend „Bevorstehende Buchungen“. Klicken Sie dort auf „Buchung ändern“.\n\nBitte beachten Sie, dass Änderungen nur möglich sind, wenn Ihre Buchung mindestens 48 Stunden im Voraus geplant ist. Ausserdem kann eine Anpassung der Uhrzeit im Tagesverlauf dazu führen, dass eine andere Betreuungskraft zugewiesen wird, da unsere Betreuungskräfte stark ausgelastet sind.`
  },
  {
    question: "Wie kann ich eine Buchung vornehmen?",
    answer: `Eine zuverlässige Betreuungskraft zu engagieren ist ganz einfach:\n\nBesuchen Sie unsere Webseite phc.ch und geben Sie Ihre Postleitzahl ein.\nWählen Sie Ihre gewünschten Dienstleistungen und die gewünschte Häufigkeit aus.\nLegen Sie den Zeitpunkt für Ihre Betreuung fest – das System zeigt Ihnen die Verfügbarkeit der Betreuungskräfte in Ihrer Region an.\nGeben Sie Ihre persönlichen Daten ein.\nWählen Sie eine Zahlungsmethode\n\nAnschliessend erhalten Sie eine Bestätigung an die angegebene E-Mail-Adresse.`
  },
  {
    question: "Kann ich meine Buchung stornieren?",
    answer: `Um eine bestehende Buchung zu stornieren, melden Sie sich bitte in Ihrem Profil an. Gehen Sie zu „Meine Buchungen“, wählen Sie „Bevorstehende Settings“ und klicken Sie auf „Buchung stornieren“.\n\nBeachten Sie bitte, dass durch das Aktualisieren Ihrer Verfügbarkeiten mehr als 14 Tage vor der Buchung – etwa bei geplanten Urlauben oder Abwesenheiten – Stornierungsgebühren vermieden werden können. Um uns über eine Abwesenheit frühzeitig zu informieren, gehen Sie in Ihrem Profil zum Abschnitt „Optionen“ und wählen Sie „Abwesenheiten hinzufügen“. `
  },
  {
    question: "Wie kann ich eine Betreuungsdienstleistung umbuchen?",
    answer: `Sie können den Zeitpunkt Ihrer Betreuung verschieben, indem Sie sich in Ihr Prime Home Care AG-Konto einloggen und auf die Registerkarte „Meine Betreuungen“ zugreifen. Unter dem Abschnitt „Bevorstehende“ klicken Sie auf „Mehr“ und wählen im Dropdown-Menü „Betreuung bearbeiten“. Folgen Sie den Anweisungen, um Ihre Änderungen anzufordern.\n\nBitte beachten Sie, dass eine Änderung der Dauer oder des Zeitplans möglicherweise dazu führen kann, dass Ihre Betreuungskraft aufgrund von Verfügbarkeitsengpässen Ihre Anfrage nicht mehr erfüllen kann. Ist Ihre bevorzugte Betreuungskraft verfügbar, wird sie automatisch durch den Algorithmus der Plattform ausgewählt.`
  },
  {
    question: "Kann ich die Adresse meiner gebuchten Betreuung ändern?",
    answer: `Sie können Ihre Adresse online unter «Adressänderung» selbständig anpassen.\n\nBitte beachten Sie, dass wenn Sie Ihre Adresse anpassen, es möglich sein kann, dass Ihnen nicht mehr dieselbe Betreuungskraft zur Verfügung steht.`
  },
  {
    question: "Kann ich kurzfristig eine Betreuungskraft buchen?",
    answer: `Für die Bereitstellung einer neuen Betreuungskraft benötigen wir eine Vorlaufzeit von 14 Tagen. Sollten Sie jedoch kurzfristiger Unterstützung benötigen, benutzen Sie hierfür das Kontaktformular – wir werden unser Bestes tun, um eine individuelle Lösung für Sie zu finden. Bitte beachten Sie, dass in solchen Fällen zusätzliche Gebühren anfallen können.`
  },
  {
    question: "Kann ich bei meiner Buchung Zeit und Datums-Präferenzen angeben?",
    answer: `Die Reservierung einer passenden Zeit für Ihr Betreuungssetting war noch nie so einfach. Geben Sie zunächst die gewünschten Dienstleistungen an und die bevorzugte Häufigkeit. Überprüfen Sie danach die Verfügbarkeiten, bevor Sie Datum und Uhrzeit festlegen. Bitte beachten Sie, dass nicht alle Zeitfenster immer verfügbar sind, da das System die aktuellen Kapazitäten der Betreuungskräfte in Ihrer Region in Echtzeit anzeigt. Die Verfügbarkeit hängt somit auch von der Anzahl an Betreuungsskräften in Ihrer Nähe ab.`
  },
  {
    question: "Wie setzt sich der Preis zusammen?",
    answer: `Der ausgewiesene Preis für ein Betreuungssetting richtet sich nach der Anzahl der gebuchten Stunden und dem entsprechenden Stundensatz. Bitte beachten Sie, dass eine Mindestbuchung von 2 Stunden erforderlich ist.\n\nIhr Preis ist komplett transparent – alle Kosten sind inklusive Mehrwertsteuer, ohne versteckte Gebühren.\n\nBei der Prime Home Care AG zahlen Sie ausschliesslich für die reservierte Zeit.\nZusätzliche gebuchte Leistungen werden entsprechend auf der Rechnung ausgewiesen.`
  },
  {
    question: "Kann ich eine Betreuungskraft welche bereits bei mir war nochmals anfragen?",
    answer: `Für regelmässige Betreuungseinsätze (wöchentlich oder alle zwei Wochen), wird immer, wenn möglich, dieselbe Betreuungskraft eingesetzt. Im Falle der Abwesenheit Ihrer persönlichen Betreuungskraft bieten wir Ihnen einen vorübergehenden Ersatz an.\nBitte beachten Sie, dass wir bei monatlichen Buchungen nicht immer den Einsatz derselben Betreuungskraft garantieren können.`
  },
  {
    question: "Kann ich meiner Betreuungskraft zusätzliche Aufgaben zuweisen?",
    answer: `Sie können Ihrer Betreuungskraft direkt während des Buchungsvorgangs oder vor jedem Betreuungseinsatz unter "Spezialanweisungen" besondere Anweisungen geben. Je klarer Ihre Angaben sind, desto besser wird die Betreuung sein.`
  },
  {
    question: "Wie erhält meine Betreuungskraft einen Hausschlüssel?",
    answer: `Um Ihrer Betreuungskraft einen Hausschlüssel zu übergeben, können Sie direkt mit ihr eine sichere Übergabemethode vereinbaren. Alternativ bietet Prime Home Care AG auch unterstützende Lösungen an, um den Schlüssel sicher und unkompliziert zur Verfügung zu stellen.`
  },
  {
    question: "Wie bewerte ich meine Betreuungsdienstleistung?",
    answer: `Sie können Ihre Betreuungskraft ganz einfach über die Prime Home Care AG Plattform bewerten. Nach jedem Einsatz haben Sie die Möglichkeit, eine Bewertung abzugeben und Feedback zu hinterlassen. Dies hilft uns, die Qualität unserer Dienstleistungen aufrechtzuerhalten und kontinuierlich zu verbessern.`
  },
  {
    question: "Was passiert, nachdem ich gebucht habe?",
    answer: `Sobald die Zahlung autorisiert und bestätigt wurde, erhalten Sie eine Bestätigungs-E-Mail mit der Uhrzeit, zu der Ihre Betreuungskraft eintreffen wird, um den Einsatz entsprechend Ihren Wünschen durchzuführen.`
  },
  {
    question: "Kann ich Betreuung für mehrere Adressen buchen?",
    answer: `Ja, bei Prime Home Care AG können Sie Betreuungseinsätze für mehrere Adressen buchen. Bitte geben Sie bei der Buchung die jeweiligen Adressen und spezifischen Anforderungen für jeden Einsatz an. Unser Team wird die Betreuung entsprechend Ihrer Wünsche organisieren. Für weitere Informationen oder Unterstützung steht`
  },
  {
    question: "Was ist Ihre Schadenversicherungspolice?",
    answer: `Bitte kontaktieren Sie uns für Details zu unserer Schadenversicherungspolice.`
  },
  {
    question: "Was tun, wenn ich mit der stundenweisen Betreuung unzufrieden bin?",
    answer: `Sollten Sie mit dem Betreuung Service nicht zufrieden sein, senden Sie uns bitte direkt eine Nachricht über Ihr Kundenprofil. Damit wir die Situation mit Ihrer Betreuungskraft überprüfen können. Wir werden Sie so schnell wie möglich mit einer geeigneten Lösung kontaktieren.`
  },
  {
    question: "Wie erstelle ich eine Zusammenfassung meiner Betreuungsdienstleistungen?",
    answer: `Falls Sie eine Zusammenfassung Ihrer Betreuungen im PDF-Format benötigen, um den Überblick zu behalten oder sie an Dritte weiterzugeben, befolgen Sie diese Schritte:\n\nBesuchen Sie unsere Website unter phc.ch\nMelden Sie sich bei Ihrem Profil an\nGehen Sie zu „Optionen”\nWählen Sie „Betreuungszusammenfassung” und klicken Sie auf „Zusammenfassung erstellen”\nWählen Sie aus, welche Art von Zusammenfassung Sie benötigen: monatlich, jährlich oder für einen bestimmten Zeitraum\n\nNachdem Sie den gewünschten Zeitraum bestätigt haben, wird die Zusammenfassung als PDF-Datei an die E-Mail-Adresse gesendet, die mit Ihrem Konto verknüpft ist.`
  },
  {
    question: "Wie kann ich die Checkliste für die stundenweise Betreuung nutzen?",
    answer: `Unsere Betreuungs-Checklisten ist für Kundinnen und Kunden gedacht, die regelmässige stundenweise Betreuungsleistungen in Anspruch nehmen. Sie hilft Ihnen, die Betreuung nach Ihren individuellen Wünschen zu gestalten.\n\nAuf Basis Ihrer Angaben erstellen wir eine persönliche Checkliste, die Sie jederzeit in Ihrem Profil unter „Meine Betreuungen“ oder „Optionen“ anpassen können. Änderungen gelten für die gesamte Vertragsdauer.\n\nDiese Checkliste bietet Ihrer Betreuungskraft klare Anweisungen, um sicherzustellen, dass die Betreuung Ihren Vorstellungen entspricht. Sie ermöglicht Ihnen, Prioritäten festzulegen und besondere Wünsche zu kommunizieren, wodurch die Betreuung gezielt auf Ihre Anforderungen abgestimmt wird.`
  },
  {
    question: "Wie kann ich mich auf der Plattform einloggen?",
    answer: `Nachdem Sie Ihre erste Buchung abgeschlossen haben, wird Ihr Konto automatisch erstellt. Um sich anzumelden, klicken Sie einfach auf die Schaltfläche „Login".`
  },
  {
    question: "Wie kann ich mein Passwort ändern?",
    answer: `Gehen Sie in Ihr Konto und wählen Sie Ihr Profil aus. Dort können Sie Ihr Passwort ändern.`
  },
  {
    question: "Was beinhaltet mein Konto?",
    answer: `Ihr Konto hat 3 Seiten: ''Meine Buchungen'', ''Profil'' und ''Optionen''.\n\nDie Seite ''Meine Buchungen'' ist in zwei Bereiche unterteilt, ''vorhergehende'' und ''bevorstehende'' Buchungen. Auf der Seite ''vorhergehende'' Buchungen können Sie frühere Buchungen bewerten, Details einsehen und Rechnungen herunterladen. Im Bereich ''bevorstehende'' Buchungen können Sie alle zukünftigen Buchungen sehen, die geplant sind, und über das Dropdown-Menü ''mehr'' die gewünschten Änderungen vornehmen.\n\nAuf der Seite "Profil" können Sie Ihre persönlichen Daten ändern, eine bestehende Adresse auswählen und Zahlungsdetails aktualisieren. Ausserdem finden Sie hier Ihren persönlichen Empfehlungslink.\n\nIm Bereich "Optionen" können Sie Ihre Benachrichtigungen, das Vorhandensein von Haustieren in einem Ihrer Häuser, die Automatisierung von Vertretungen im Falle der Abwesenheit Ihrer Betreuungskraft und ferner Ihre eigenen Urlaubstage verwalten.`
  },
  {
    question: "Wo kann ich melden wenn ich im Urlaub bin und keine Betreuung benötige?",
    answer: `Besuchen Sie Ihr Konto und wählen Sie "Optionen" aus. Danach, gehen Sie auf die Sparte Urlaub und schliesslich auf "Urlaub hinzufügen".`
  },
  {
    question: "Wo kann habe ich eine Übersicht über meine bevorstehenden und laufenden Buchungen?",
    answer: `Um Ihre Buchungen zu sehen, müssen Sie in Ihrem Konto eingeloggt sein. Bitte gehen dann Sie auf "Buchungen" und wählen Sie dann dementsprechend "Bevorstehend" oder "Vorhergehend".`
  },
  {
    question: "Ich benötige dringend Hilfe, kann ich kurzfristig eine Betreuung buchen?",
    answer: `Wenden Sie sich direkt per Telefon, 043 200 10 20 an den Kundendienst. Wir werden unser Bestes tun, um Ihren Bedarf zu erfüllen. Bitte beachten Sie ausserdem, dass dies nicht immer möglich ist und dass ein Aufpreis anfällt.`
  },
  {
    question: "Was kann ich tun, wenn meine Betreuungskraft zu spät kommt?",
    answer: `Sollte sich Ihre Betreuungskraft verspäten, kontaktieren Sie bitte unseren Kundenservice und wir werden unser Bestes tun, um die bestmögliche Lösung für Sie zu finden.\nWir entschuldigen uns aufrichtig für die Unannehmlichkeiten.`
  },
  {
    question: "Was kann ich tun, wenn meine Betreuungskraft nicht erscheint?",
    answer: `Bitte kontaktieren Sie uns unter 043 200 10 20, damit wir die Betreuung kostenfrei stornieren und Ihnen die bestmögliche Lösung anbieten können.`
  },
  {
    question: "Was kann ich tun, wenn meine Betreuungskraft mehr Zeit benötigt?",
    answer: `Sollte eine längere Betreuungsdauer notwendig sein, können Sie dies direkt mit der anwesenden Betreuungskraft besprechen. Wenn sie länger bleiben kann, hat die Betreuungskraft sowie Sie die Möglichkeit, die zusätzlichen Stunden direkt in der App anzupassen.\n\nDanach werden wir die Dauer und die Verrechnung entsprechend aktualisieren.`
  },
  {
    question: "Was kann ich tun, wenn etwas beschädigt wurde?",
    answer: `Wir bieten Ihnen die Schadenversicherung, Baloise mit Batmaid an. Sie deckt bis zu 1000,- CHF pro Jahr im Falle eines anerkannten Schadens. Wir bitten Sie, ein Bild des beschädigten Gegenstandes zusammen mit einem Kaufbeleg einzureichen. Wenn der Betrag 1000,- CHF übersteigt, werden wir Ihren Fall individuell behandeln und mit der bestmöglichen Lösung auf Sie zurückkommen.\n\nBei weiteren Fragen können Sie sich gerne an unseren Kundenservice wenden.`
  },
  {
    question: "Was kann ich tun, wenn ich das Gefühl habe, bestohlen worden zu sein?",
    answer: `Bitte setzen Sie sich umgehend mit uns in Verbindung. Wir werden die Situation mit Ihrer Betreuungskraft besprechen und Sie zeitnah über die nächsten Schritte informieren.`
  },
  {
    question: "Was kann ich tun, wenn ich den Schlüssel vergessen habe bereitzulegen?",
    answer: `Bitte benachrichtigen Sie Ihre Betreuungskraft umgehend. Beachten Sie bitte, dass in diesem Fall der volle Betrag berechnet wird, um die Betreuungskraft zu entschädigen.`
  },
  {
    question: "Wie erreiche ich die Prime Home Care AG am besten?",
    answer: `Wenn Sie Fragen haben, können Sie uns eine E-Mail an info@phc.ch senden oder uns unter der Nummer 043 200 10 20 anrufen. Wir nehmen Ihre Anrufe von Montag bis Freitag, zwischen 8:30 und 11:00 und 13:30 und 16:00 Uhr, entgegen.`
  },
  {
    question: "Wie wählt die Prime Home Care AG professionelle Betreuungskräfte aus?",
    answer: `Alle unsere Betreuungskräfte durchlaufen Eignungsprüfungen, eine Interviewrunde und müssen ein Strafregisterauszug einreichen.`
  },
  {
    question: "Wie wird meine Zahlung abgewickelt?",
    answer: `Bei der Prime Home Care AG setzen wir auf ein sicheres Zahlungssystem für Ihre Transaktionen. Der Betrag, der online für jede unserer Betreuungsleistungen angezeigt wird, ist der einzige, den Sie zahlen - ohne versteckte Gebühren. Jede Stunde der Betreuung wird Ihnen transparent in Rechnung gestellt. Beachten Sie bitte, dass die angegebenen Stundenpreise inklusive Mehrwertsteuer sind, es sei denn, es ist ausdrücklich anders angegeben.`
  },
  {
    question: "Habe ich die Wahl zwischen einer männlichen und einer weiblichen Betreuungskraft?",
    answer: `Bei Prime Home Care AG stehen Ihre Bedürfnisse und Präferenzen an erster Stelle. Unser Ziel ist es, Ihnen die beste Betreuung zu bieten, unabhängig vom Geschlecht der Betreuungskraft.`
  },
  {
    question: "Können die Betreuungszeiten individuell und bedarfsorientiert festgelegt werden?",
    answer: `Ja, die Betreuungszeiten können online angepasst und ausgewählt werden. Wir benötigen dabei eine Vorlaufzeit von 14 Tagen, um sicherzustellen, dass wir die bestmögliche stundenweise Betreuung für Sie organisieren können. Unsere flexible Planung ermöglicht es Ihnen, die Betreuung nach Ihren individuellen Bedürfnissen zu gestalten und Änderungen rechtzeitig vorzunehmen.`
  },
  {
    question: "Wann ist eine stundenweise Betreuung ratsam und für wen ist sie besonders geeignet?",
    answer: `Eine stundenweise Betreuung ist ratsam, wenn nur zeitweise Unterstützung benötigt wird, zum Beispiel bei der Entlastung von pflegenden Angehörigen oder bei speziellen Aufgaben wie Arztbesuche, Gesellschaft leisten oder Haushaltshilfe. Sie ist besonders geeignet für betreuungsbedürftige Personen, die noch weitgehend selbstständig sind, aber gelegentlich Hilfe und/oder Gesellschaft benötigen.`
  },
  {
    question: "Wann reicht eine stundenweise Betreuung nicht mehr aus?",
    answer: `Eine stundenweise Betreuung reicht nicht mehr aus, wenn eine betreuungsbedürftige Person umfassendere und kontinuierlichere Unterstützung benötigt, wie bei schwerwiegenden gesundheitlichen Einschränkungen, fortgeschrittener Demenz oder wenn rund um die Uhr Betreuung erforderlich ist. In solchen Fällen sind eine intensivere Betreuung und allenfalls auch Pflege notwendig. Wir verfügen über ein grosses Netzwerk von Spitex-Partnern sowie 24 Stunden Betreuungs-Partnern, um auch in solchen Situationen die passende Unterstützung für Sie sicherzustellen.`
  },
  {
    question: "Was beinhaltet meine Betreuung?",
    answer: `Unser Dienstleistungsangebot finden Sie auf unserer Internetseite www.phc.ch/.....`
  },
  {
    question: "Verfügt die PHC über eine Mobil-App?",
    answer: `Ja, wir haben eine Online-App, welche auf IOS und Android verfügbar ist\n\nEbenfalls verfügen wir über eine online Plattform, welche über jedes System zugänglich ist.`
  },
  {
    question: "Ist die Prime Home Care schweizweit tätig?",
    answer: `Prime Home Care AG bietet derzeit ihre Dienstleistungen ausschliesslich im Kanton Zürich an. Wenn Sie jedoch Betreuung in anderen Regionen der Schweiz benötigen, kontaktieren Sie uns bitte. Wir besprechen gerne die Möglichkeiten und finden eine Lösung, die Ihren Wünschen entspricht.`
  },
  {
    question: "Besteht die Option, das Betreuungspersonal selbst auswählen zu können?",
    answer: `Leider nein. Wir legen sehr grossen Wert darauf, die passenden Mitarbeiter für Ihre Bedürfnisse zu finden. Unser Ziel ist es, Ihnen eine Betreuungskraft zur Seite zu stellen, die optimal auf Ihre individuellen Anforderungen und Wünsche abgestimmt ist. Wir achten dabei sorgfältig auf Qualifikationen, Erfahrungen und persönliche Eigenschaften, um eine vertrauensvolle und harmonische Betreuung sicherzustellen.`
  },
  {
    question: "Erhalte ich für die regelmässige Betreuung immer dieselbe Betreuungskraft?",
    answer: `Wir legen grossen Wert auf Kontinuität und Verlässlichkeit in der Betreuung. Daher erhalten Sie für Ihre regelmässigen Betreuungen grundsätzlich immer dieselbe Betreuungskraft. So können stabile und vertrauensvolle Beziehungen aufgebaut werden, die für eine hochwertige Betreuung essenziell sind. Sollte es jedoch einmal notwendig sein, eine Vertretung zu organisieren, sorgen wir dafür, dass diese nahtlos und reibungslos erfolgt.`
  },
  {
    question: "Was passiert, wenn ich mit meiner Betreuungskraft nicht zufrieden bin?",
    answer: `Bei Prime Home Care AG ist Ihre Zufriedenheit unsere oberste Priorität. Wenn Sie mit der Arbeit Ihrer Betreuungskraft nicht zufrieden sind, bitten wir Sie, uns umgehend zu kontaktieren. Wir werden Ihre Bedenken ernst nehmen und gemeinsam eine Lösung finden. Sei es durch ein Feedbackgespräch oder den Wechsel der Betreuungskraft, wir setzen alles daran, dass Sie zufrieden sind und die bestmögliche Betreuung erhalten.`
  },
  {
    question: "Wann wird meine Betreuungskraft jeweils mit der Arbeit beginnen?",
    answer: `Über unser Online-Portal können Sie alle relevanten Informationen und Termine selbst eingeben und verwalten. Vor jedem Termin erhalten Sie eine Bestätigung der genauen Uhrzeit, zu der Ihre Betreuungskraft eintreffen wird. Dadurch stellen wir sicher, dass die Betreuung zu den für Sie passenden Zeiten erfolgt. Sollten Sie Änderungen oder spezielle Wünsche haben, können Sie dies jederzeit über das Portal ändern.`
  },
  {
    question: "Wo sehe ich, ob Sie in meiner Region tätig sind?",
    answer: `Um zu erfahren, ob unsere Dienstleistungen in Ihrer Region verfügbar sind, geben Sie bitte auf der Seite phc.ch Ihre Postleitzahl ein. Wenn Ihre Region abgedeckt ist, werden Sie automatisch zur Buchungsseite weitergeleitet. Falls wir momentan nicht in Ihrer Region tätig sind, hinterlassen Sie uns einfach Ihre E-Mail-Adresse im vorgesehenen Feld, und wir informieren Sie, sobald unsere Dienstleistungen auch in Ihrer Gegend verfügbar sind.`
  },
  {
    question: "Meine Bedürfnisse haben sich geändert und ich muss meinen Vertrag aktualisieren. Wie gehe ich vor?",
    answer: `Wenn sich Ihre Bedürfnisse geändert haben und Sie Ihren Vertrag aktualisieren müssen, gehen Sie wie folgt vor:\n\nMelden Sie sich in Ihrem Konto auf unserem Online-Portal an.\nNavigieren Sie zum Abschnitt „Vertragsverwaltung“.\nPassen Sie dort Ihre Vertragsdetails entsprechend Ihren neuen Bedürfnissen an.\nSpeichern Sie die Änderungen.\n\nSollten Sie Unterstützung benötigen oder Fragen haben, steht Ihnen unser Kundenservice gerne zur Verfügung. Sie können uns während unserer Geschäftszeiten telefonisch oder per E-Mail erreichen.`
  },
  {
    question: "Was tun wenn meine Betreuungskraft den Termin kurzfristig absagt? Muss ich das bezahlen?",
    answer: `Wenn Ihre Betreuungskraft einen Termin absagt, entstehen für Sie keine Kosten. Wir bemühen uns, solche Vorfälle zu vermeiden. Sollte dies dennoch geschehen, kontaktieren wir Sie umgehend, um gemeinsam einen neuen Termin zu vereinbaren oder eine alternative Betreuungskraft zu organisieren. Unser Ziel ist es, sicherzustellen, dass Sie die Unterstützung erhalten, die Sie benötigen, ohne zusätzliche Belastungen für Sie.`
  },
  {
    question: "Was passiert, wenn keine Ersatzbetreuungskraft für den gewünschten Zeitraum verfügbar ist?",
    answer: `Wenn in dem von Ihnen gewählten Zeitfenster oder am gewünschten Tag keine Ersatzbetreuungskraft zur Verfügung steht, setzen wir alles daran, schnellstmöglich eine Lösung zu finden. Sie werden umgehend von uns kontaktiert, um alternative Betreuungstermine oder andere verfügbare Betreuungskräfte zu besprechen. Unser Ziel ist es, sicherzustellen, dass Ihre Betreuungsbedürfnisse stets erfüllt werden.`
  },
  {
    question: "Kann ich mit meiner Betreuungskraft in die Ferien fahren?",
    answer: `Ja, es ist möglich, dass Sie Ihre Betreuungskraft mit in den Urlaub nehmen. Bitte besprechen Sie Ihre Pläne rechtzeitig mit uns, damit wir alle Details und notwendigen Vorkehrungen gemeinsam klären können. So stellen wir sicher, dass Ihre Betreuung auch während Ihrer Reise optimal gewährleistet ist.`
  },
  {
    question: "Zahlungsabwicklung, wie funktioniert dies genau?",
    answer: `Die Zahlungsabwicklung bei Prime Home Care AG erfolgt unkompliziert und sicher. Sie benötigen eine gültige Kreditkarte, um unsere Dienstleistungen in Anspruch zu nehmen. Der Betrag wird 24 Stunden nach der Betreuung automatisch von Ihrer Kreditkarte abgebucht. So stellen wir sicher, dass die Zahlung bequem und rechtzeitig erfolgt.`
  },
  {
    question: "Welche Zahlungsmethoden stehen mir zur Verfügung?",
    answer: `Sie können alle gängigen Kreditkarten als Zahlungsmethode verwenden. Dazu gehören Visa, MasterCard, American Express.`
  },
  {
    question: "Kann ich meine Zahlungsmethode anpassen?",
    answer: `Ja, dies können Sie auf unserer online Plattform in Ihrem Kundenkonto unter Zahlungen unkompliziert und schnell erledigen.`
  },
  {
    question: "Stundenweise Seniorenbetreuung: Was bedeutet das?",
    answer: `Stundenweise Seniorenbetreuung bezieht sich auf eine Art von Pflege- und Unterstützungsdienst, bei dem Betreuungspersonen für eine bestimmte Anzahl von Stunden pro Tag oder Woche bei hilfsbedürftigen Menschen zu Hause im Einsatz sind.\n\nFlexible Einsatzzeiten\n\nDie Betreuung erfolgt nicht rund um die Uhr, sondern für eine im Voraus festgelegte Anzahl von Stunden, die je nach Bedarf variieren kann. Dies kann täglich, mehrmals pro Woche oder auch nur gelegentlich sein.\n\nIndividuell angepasste Unterstützung\n\nDie Betreuungsleistungen werden auf die individuellen Bedürfnisse zugeschnitten. Dazu können Aufgaben wie Unterstützung bei der Körperpflege, Haushaltsarbeiten, Begleitung zu Arztterminen oder einfach Gesellschaft leisten gehören.\n\nEntlastung für Angehörige\n\nStundenweise Betreuung kann Angehörigen eine dringend benötigte Pause bieten und sie unterstützen, wenn sie selbst Verpflichtungen haben. Es ermöglicht Familienmitgliedern, ihre eigenen Aufgaben und Freizeitaktivitäten zu bewältigen, während sie wissen, dass ihr Familienmitglied bestens versorgt ist.\n\nErhaltung der Selbstständigkeit\n\nDiese Art der stundenweisen Betreuung hilft Senioren, so lange wie möglich in ihrer vertrauten Umgebung zu bleiben. Sie erhalten die Unterstützung, die sie benötigen, ohne vollständig auf Fremdpflege angewiesen zu sein.\n\nSoziale Interaktion\n\nStundenweise Betreuungsmitarbeiter bieten nicht nur praktische Hilfe im eigenen Zuhause, sondern auch soziale Interaktionen, die für das emotionale Wohlbefinden sehr wichtig ist. Gemeinsame Aktivitäten wie Gespräche, Spaziergänge oder Spiele können Einsamkeit und Isolation reduzieren. Insgesamt bietet die stundenweise Seniorenbetreuung eine flexible und bedarfsgerechte Lösung für Menschen und ihre Familien, um Unterstützung und Entlastung im Alltag zu erhalten.`
  }
];

const mitarbeiterFAQ = [
  {
    question: "Einleitung zu den Mitarbeiter FAQs",
    answer: `Was für Mitarbeiter suchen wir?\n\nWir suchen engagierte Betreuerinnen und Betreuer, die eine Affinität zur Technik mitbringen, da wir ausschliesslich digital arbeiten. Wenn Sie gerne mit Menschen arbeiten und Freude daran haben, moderne Technologien zu nutzen, um individuelle stundenweise Betreuung über unsere fortschrittliche Online-Plattform zu ermöglichen, dann sind Sie bei uns genau richtig. Unterstützen Sie uns dabei, durch den Einsatz von innovativen Tools die bestmögliche stundenweise Betreuung zu gewährleisten und gleichzeitig Ihre technischen Fähigkeiten weiterzuentwickeln. Werden Sie Teil unseres dynamischen Teams und gestalten Sie die Zukunft der stundenweisen Betreuung aktiv mit!`
  },
  {
    question: "Betreuerinnen und Betreuer - Was wir bieten",
    answer: `Wir bieten Ihnen eine abwechslungsreiche Teilzeitbeschäftigung auf Stundenlohnbasis. Sie profitieren von viel Flexibilität, einem innovativen Unternehmen mit modernen Strukturen, fortschrittlichen Anstellungsbedingungen, Unterstützung durch unser Backoffice und einem angenehmen Arbeitsklima. Ihr Arbeitsort befindet sich auf Wunsch immer in der Nähe Ihres Wohnortes.`
  },
  {
    question: "Betreuerinnen und Betreuer - Ihr Aufgabenbereich",
    answer: `Sie betreuen fest zugewiesene Kunden in Ihrer Region. Je nach Bedarf kann Ihr Arbeitsvolumen zwischen ca. 20 % und 100 % liegen. Die Betreuung der Kunden erfolgt in einem regelmässigen Rhythmus.`
  },
  {
    question: "Betreuerinnen und Betreuer - Was bringen Sie mit",
    answer: `Als engagierte Persönlichkeit arbeiten Sie selbstständig und effizient und setzen die Firmenphilosophie konsequent um. Ihre Fachkenntnisse ermöglichen es Ihnen, auf die Bedürfnisse der Kunden einzugehen. Gute Deutschkenntnisse sind zwingend erforderlich. Ein eigenes Fahrzeug ist von Vorteil, aber keine Bedingung.`
  },
  {
    question: "Springer - Was wir bieten",
    answer: `Wir bieten Ihnen eine abwechslungsreiche Teilzeitbeschäftigung auf Stundenlohnbasis. Sie geniessen viele Freiheiten in einem innovativen Unternehmen mit modernen Strukturen, fortschrittlichen Anstellungsbedingungen und Unterstützung durch unser Back Office. Zudem profitieren Sie von einem angenehmen Arbeitsklima. Das geographische Einsatzgebiet können Sie selbst bestimmen, und wir richten uns nach Ihren bevorzugten Einsatzzeiten.`
  },
  {
    question: "Springer - Ihr Aufgabenbereich",
    answer: `Sie vertreten unsere stundenweisen Betreuerinnen und Betreuer bei Ferien und anderen Abwesenheiten und übernehmen gelegentliche Einsätze bei unseren privaten Kunden. Ihr Arbeitsvolumen kann je nach Bedarf variieren, sodass Ihre individuellen Verfügbarkeiten berücksichtigt werden können.`
  },
  {
    question: "Springer - Was bringen Sie mit",
    answer: `Als engagierte Persönlichkeit arbeiten Sie selbstständig und effizient und setzen die Firmenphilosophie konsequent um. Ihre Fachkenntnisse ermöglichen es Ihnen, auf die Bedürfnisse der Kunden einzugehen. Sie sind zwischen 18 und 70 Jahre alt und beherrschen die deutsche Sprache sehr gut. Sie schätzen flexible Arbeitszeiten und sind nicht an feste Einsatzpläne gebunden. Ein eigenes Fahrzeug ist für diese Tätigkeit unerlässlich.`
  },
  {
    question: "Wie erfahre ich, wann und wo ich im Einsatz bin?",
    answer: `Dein persönlicher Einsatzplan ist jederzeit über die Prime Home Care Mitarbeiter-Plattform oder App einsehbar. Dort findest du:\n\n- Datum und Uhrzeit deines Einsatzes\n- Name und Adresse des Kunden\n- Besondere Hinweise oder Wünsche des Kunden (Checkliste)\n\nDu wirst zusätzlich per Push-Mitteilung oder E-Mail benachrichtigt, wenn neue Einsätze geplant oder bestehende Einsätze geändert werden. Bitte überprüfe deinen Kalender regelmässig, um über deine Einsätze informiert zu bleiben.`
  },
  {
    question: "Was soll ich tun, wenn ich mich verspäte oder verhindert bin?",
    answer: `Falls du dich verspätest:\n\n- Informiere sofort den Kunden und die Prime Home Care AG.\n- Gib eine realistische Einschätzung deiner Verspätung an, damit wir entsprechend reagieren können.\n\nFalls du den Einsatz nicht antreten kannst (z. B. wegen Krankheit):\n\n- Melde dich so früh wie möglich telefonisch bei der PHC AG\n- Reiche im Krankheitsfall ein Arztzeugnis ein, wenn du länger als 1 Tag ausfällst.\n- Gib – wenn möglich – an, ob du für eine Ersatzplanung zur Verfügung stehst. (An einem anderen Tag)`
  },
  {
    question: "Wie kann ich meine Verfügbarkeit anpassen?",
    answer: `Deine Verfügbarkeiten kannst du direkt in der Plattform im Bereich „Profil“ oder „Optionen“ ändern. Gib möglichst langfristig an:\n\n- An welchen Tagen und zu welchen Zeiten du grundsätzlich verfügbar bist\n- Urlaube oder geplante Abwesenheiten (mindestens 14 Tage im Voraus)\n\nDas hilft dem Planungsteam, dich optimal einzuplanen und unnötige Lücken oder kurzfristige Umbuchungen zu vermeiden.`
  },
  {
    question: "Was mache ich, wenn ich kurzfristig für einen Einsatz angefragt werde?",
    answer: `Wenn du als Vertretung gebraucht wirst, wirst du per Anruf oder Mitteilung kontaktiert. Du kannst dann spontan entscheiden, ob du den Einsatz übernimmst. In der Regel geschieht das nur bei:\n\n- Krankheitsausfällen anderer Betreuungskräfte\n- Notfällen bei Kunden\n\nWenn du häufiger kurzfristig einspringen möchtest, kannst du das im System hinterlegen – so wirst du bevorzugt bei spontanen Einsätzen als Springer berücksichtigt.`
  },
  {
    question: "Bekomme ich automatisch Arbeit, sobald ich mich auf der PHC-Plattform registriere?",
    answer: `Nein, mit der Registrierung auf der PHC-Plattform entsteht noch kein Anspruch auf Arbeit. Erst wenn ein sogenannter "Match" zwischen dir und einem Kunden zustande kommt – also wenn ein Kunde dich für einen konkreten Einsatz auswählt – entsteht ein offizielles Arbeitsverhältnis.\n\nDu bist zu keiner Zeit verpflichtet, angebotene Arbeit anzunehmen. Du kannst jeden Einsatzvorschlag frei annehmen oder ablehnen, ganz wie es für dich passt. Die Plattform soll dir Flexibilität bieten und ist freiwillig – du entscheidest selbst, wann und wie oft du arbeiten möchtest.`
  },
  {
    question: "Was sind meine Aufgaben während eines Betreuungseinsatzes?",
    answer: `Deine Aufgaben richten sich nach der Buchung des Kunden und den individuellen Wünschen, die im System oder in der Checkliste des Kunden hinterlegt sind. Mögliche Aufgaben können sein:\n\n- Unterstützung im Haushalt (Putzen, Waschen, Einkaufen)\n- Gesellschaft leisten (Spaziergänge, Gespräche, Spiele)\n- Begleitung zu Terminen (z. B. Arztbesuch)\n- Leichte Hilfe im Alltag (z. B. beim Anziehen oder Zubereiten von Mahlzeiten)\n\nWichtig ist, dass du nur die Aufgaben übernimmst, die in deinem Kompetenzbereich liegen. Medizinische Tätigkeiten sind nicht erlaubt, ausser du hast eine entsprechende Qualifikation und es ist vorher abgesprochen.`
  },
  {
    question: "Was tue ich, wenn der Kunde mir zusätzliche Aufgaben geben will?",
    answer: `Wenn dir ein Kunde spontan zusätzliche Aufgaben nennt, gilt Folgendes:\n\n- Höre dir den Wunsch höflich an\n- Prüfe, ob die Aufgabe im Rahmen deines Auftrags und deiner Ausbildung liegt\n- Notiere dies in Deiner Prime Home Care App\n\nViele Kunden schätzen Flexibilität, aber du musst nicht jede Aufgabe übernehmen, insbesondere wenn sie deine Kompetenzen überschreitet oder nicht im Auftrag enthalten ist. Es ist immer besser, transparent zu kommunizieren und professionelle Grenzen zu wahren.`
  },
  {
    question: "Was passiert, wenn ich länger beim Kunden bleiben soll?",
    answer: `Wenn du während des Einsatzes feststellst, dass mehr Zeit nötig ist (z. B. weil der Kunde Hilfe bei etwas Dringendem braucht), dann:\n\n- Kläre mit dem Kunden, ob er eine Verlängerung möchte\n- Trage die zusätzliche Zeit in der App korrekt ein\n\nDie zusätzliche Zeit wird dir entsprechend vergütet, solange sie mit dem Kunden abgestimmt wurde.`
  },
  {
    question: "Darf ich mit einem Kunden in die Ferien fahren?",
    answer: `Ja, in Absprache mit uns ist das möglich. Falls ein Kunde dich bittet, ihn in den Urlaub zu begleiten:\n\n- Informiere bitte rechtzeitig das PHC-Team\n- Wir klären die Details (Dauer, Unterkunft, Aufgaben, Vergütung) gemeinsam mit dem Kunden\n- Du darfst nur mitreisen, wenn du damit einverstanden bist und die Rahmenbedingungen klar geregelt sind\n\nSolche Einsätze erfordern eine besondere Vorbereitung – du wirst dabei aber vom Team unterstützt.`
  },
  {
    question: "Wie verhalte ich mich professionell beim Kunden?",
    answer: `- Sei pünktlich, freundlich und respektvoll\n- Trage angemessene Kleidung (gepflegt, neutral)\n- Vermeide Diskussionen über Religion, Politik oder private Probleme\n- Achte auf Diskretion – was du beim Kunden erfährst, bleibt vertraulich, auch keine Fotos oder Videos\n- Dokumentiere Besonderheiten und Rückmeldungen sauber\n\nWenn du unsicher bist oder eine heikle Situation erlebst, zögere nicht, das Team zu kontaktieren. Wir sind für dich da.`
  },
  {
    question: "Wie läuft die Schlüsselübergabe sicher ab?",
    answer: `In vielen Fällen erhältst du vom Kunden einen Hausschlüssel, um Einsätze auch bei dessen Abwesenheit durchführen zu können. Für eine sichere Schlüsselübergabe gilt:\n\n- Die Übergabe erfolgt persönlich zwischen dir und dem Kunden oder über eine vorher vereinbarte Methode (z. B. Schlüsselbox).\n- Wenn der Schlüssel übergeben wurde, vermerke dies bitte in der App.\n- Bewahre den Schlüssel während der Einsatzzeit sicher auf und verwende ihn ausschliesslich für vereinbarte Einsätze. Bei Verlust eines Schlüssels haftest Du vollumfänglich für die entstandenen Kosten.\n- Bei Beendigung des Betreuungsverhältnisses musst du den Schlüssel zeitnah und persönlich zurückgeben oder nach Absprache an uns senden.`
  },
  {
    question: "Was tun, wenn ich vor verschlossener Tür stehe?",
    answer: `Wenn du beim Kunden ankommst und nicht ins Haus kommst (z. B. weil der Schlüssel fehlt oder der Kunde nicht öffnet):\n\n- Versuche, den Kunden telefonisch zu erreichen.\n- Warte max. 15 Minuten vor Ort.\n- Informiere das PHC-Team, wenn du niemanden erreichst.\n\nWichtig: Wenn du nicht betreten kannst, obwohl du eingeplant warst, wird der Einsatz (abhängig vom Fall) trotzdem als Arbeitszeit gewertet.`
  },
  {
    question: "Was tue ich bei einem medizinischen Notfall beim Kunden?",
    answer: `Wenn sich während deines Einsatzes ein gesundheitlicher Notfall beim Kunden ereignet (z. B. Sturz, Atemnot, Bewusstlosigkeit):\n\n- Bewahre Ruhe.\n- Rufe sofort den Notruf (144), wenn nötig.\n- Leiste Erste Hilfe\n- Informiere danach das PHC-Team und – wenn möglich – auch Angehörige (Kontakte findest du in der App).\n\nDeine Sicherheit hat oberste Priorität – bring dich nicht selbst in Gefahr.`
  },
  {
    question: "Was mache ich, wenn etwas beschädigt wurde?",
    answer: `Wenn du versehentlich etwas beschädigst:\n\n- Melde den Schaden sofort an das PHC-Team\n- Mach (wenn möglich) ein Foto des beschädigten Gegenstandes\n- Notiere dir alle wichtigen Infos (Zeitpunkt, Ursache, Zeugen etc.)\n\nKleine Schäden sind über die Betriebshaftpflicht abgesichert. Bei grösseren Fällen wird gemeinsam mit der Versicherung eine Lösung gefunden.`
  },
  {
    question: "Was tun, wenn ich einen Diebstahlsverdacht mitbekomme?",
    answer: `Ein Verdacht auf Diebstahl ist eine sehr ernste Angelegenheit. Wenn du etwas beobachtest oder ein Kunde dir einen Verdacht meldet:\n\n- Verhalte dich zurückhaltend und neutral\n- Melde den Vorfall umgehend an das PHC-Team\n- Dokumentiere deine Beobachtungen schriftlich, aber ohne Wertung\n\nDu wirst bei Bedarf durch das Team unterstützt – auch in der Kommunikation mit Kunden oder Behörden.`
  },
  {
    question: "Wie logge ich mich in die Mitarbeiter-Plattform oder App ein?",
    answer: `Nach deiner Anstellung bei Prime Home Care AG erhältst du per E-Mail deine Zugangsdaten zur internen Plattform (oder App für iOS/Android). So funktioniert der Login:\n\n- Öffne die Plattform oder lade die App herunter.\n- Gib deine E-Mail-Adresse und dein Passwort ein.\n- Nach dem ersten Login wirst du aufgefordert, ein persönliches Passwort zu wählen.\n- Solltest du keine Zugangsdaten erhalten haben, wende dich an den Innendienst.`
  },
  {
    question: "Was mache ich, wenn mein Login nicht funktioniert?",
    answer: `Überprüfe deine E-Mail-Adresse und das Passwort.\n\n- Nutze die Funktion „Passwort vergessen“, um ein neues Passwort anzufordern.\n- Falls du weiterhin nicht reinkommst, kontaktiere den Support – wir helfen dir schnell weiter.`
  },
  {
    question: "Wo finde ich meine Einsätze und Kundendetails?",
    answer: `In der Plattform/App findest du unter „Meine Einsätze“ alle geplanten Betreuungstermine. Dort stehen:\n\n- Datum und Uhrzeit\n- Name, Adresse und Telefonnummer des Kunden\n- Aufgaben und Hinweise (z. B. Haustiere, besondere Wünsche)\n- Zusatzfunktionen wie „Navigation starten“ oder „Bericht schreiben“\n\nDiese Infos werden laufend aktualisiert – bitte kontrolliere deine Einsätze regelmässig.`
  },
  {
    question: "Wie kann ich meine Einsatzberichte oder Notizen erfassen?",
    answer: `Nach jedem Einsatz wirst du aufgefordert, einen kurzen Bericht einzugeben. Darin kannst du festhalten:\n\n- Was du gemacht hast\n- Ob alles gut verlaufen ist\n- Ob es Besonderheiten oder Rückmeldungen gab\n\nDiese Infos helfen der internen Qualitätssicherung und dem Kundenservice. Du kannst sie direkt in der App erfassen – das dauert nur 1–2 Minuten.`
  },
  {
    question: "Wie ändere ich meine persönlichen Daten oder Verfügbarkeiten?",
    answer: `Gehe auf dein Profil in der Plattform.\nDort kannst du deine Telefonnummer, Adresse oder Verfügbarkeiten aktualisieren.\nAuch Ferien oder geplante Abwesenheiten kannst du dort eintragen.\n\nJe aktueller deine Angaben, desto besser funktioniert die Einsatzplanung.`
  },
  {
    question: "Was tun, wenn ich technische Probleme mit der App habe?",
    answer: `Wenn die App abstürzt, sich nicht öffnen lässt oder du Fehlermeldungen bekommst:\n\n- Schliess die App komplett und öffne sie neu.\n- Überprüfe, ob du die neueste Version installiert hast.\n- Starte dein Gerät neu.\n- Wenn das Problem weiterhin besteht, schreib dem Supportteam oder ruf an – wir kümmern uns schnellstmöglich darum.`
  },
  {
    question: "Wie wird meine Arbeitszeit erfasst?",
    answer: `Deine Arbeitszeit wird über die Plattform oder App automatisch erfasst, wenn du:\n\n- Deinen Einsatz bestätigst\n- Die tatsächliche Ankunfts- und Endzeit eingibst\n- Deinen Einsatzbericht ausfüllst\n\nBitte achte darauf, die Zeiten korrekt und direkt im Anschluss an Deinen Einsatz einzutragen. Bei Abweichungen von der ursprünglich geplanten Zeit (z. B. Verlängerung durch den Kunden) muss die Änderung ebenfalls vermerkt werden – sonst kann sie nicht abgerechnet werden.`
  },
  {
    question: "Was zählt zur bezahlten Arbeitszeit?",
    answer: `Zur bezahlten Arbeitszeit zählen:\n\n- Die tatsächlich beim Kunden geleisteten Betreuungsstunden\n- Ggf. Reisezeit, wenn sie im Arbeitsvertrag oder bei Sonderfällen ausdrücklich vereinbart wurde\n\nNicht bezahlt werden:\n\n- Pausen ausserhalb der Einsatzzeit\n- Fahrten zu Einsätzen (ausser bei Sonderregelung)\n- Wartezeiten ohne Kundenkontakt (z. B. zu frühes Eintreffen)\n\nBei Unsicherheiten wende dich an die Prime Home Care AG`
  },
  {
    question: "Wann erhalte ich meinen Lohn?",
    answer: `Dein Lohn wird monatlich ausbezahlt – in der Regel bis am 5. jedes Nachfolgemonats. Grundlage dafür ist:\n\n- Deine geleistete Arbeitszeit laut System\n- Alle korrekt erfassten Einsätze und Berichte\n\nFalls du Unstimmigkeiten feststellst, melde dich bitte spätestens bis zum 3. des Folgemonats, damit wir alles rechtzeitig klären können.`
  },
  {
    question: "Was mache ich, wenn ich eine Lohnabrechnung nicht verstehe?",
    answer: `Wenn du Fragen hast zur Abrechnung (z. B. zu Stunden, Abzügen, Zulagen oder Ferienguthaben):\n\n- Wende dich an die Personalabteilung\n- Halte deine Einsatzdaten bereit, damit wir deine Abrechnung prüfen können\n\nTransparenz ist uns wichtig – wir erklären dir jeden Punkt auf der Lohnabrechnung, wenn nötig.`
  },
  {
    question: "Wie sind Ferien, Krankheit und freie Tage geregelt?",
    answer: `Ferien: Du hast Anspruch auf Ferien gemäss deinem Arbeitsvertrag. Bitte trage geplante Ferien frühzeitig in der Plattform ein – idealerweise 4 Wochen im Voraus.\n\nKrankheit: Melde dich sofort bei Krankheit telefonisch bei der PHC AG. Ab dem 1. Tag wird ein Arztzeugnis benötigt.\n\nFreie Tage: Wenn du einen Tag nicht arbeiten kannst (z. B. wegen privater Termine), trage dies mindestens einen Monat davor im System als Abwesenheit ein – so wird deine Planung angepasst.`
  },
  {
    question: "Bin ich versichert, wenn mir beim Einsatz etwas passiert?",
    answer: `Ja, du bist bei Prime Home Care AG gesetzlich versichert. Das beinhaltet:\n\n- Unfallversicherung wie Berufsunfall & Nichtberufsunfall (unter 8 Stunden Arbeitszeit pro Woche ist privat mit deiner Krankenasse zu organisieren)\n- Haftpflicht (bei Schäden während eines Einsatzes)\n- Lohnfortzahlung im Krankheitsfall (gemäss Vertrag)\n\nBitte melde Unfälle oder Verletzungen sofort, auch wenn sie harmlos erscheinen – zur Sicherheit und zur Dokumentation.`
  },
  {
    question: "Wann werde ich als Vertretung eingeplant?",
    answer: `Du wirst dann als Vertretung angefragt, wenn:\n\n- Eine andere Betreuungskraft krank, im Urlaub oder kurzfristig verhindert ist\n- Ein kurzfristiger Einsatz zustande kommt (z. B. bei einem neuen Kunden oder Notfall)\n\nDie Planung erfolgt durch die PHC – du bekommst in diesem Fall eine direkte Anfrage über die App.\n\nWichtig: Wenn du grundsätzlich bereit bist, auch kurzfristige Einsätze zu übernehmen, kannst du dies im System hinterlegen – das hilft bei der Planung und erhöht deine Einsatzmöglichkeiten.`
  },
  {
    question: "Was passiert, wenn ich einen Einsatz absagen muss?",
    answer: `Falls du einen geplanten Einsatz nicht wahrnehmen kannst (z. B. wegen Krankheit, familiären Gründen oder anderen Verpflichtungen):\n\n- Informiere uns so früh wie möglich.\n- Wenn möglich, schlage Ersatztermine oder alternative Verfügbarkeiten vor.\n- Verzichte bitte auf direkte Absprachen mit dem Kunden – dies wird von uns übernommen.\n\nBei kurzfristigen Absagen ist es wichtig, dass das Team schnell reagieren kann – je früher du Bescheid gibst, desto besser.`
  },
  {
    question: "Wie kommuniziere ich mit der PHC AG?",
    answer: `Du erreichst das Team von Prime Home Care AG:\n\n- Per Telefon: 043 200 10 20 (Mo–Fr: 8:30–11:00 & 13:30–16:00 Uhr)\n- Per E-Mail: info@phc.ch\n- Bei Notfällen oder technischen Problemen auch über die App-Nachrichtenfunktion\n\nBitte gib bei jeder Kontaktaufnahme deinen Namen und – wenn möglich – die Kundennummer oder Einsatzzeit mit an, damit wir dich schnell zuordnen können.`
  },
  {
    question: "Darf ich mit anderen Betreuungskräften direkt Kontakt aufnehmen?",
    answer: `Grundsätzlich läuft die Kommunikation über das PHC-Team. Bei grösseren Teams oder bei geplanten Übergaben kann es sein, dass du mit anderen Mitarbeitenden zusammenarbeitest (z. B. bei Ferienvertretung).\n\nIn diesem Fall ist ein klarer und respektvoller Austausch wichtig, aber alle Planungsänderungen oder Absprachen müssen über das Büro erfolgen.`
  },
  {
    question: "Was mache ich, wenn es mit einem Kunden schwierig wird?",
    answer: `Manchmal kann es zu herausfordernden Situationen kommen – etwa wenn:\n\n- Der Kunde unfreundlich ist oder sich unangebracht verhält\n- Erwartungen nicht klar sind oder sich ändern\n- Die Kommunikation schwierig ist\n\nIn solchen Fällen:\n\n- Bleib ruhig und professionell\n- Dokumentiere den Vorfall in der App (kurz, sachlich)\n- Kontaktiere das PHC-Team, bevor du etwas selbst entscheidest\n\nWir besprechen mit dir gemeinsam, wie weiter vorgegangen wird – du stehst nie allein da.`
  },
  {
    question: "Wie wird sichergestellt, dass ich als Betreuungskraft für den Einsatz geeignet bin?",
    answer: `Bei Prime Home Care AG legen wir grossen Wert auf Qualität und Vertrauen. Deshalb durchläufst du vor deinem ersten Einsatz:\n\n- Ein persönliches online Gespräch oder Interview\n- Eine Eignungsprüfung (z. B. Erfahrung, Soft Skills)\n- Einen Hintergrundcheck (Strafregisterauszug)\n- Eine Einführung in unsere Standards und Erwartungen\n\nNur wer diese Schritte erfolgreich durchläuft, wird in den aktiven Mitarbeiterpool aufgenommen. So stellen wir sicher, dass du gut vorbereitet bist und dich bei deinen Einsätzen wohlfühlst.`
  },
  {
    question: "Welche Sicherheitsvorkehrungen gelten für mich beim Kunden?",
    answer: `Deine Sicherheit hat oberste Priorität. Daher gilt:\n\n- Du darfst Einsätze ablehnen, wenn du dich unsicher fühlst\n- Du musst keine Aufgaben übernehmen, die gefährlich sind oder über deine Ausbildung hinausgehen\n- Wenn du dich unangemessen behandelt fühlst, wende dich sofort an das PHC-Team\n\nBei Einsätzen mit besonderen Risiken (z. B. aggressive Tiere, schwer erreichbare Orte) wirst du im Voraus informiert und kannst ablehnen.`
  },
  {
    question: "Wie gehen wir mit Beschwerden oder Kritik um – von Kunden oder von dir?",
    answer: `Kundenbeschwerden:\n\n- Werden vertraulich aufgenommen und gemeinsam mit dir besprochen\n- Du wirst immer zuerst angehört, bevor Massnahmen getroffen werden\n- Ziel ist es, Missverständnisse zu klären und konstruktive Lösungen zu finden\n\nDein Feedback:\n\n- Ist ausdrücklich erwünscht!\n- Du kannst jederzeit Anliegen, Verbesserungsvorschläge oder Kritik anbringen – per Mail, Telefon oder anonym\n- Wir wollen ein Arbeitsumfeld schaffen, in dem du dich wertgeschätzt fühlst`
  },
  {
    question: "Welche Qualitätsstandards soll ich bei der Arbeit einhalten?",
    answer: `Unsere Kundinnen und Kunden vertrauen auf deine Kompetenz und dein Auftreten. Deshalb ist es wichtig:\n\n- Freundlich, aufmerksam und respektvoll zu sein\n- Aufgaben sorgfältig und nach Vorgabe zu erledigen\n- Kundenwünsche zu respektieren, aber auch Grenzen klar zu kommunizieren\n- Alle Informationen vertraulich zu behandeln\n- Auf Sauberkeit, Pünktlichkeit und Zuverlässigkeit zu achten\n\nDein Auftreten repräsentiert Prime Home Care AG – du bist unser Gesicht beim Kunden.`
  },
  {
    question: "Was ist, wenn ich Fragen zu meiner Rolle oder Unsicherheiten habe?",
    answer: `Wir lassen dich nicht allein. Wenn du Fragen hast – sei es zu Einsätzen, Verhalten, Technik oder persönlichen Anliegen – steht dir das PHC-Team zur Seite. Es ist besser, einmal zu viel zu fragen als einmal zu wenig. Gemeinsam finden wir immer eine Lösung.`
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to normalize strings for better search (case/diacritics-insensitive)
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .trim();

  const filterFAQ = (faqList) => {
    const term = normalize(searchTerm);
    if (!term) return faqList;
    return faqList.filter(
      (q) =>
        normalize(q.question).includes(term) ||
        normalize(q.answer).includes(term)
    );
  };

  const filteredKunden = filterFAQ(kundenFAQ);
  const filteredMitarbeiter = filterFAQ(mitarbeiterFAQ);
  const hasResults = filteredKunden.length > 0 || filteredMitarbeiter.length > 0;

  // Toggle logic for unique openIndex per section
  const toggleFAQ = (section, idx) => {
    const key = `${section}-${idx}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <div className="p-4 lg:p-2 max-w-[1430px] bg-[#FAFCFF] mx-auto">
      {/* Header Section */}
      <div className="bg-[#B99B5F] text-center rounded-[20px] py-[90px] max-w-[1390px] mx-auto">
        <h2 className="text-[#FAFCFF] text-[55px] font-semibold leading-[66px]">
          Häufige Fragen
        </h2>
        <p className="text-white text-[20px] mt-2">
          Finden Sie Antworten auf die am häufigsten gestellten Fragen zu unseren Dienstleistungen, Richtlinien und mehr.
        </p>
      </div>

      {/* 🔍 Search Bar */}
      <div className="max-w-[1110px] mx-auto mt-12 relative">
        <input
          type="text"
          placeholder="Suchen Sie nach Stichworten (z. B. Preis, Konto, Stornierung)..."
          className="w-full rounded-[20px] p-4 pl-12 text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FAQ Content - Side by Side, Improved UI */}
      <div className="max-w-[1430px] mx-auto mt-20 lg:mt-12 lg:px-6 mb-[80px] flex flex-col lg:flex-row gap-10 lg:gap-8">
        {!hasResults && (
          <p className="text-center text-gray-500 text-lg w-full">
            Keine Ergebnisse gefunden für „{searchTerm}“.
          </p>
        )}
        {/* Kunden Section */}
        {filteredKunden.length > 0 && (
          <div className="flex-1 min-w-0 bg-white rounded-[24px] shadow-lg border-2 border-[#B99B5F]/30 p-6 lg:p-8">
            <h3 className="text-[#B99B5F] text-[30px] lg:text-[32px] font-bold mb-6 tracking-tight text-center lg:text-left drop-shadow-sm" style={{ fontFamily: 'Metropolis, sans-serif', letterSpacing: '0.04em' }}>
              Für Kunden
            </h3>
            <div className="space-y-5 lg:space-y-7">
              {filteredKunden.map((item, idx) => {
                const isOpen = openIndex === `kunden-${idx}`;
                // Ref for scrolling into view
                const ref = typeof window !== 'undefined' && typeof document !== 'undefined' && window.innerWidth < 1024 ? (el => {
                  if (el && isOpen) {
                    setTimeout(() => {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }) : undefined;
                return (
                  <div key={idx} className={`rounded-[18px] shadow-md border border-[#B99B5F]/20 bg-white transition-all duration-200 ${isOpen ? 'ring-2 ring-[#B99B5F]/60' : ''}` }>
                    <div
                      ref={ref}
                      onClick={() => toggleFAQ("kunden", idx)}
                      className="p-4 lg:p-5 flex justify-between items-center cursor-pointer hover:bg-[#F3EAD9] rounded-[18px] select-none"
                    >
                      <h4 className="text-[#04436F] text-[15px] lg:text-[20px] font-semibold">
                        {item.question}
                      </h4>
                      <span className={`transition-transform text-[#B99B5F] text-xl font-bold ${isOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    {isOpen && (
                      <div className="p-4 pt-2 text-[#04436F] text-[15px] lg:text-[18px] bg-white rounded-b-[12px] border-t border-[#B99B5F]/20">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Mitarbeiter Section */}
        {filteredMitarbeiter.length > 0 && (
          <div className="flex-1 min-w-0 bg-white rounded-[24px] shadow-lg border-2 border-[#04436F]/20 p-6 lg:p-8">
            <h3 className="text-[#04436F] text-[30px] lg:text-[32px] font-bold mb-6 tracking-tight text-center lg:text-left drop-shadow-sm" style={{ fontFamily: 'Metropolis, sans-serif', letterSpacing: '0.04em' }}>
              Für Mitarbeiter
            </h3>
            <div className="space-y-5 lg:space-y-7">
              {filteredMitarbeiter.map((item, idx) => {
                const isOpen = openIndex === `mitarbeiter-${idx}`;
                // Ref for scrolling into view
                const ref = typeof window !== 'undefined' && typeof document !== 'undefined' && window.innerWidth < 1024 ? (el => {
                  if (el && isOpen) {
                    setTimeout(() => {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }
                }) : undefined;
                return (
                  <div key={idx} className={`rounded-[18px] shadow-md border border-[#04436F]/20 bg-white transition-all duration-200 ${isOpen ? 'ring-2 ring-[#04436F]/40' : ''}` }>
                    <div
                      ref={ref}
                      onClick={() => toggleFAQ("mitarbeiter", idx)}
                      className="p-4 lg:p-5 flex justify-between items-center cursor-pointer hover:bg-[#E1E8F0] rounded-[18px] select-none"
                    >
                      <h4 className="text-[#04436F] text-[15px] lg:text-[20px] font-semibold">
                        {item.question}
                      </h4>
                      <span className={`transition-transform text-[#04436F] text-xl font-bold ${isOpen ? "rotate-180" : ""}`}>▼</span>
                    </div>
                    {isOpen && (
                      <div className="p-4 pt-2 text-[#04436F] text-[15px] lg:text-[18px] bg-white rounded-b-[12px] border-t border-[#04436F]/20">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contact Hint */}
      <p className="text-[#04436F] text-[18px] text-center mt-16">
        Falls Sie die Antwort auf Ihre Frage nicht finden, kontaktieren Sie uns gerne über das{" "}
        <a
          href="/contact"
          className="underline hover:text-[#B99B5F] transition-colors"
        >
          Kontaktformular
        </a>.
      </p>
    </div>
  );
}