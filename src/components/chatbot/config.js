import { createChatBotMessage } from "react-chatbot-kit";
import CategoryOptions from "./widgets/CategoryOptions";
import QuestionOptions from "./widgets/QuestionOptions";
import React from "react";
import DashboardLink from "./DashboardLink";

import YesNoOptions from "./YesNoOptions";   // 👉 hier hinzufügen

// --- Custom Avatars ---
const BotAvatar = () => (
  <div className="bot-avatar">
    <img src="/Agent_Yellow.png" alt="Bot" style={{ width: "25px", height: "25px" }} />
  </div>
);

const UserAvatar = () => (
  <div className="hidden user-avatar">
    <img src="/Speaking_Blue.png" alt="User" style={{ width: "32px", height: "32px" }} />
  </div>
);

// --- Custom Input (mit deutschem Placeholder + Icon) ---
const CustomInput = (props) => {
  return (
    <form
      className="react-chatbot-kit-chat-input-form"
      onSubmit={props.onSubmit}
    >
      <input
        className="react-chatbot-kit-chat-input"
        placeholder="Ihre Nachricht eingeben..."   // ✅ German
        value={props.value}
        onChange={props.onChange}
      />
      <button className="react-chatbot-kit-chat-btn-send" type="submit">
        {/* ✅ schönes SVG-Icon statt nur Text */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
        </svg>
      </button>
    </form>
  );
};

const config = {
  botName: "PHC Support Agent",

  initialMessages: [
    createChatBotMessage(
      "Hallo! 👋 Wie kann ich Ihnen helfen? Bitte wählen Sie eine Kategorie:",
      { widget: "categoryOptions" }
    ),
  ],

  customStyles: {
    botMessageBox: { backgroundColor: "#04436F" },
    chatButton: { backgroundColor: "#B99B5F" },
  },

  customComponents: {
    header: () => <></>,  // kein Header
    botAvatar: (props) => <BotAvatar {...props} />,
    userAvatar: (props) => <UserAvatar {...props} />,
    input: (props) => <CustomInput {...props} />,   // ✅ Input überschrieben
  },

  widgets: [
    {
      widgetName: "categoryOptions",
      widgetFunc: (props) => <CategoryOptions {...props} />,
    },
    
  {
    widgetName: "dashboardLink",
    widgetFunc: (props) => <DashboardLink {...props} />,
  },
    {
      widgetName: "questionOptions",
      widgetFunc: (props) => <QuestionOptions {...props} />,
      mapStateToProps: ["faqData"],
    },
      {
      widgetName: "yesNoOptions",
      widgetFunc: (props) => <YesNoOptions {...props} />,
    },
  ],

state: {
  knowledgeBase: [

    // --- Preise ---
{
  keywords: ["preise", "kosten", "tarif", "gebühren", "kosten stunde", "preis berechnung", "preisinfo", "preise liste", "preise details"],
  answer: "Unsere Preise: Einmalige Einsätze ab CHF 75.– pro Stunde, regelmässige Betreuung ab CHF 59.– pro Stunde."
},
{
  keywords: ["preis zusammensetzung", "kosten berechnung", "preisdetails", "mindestbuchung"],
  answer: "Der Preis richtet sich nach der Anzahl der Stunden und dem jeweiligen Stundentarif. Die Mindestbuchung beträgt 2 Stunden. Alle Preise verstehen sich inklusive Mehrwertsteuer und ohne versteckte Kosten."
}
,

// --- Vorteile (Warum PHC) ---
{
  keywords: ["vorteile", "warum prime home care", "warum phc", "gründe", "warum uns"],
  answer: "Warum die Prime Home Care AG? Weil Vertrauen, Herzlichkeit und Verlässlichkeit im Mittelpunkt stehen. Unsere stundenweise Betreuung stellt Ihre individuellen Bedürfnisse in den Fokus und bietet die perfekte Balance zwischen Selbstständigkeit und gezielter Unterstützung. Ihre Vorteile auf einen Blick: Individuell & flexibel – wir passen uns Ihrem Alltag an. Vertraute Gesichter – lokal verankert und schnell zur Stelle. Mehr Lebensfreude zu Hause – Wohlbefinden für Sie und Ihre Angehörigen. Einfach & zuverlässig organisiert – direkte Ansprechpartner und unkomplizierte Abläufe."
},


    // --- Konto & Profil ---
    {
      keywords: ["konto löschen", "account löschen", "profil entfernen", "benutzerkonto", "account entfernen"],
      answer: "Um Ihr Konto zu löschen, gehen Sie bitte in die Kontoeinstellungen."
    },
    {
      keywords: ["adresse ändern", "adressänderung"],
      answer: "Ihre Adresse können Sie jederzeit im Kundenprofil unter 'Adressänderung' anpassen."
    },
    {
      keywords: ["mehrere adressen", "adressen buchen"],
      answer: "Sie können Betreuungseinsätze für mehrere Adressen buchen. Bitte geben Sie bei der Buchung alle relevanten Daten an."
    },

    // --- FAQ & Infos ---
    {
      keywords: ["faq", "häufige fragen", "hilfe", "support fragen", "informationen"],
      answer: "In unseren FAQ finden Sie Antworten auf die häufigsten Fragen: [Link zur FAQ-Seite]"
    },
    {
      keywords: ["agb", "avb", "bedingungen", "vertrag", "vertragsbedingungen", "avb seite", "nutzungsbedingungen"],
      answer: "Unsere Allgemeinen Vertragsbedingungen (AVB) können Sie hier einsehen: [Link zu AVB-Seite]"
    },
    {
      keywords: ["unterschied stundenweise betreuung", "24 stunden betreuung"],
      answer: "Bei stundenweiser Betreuung entscheiden Sie flexibel, wann und wie lange Unterstützung benötigt wird. Die 24-Stunden-Betreuung bedeutet eine dauerhafte Anwesenheit einer Betreuungskraft im Haushalt."
    },

    // --- Kontakt ---
    {
      keywords: ["kontakt", "telefon", "email", "support", "hotline", "kundendienst", "kontaktformular"],
      answer: "Sie erreichen uns unter: +41 44 123 45 67 oder per E-Mail an info@phc.ch. Adresse: Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz. Öffnungszeiten: 8:30 – 11:00 und 13:30 – 16:00 Uhr."
    },
    {
      keywords: ["öffnungszeiten", "zeiten", "wann erreichbar", "arbeitszeiten"],
      answer: "Unsere Öffnungszeiten: 8:30 – 11:00 und 13:30 – 16:00 Uhr."
    },
    {
      keywords: ["adresse", "standort", "büro", "wo sind sie", "anschrift"],
      answer: "Unsere Adresse: Prime Home Care AG, Birkenstrasse 49, 6343 Rotkreuz."
    },

    // --- Über uns ---
    {
      keywords: ["über uns", "unternehmen", "prime home care ag", "wer sind wir", "phc firma"],
      answer: "Willkommen bei der Prime Home Care AG – Ihrem zuverlässigen Partner für individuelle und professionelle stundenweise Betreuung zu Hause. Seit unserer Gründung verfolgen wir das Ziel, Menschen in ihrem vertrauten Umfeld bestmögliche Betreuung und Unterstützung zu bieten."
    },
    {
      keywords: ["philosophie", "werte", "grundsätze"],
      answer: "Unsere Philosophie basiert auf Empathie, Respekt und Kompetenz. Jede Person hat einzigartige Bedürfnisse, deshalb legen wir Wert auf eine persönliche und flexible Betreuung – von Gesellschaft bis hin zu hauswirtschaftlichen Dienstleistungen."
    },
    {
      keywords: ["vision", "ziel", "strategie"],
      answer: "Als digitales Unternehmen verbinden wir Betreuung mit modernster Technologie. Über unsere Plattform finden und buchen Sie flexibel und unkompliziert die passende Betreuung – individuell abgestimmt und genau dann, wenn sie gebraucht wird."
    },
    {
      keywords: ["qualität", "vertrauen", "standards"],
      answer: "Qualität und Vertrauen sind die Grundlage unseres Handelns. Wir setzen auf kontinuierliche Weiterbildung, hohe Standards und eine transparente, digitale Plattform – von der Buchung bis zur Abrechnung."
    },
    {
      keywords: ["zufriedenheit", "lebensqualität"],
      answer: "Ihre Zufriedenheit ist unser Antrieb. Wir sind stolz darauf, Ihnen Lebensqualität und Selbstständigkeit zurückzugeben – in Ihrem Zuhause, wo Sie sich am wohlsten fühlen."
    },

    // --- Dienstleistungen ---
    {
      keywords: ["dienstleistung", "dienstleistungen", "angebot", "services", "hilfe zuhause"],
      answer: "Unser Dienstleistungsangebot: Alltagsbegleitung & Besorgungen, Freizeit & soziale Aktivitäten, Gesundheitsfürsorge & Grundpflege sowie Haushaltshilfe & Wohnpflege."
    },
    {
      keywords: ["alltagsbegleitung", "besorgungen", "arzttermin", "einkauf", "postgang", "begleitung"],
      answer: "Unsere Alltagsbegleitung & Besorgungen umfasst: Begleitung zu Terminen, Einkäufe erledigen, Postgänge und weitere Erledigungen."
    },
    {
      keywords: ["freizeit", "soziale aktivitäten", "ausflüge", "reisebegleitung", "kochen", "gesellschaft"],
      answer: "Unsere Freizeit- & Sozialangebote beinhalten: Gesellschaft leisten, gemeinsames Kochen, Vorlesen, Kartenspiele sowie Ausflüge und Reisebegleitung."
    },
    {
      keywords: ["gesundheitsfürsorge", "pflege", "körperpflege", "nahrungsaufnahme", "grundpflege"],
      answer: "Unsere Gesundheitsfürsorge & Grundpflege umfasst: körperliche Unterstützung, Hilfe bei Nahrungsaufnahme, grundpflegerische Tätigkeiten, gesundheitsfördernde Aktivitäten und geistige Unterstützung."
    },
    {
      keywords: ["haushaltshilfe", "wohnpflege", "putzen", "wäsche", "staubsaugen", "haushalt", "hauswirtschaft"],
      answer: "Unsere Haushaltshilfe & Wohnpflege beinhaltet: Kochen, Waschen, Bügeln, Fenster putzen, Bettwäsche wechseln, Aufräumen, Abfall entsorgen, Abstauben, Staubsaugen, Boden wischen und Vorhänge reinigen sowie Balkon- und Blumenpflege."
    },
    {
      keywords: ["individuelle dienstleistung", "spezielle betreuung", "extra service", "besondere wünsche"],
      answer: "Neben den Standardangeboten bieten wir auch individuelle Dienstleistungen an – zum Beispiel Ferienbegleitung, Beratungen oder Biografiearbeit. Kontaktieren Sie uns gerne für ein persönliches Angebot."
    },
// --- Seniorenbetreuung (About Us Intro) ---
{
  keywords: ["seniorenbetreuung", "fürsorglich", "eigene vier wände", "betreuung zuhause"],
  answer: "Seit unserer Gründung verfolgen wir das Ziel, Menschen in ihrem vertrauten Umfeld die bestmögliche Betreuung und Unterstützung zu bieten. Mit einem engagierten Team aus erfahrenen Mitarbeitenden und einem breiten Spektrum an Dienstleistungen setzen wir uns täglich dafür ein, die Lebensqualität unserer Kundinnen und Kunden zu verbessern."
},

// --- Mehr Zeit & Entlastung ---
{
  keywords: ["mehr zeit", "entlastung", "zeit gewinnen", "zeit sparen", "entlastung familie"],
  answer: "Bei Prime Home Care bieten wir einfühlsame und individuelle Betreuung – für Sie oder Ihre Liebsten. Dadurch gewinnen Sie mehr Zeit und Entlastung im Alltag."
},



    // --- Buchungen ---
    {
      keywords: ["buchung vornehmen", "betreuung buchen", "betreuung reservieren"],
      answer: "Besuchen Sie unsere Webseite phc.ch, geben Sie Ihre Postleitzahl ein, wählen Sie die gewünschte Dienstleistung und Häufigkeit und bestätigen Sie Ihre Buchung online."
    },
    {
      keywords: ["buchung bearbeiten", "buchung ändern"],
      answer: "Melden Sie sich in Ihrem Kundenprofil an, gehen Sie zu 'Meine Buchungen' → 'Bevorstehende Buchungen' und klicken Sie auf 'Buchung ändern'."
    },
    {
      keywords: ["umbuchen", "betreuung verschieben"],
      answer: "Loggen Sie sich in Ihr PHC-Konto ein, gehen Sie zu 'Meine Betreuungen' → 'Bevorstehende' und wählen Sie 'Betreuung bearbeiten'."
    },
    {
      keywords: ["buchung stornieren", "betreuung absagen", "stornieren"],
      answer: "Melden Sie sich in Ihrem Profil an, gehen Sie zu 'Meine Buchungen' → 'Bevorstehende Settings' → 'Buchung stornieren'."
    },
    {
      keywords: ["nach buchung", "buchung bestätigt"],
      answer: "Nach der Buchung erhalten Sie eine Bestätigung per E-Mail mit allen Details und der Uhrzeit der Betreuung."
    },
    {
      keywords: ["kurzfristig buchen", "sofort betreuung", "dringend"],
      answer: "Wir benötigen normalerweise 14 Tage Vorlaufzeit. Kontaktieren Sie uns bei dringendem Bedarf, wir versuchen eine Lösung zu finden."
    },
    {
      keywords: ["wie funktioniert", "ablauf", "so läuft es", "prozess", "schritte"],
      answer: "So einfach geht’s in drei Schritten: 1. Profil erstellen und Wünsche angeben. 2. Passende Betreuungsperson wird gefunden. 3. Betreuung zuhause geniessen."
    },

    // --- Zusatzinfos ---
    {
      keywords: ["schaden", "versicherung", "versicherungspolice"],
      answer: "Unsere Schadenversicherung deckt bis zu 1000 CHF pro Jahr. Reichen Sie bei einem Schaden ein Foto und den Kaufbeleg ein."
    },
    {
      keywords: ["betreuungskraft erneut", "gleiche betreuungskraft"],
      answer: "Bei regelmässigen Einsätzen wird möglichst dieselbe Betreuungskraft zugeteilt. Bei monatlichen Buchungen kann es Abweichungen geben."
    },
    {
      keywords: ["aufgaben zuweisen", "zusätzliche aufgaben"],
      answer: "Sie können während der Buchung oder im Kundenprofil unter 'Spezialanweisungen' Aufgaben hinzufügen."
    },
    {
      keywords: ["hausschlüssel", "schlüsselübergabe"],
      answer: "Die Schlüsselübergabe können Sie direkt mit der Betreuungskraft vereinbaren oder eine sichere PHC-Lösung nutzen."
    },
    {
      keywords: ["unzufrieden", "beschwerde", "reklamation"],
      answer: "Falls Sie unzufrieden sind, kontaktieren Sie uns bitte direkt über Ihr Kundenprofil. Wir finden gemeinsam eine Lösung."
    },
    {
  keywords: [
    "meine rechnung",
    "kosten",
    "meine zahlung",
    "zahlung",
    "ihre rechnung",
    "rechnung",
    "ihre zahlung",
    "seine rechnung",
    "seine zahlung",
    "ihre kosten",
    "mein rechnung",
    "mein zahlung",
    "mein kosten"
  ],
  widget: "dashboardLink"
},

    {
      keywords: ["notfall", "dringend hilfe", "schnelle hilfe", "sofort hilfe", "notdienst"],
      answer: "In Notfällen kontaktieren Sie uns bitte sofort telefonisch. Wir versuchen schnellstmöglich eine Betreuungslösung zu organisieren."
    },
    {
      keywords: ["spitex", "pflegeheim", "unterschied", "warum nicht spitex"],
      answer: "Im Unterschied zur Spitex oder einem Pflegeheim bieten wir flexible stundenweise Betreuung in Ihrem Zuhause – individuell, digital organisiert und mit vertrauten Betreuungspersonen."
    },
    {
      keywords: ["sprache", "deutsch", "englisch", "mehrsprachig", "andere sprachen"],
      answer: "Unsere Betreuungspersonen sprechen in der Regel Deutsch. Auf Anfrage sind auch weitere Sprachen möglich."
    },
    {
      keywords: ["plattform", "digital", "app", "online", "wie buchen"],
      answer: "Unsere volldigitale Plattform macht die Betreuung einfach: Sie können online buchen, Änderungen vornehmen und alles transparent einsehen."
    },
    {
      keywords: ["gutschein", "geschenk", "betreuung verschenken"],
      answer: "Ja, Sie können Betreuung auch als Gutschein verschenken. Kontaktieren Sie uns für Details."
    },

    // --- Bewertungen ---
    {
      keywords: ["kundenmeinungen", "kundenstimmen", "bewertungen", "feedback"],
      answer: "Unsere Kunden sagen: 'Die Unterstützung durch Prime Home Care gibt mir Sicherheit und Freiheit' (Markus S., Zürich). 'Sehr herzlich und professionell' (Claudia H., Bern). 'Stundenweise Betreuung bringt viel Entlastung' (Peter K., Luzern)."
    },

   // --- Jobs / Karriere ---
{
  keywords: ["jobs", "karriere", "stellenangebote", "arbeit", "mitarbeiten"],
  answer: "Alle offenen Stellen findest du auf unserer Jobs-Seite. Dort sind aktuelle Stellenbeschreibungen, Anforderungen und Bewerbungsdetails aufgeführt."
},
{
  keywords: ["bewerbung", "jetzt bewerben", "bewerben", "bewerbungsdetails"],
  answer: "Bewirb dich ganz einfach online über unsere Jobs-Seite. Dort findest du alle Infos zur Bewerbung und kannst dich direkt registrieren."
},
{
  keywords: ["anforderungen", "qualifikationen", "wer kann arbeiten", "wen suchen wir"],
  answer: "Wir suchen empathische und zuverlässige Menschen mit Freude am Umgang mit Seniorinnen und Senioren. Wichtige Eigenschaften sind: Empathie, Zuverlässigkeit, Eigenständigkeit, Motivation, Mobilität und Flexibilität."
},
{
  keywords: ["vorteile arbeiten", "arbeit bei phc", "warum hier arbeiten"],
  answer: "Deine Vorteile bei uns: Flexible Arbeitszeiten, faire Bezahlung und transparente Abrechnung, einfache Organisation über unsere Plattform und wertvolle Erfahrung in einem sinnvollen Beruf."
},
{
  keywords: ["start", "wie starte ich", "einstieg", "arbeiten beginnen"],
  answer: "So einfach startest du: 1. Registrieren über unser Online-Formular. 2. Profil erstellen und Bewerbungsunterlagen hochladen. 3. Nach erfolgreicher Prüfung kannst du direkt mit ersten Einsätzen starten."
}
,
// --- Hilfe / Support ---
{
  keywords: ["hilfe", "help", "unterstützung", "support", "problem", "frage"],
  answer: "Kein Problem – ich bin für Sie da! 😊 Sie können mir Ihre Frage direkt hier stellen. Falls Sie persönliche Unterstützung benötigen, erreichen Sie unser Team auch telefonisch unter +41 44 123 45 67 oder per E-Mail an info@phc.ch."
},
// --- Sprache wechseln ---

{
  keywords: ["english", "englisch", "in english", "can we speak english", "speak english", "english please"],
  answer: "Unsere Antworten sind nur auf Deutsch verfügbar. 😊 Bitte stellen Sie Ihre Frage auf Deutsch."
},



    // --- Newsletter ---
    {
      keywords: ["newsletter", "news", "aktuelle informationen"],
      answer: "Bleiben Sie auf dem Laufenden: Geben Sie Ihre E-Mail-Adresse auf unserer Website ein und abonnieren Sie unseren Newsletter."
    }
  ]
}

};

export default config;
