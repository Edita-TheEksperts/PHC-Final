import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import zipToCity from "../lib/zipToCity"; // adjust path if needed
import Link from 'next/link';
import { useRef } from "react";

export default function Home() {
  const faqs = [
    {
      question: "Was genau leistet die Prime Home Care?",
      answer: " Wenn ein Familienmitglied oder ein geliebter Mensch pflegebedürftig wird, müssen Angehörige und Freund oft unter grossem Zeitdruck Betreuung sowie die dafür benötigten Hilfsmittel organisieren. Häusliche Betreuung stellt ein komplexes Thema mit sehr vielen Dimensionen dar: Zum einen geht es um viel Geld und bedeutet für die Betroffenen häufig auch einen Verzehr von Vermögen. Zum anderen gibt es in der Schweiz die rechtliche Dimension, bei der es um die korrekte Gestaltung und Abwicklung von Arbeitsverhältnissen geht. Hierbei ist es zentral, das richtige Betreuungsmodell zu wählen und einen arbeits- und sozialversicherungsrechtlich versierten Partner an seiner Seite zu wissen. Und schliesslich geht es um zwischenmenschliche Aspekte, immerhin leben in einer Betreuungssituation häufig zwei oder mehrere Menschen in einem Haushalt mit einer Pflegehilfe, die häufig vom Ausland anreist. Senioren oder hilfsbedürftigen Menschen unter unseren Kunden sowie deren pflegende Angehörige oder Partner wissen zu schätzen, dass sie mit uns alle benötigten Leistungen nahtlos und «wie aus einer Hand» erhalten können und wir zudem zu allen Aspekten der Betreuung optimal beraten können. Wir holen für sie unterschiedliche Angebote von Partnerunternehmen ein und haben stets ein Auge auf die Einhaltung korrekter Anstellungsbedingungen sowie auf alle Rechtsnormen. Auf diese Weise können wir bei der Seniorenbetreuung zuhause zugleich geringe Kosten und eine hohe Qualität sicherstellen. So leisten wir unseren Beitrag dafür, dass sich betroffene Menschen sowohl in ihrem eigenen Haushalt als auch unterwegs 24h am Tag sicher und geborgen fühlen können.",
    },
    {
      question: "Welche Vorteile bietet die Zusammenarbeit mit Prime Home Care für eine Betreuung zu Hause?",
      answer: "Wenn ein Familienmitglied oder ein geliebter Mensch pflegebedürftig wird, müssen Angehörige und Freund oft unter grossem Zeitdruck Betreuung sowie die dafür benötigten Hilfsmittel organisieren. Häusliche Betreuung stellt ein komplexes Thema mit sehr vielen Dimensionen dar: Zum einen geht es um viel Geld und bedeutet für die Betroffenen häufig auch einen Verzehr von Vermögen. Zum anderen gibt es in der Schweiz die rechtliche Dimension, bei der es um die korrekte Gestaltung und Abwicklung von Arbeitsverhältnissen geht. Hierbei ist es zentral, das richtige Betreuungsmodell zu wählen und einen arbeits- und sozialversicherungsrechtlich versierten Partner an seiner Seite zu wissen. Und schliesslich geht es um zwischenmenschliche Aspekte, immerhin leben in einer Betreuungssituation häufig zwei oder mehrere Menschen in einem Haushalt mit einer Pflegehilfe, die häufig vom Ausland anreist. Senioren oder hilfsbedürftigen Menschen unter unseren Kunden sowie deren pflegende Angehörige oder Partner wissen zu schätzen, dass sie mit uns alle benötigten Leistungen nahtlos und «wie aus einer Hand» erhalten können und wir zudem zu allen Aspekten der Betreuung optimal beraten können. Wir holen für sie unterschiedliche Angebote von Partnerunternehmen ein und haben stets ein Auge auf die Einhaltung korrekter Anstellungsbedingungen sowie auf alle Rechtsnormen. Auf diese Weise können wir bei der Seniorenbetreuung zuhause zugleich geringe Kosten und eine hohe Qualität sicherstellen. So leisten wir unseren Beitrag dafür, dass sich betroffene Menschen sowohl in ihrem eigenen Haushalt als auch unterwegs 24h am Tag sicher und geborgen fühlen können.",
    },
    {
      question: "Welche Kosten entstehen für eine private Betreuung zu Hause?",
      answer: "Bei Prime Home Care AG bieten wir flexible, unkomplizierte Betreuungsdienstleistungen – ganz nach Ihren Bedürfnissen. Der Einstieg ist einfach und transparent Regelmässige Betreuung,für wiederholte Unterstützung im Alltag (z. B. fixe Termine oder stundenweise Begleitung) berechnen wir CHF 59.– pro Stunde. Diese Variante eignet sich ideal für langfristige, planbare Unterstützung und bietet Ihnen eine vertraute Betreuungsperson. Sie profitieren von planbaren Kosten, einer konstanten Ansprechperson und einer effizienten Betreuungslösung.Einmalige Einsätze, für kurzfristige oder situativ bedingte Begleitung (wie etwa nach einem Spitalaufenthalt, Ferienvertretung oder einzelne Besorgungen) gelten CHF 75.– pro Stunde. Diese Option ist optimal für flexible, gezielte Unterstützung – unkompliziert online buchbar und ohne langfristige Bindung. Darüber hinaus bieten wir individuelle Dienstleistungen auf Anfrage an, zum Beispiel 24Stunden-Live-In-Betreuung, Ferienbegleitung oder gemeinsame Aktivitäten. Hier stimmen wir die Konditionen direkt mit Ihnen ab. ",
    },
{
  question: "Können auch einzelne Leistungen in Anspruch genommen werden?",
    answerType: "jsx",
  answer: (
    <div>
      <p>
        Ja, bei der Prime Home Care AG sind Sie völlig flexibel! Sie können einzelne Leistungen ganz nach Bedarf buchen – ohne feste Pakete oder Verpflichtungen.
      </p>
      <p className="mt-2 font-semibold">Unsere Optionen:</p>
      <ul className="list-disc list-inside">
        <li>Alltagsbegleitung & Besorgungen: Arzttermine, Einkäufe, Erledigungen</li>
        <li>Freizeit & Gesellschaft: Spaziergänge, Ausflüge, gemeinsame Aktivitäten</li>
        <li>Grundpflege & Gesundheitsfürsorge: Unterstützung bei Körperpflege und Nahrungsaufnahme</li>
        <li>Haushaltshilfe: Kochen, Putzen, Wäsche, Pflanzenpflege</li>
      </ul>
    </div>
  )
}
,
    {
      question: "Wer wählt die passende Betreuungskraft aus? ",
      answer: "Bei Prime Home Care unterstützt Sie ein vollautomatisches Matchingsystem: Auf Basis Ihrer Angaben schlagen wir passende Betreuungspersonen vor – schnell, digital und unkompliziert. Unser Ziel: eine harmonische und vertrauensvolle Betreuung. Eine 100 % Übereinstimmung aller Wünsche können wir jedoch nicht garantieren. So behalten Sie die Wahl und finden die Betreuungskraft, die am besten zu Ihrer Situation passt. ",
    },
    {
      question: "Was unterscheidet stundenweise Betreuung von einer 24 Stunden Betreuung?",
      answer: "Manchmal braucht es nur ein paar Stunden Hilfe pro Woche, manchmal rund um die Uhr – und genau hier liegt der Unterschied: Stundenweise Betreuung bedeutet: Unterstützung dann, wenn Sie sie brauchen. Zum Beispiel für Einkäufe, Arztbesuche, Spaziergänge oder Hilfe im Haushalt. Sie bleiben flexibel und bezahlen nur die tatsächlich geleisteten Stunden. Ideal, wenn Angehörige zwischendurch entlastet werden sollen oder Sie punktuell Unterstützung suchen. 24-Stunden-Betreuung hingegen bietet eine dauerhafte Präsenz im Zuhause. Eine Betreuungsperson lebt mit im Haushalt und ist jederzeit vor Ort – für Pflege, Gesellschaft und Sicherheit. Perfekt, wenn eine kontinuierliche Betreuung notwendig ist und Angehörige vollständig entlastet werden sollen. "
}];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
const services = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
    "Gemeinsames Kochen",
    "Vorlesen",
    "Biografiearbeit",
    "Kartenspiele",
    "Ausflüge und Reisebegleitung",
  ],
  "Gesundheitsführsorge": [
    "Körperliche Unterstützung",
    "Nahrungsaufnahme",
    "Grundpflegerische Tätigkeiten",
    "Gesundheitsfördernde Aktivitäten",
    "Geistige Unterstützung",
  ],
  "Haushaltshilfe und Wohnpflege": [
    "Hauswirtschaft",
    "Balkon und Blumenpflege",
    "Waschen / Bügeln",
    "Kochen",
    "Fenster Putzen",
    "Bettwäsche wechseln",
    "Aufräumen",
    "Trennung / Entsorgung / Abfall",
    "Abstauben",
    "Staubsaugen",
    "Boden wischen",
    "Vorhänge reinigen",
  ],
};

const router = useRouter();
const [postalCode, setPostalCode] = useState("");
const [city, setCity] = useState("");
const [suggestions, setSuggestions] = useState([]);

const handleSubmit = () => {
  if (selectedService.length === 0 || !postalCode) {
    alert("Bitte wählen Sie mindestens eine Dienstleistung und eine Postleitzahl.");
    return;
  }

  const serviceParam = selectedService.map(encodeURIComponent).join(",");
  router.push(
    `/register-client?service=${serviceParam}&postalCode=${encodeURIComponent(postalCode)}`
  );
};


    const [email, setEmail] = useState("");
const [agbAccepted, setAgbAccepted] = useState(false);

const handleEmployeeStart = () => {
  if (!email || !agbAccepted) {
    alert("Bitte E-Mail eingeben und AGB akzeptieren.");
    return;
  }

  // Save to localStorage
  localStorage.setItem("employeeEmail", email);
  localStorage.setItem("employeeAgbAccepted", agbAccepted.toString());

  // Redirect to employee register
  router.push("/employee-register");
};
useEffect(() => {
  if (postalCode.length >= 4 && zipToCity[postalCode]) {
    setCity(zipToCity[postalCode]);
  } else {
    setCity("");
  }
}, [postalCode]);

const handleInputChange = (e) => {
  const value = e.target.value.split(" ")[0];
  setPostalCode(value);
  setCity("");

  if (value.length >= 3) {
    const matched = Object.entries(zipToCity)
      .filter(([zip]) => zip.startsWith(value))
      .map(([zip, city]) => ({ zip, city }));
    setSuggestions(matched);
  } else {
    setSuggestions([]);
  }
};



const handleSelect = (zip, cityName) => {
  setPostalCode(zip);
  setCity(cityName);
  setSuggestions([]);
};
const [selectedService, setSelectedService] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleService = (service) => {
    setSelectedService((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  const removeService = (service) => {
    setSelectedService((prev) => prev.filter((item) => item !== service));
  };
const [searchText, setSearchText] = useState("");

  return (
    
    <div className="bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]">
      {/* Hero Section */}
    <section className="max-w-[1430px] bg-[#EDF2FB] rounded-[20px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-2 px-4 lg:px-[20px] py-12 lg:py-[70px]">
  {/* Left Content */}
  <div className="flex-1 w-full max-w-[830px]">
    <h1 className="text-[#04436F] text-[32px] lg:text-[60px] font-semibold leading-tight">
      Individuelle<br /> Betreuungslösungen<br /> für Sie in Ihrem Zuhause

    </h1>
<p className="text-gray-700 text-lg mt-4">
Jetzt Ihre Betreuung buchen!</p>

    {/* Service Selector */}
   <div className="bg-white rounded-[20px]  p-6 lg:p-6 mt-4 w-full">
  <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-4 w-full">
    
        <div className="relative w-full lg:w-[370px]" ref={wrapperRef}>
      {/* Main Selector Display */}
     <div
  className="min-h-[65px] max-h-[60px] mt-[5px] overflow-y-auto border border-gray-300 rounded-[12px] px-4 py-3 bg-white cursor-pointer flex flex-wrap gap-3 items-center"
  onClick={() => setDropdownOpen(!dropdownOpen)}
  style={{
    scrollbarColor: "#B99B5F transparent",
    scrollbarWidth: "thin",
  }}
>
  {selectedService.length > 0 ? (
    selectedService.map((srv) => (
      <span
        key={srv}
        className="bg-[#B99B5F] text-white px-4 py-1.5 rounded-full flex items-center text-sm font-medium shadow-sm"
      >
        {srv}
        <button
          className="ml-2 text-white hover:text-gray-200 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            removeService(srv);
          }}
        >
          ×
        </button>
      </span>
    ))
  ) : (
<span className="text-[#6B7280] text-base opacity-70">
      Bitte Dienstleistung wählen
    </span>  )}
</div>


    {dropdownOpen && (
  <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto p-4 space-y-3">
     

    {/* Service Tags */}
    <div className="flex flex-wrap gap-2">
      {Object.keys(services)
        .filter((srv) =>
          srv.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((srv) => {
          const isSelected = selectedService.includes(srv);
          return (
            <div
              key={srv}
              onClick={() => toggleService(srv)}
              className={`cursor-pointer px-3 py-1 rounded-full border text-sm transition 
                ${isSelected ? "bg-[#04436F] text-white border-[#04436F]" : "bg-gray-100 text-gray-700 border-gray-300"}
              `}
            >
              {srv}
            </div>
          );
        })}
    </div>
  </div>
)}
    </div>

<div className="w-full lg:w-[250px] relative h-[60px]">
  <input
    type="text"
    className="w-full border border-gray-300 rounded-[12px] px-5 py-5 text-base focus:outline-none focus:ring-2 focus:ring-[#04436F] transition"
    placeholder="Postleitzahl eingeben"
    value={city ? `${postalCode} (${city})` : postalCode}
    onChange={handleInputChange}
  />

  {suggestions.length > 0 && (
    <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
      {suggestions.map((item, index) => (
         <li
    key={`${item.zip}-${index}`}
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    onClick={() => handleSelect(item.zip, item.city)}
  >
    {item.zip} – {item.city}
  </li>
      ))}
    </ul>
  )}
</div>





    {/* Submit Button */}
    <div className="w-full lg:w-auto mt-4 lg:mt-0">
      <button
        onClick={handleSubmit}
        className="w-full bg-[#04436F] hover:bg-[#B99B5F] text-white text-[16px] font-semibold rounded-[12px] px-4 py-5 transition shadow-lg"
      >
        Los geht’s!
      </button>
    </div>
  </div>
  {/* Rating Section */}
<div className="flex items-center gap-3 mt-6 lg:mt-8 text-[#04436F]">
  {/* Stars */}
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        fill="gold"
        viewBox="0 0 24 24"
        stroke="none"
        className="w-5 h-5"
      >
        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848 1.417 8.268L12 19.771l-7.417 4.093L6 15.596 0 9.748l8.332-1.73z" />
      </svg>
    ))}
  </div>

  {/* Score Text */}
  <span className="text-[18px] font-semibold">5/5</span>

  {/* Review Count */}
  <span className="text-sm text-gray-600">
    Verifizierte Bewertungen seit 2023
  </span>
</div>

</div>


    {/* Avatars and Benefits */}
    <div className="mt-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex -space-x-4">
        </div>
      </div>

      <h2 className="text-[#04436F] text-[24px] font-semibold mb-2">
        Hilfreiche Lösungen für ein selbstbestimmtes Leben zu Hause
      </h2>
      <ul className="list-disc pl-6 text-[#04436F] text-[16px] space-y-1">
        <li>Volldigitale Plattform</li>
        <li>Die innovative Betreuungslösung</li>
      </ul>
    </div>
  </div>

  {/* Right Image */}
  <div className="w-full lg:w-[500px] flex justify-end">
    <Image
      src="/images/phc-hero-phc123.png"
      alt="Elderly care"
      width={500}
      height={600}
      className="rounded-[20px] object-cover"
    />
  </div>
</section>


      {/* Services Section */}
      <section className="max-w-[1430px] mx-auto px-6 mt-[120px] ">
      <h2 className="text-[#04436F] text-center text-[28px] leading-[37px] lg:text-[55px] font-semibold lg:leading-[71.5px] pt-4">
      Entdecken Sie unser umfassendes<br></br> Dienstleistungsangebot
</h2>


{/* Services Grid */}
<div className="mt-10 lg:mt-[70px] grid grid-cols-1 lg:px-[120px] md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-[60px] ">
  {[
    {
      title: "Alltagsbegleitung & Besorgungen",
      description:
        "Wir begleiten Sie zuverlässig zu Arztterminen, Therapien, Behördengängen oder beim Einkaufen – ob Supermarkt, Apotheke oder Modegeschäft. Auch Postgänge und sonstige Erledigungen übernehmen wir gerne.",
      icon: "/images/shopping-cart.png",
    },
    {
      title: "Freizeit & soziale Aktivitäten",
      description:
        "Für mehr Lebensfreude im Alltag: Wir leisten Gesellschaft, kochen gemeinsam, lesen vor, spielen Karten oder begleiten Sie zu Theater, Kino, Konzerten, Sportanlässen oder in den Urlaub.",
      icon: "/images/music (1).png",
    },
    {
      title: "Gesundheitsfürsorge & Grundpflege",
      description:
        "Einfühlsame Unterstützung bei der Körperpflege, Nahrungsaufnahme und bei alltäglichen pflegerischen Aufgaben – ergänzt durch gesundheitsfördernde Aktivitäten für Körper und Geist.",
      icon: "/images/medical-report.png",
    },
    {
      title: "Haushaltshilfe & Wohnpflege",
      description:
        "Wir sorgen für ein sauberes, gepflegtes Zuhause: von Kochen, Waschen und Bügeln bis hin zu Fenster putzen, Staubsaugen, Pflanzenpflege oder dem Wechseln der Bettwäsche.",
      icon: "/images/house (1).png",
    },
  ].map((service, index) => (
    <div
      key={index}
      className="bg-[FAFCFF] p-4 lg:p-[40px] rounded-[20px] flex flex-col justify-center items-center text-center"
    >
      {/* Icon Background */}
      <div className="w-[100px] h-[100px] bg-[#EDF2FB] rounded-full flex justify-center items-center mb-[30px]">
        <Image src={service.icon} alt={service.title} width={50} height={50} />
      </div>

      {/* Title */}
      <h3 className="text-[#04436F] text-center text-[28px] font-semibold leading-[33.6px]">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-[#04436F] text-center text-[16px] font-normal leading-[25.6px] mt-[10px]">
        {service.description}
      </p>
    </div>
  ))}
</div>


      </section>

      <section className="relative mt-[120px]  rounded-[20px]  mx-auto p-4">
      {/* Background Image */}
      <div className="relative w-full h-[350px] lg:h-[576px] overflow-hidden rounded-[20px]">
        <Image
          src="/images/phc-bg-hero.png"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:block hidden "
        />
           <Image
          src="/images/phc-bg-hero-mobile.jpg"  // Change this to your image path
          alt="Consultation"
          layout="fill"
          objectFit="cover"
          className="rounded-[20px] lg:hidden block bg-black bg-opacity-60"
          />
        {/* Overlay */}
        <div className="absolute inset-0 lg:mt-[-100px]  rounded-[20px] flex flex-col gap-3 lg:gap-[30px] justify-center items-center text-center px-6 ">
        <p className="text-[#FAFCFF] text-[18px]  font-normal leading-[23.4px] 
            px-[10px] py-[2px] flex flex-col items-start 
            rounded-l-[50px] rounded-r-none 
            bg-[linear-gradient(97deg,#04436F_0%,rgba(0,0,0,0.00)_100%)] text-center">
            Kontaktieren Sie uns
            </p>

            <h2 className="text-[#FAFCFF] text-center
            text-[32px] lg:text-[55px] font-semibold leading-[38px] lg:leading-[71.5px] mt-2">
            Buchen Sie jetzt<br></br>  Ihre Betreuungsperson<br></br> und Haushaltshilfe
            </h2>
        </div>
      </div>

      {/* Contact Options */}
      <div className="marginclass mt-10 lg:mt-[-80px] z-999 lg:ml-[850px] relative flex flex-row justify-center items-center gap-[20px]">
      {/* Online Session */}
        <div className="flex flex-col lg:items-right lg:text-right">
        <p className="text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:block hidden">
        Buchen Sie hier Ihre Betreuungsdienstleistung
        </p>
        <p className="text-[#04436F] text-[22px] font-medium leading-[26.4px] lg:text-right lg:hidden block">
        Buchen Sie hier<br></br> Ihre Betreuungsdienstleistung
        </p>

<Link href="/register-client">
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] lg:text-right underline cursor-pointer">
    Jetzt Buchen
  </p>
</Link>
        </div>
        <div className="w-[80px] h-[80px] bg-[#B99B5F] rounded-full flex justify-center items-center">
        <svg
      xmlns="http://www.w3.org/2000/svg"
      width="51"
      height="51"
      viewBox="0 0 51 51"
      fill="none"
    >
      <mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="51"
        height="51"
      >
        <path
          d="M50.4805 50.3526V0.450195H0.578125V50.3526H50.4805Z"
          fill="white"
          stroke="white"
          strokeWidth="0.0976562"
        />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M9.27735 41.6529C-7.28808 25.0874 7.2461 12.4911 10.7268 17.2307C10.7268 17.2307 13.9509 21.2203 14.6621 22.1502C15.3731 23.08 16.147 24.626 12.6138 27.3223C8.51993 30.4466 11.5208 34.1175 14.1462 36.7839C16.8126 39.4094 20.4836 42.4102 23.6078 38.3162C26.3041 34.7831 27.8501 35.557 28.7799 36.268C29.7098 36.9791 33.6994 40.2033 33.6994 40.2033C38.4389 43.6841 25.8426 58.2183 9.27735 41.6529Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.9043 1.37793C42.9945 1.37793 49.5528 7.93623 49.5528 16.0264C49.5528 24.1165 42.9945 30.6748 34.9043 30.6748C32.1017 30.6748 29.483 29.8872 27.2569 28.5219C25.6887 28.9428 24.1203 29.3635 22.5518 29.7838C21.7147 30.0202 20.9129 29.2541 21.1423 28.3933C21.5641 26.8189 21.9861 25.2458 22.4082 23.6729C21.0433 21.4471 20.2559 18.8287 20.2559 16.0264C20.2559 7.93623 26.8142 1.37793 34.9043 1.37793Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.70508 17.9458L12.7347 26.7336"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M33.0369 45.2532L24.1592 38.1514"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34.1368 6.97287C35.0863 7.92238 35.0863 9.47609 34.1368 10.4255L29.303 15.2594C28.3535 16.2088 26.7998 16.2088 25.8502 15.2594C24.9008 14.3097 24.9008 12.7561 25.8502 11.8066L30.6841 6.97287C31.6335 6.02336 33.1872 6.02336 34.1368 6.97287Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28.6128 9.73486L31.3748 12.497"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.8805 25.7919C38.3008 25.7919 40.275 23.8178 40.275 21.3974C40.275 18.977 38.3008 17.0029 35.8805 17.0029C33.46 17.0029 31.4858 18.977 31.4858 21.3974C31.4858 23.8178 33.46 25.7919 35.8805 25.7919Z"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.9741 21.3975H35.8803"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M35.8813 16.9267C35.9012 15.7879 36.3624 14.7014 37.1678 13.896C38.8839 12.1798 41.6664 12.1798 43.3825 13.896C45.0987 15.6121 45.0987 18.3946 43.3825 20.1108C42.5772 20.9162 41.4905 21.3774 40.3518 21.3972"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M39.2441 18.0343L40.2751 17.0034"
          stroke="white"
          strokeWidth="1.95312"
          strokeMiterlimit="22.926"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
          </div>

      </div>
    </section>

    <section className="max-w-[1400] mt-[120px] mx-auto p-2 lg:px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-[80px]">
      
      {/* Left: Image with Custom Cropped Shape */}
    <div className="relative w-full max-w-[610px] rounded-[20px] overflow-hidden">
  <Image
    src="/images/phc-easy-care-steps.png" // Change to your actual image path
    alt="Easy Care"
    width={610}
    height={750}
    className="w-full h-auto object-cover rounded-[20px]"
  />
</div>


      {/* Right: Text Content */}
      <div className="lg:w-1/2">
        {/* Tag: "How we work" */}
        <p className="mb-[10px] lg:pl-[14px] lg:pr-[100px] px-[14px] py-[2px] text-[#FAFCFF] text-[18px] font-normal leading-[23.4px] rounded-l-[50px]  inline-block"
         style={{
            background: "linear-gradient(94deg, #04436F 0%, rgba(0, 0, 0, 0.00) 100%)",
          }}>
 Wie wir arbeiten
</p>


        {/* Main Title */}
        <h2 className="text-[#04436F] text-[32px] lg:text-[55px] font-semibold leading-[40px] lg:leading-[71.5px] mb-10 lg:mb-[70px]">
        So einfach geht’s –<br></br>
        in drei Schritten
</h2>


        {/* Steps List */}
        <div className="space-y-6 lg:space-y-[50px]">
          {[
            {
              number: "1",
              title: "Registration",
              description:
                "Erstellen Sie Ihr Profil samt Ihren Wünschen an die Betreuung.",
              bgColor: "bg-[#EDF2FB]",
              textColor: "text-[#003588]",
            },
            {
              number: "2",
              title: "Passende Betreuungsperson finden",
              description:
                "Wir finden die richtige Betreuungsperson – einfühlsam, fachlich versiert und zuverlässig.",
              bgColor: "bg-[#B99B5F]",
              textColor: "text-white",
            },
            {
              number: "3",
              title: "Geniessen Sie Ihre Betreuung zuhause",
              description:
                "Wir übernehmen die Betreuung – Sie oder Ihre Angehörigen können sich entspannen.",
              bgColor: "bg-[#003588]",
              textColor: "text-white",
            },
          ].map((step, index) => (
            <div key={index} className="flex items-start gap-2 lg:gap-4">
              {/* Step Number */}
              <div
className={`w-[40px] h-[40px] lg:w-[70px] lg:h-[70px] aspect-square 
  flex items-center justify-center text-[16px] lg:text-[32px] 
  font-[500] rounded-full ${step.bgColor} ${step.textColor}`}              >
                {step.number}
              </div>

              {/* Step Content */}
              <div>
                <h3 className="text-[#04436F] text-[22px] lg:text-[28px] font-medium leading-[28px] lg:leading-[33.6px]">
                {step.title}
                </h3>

                <p className="text-[#04436F] lg:w-[500px] text-[16px] font-normal leading-[25.6px]">
                {step.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>


 <section className="text-center mt-[120px]">
  <h2 className="text-[#04436F] text-[55px] mb-4 lg:mb-[70px] font-semibold leading-[71.5px]">
    Preise
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

   

    {/* Card 2 – Einmalige Einsätze */}
    <div className="rounded-[20px] text-center bg-white shadow-md border border-gray-100 flex flex-col justify-between overflow-hidden">
      <div className="w-full p-[50px] text-left bg-[#EDF2FB] text-[#000000] rounded-t-[20px]">
        <h3 className="text-[22px] font-medium leading-[30.8px] mb-1">Einmalige Einsätze</h3>
   <div className="flex flex-col items-left mt-[20px]">
          <span className="text-[48px] text-[#04436F] font-semibold leading-[70px]">CHF 75.—</span>
          <span className="text-[16px] text-[#04436F] leading-[25px]">pro Stunde</span>
        </div>
      </div>

      <div className="px-[50px] pt-6 pb-4 text-left text-[#04436F] flex-grow">
        <p className="text-[16px] font-semibold mb-2">Ideal für flexible Bedürfnisse</p>
        <p className="text-[16px] leading-[26px] mb-6">
          Für einmalige Unterstützung – sei es nach einem Spitalaufenthalt oder einfach zur Entlastung. Unkompliziert online buchbar.
        </p>
        <h4 className="text-[16px] font-semibold mb-2">Typische Einsätze</h4>
        <ul className="list-disc pl-5 space-y-2 text-[16px] font-normal">
          <li>Betreuung nach ambulanten Eingriffen</li>
          <li>Ferienvertretung für Angehörige</li>
          <li>Einzelne Begleitdienste</li>
        </ul>
      </div>

      <div className="mt-auto px-[50px] pb-[50px]">
        <Link href="/register-client">
          <button className="w-full bg-[#04436F] text-white py-3 rounded-full text-[18px] font-medium transition duration-300 hover:bg-[#B99B5F]">
            Jetzt Buchen
          </button>
        </Link>
      </div>
    </div>
 {/* Card 1 – Regelmässige Betreuung */}
    <div className="rounded-[20px] text-center bg-white shadow-md border border-gray-100 flex flex-col justify-between overflow-hidden">
              <div className="w-full p-[50px] text-left bg-[#B99B5F] text-white rounded-t-[20px]">

        <h3 className="text-[22px] font-medium leading-[30.8px] mb-1">
          Regelmässige Betreuung
        </h3>
   <div className="flex flex-col items-left mt-[20px]">
  <span className="text-white text-[48px] font-semibold leading-[70px]">CHF 59.—</span>
  <span className="text-white text-[16px] leading-[25px]">pro Stunde</span>
</div>

      </div>

      <div className="px-[50px] pt-6 pb-4 text-left text-[#04436F] flex-grow">
        <p className="text-[16px] font-semibold mb-2">Ideal für den Alltag</p>
        <p className="text-[16px] leading-[26px] mb-6">
          Unsere regelmässigen Betreuungslösungen bieten zuverlässige Unterstützung im Alltag – flexibel und individuell angepasst.
        </p>
        <h4 className="text-[16px] font-semibold mb-2">Ihre Vorteile</h4>
        <ul className="list-disc pl-5 space-y-2 text-[16px] font-normal">
          <li>Planbare Betreuung</li>
          <li>Feste Bezugspersonen</li>
          <li>Kosteneffizient bei langfristiger Inanspruchnahme</li>
        </ul>
      </div>

      <div className="mt-auto px-[50px] pb-[50px]">
        <Link href="/register-client">
          <button className="w-full bg-[#04436F] text-white py-3 rounded-full text-[18px] font-medium transition duration-300 hover:bg-[#B99B5F]">
            Jetzt Buchen
          </button>
        </Link>
      </div>
    </div>

    {/* Card 3 – Individuelle Dienstleistungen */}
    <div className="rounded-[20px] text-center bg-white shadow-md border border-gray-100 flex flex-col justify-between overflow-hidden">
      <div className="w-full p-[50px] lg:h-[245px] text-left bg-[#EDF2FB] text-[#000000] rounded-t-[20px] justify-center">
        
           <div className="flex flex-col items-left">

        <h3 className="text-[22px] font-medium leading-[30.8px]">Individuelle Dienstleistungen</h3>
                <h3 className="text-[20px] font-[300] leading-[26.8px] mt-4">Auf Anfrage</h3>

        </div>
      </div>

      <div className="px-[50px] pt-6 pb-4 text-left text-[#04436F] flex-grow">
        <p className="text-[16px] leading-[26px] mb-6">
          Wir bei der Prime Home Care AG verstehen die individuellen Bedürfnisse unserer Kunden.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-[16px] font-normal">
          <li>24 Stunden Live-In Betreuung</li>
          <li>Ferienbegleitung</li>
      <li>Beratungsdienstleistungen</li>
          <li>Biographiearbeit</li>
        </ul>
      </div>

      <div className="mt-auto px-[50px] pb-[50px]">
        <Link href="/contact">
          <button className="w-full bg-[#04436F] text-white py-3 rounded-full text-[18px] font-medium transition duration-300 hover:bg-[#B99B5F]">
            Jetzt kontaktieren
          </button>
        </Link>
      </div>
    </div>

  </div>
</section>


<section className="flex flex-col items-center justify-center px-2 md:px-5 md:py-2 mt-[180px] text-[#04436F]">
  {/* Main heading */}
  <p
    style={{
      background:
        "linear-gradient(70deg, #B2EAFF 0%, #A9B4B9 75%, rgba(0, 0, 0, 0.00) 100%)",
    }}
    className="text-center font-metropolis text-[16px] font-[400] leading-[24px] mb-[16px] px-2 py-1 rounded-[50px_0px_0px_50px]"
  >
    Deine Chance – Betreuung neu gedacht
  </p>
 
  {/* Subheading */}
  <h1 className="text-center font-metropolis text-[32px] lg:text-[55px] font-[600] leading-[32px] lg:leading-[71.5px] mb-[16px] md:mb-2">
        Werde Teil unseres Betreuungsteams.

  </h1>
 
  {/* Paragraph */}
  <p className="lg:block hidden lg:max-w-[1240px] text-center font-metropolis text-[16px] md:text-[24px] font-[400] leading-[25px] md:leading-[40px] max-w-[800px]">
    Prime Home Care AG ist die erste volldigitale Plattform in der Schweiz, die Betreuung und Technologie <br /> verbindet. Als Betreuungsperson hilfst du Familien, Senioren und Menschen im Alltag – flexibel und genau<br /> dann, wann sie dich brauchen.
  </p>
  <p className="lg:hidden block lg:min-w-[1240px] text-center font-metropolis text-[16px] lg:text-[24px] font-[400] leading-[25px] lg:leading-[40px] max-w-[800px]">
    Prime Home Care AG ist die erste volldigitale Plattform in der Schweiz, die Betreuung und Technologie verbindet. Als Betreuungsperson hilfst du Familien, Senioren und Menschen im Alltag – flexibel und genau dann, wann sie dich brauchen.
  </p>
 
  {/* === Desktop layout === */}
  <div className="hidden lg:grid grid-cols-3 gap-6 mt-[60px] w-full max-w-[1280px]">
    {/* Card 1 */}
    <div className="relative overflow-hidden rounded-[28px] bg-[#F8F7EB] p-6 md:p-8 lg:p-10 flex flex-col h-full">
      {/* corner shapes */}
      <span className="pointer-events-none absolute top-0 right-0 w-[52px] h-[82px] bg-[#FAFCFF] rounded-bl-[40px]" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-[140px] h-[52px] bg-[#FAFCFF] rounded-tl-[34px]" />
 
      {/* Icon */}
      <div className="flex justify-center items-center w-[80px] h-[80px] bg-[#04436F] rounded-full mx-auto mb-[40px]">
        {/* SVG ICON (1) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M28.5378 31.4094C28.4012 31.4096 28.267 31.3739 28.1485 31.306C28.03 31.238 27.9314 31.1402 27.8626 31.0222L24.6605 25.5432C24.4395 25.1653 24.323 24.7355 24.3229 24.2977V16.0336C24.3229 15.8264 24.4052 15.6277 24.5518 15.4811C24.6983 15.3346 24.897 15.2523 25.1042 15.2523C25.3114 15.2523 25.5101 15.3346 25.6566 15.4811C25.8031 15.6277 25.8854 15.8264 25.8854 16.0336V24.2977C25.8854 24.4583 25.9282 24.6161 26.0094 24.7547L29.2115 30.2341C29.2808 30.3528 29.3175 30.4876 29.3181 30.625C29.3186 30.7624 29.2829 30.8975 29.2146 31.0167C29.1463 31.1359 29.0477 31.2349 28.9289 31.3039C28.8101 31.3729 28.6752 31.4092 28.5378 31.4094Z" fill="white"/>
          <path d="M38.1871 32.2197C39.4942 29.9489 40.1821 27.3748 40.1821 24.7547C40.1821 22.1347 39.4942 19.5605 38.1871 17.2898C38.1801 17.2647 38.1718 17.24 38.1622 17.2157C38.1423 17.1898 38.1206 17.1652 38.0973 17.1422C36.7901 14.9206 34.9382 13.0687 32.7166 11.7615C32.6992 11.7374 32.6771 11.7171 32.6518 11.7016C32.6264 11.6862 32.5981 11.676 32.5688 11.6716C30.2981 10.3646 27.7242 9.67678 25.1043 9.67676C22.4844 9.67674 19.9104 10.3646 17.6398 11.6715C17.6104 11.6759 17.5821 11.6861 17.5567 11.7016C17.5312 11.717 17.5091 11.7374 17.4917 11.7615C15.2697 13.0689 13.4177 14.9211 12.1104 17.1431C12.0875 17.1659 12.0661 17.1901 12.0464 17.2157C12.037 17.2395 12.0288 17.2638 12.022 17.2885C10.7144 19.5595 10.0262 22.1341 10.0262 24.7547C10.0262 27.3753 10.7144 29.9499 12.022 32.221C12.0288 32.2456 12.037 32.2699 12.0464 32.2937C12.0733 32.3365 12.1043 32.3765 12.1389 32.4132C13.4445 34.6146 15.2859 36.4498 17.4917 37.748C17.5147 37.7712 17.5393 37.7929 17.5652 37.8128C17.5983 37.8294 17.6327 37.8436 17.6679 37.8551C19.932 39.151 22.4954 39.8327 25.1042 39.8327C27.7129 39.8327 30.2763 39.151 32.5404 37.8551C32.5756 37.8436 32.61 37.8294 32.6431 37.8128C32.6691 37.7929 32.6936 37.7712 32.7166 37.748C34.9216 36.4503 36.7625 34.6159 38.068 32.4155C38.1034 32.3782 38.135 32.3374 38.1622 32.2937C38.1718 32.2695 38.1801 32.2448 38.1871 32.2197ZM32.522 36.04L31.6639 34.5535C31.6126 34.4647 31.5443 34.3868 31.4629 34.3243C31.3815 34.2618 31.2886 34.216 31.1895 34.1894C31.0904 34.1629 30.987 34.1561 30.8853 34.1695C30.7835 34.1829 30.6854 34.2161 30.5966 34.2674C30.5077 34.3187 30.4298 34.387 30.3673 34.4684C30.3048 34.5498 30.259 34.6428 30.2324 34.7419C30.2059 34.841 30.1991 34.9444 30.2125 35.0461C30.2259 35.1478 30.2592 35.2459 30.3104 35.3348L31.1663 36.8174C29.5218 37.6463 27.7241 38.1274 25.8854 38.2307V36.5208C25.8854 36.3136 25.8031 36.1149 25.6566 35.9684C25.5101 35.8219 25.3114 35.7396 25.1042 35.7396C24.897 35.7396 24.6982 35.8219 24.5517 35.9684C24.4052 36.1149 24.3229 36.3136 24.3229 36.5208V38.2307C22.4842 38.1274 20.6865 37.6463 19.042 36.8174L19.8979 35.3348C19.9492 35.2459 19.9826 35.1478 19.996 35.046C20.0094 34.9443 20.0027 34.8409 19.9761 34.7417C19.9496 34.6426 19.9037 34.5496 19.8413 34.4682C19.7788 34.3867 19.7009 34.3184 19.612 34.2671C19.5231 34.2158 19.4249 34.1825 19.3231 34.1691C19.2214 34.1557 19.118 34.1625 19.0188 34.1891C18.9197 34.2157 18.8268 34.2616 18.7454 34.3241C18.664 34.3867 18.5957 34.4646 18.5444 34.5535L17.6863 36.04C16.1489 35.0258 14.8332 33.7101 13.8189 32.1727L15.3053 31.3145C15.4847 31.2108 15.6156 31.0402 15.6692 30.8401C15.7227 30.64 15.6947 30.4268 15.5911 30.2473C15.4875 30.0679 15.317 29.937 15.1169 29.8833C14.9168 29.8296 14.7036 29.8576 14.5241 29.961L13.0416 30.817C12.2126 29.1725 11.7315 27.3747 11.6283 25.536H13.3385C13.5457 25.536 13.7444 25.4537 13.8909 25.3072C14.0374 25.1606 14.1197 24.9619 14.1197 24.7547C14.1197 24.5475 14.0374 24.3488 13.8909 24.2023C13.7444 24.0558 13.5457 23.9735 13.3385 23.9735H11.6283C11.7315 22.1347 12.2126 20.337 13.0415 18.6925L14.5241 19.5485C14.7036 19.6519 14.9168 19.6799 15.1169 19.6262C15.317 19.5725 15.4875 19.4416 15.5911 19.2622C15.6947 19.0827 15.7227 18.8695 15.6692 18.6694C15.6156 18.4693 15.4847 18.2987 15.3053 18.195L13.8189 17.3367C14.8332 15.7993 16.1489 14.4836 17.6863 13.4694L18.5444 14.9559C18.5957 15.0448 18.664 15.1228 18.7454 15.1853C18.8268 15.2478 18.9197 15.2937 19.0188 15.3203C19.118 15.3469 19.2214 15.3537 19.3231 15.3403C19.4249 15.3269 19.5231 15.2936 19.612 15.2423C19.7009 15.191 19.7788 15.1227 19.8413 15.0413C19.9037 14.9598 19.9496 14.8669 19.9761 14.7677C20.0027 14.6686 20.0094 14.5652 19.996 14.4634C19.9826 14.3616 19.9492 14.2635 19.8979 14.1746L19.042 12.6921C20.6865 11.8631 22.4842 11.382 24.3229 11.2788V12.9891C24.3229 13.1963 24.4052 13.395 24.5517 13.5415C24.6982 13.688 24.897 13.7703 25.1042 13.7703C25.3114 13.7703 25.5101 13.688 25.6566 13.5415C25.8031 13.395 25.8854 13.1963 25.8854 12.9891V11.2788C27.7241 11.3821 29.5218 11.8632 31.1663 12.6921L30.3104 14.1747C30.2069 14.3542 30.1788 14.5675 30.2324 14.7676C30.2861 14.9678 30.4171 15.1385 30.5966 15.2421C30.776 15.3457 30.9893 15.3737 31.1895 15.3201C31.3897 15.2664 31.5603 15.1354 31.6639 14.9559L32.522 13.4695C34.0595 14.4837 35.3752 15.7994 36.3895 17.3369L34.903 18.195C34.7236 18.2987 34.5927 18.4693 34.5392 18.6694C34.4856 18.8695 34.5136 19.0827 34.6172 19.2622C34.7208 19.4416 34.8914 19.5725 35.0914 19.6262C35.2915 19.6799 35.5047 19.6519 35.6842 19.5485L37.1668 18.6926C37.9958 20.3371 38.4769 22.1348 38.5801 23.9735H36.8702C36.663 23.9735 36.4643 24.0558 36.3178 24.2023C36.1713 24.3489 36.089 24.5476 36.089 24.7548C36.089 24.962 36.1713 25.1607 36.3178 25.3072C36.4643 25.4537 36.663 25.536 36.8702 25.536H38.5801C38.4769 27.3747 37.9958 29.1724 37.1668 30.8169L35.6842 29.961C35.5047 29.8576 35.2915 29.8296 35.0914 29.8833C34.8914 29.937 34.7208 30.0679 34.6172 30.2473C34.5136 30.4268 34.4856 30.64 34.5392 30.8401C34.5927 31.0402 34.7236 31.2108 34.903 31.3145L36.3895 32.1726C35.3752 33.7101 34.0595 35.0258 32.522 36.04Z" fill="white"/>
          <path d="M45.1998 37.6724L42.2544 38.4342C45.275 34.5459 46.8934 29.7512 46.8471 24.8277C46.8007 19.9042 45.0923 15.1407 41.999 11.31C38.9057 7.47933 34.6089 4.80604 29.8056 3.7238C25.0023 2.64155 19.9742 3.21384 15.537 5.34782C11.0998 7.48181 7.51364 11.0523 5.3603 15.4802C3.20696 19.9081 2.61273 24.9336 3.67398 29.7416C4.73524 34.5495 7.38974 38.858 11.2069 41.968C15.0241 45.078 19.78 46.8072 24.7032 46.875H24.7139C24.9211 46.8763 25.1204 46.7953 25.2678 46.6497C25.4152 46.5041 25.4988 46.3059 25.5001 46.0987C25.5014 45.8915 25.4204 45.6923 25.2748 45.5448C25.1292 45.3974 24.931 45.3138 24.7238 45.3125C20.1428 45.2534 15.7162 43.6479 12.1623 40.7566C8.60844 37.8653 6.13593 33.8579 5.14601 29.3847C4.1561 24.9115 4.70687 20.2351 6.70896 16.1142C8.71104 11.9934 12.0469 8.6701 16.1753 6.68359C20.3036 4.69707 24.9821 4.16396 29.4516 5.17076C33.921 6.17755 37.919 8.66518 40.7969 12.2299C43.6748 15.7947 45.2635 20.2273 45.3053 24.8086C45.3472 29.3898 43.8396 33.8507 41.0274 37.4675L41.2664 34.3979C41.2825 34.1914 41.2159 33.9869 41.0812 33.8295C40.9465 33.6721 40.7548 33.5746 40.5483 33.5585C40.3418 33.5425 40.1373 33.6091 39.9799 33.7438C39.8225 33.8784 39.725 34.0701 39.7089 34.2767L39.3316 39.1187C39.317 39.3144 39.3493 39.5107 39.4257 39.6914C39.5022 39.8721 39.6206 40.032 39.7711 40.1578C39.9217 40.2836 40.1 40.3718 40.2914 40.4149C40.4828 40.458 40.6818 40.4549 40.8717 40.4059L45.5907 39.1854C45.69 39.1597 45.7834 39.1148 45.8653 39.053C45.9473 38.9913 46.0163 38.914 46.0684 38.8256C46.1205 38.7372 46.1547 38.6394 46.169 38.5378C46.1833 38.4362 46.1774 38.3328 46.1517 38.2335C46.1261 38.1341 46.0811 38.0408 46.0194 37.9588C45.9576 37.8769 45.8804 37.8079 45.792 37.7558C45.7036 37.7037 45.6058 37.6695 45.5042 37.6552C45.4026 37.6409 45.2991 37.6467 45.1998 37.6724Z" fill="white"/>
        </svg>
      </div>
 
      {/* Text */}
      <div className="flex flex-col flex-grow items-center text-center">
        <h3 className="text-[28px] md:text-[30px] font-metropolis font-[700] leading-[1.15] mb-3">
          Flexibilität
        </h3>
        <p className="text-[20px] font-metropolis font-normal leading-[25.6px]">
          Plane deine Einsätze, wie es dir passt
        </p>
      </div>
    </div>
 
    {/* Card 2 */}
    <div className="relative overflow-hidden rounded-[28px] bg-[#EAF6FF] p-6 md:p-8 lg:p-10 flex flex-col h-full">
      {/* corner shapes */}
      <span className="pointer-events-none absolute top-0 right-0 w-[52px] h-[82px] bg-[#FAFCFF] rounded-bl-[40px]" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-[140px] h-[52px] bg-[#FAFCFF] rounded-tl-[34px]" />
 
      {/* Icon */}
      <div className="flex justify-center items-center w-[84px] h-[84px] rounded-full bg-[#04436F] mx-auto mb-[40px]">
        {/* SVG ICON (2) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M45.5916 7.5488C42.7311 4.46135 38.6972 2.69846 34.7861 2.83885C31.617 2.95134 28.2163 4.11181 25.0018 5.57761C21.1911 3.83827 17.9833 2.93709 15.2139 2.83885C11.2997 2.69922 7.26959 4.46135 4.40913 7.54842C1.75392 10.4138 0.456837 14.0758 0.85054 17.5947C1.25416 21.2014 3.50499 24.5902 5.49029 27.5804C5.8633 28.1425 6.22253 28.6879 6.56401 29.2225C5.29516 30.867 5.40007 32.7095 6.3128 33.8888C6.89725 34.6442 7.86014 35.1657 9.03897 35.1657C9.36042 35.1657 9.69919 35.1223 10.0494 35.0388C9.83505 36.0982 10.0918 37.1211 10.6771 37.8769C11.2677 38.6396 12.2351 39.1706 13.4094 39.1702C13.7842 39.1702 14.1807 39.1133 14.592 38.9954C14.466 39.9751 14.7389 40.9224 15.2795 41.6206C15.8716 42.3855 16.8337 42.9264 17.9805 42.9264C18.0837 42.9264 18.1928 42.9071 18.2988 42.8981C18.2536 43.8282 18.6151 44.7287 19.3622 45.3711C19.8605 45.7991 20.5861 46.1268 21.4261 46.1268C22.1464 46.1268 22.9514 45.8861 23.7708 45.2623C23.7759 45.2585 23.7822 45.253 23.7874 45.2491C24.2049 45.5874 24.4707 45.7919 24.8756 46.0947C25.8896 46.8543 26.8602 47.1664 27.7094 47.1664C28.7028 47.1664 29.5306 46.7391 30.0701 46.1005C30.6457 45.4184 30.9339 44.4575 30.7767 43.4426C31.155 43.543 31.5201 43.5902 31.8669 43.5902C33.0412 43.5902 34.0094 43.0592 34.5999 42.2966C35.1872 41.5377 35.4437 40.5098 35.2247 39.4459C35.5626 39.5237 35.8904 39.5647 36.203 39.5647C37.4177 39.5647 38.4187 39.0161 39.0283 38.2279C39.6485 37.4269 39.9128 36.3356 39.6602 35.2101C39.9415 35.2654 40.2187 35.2942 40.4887 35.2942C41.6866 35.2942 42.7472 34.7769 43.4438 33.972C44.4273 32.8343 44.747 30.9543 43.4774 29.1521C43.8054 28.6409 44.1534 28.1164 44.5097 27.5804C46.495 24.5902 48.7458 21.2014 49.1494 17.5947C49.5431 14.0758 48.2468 10.4142 45.5916 7.5488ZM7.54808 32.9324C6.90411 32.1003 7.04832 30.6213 8.56973 29.4039L9.82332 28.3945C11.7369 26.8517 14.9399 24.2694 16.5857 22.9895C17.8538 22.0048 18.9899 22.4584 19.5782 23.1466C20.1428 23.8059 20.3335 24.8267 19.4881 25.6222C18.3659 26.6792 13.8172 30.7122 11.9134 32.2572C11.8923 32.271 11.446 32.6288 11.392 32.6691C9.62189 33.9933 8.1867 33.7568 7.54808 32.9324ZM11.9124 36.9202C11.3214 36.1562 11.3315 34.8333 12.6595 33.6634C14.5428 32.1673 20.8061 26.5392 20.8463 26.5007C21.9824 25.4154 23.4984 25.6115 24.308 26.4275C25.1633 27.2912 24.9603 28.5398 23.7655 29.7675C22.6902 30.8727 18.3886 34.5291 16.3403 36.1684C16.3119 36.1857 15.7083 36.6654 15.6091 36.7397C13.9336 37.9952 12.5449 37.7362 11.9124 36.9202ZM16.5148 40.6638C15.9291 39.9073 15.884 38.6417 17.076 37.5774C18.3916 36.5325 21.0267 34.3273 22.9393 32.6457C22.9413 32.6439 22.944 32.6435 22.946 32.6417C24.2393 31.456 25.5738 31.5063 26.2231 32.1717C26.9296 32.8942 26.6717 34.1051 25.5669 35.2565C24.4224 36.4494 21.0782 39.7165 19.8589 40.6298C18.2841 41.8094 17.0733 41.3859 16.5148 40.6638ZM22.8232 44.0194C21.7947 44.8041 20.8867 44.6206 20.3816 44.1861C19.9778 43.8397 19.6652 43.1735 19.9949 42.3859C20.2592 42.2461 20.5262 42.0825 20.7959 41.8804C22.0755 40.9216 25.2737 37.7986 26.5276 36.5105C27.2176 36.3853 27.8195 36.7668 28.1023 37.2139C28.4952 37.8335 28.3747 38.5701 27.7735 39.2347C26.0621 41.1261 23.9799 43.1382 22.8232 44.0194ZM28.876 45.0926C28.232 45.8544 27.0295 45.7556 25.8118 44.8438C25.5075 44.6162 25.2782 44.4401 25.0048 44.2222C25.8202 43.4903 26.7638 42.5728 27.6983 41.6017C27.9025 41.7682 28.0645 41.8957 28.3341 42.1064C29.444 43.1724 29.4491 44.4135 28.876 45.0926ZM42.2619 32.9495C41.4737 33.8598 39.8653 34.1192 38.3119 32.8565C38.1778 32.7474 32.7076 28.1496 32.6818 28.1271C32.356 27.8451 31.8623 27.8787 31.58 28.2053C31.297 28.5311 31.3321 29.0247 31.6578 29.3074C31.6839 29.3302 34.1939 31.5065 36.8819 33.7062C38.4218 34.9698 38.4405 36.4355 37.7931 37.2715C37.1239 38.1356 35.6552 38.4152 33.885 37.0884C33.8305 37.0476 33.366 36.681 33.3352 36.6626C31.828 35.4668 29.5799 33.491 29.5543 33.4684C29.2315 33.1842 28.7386 33.2147 28.4518 33.539C28.1672 33.8628 28.1984 34.3569 28.5227 34.6419C28.6346 34.7402 31.1096 36.916 32.6384 38.1027C33.944 39.2676 33.9524 40.58 33.3639 41.3398C32.7337 42.1558 31.3443 42.4156 29.6664 41.159C29.6664 41.159 28.9388 40.5958 28.7695 40.459C28.8231 40.4004 28.8787 40.3416 28.9317 40.283C30.2173 38.8627 30.0289 37.3345 29.423 36.3781C29.0035 35.7164 28.3645 35.2636 27.6531 35.0547C28.536 33.454 28.2156 31.9741 27.3408 31.0795C26.8645 30.592 26.2102 30.2662 25.4673 30.1697C26.8604 28.2814 26.504 26.4241 25.4181 25.328C24.5183 24.4196 23.0412 23.9656 21.6188 24.3292C21.6015 23.5168 21.2796 22.7313 20.7654 22.1307C19.6842 20.8661 17.6142 20.2099 15.6274 21.7557C13.9694 23.044 10.7603 25.6321 8.84288 27.1779L7.69953 28.0983C7.40674 27.6458 7.10511 27.1872 6.79195 26.7159C4.90431 23.8734 2.76489 20.652 2.40399 17.4208C2.06064 14.3535 3.20895 11.1425 5.55515 8.6105C8.11193 5.85152 11.6949 4.27289 15.1589 4.40069C17.4295 4.48119 20.0556 5.16111 23.1446 6.46549C21.1886 7.44036 16.5514 10.022 16.031 10.2948C13.6131 11.5625 10.6031 13.14 9.31059 15.4923C8.58804 16.8069 8.85737 17.7313 9.2114 18.2753C9.98279 19.4625 11.8559 19.8662 13.3628 19.738C15.2543 19.5785 17.1458 18.8491 18.9746 18.1441C21.2346 17.2724 23.5717 16.3675 25.8057 16.6143C27.2348 16.7703 29.3117 18.5572 30.5523 19.6247L30.8437 19.8753C34.5015 23.0036 40.4628 28.3193 41.5363 29.3063C43.1294 30.7727 42.9227 32.1854 42.2619 32.9495ZM47.596 17.4208C47.2351 20.652 45.0957 23.8734 43.208 26.7159C42.9265 27.1397 42.6503 27.556 42.384 27.9649C40.8931 26.6095 35.337 21.6619 31.8593 18.6877L31.5716 18.4401C30.1036 17.1778 27.8864 15.2695 25.9751 15.0608C25.66 15.0265 25.3464 15.0105 25.0336 15.0105C22.7583 15.0105 20.5533 15.8604 18.4123 16.686C16.6063 17.3822 14.9003 18.0399 13.2316 18.1807C12.0719 18.2799 10.8564 17.9392 10.5215 17.4238C10.3452 17.153 10.3986 16.7562 10.6794 16.2446C11.7461 14.3055 14.5241 12.8489 16.7566 11.6785C17.2907 11.3989 18.4589 10.7618 18.4589 10.7618C23.0971 8.15805 29.4498 4.59182 34.841 4.40069C38.3157 4.27747 41.8896 5.8519 44.4456 8.61088C46.7918 11.1429 47.9401 14.3539 47.596 17.4208Z" fill="white"/>
        </svg>
      </div>
 
      {/* Text */}
      <div className="flex flex-col flex-grow items-center text-center">
        <h3 className="text-[28px] md:text-[30px] font-metropolis font-[700] leading-[1.15] mb-3">
          Fairer Verdienst
        </h3>
        <p className="text-[20px] md:text-[20px] leading-[25.6px] font-metropolis font-normal">
          Transparent und pünktlich
        </p>
      </div>
    </div>
 
    {/* Card 3 */}
    <div className="relative overflow-hidden rounded-[28px] bg-[#F2EEED] p-6 md:p-8 lg:p-10 flex flex-col h-full">
      {/* corner shapes */}
      <span className="pointer-events-none absolute top-0 right-0 w-[52px] h-[82px] bg-[#FAFCFF] rounded-bl-[40px]" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-[140px] h-[52px] bg-[#FAFCFF] rounded-tl-[34px]" />
 
      {/* Icon */}
      <div className="flex justify-center items-center w-[80px] h-[80px] bg-[#04436F] rounded-full mx-auto mb-[40px]">
        {/* SVG ICON (3) */}
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M47.9669 35.8903C47.8885 36.0797 47.7636 36.2464 47.6038 36.3747C46.8816 36.9551 45.3403 37.8111 44.1331 38.4021C44.1228 38.4071 44.1123 38.4121 44.1019 38.4168L28.2938 45.6067C25.5946 46.8203 23.6346 46.7799 22.0599 46.7478C21.7507 46.7414 21.4586 46.7355 21.1818 46.7397C20.5636 46.7492 20.0045 46.7372 19.4638 46.7254C16.8698 46.6692 15.1558 46.6323 11.768 49.3847C11.5417 49.5685 11.2695 49.658 10.9989 49.658C10.644 49.658 10.2921 49.504 10.0508 49.207C9.62571 48.6838 9.7052 47.9149 10.2284 47.4898C14.312 44.1722 16.7238 44.2244 19.5164 44.2846C20.035 44.2958 20.571 44.3074 21.144 44.2985C21.465 44.2937 21.7782 44.3001 22.1101 44.3068C23.5775 44.3371 25.095 44.3682 27.2878 43.3822L43.0753 36.2017C44.1255 35.6868 45.2107 35.0747 45.805 34.6687C45.8584 34.4376 45.863 34.169 45.6848 33.9875C45.3135 33.6094 43.9033 33.2768 40.9736 34.4286C37.8538 35.6551 33.7135 37.0009 31.3426 37.5591C31.3358 37.5606 31.329 37.5613 31.3222 37.5628C31.2025 37.7397 31.0666 37.9083 30.9129 38.0667C28.901 40.1409 24.5395 40.1331 20.6091 39.9632C20.2277 39.9467 19.8982 39.9324 19.639 39.9269C18.965 39.9126 18.4302 39.3545 18.4446 38.6805C18.4588 38.0064 19.0166 37.4691 19.6909 37.486C19.977 37.4921 20.3189 37.5068 20.7147 37.524C22.8179 37.6149 27.7433 37.828 29.1606 36.3668C29.4201 36.0992 29.5219 35.7908 29.4906 35.3667C29.437 34.6415 28.6634 34.2668 27.1911 34.253C23.5515 34.2189 20.3025 33.9482 16.2445 33.5223C11.0987 33.1765 6.9093 37.8139 3.84836 41.2002C3.60745 41.4668 3.27551 41.6023 2.94241 41.6023C2.65061 41.6023 2.35784 41.4983 2.12424 41.2872C1.62405 40.8352 1.58508 40.0632 2.03723 39.5631C3.96887 37.4261 5.88948 35.3743 8.14358 33.762C10.9304 31.7686 13.6427 30.8938 16.4346 31.0882C16.4489 31.0892 16.4631 31.0904 16.4774 31.0919C20.4743 31.5117 23.6646 31.7785 27.214 31.8117C30.8954 31.8462 31.7203 33.7974 31.892 34.8987C34.2138 34.2661 37.4995 33.171 40.0805 32.1564C44.6177 30.3727 46.6307 31.4663 47.4268 32.2769C48.3239 33.1903 48.5259 34.5412 47.9671 35.8901L47.9669 35.8903ZM10.3271 29.0483C10.5178 26.9314 11.4877 24.9709 13.0581 23.5278C13.7222 22.9176 14.4705 22.4243 15.2735 22.0554C14.5614 21.2299 14.1292 20.1564 14.1292 18.9834C14.1292 16.3861 16.2422 14.2731 18.8395 14.2731C21.4367 14.2731 23.5497 16.3861 23.5497 18.9834C23.5497 20.1565 23.1176 21.23 22.4055 22.0554C23.2084 22.4242 23.9568 22.9176 24.6208 23.5278C26.1912 24.9708 27.1612 26.9314 27.3519 29.0483C27.4123 29.7197 26.9171 30.3132 26.2456 30.3736C26.2084 30.377 26.1713 30.3786 26.1347 30.3786C25.51 30.3786 24.9775 29.9017 24.9203 29.2674C24.6353 26.1032 22.0211 23.7172 18.8394 23.7172C15.6576 23.7172 13.0436 26.1032 12.7585 29.2674C12.698 29.9389 12.1036 30.4335 11.4332 30.3736C10.7618 30.3131 10.2666 29.7197 10.3271 29.0483ZM16.5707 18.9834C16.5707 20.2345 17.5885 21.2521 18.8396 21.2521C20.0906 21.2521 21.1084 20.2344 21.1084 18.9834C21.1084 17.7324 20.0906 16.7146 18.8396 16.7146C17.5885 16.7146 16.5707 17.7323 16.5707 18.9834ZM36.5667 14.2731C39.164 14.2731 41.277 16.3861 41.277 18.9834C41.277 20.1565 40.8448 21.23 40.1328 22.0554C40.9358 22.4242 41.6841 22.9176 42.3482 23.5278C43.9187 24.9708 44.8885 26.9314 45.0792 29.0483C45.1397 29.7197 44.6444 30.3132 43.973 30.3736C43.3024 30.4341 42.7081 29.9388 42.6477 29.2674C42.3626 26.1032 39.7485 23.7172 36.5667 23.7172C33.385 23.7172 30.7709 26.1033 30.4858 29.2674C30.4286 29.9016 29.896 30.3786 29.2714 30.3786C29.2347 30.3786 29.1978 30.377 29.1605 30.3736C28.489 30.3131 27.9938 29.7197 28.0542 29.0483C28.245 26.9314 29.2149 24.9709 30.7853 23.5278C31.4493 22.9176 32.1977 22.4242 33.0006 22.0554C32.2885 21.2299 31.8565 20.1564 31.8565 18.9834C31.8565 16.3861 33.9695 14.2731 36.5667 14.2731ZM34.2979 18.9834C34.2979 20.2345 35.3156 21.2521 36.5667 21.2521C37.8178 21.2521 38.8356 20.2344 38.8356 18.9834C38.8356 17.7324 37.8178 16.7146 36.5667 16.7146C35.3156 16.7146 34.2979 17.7323 34.2979 18.9834ZM19.9927 12.2005C20.8673 10.3764 22.3587 8.95215 24.1424 8.13018C23.4272 7.30391 22.9929 6.22803 22.9929 5.05205C22.9929 2.45479 25.1059 0.341797 27.7031 0.341797C30.3004 0.341797 32.4133 2.45479 32.4133 5.05205C32.4133 6.22813 31.979 7.304 31.2638 8.13018C33.0475 8.95215 34.539 10.3764 35.4136 12.2005C35.705 12.8084 35.4486 13.5375 34.8406 13.829C34.6704 13.9105 34.4907 13.9492 34.3137 13.9492C33.8586 13.9492 33.422 13.6937 33.2121 13.256C32.2014 11.1479 30.039 9.78574 27.703 9.78574C25.3671 9.78574 23.2048 11.1479 22.1941 13.256C21.9027 13.8639 21.1735 14.1203 20.5655 13.8289C19.9576 13.5374 19.7011 12.8083 19.9926 12.2004L19.9927 12.2005ZM25.4343 5.05195C25.4343 6.30303 26.4521 7.3207 27.7031 7.3207C28.9542 7.3207 29.9719 6.30293 29.9719 5.05195C29.9719 3.80098 28.9541 2.78311 27.7031 2.78311C26.4522 2.78311 25.4343 3.80088 25.4343 5.05195Z" fill="white"/>
        </svg>
      </div>
 
      {/* Text */}
      <div className="flex flex-col flex-grow items-center text-center">
        <h3 className="text-[28px] md:text-[30px] font-metropolis font-[700] leading-[1.15] mb-3">
          Unterstützung
        </h3>
        <p className="text-[20px] text-[#04436F] font-metropolis font-normal leading-[25.6px]">
          Wir kümmern uns um die<br /> Organisation – du <br />konzentrierst dich auf die <br /> Betreuung
        </p>
      </div>
    </div>
  </div>
 
  {/* === Mobile layout === */}
  <div className="lg:hidden block lg:flex gap-6 mt-[32px] md:w-[730px] lg:max-w-[1280px] mb-[160px]">
    {/* Card 1 */}
    <div className="flex flex-row justify-center items-center bg-white rounded-[20px] bg-no-repeat px-2 gap-2 mt-[16px]">
      <div className="flex justify-center items-center mt-[40px] mb-[40px] w-[80px] h-[80px] bg-[#04436F] rounded-full">
        {/* SVG (1) */}
       <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M28.5378 31.4094C28.4012 31.4096 28.267 31.3739 28.1485 31.306C28.03 31.238 27.9314 31.1402 27.8626 31.0222L24.6605 25.5432C24.4395 25.1653 24.323 24.7355 24.3229 24.2977V16.0336C24.3229 15.8264 24.4052 15.6277 24.5518 15.4811C24.6983 15.3346 24.897 15.2523 25.1042 15.2523C25.3114 15.2523 25.5101 15.3346 25.6566 15.4811C25.8031 15.6277 25.8854 15.8264 25.8854 16.0336V24.2977C25.8854 24.4583 25.9282 24.6161 26.0094 24.7547L29.2115 30.2341C29.2808 30.3528 29.3175 30.4876 29.3181 30.625C29.3186 30.7624 29.2829 30.8975 29.2146 31.0167C29.1463 31.1359 29.0477 31.2349 28.9289 31.3039C28.8101 31.3729 28.6752 31.4092 28.5378 31.4094Z" fill="white"/>
          <path d="M38.1871 32.2197C39.4942 29.9489 40.1821 27.3748 40.1821 24.7547C40.1821 22.1347 39.4942 19.5605 38.1871 17.2898C38.1801 17.2647 38.1718 17.24 38.1622 17.2157C38.1423 17.1898 38.1206 17.1652 38.0973 17.1422C36.7901 14.9206 34.9382 13.0687 32.7166 11.7615C32.6992 11.7374 32.6771 11.7171 32.6518 11.7016C32.6264 11.6862 32.5981 11.676 32.5688 11.6716C30.2981 10.3646 27.7242 9.67678 25.1043 9.67676C22.4844 9.67674 19.9104 10.3646 17.6398 11.6715C17.6104 11.6759 17.5821 11.6861 17.5567 11.7016C17.5312 11.717 17.5091 11.7374 17.4917 11.7615C15.2697 13.0689 13.4177 14.9211 12.1104 17.1431C12.0875 17.1659 12.0661 17.1901 12.0464 17.2157C12.037 17.2395 12.0288 17.2638 12.022 17.2885C10.7144 19.5595 10.0262 22.1341 10.0262 24.7547C10.0262 27.3753 10.7144 29.9499 12.022 32.221C12.0288 32.2456 12.037 32.2699 12.0464 32.2937C12.0733 32.3365 12.1043 32.3765 12.1389 32.4132C13.4445 34.6146 15.2859 36.4498 17.4917 37.748C17.5147 37.7712 17.5393 37.7929 17.5652 37.8128C17.5983 37.8294 17.6327 37.8436 17.6679 37.8551C19.932 39.151 22.4954 39.8327 25.1042 39.8327C27.7129 39.8327 30.2763 39.151 32.5404 37.8551C32.5756 37.8436 32.61 37.8294 32.6431 37.8128C32.6691 37.7929 32.6936 37.7712 32.7166 37.748C34.9216 36.4503 36.7625 34.6159 38.068 32.4155C38.1034 32.3782 38.135 32.3374 38.1622 32.2937C38.1718 32.2695 38.1801 32.2448 38.1871 32.2197ZM32.522 36.04L31.6639 34.5535C31.6126 34.4647 31.5443 34.3868 31.4629 34.3243C31.3815 34.2618 31.2886 34.216 31.1895 34.1894C31.0904 34.1629 30.987 34.1561 30.8853 34.1695C30.7835 34.1829 30.6854 34.2161 30.5966 34.2674C30.5077 34.3187 30.4298 34.387 30.3673 34.4684C30.3048 34.5498 30.259 34.6428 30.2324 34.7419C30.2059 34.841 30.1991 34.9444 30.2125 35.0461C30.2259 35.1478 30.2592 35.2459 30.3104 35.3348L31.1663 36.8174C29.5218 37.6463 27.7241 38.1274 25.8854 38.2307V36.5208C25.8854 36.3136 25.8031 36.1149 25.6566 35.9684C25.5101 35.8219 25.3114 35.7396 25.1042 35.7396C24.897 35.7396 24.6982 35.8219 24.5517 35.9684C24.4052 36.1149 24.3229 36.3136 24.3229 36.5208V38.2307C22.4842 38.1274 20.6865 37.6463 19.042 36.8174L19.8979 35.3348C19.9492 35.2459 19.9826 35.1478 19.996 35.046C20.0094 34.9443 20.0027 34.8409 19.9761 34.7417C19.9496 34.6426 19.9037 34.5496 19.8413 34.4682C19.7788 34.3867 19.7009 34.3184 19.612 34.2671C19.5231 34.2158 19.4249 34.1825 19.3231 34.1691C19.2214 34.1557 19.118 34.1625 19.0188 34.1891C18.9197 34.2157 18.8268 34.2616 18.7454 34.3241C18.664 34.3867 18.5957 34.4646 18.5444 34.5535L17.6863 36.04C16.1489 35.0258 14.8332 33.7101 13.8189 32.1727L15.3053 31.3145C15.4847 31.2108 15.6156 31.0402 15.6692 30.8401C15.7227 30.64 15.6947 30.4268 15.5911 30.2473C15.4875 30.0679 15.317 29.937 15.1169 29.8833C14.9168 29.8296 14.7036 29.8576 14.5241 29.961L13.0416 30.817C12.2126 29.1725 11.7315 27.3747 11.6283 25.536H13.3385C13.5457 25.536 13.7444 25.4537 13.8909 25.3072C14.0374 25.1606 14.1197 24.9619 14.1197 24.7547C14.1197 24.5475 14.0374 24.3488 13.8909 24.2023C13.7444 24.0558 13.5457 23.9735 13.3385 23.9735H11.6283C11.7315 22.1347 12.2126 20.337 13.0415 18.6925L14.5241 19.5485C14.7036 19.6519 14.9168 19.6799 15.1169 19.6262C15.317 19.5725 15.4875 19.4416 15.5911 19.2622C15.6947 19.0827 15.7227 18.8695 15.6692 18.6694C15.6156 18.4693 15.4847 18.2987 15.3053 18.195L13.8189 17.3367C14.8332 15.7993 16.1489 14.4836 17.6863 13.4694L18.5444 14.9559C18.5957 15.0448 18.664 15.1228 18.7454 15.1853C18.8268 15.2478 18.9197 15.2937 19.0188 15.3203C19.118 15.3469 19.2214 15.3537 19.3231 15.3403C19.4249 15.3269 19.5231 15.2936 19.612 15.2423C19.7009 15.191 19.7788 15.1227 19.8413 15.0413C19.9037 14.9598 19.9496 14.8669 19.9761 14.7677C20.0027 14.6686 20.0094 14.5652 19.996 14.4634C19.9826 14.3616 19.9492 14.2635 19.8979 14.1746L19.042 12.6921C20.6865 11.8631 22.4842 11.382 24.3229 11.2788V12.9891C24.3229 13.1963 24.4052 13.395 24.5517 13.5415C24.6982 13.688 24.897 13.7703 25.1042 13.7703C25.3114 13.7703 25.5101 13.688 25.6566 13.5415C25.8031 13.395 25.8854 13.1963 25.8854 12.9891V11.2788C27.7241 11.3821 29.5218 11.8632 31.1663 12.6921L30.3104 14.1747C30.2069 14.3542 30.1788 14.5675 30.2324 14.7676C30.2861 14.9678 30.4171 15.1385 30.5966 15.2421C30.776 15.3457 30.9893 15.3737 31.1895 15.3201C31.3897 15.2664 31.5603 15.1354 31.6639 14.9559L32.522 13.4695C34.0595 14.4837 35.3752 15.7994 36.3895 17.3369L34.903 18.195C34.7236 18.2987 34.5927 18.4693 34.5392 18.6694C34.4856 18.8695 34.5136 19.0827 34.6172 19.2622C34.7208 19.4416 34.8914 19.5725 35.0914 19.6262C35.2915 19.6799 35.5047 19.6519 35.6842 19.5485L37.1668 18.6926C37.9958 20.3371 38.4769 22.1348 38.5801 23.9735H36.8702C36.663 23.9735 36.4643 24.0558 36.3178 24.2023C36.1713 24.3489 36.089 24.5476 36.089 24.7548C36.089 24.962 36.1713 25.1607 36.3178 25.3072C36.4643 25.4537 36.663 25.536 36.8702 25.536H38.5801C38.4769 27.3747 37.9958 29.1724 37.1668 30.8169L35.6842 29.961C35.5047 29.8576 35.2915 29.8296 35.0914 29.8833C34.8914 29.937 34.7208 30.0679 34.6172 30.2473C34.5136 30.4268 34.4856 30.64 34.5392 30.8401C34.5927 31.0402 34.7236 31.2108 34.903 31.3145L36.3895 32.1726C35.3752 33.7101 34.0595 35.0258 32.522 36.04Z" fill="white"/>
          <path d="M45.1998 37.6724L42.2544 38.4342C45.275 34.5459 46.8934 29.7512 46.8471 24.8277C46.8007 19.9042 45.0923 15.1407 41.999 11.31C38.9057 7.47933 34.6089 4.80604 29.8056 3.7238C25.0023 2.64155 19.9742 3.21384 15.537 5.34782C11.0998 7.48181 7.51364 11.0523 5.3603 15.4802C3.20696 19.9081 2.61273 24.9336 3.67398 29.7416C4.73524 34.5495 7.38974 38.858 11.2069 41.968C15.0241 45.078 19.78 46.8072 24.7032 46.875H24.7139C24.9211 46.8763 25.1204 46.7953 25.2678 46.6497C25.4152 46.5041 25.4988 46.3059 25.5001 46.0987C25.5014 45.8915 25.4204 45.6923 25.2748 45.5448C25.1292 45.3974 24.931 45.3138 24.7238 45.3125C20.1428 45.2534 15.7162 43.6479 12.1623 40.7566C8.60844 37.8653 6.13593 33.8579 5.14601 29.3847C4.1561 24.9115 4.70687 20.2351 6.70896 16.1142C8.71104 11.9934 12.0469 8.6701 16.1753 6.68359C20.3036 4.69707 24.9821 4.16396 29.4516 5.17076C33.921 6.17755 37.919 8.66518 40.7969 12.2299C43.6748 15.7947 45.2635 20.2273 45.3053 24.8086C45.3472 29.3898 43.8396 33.8507 41.0274 37.4675L41.2664 34.3979C41.2825 34.1914 41.2159 33.9869 41.0812 33.8295C40.9465 33.6721 40.7548 33.5746 40.5483 33.5585C40.3418 33.5425 40.1373 33.6091 39.9799 33.7438C39.8225 33.8784 39.725 34.0701 39.7089 34.2767L39.3316 39.1187C39.317 39.3144 39.3493 39.5107 39.4257 39.6914C39.5022 39.8721 39.6206 40.032 39.7711 40.1578C39.9217 40.2836 40.1 40.3718 40.2914 40.4149C40.4828 40.458 40.6818 40.4549 40.8717 40.4059L45.5907 39.1854C45.69 39.1597 45.7834 39.1148 45.8653 39.053C45.9473 38.9913 46.0163 38.914 46.0684 38.8256C46.1205 38.7372 46.1547 38.6394 46.169 38.5378C46.1833 38.4362 46.1774 38.3328 46.1517 38.2335C46.1261 38.1341 46.0811 38.0408 46.0194 37.9588C45.9576 37.8769 45.8804 37.8079 45.792 37.7558C45.7036 37.7037 45.6058 37.6695 45.5042 37.6552C45.4026 37.6409 45.2991 37.6467 45.1998 37.6724Z" fill="white"/>
        </svg>      </div>
      <div className="flex flex-col w-[230px]">
        <h3 className="text-[28px] text-[#04436F] font-metropolis font-[600] leading-[33.6px] mb-2">
          Flexibilität
        </h3>
        <p className="text-[16px] text-[#04436F] font-metropolis font-normal leading-[16px]">
          Plane deine Einsätze,<br /> wie es dir passt
        </p>
      </div>
    </div>
 
    {/* Card 2 */}
    <div className="flex flex-row justify-center items-center bg-[#E7F5FF] rounded-[20px] bg-no-repeat px-2 gap-2 mt-[16px]">
      <div className="flex justify-center items-center mt-[40px] mb-[40px] w-[80px] h-[80px] bg-[#04436F] rounded-full">
        {/* SVG (2) */}
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M45.5916 7.5488C42.7311 4.46135 38.6972 2.69846 34.7861 2.83885C31.617 2.95134 28.2163 4.11181 25.0018 5.57761C21.1911 3.83827 17.9833 2.93709 15.2139 2.83885C11.2997 2.69922 7.26959 4.46135 4.40913 7.54842C1.75392 10.4138 0.456837 14.0758 0.85054 17.5947C1.25416 21.2014 3.50499 24.5902 5.49029 27.5804C5.8633 28.1425 6.22253 28.6879 6.56401 29.2225C5.29516 30.867 5.40007 32.7095 6.3128 33.8888C6.89725 34.6442 7.86014 35.1657 9.03897 35.1657C9.36042 35.1657 9.69919 35.1223 10.0494 35.0388C9.83505 36.0982 10.0918 37.1211 10.6771 37.8769C11.2677 38.6396 12.2351 39.1706 13.4094 39.1702C13.7842 39.1702 14.1807 39.1133 14.592 38.9954C14.466 39.9751 14.7389 40.9224 15.2795 41.6206C15.8716 42.3855 16.8337 42.9264 17.9805 42.9264C18.0837 42.9264 18.1928 42.9071 18.2988 42.8981C18.2536 43.8282 18.6151 44.7287 19.3622 45.3711C19.8605 45.7991 20.5861 46.1268 21.4261 46.1268C22.1464 46.1268 22.9514 45.8861 23.7708 45.2623C23.7759 45.2585 23.7822 45.253 23.7874 45.2491C24.2049 45.5874 24.4707 45.7919 24.8756 46.0947C25.8896 46.8543 26.8602 47.1664 27.7094 47.1664C28.7028 47.1664 29.5306 46.7391 30.0701 46.1005C30.6457 45.4184 30.9339 44.4575 30.7767 43.4426C31.155 43.543 31.5201 43.5902 31.8669 43.5902C33.0412 43.5902 34.0094 43.0592 34.5999 42.2966C35.1872 41.5377 35.4437 40.5098 35.2247 39.4459C35.5626 39.5237 35.8904 39.5647 36.203 39.5647C37.4177 39.5647 38.4187 39.0161 39.0283 38.2279C39.6485 37.4269 39.9128 36.3356 39.6602 35.2101C39.9415 35.2654 40.2187 35.2942 40.4887 35.2942C41.6866 35.2942 42.7472 34.7769 43.4438 33.972C44.4273 32.8343 44.747 30.9543 43.4774 29.1521C43.8054 28.6409 44.1534 28.1164 44.5097 27.5804C46.495 24.5902 48.7458 21.2014 49.1494 17.5947C49.5431 14.0758 48.2468 10.4142 45.5916 7.5488ZM7.54808 32.9324C6.90411 32.1003 7.04832 30.6213 8.56973 29.4039L9.82332 28.3945C11.7369 26.8517 14.9399 24.2694 16.5857 22.9895C17.8538 22.0048 18.9899 22.4584 19.5782 23.1466C20.1428 23.8059 20.3335 24.8267 19.4881 25.6222C18.3659 26.6792 13.8172 30.7122 11.9134 32.2572C11.8923 32.271 11.446 32.6288 11.392 32.6691C9.62189 33.9933 8.1867 33.7568 7.54808 32.9324ZM11.9124 36.9202C11.3214 36.1562 11.3315 34.8333 12.6595 33.6634C14.5428 32.1673 20.8061 26.5392 20.8463 26.5007C21.9824 25.4154 23.4984 25.6115 24.308 26.4275C25.1633 27.2912 24.9603 28.5398 23.7655 29.7675C22.6902 30.8727 18.3886 34.5291 16.3403 36.1684C16.3119 36.1857 15.7083 36.6654 15.6091 36.7397C13.9336 37.9952 12.5449 37.7362 11.9124 36.9202ZM16.5148 40.6638C15.9291 39.9073 15.884 38.6417 17.076 37.5774C18.3916 36.5325 21.0267 34.3273 22.9393 32.6457C22.9413 32.6439 22.944 32.6435 22.946 32.6417C24.2393 31.456 25.5738 31.5063 26.2231 32.1717C26.9296 32.8942 26.6717 34.1051 25.5669 35.2565C24.4224 36.4494 21.0782 39.7165 19.8589 40.6298C18.2841 41.8094 17.0733 41.3859 16.5148 40.6638ZM22.8232 44.0194C21.7947 44.8041 20.8867 44.6206 20.3816 44.1861C19.9778 43.8397 19.6652 43.1735 19.9949 42.3859C20.2592 42.2461 20.5262 42.0825 20.7959 41.8804C22.0755 40.9216 25.2737 37.7986 26.5276 36.5105C27.2176 36.3853 27.8195 36.7668 28.1023 37.2139C28.4952 37.8335 28.3747 38.5701 27.7735 39.2347C26.0621 41.1261 23.9799 43.1382 22.8232 44.0194ZM28.876 45.0926C28.232 45.8544 27.0295 45.7556 25.8118 44.8438C25.5075 44.6162 25.2782 44.4401 25.0048 44.2222C25.8202 43.4903 26.7638 42.5728 27.6983 41.6017C27.9025 41.7682 28.0645 41.8957 28.3341 42.1064C29.444 43.1724 29.4491 44.4135 28.876 45.0926ZM42.2619 32.9495C41.4737 33.8598 39.8653 34.1192 38.3119 32.8565C38.1778 32.7474 32.7076 28.1496 32.6818 28.1271C32.356 27.8451 31.8623 27.8787 31.58 28.2053C31.297 28.5311 31.3321 29.0247 31.6578 29.3074C31.6839 29.3302 34.1939 31.5065 36.8819 33.7062C38.4218 34.9698 38.4405 36.4355 37.7931 37.2715C37.1239 38.1356 35.6552 38.4152 33.885 37.0884C33.8305 37.0476 33.366 36.681 33.3352 36.6626C31.828 35.4668 29.5799 33.491 29.5543 33.4684C29.2315 33.1842 28.7386 33.2147 28.4518 33.539C28.1672 33.8628 28.1984 34.3569 28.5227 34.6419C28.6346 34.7402 31.1096 36.916 32.6384 38.1027C33.944 39.2676 33.9524 40.58 33.3639 41.3398C32.7337 42.1558 31.3443 42.4156 29.6664 41.159C29.6664 41.159 28.9388 40.5958 28.7695 40.459C28.8231 40.4004 28.8787 40.3416 28.9317 40.283C30.2173 38.8627 30.0289 37.3345 29.423 36.3781C29.0035 35.7164 28.3645 35.2636 27.6531 35.0547C28.536 33.454 28.2156 31.9741 27.3408 31.0795C26.8645 30.592 26.2102 30.2662 25.4673 30.1697C26.8604 28.2814 26.504 26.4241 25.4181 25.328C24.5183 24.4196 23.0412 23.9656 21.6188 24.3292C21.6015 23.5168 21.2796 22.7313 20.7654 22.1307C19.6842 20.8661 17.6142 20.2099 15.6274 21.7557C13.9694 23.044 10.7603 25.6321 8.84288 27.1779L7.69953 28.0983C7.40674 27.6458 7.10511 27.1872 6.79195 26.7159C4.90431 23.8734 2.76489 20.652 2.40399 17.4208C2.06064 14.3535 3.20895 11.1425 5.55515 8.6105C8.11193 5.85152 11.6949 4.27289 15.1589 4.40069C17.4295 4.48119 20.0556 5.16111 23.1446 6.46549C21.1886 7.44036 16.5514 10.022 16.031 10.2948C13.6131 11.5625 10.6031 13.14 9.31059 15.4923C8.58804 16.8069 8.85737 17.7313 9.2114 18.2753C9.98279 19.4625 11.8559 19.8662 13.3628 19.738C15.2543 19.5785 17.1458 18.8491 18.9746 18.1441C21.2346 17.2724 23.5717 16.3675 25.8057 16.6143C27.2348 16.7703 29.3117 18.5572 30.5523 19.6247L30.8437 19.8753C34.5015 23.0036 40.4628 28.3193 41.5363 29.3063C43.1294 30.7727 42.9227 32.1854 42.2619 32.9495ZM47.596 17.4208C47.2351 20.652 45.0957 23.8734 43.208 26.7159C42.9265 27.1397 42.6503 27.556 42.384 27.9649C40.8931 26.6095 35.337 21.6619 31.8593 18.6877L31.5716 18.4401C30.1036 17.1778 27.8864 15.2695 25.9751 15.0608C25.66 15.0265 25.3464 15.0105 25.0336 15.0105C22.7583 15.0105 20.5533 15.8604 18.4123 16.686C16.6063 17.3822 14.9003 18.0399 13.2316 18.1807C12.0719 18.2799 10.8564 17.9392 10.5215 17.4238C10.3452 17.153 10.3986 16.7562 10.6794 16.2446C11.7461 14.3055 14.5241 12.8489 16.7566 11.6785C17.2907 11.3989 18.4589 10.7618 18.4589 10.7618C23.0971 8.15805 29.4498 4.59182 34.841 4.40069C38.3157 4.27747 41.8896 5.8519 44.4456 8.61088C46.7918 11.1429 47.9401 14.3539 47.596 17.4208Z" fill="white"/>
        </svg>      </div>
      <div className="flex flex-col w-[230px]">
        <h3 className="text-[28px] text-[#04436F] font-metropolis font-[600] leading-[33.6px] mb-2">
          Fairer Verdienst
        </h3>
        <p className="text-[16px] text-[#04436F] font-metropolis font-normal leading-[18px]">
          Transparent und pünktlich
        </p>
      </div>
    </div>
 
    {/* Card 3 */}
    <div className="flex flex-row justify-center items-center bg-[#F6F6F6] rounded-[20px] bg-no-repeat px-2 gap-2 mt-[16px]">
      <div className="flex justify-center items-center mt-[40px] mb-[40px] w-[80px] h-[80px] bg-[#04436F] rounded-full">
        {/* SVG (3) */}
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
          <path d="M47.9669 35.8903C47.8885 36.0797 47.7636 36.2464 47.6038 36.3747C46.8816 36.9551 45.3403 37.8111 44.1331 38.4021C44.1228 38.4071 44.1123 38.4121 44.1019 38.4168L28.2938 45.6067C25.5946 46.8203 23.6346 46.7799 22.0599 46.7478C21.7507 46.7414 21.4586 46.7355 21.1818 46.7397C20.5636 46.7492 20.0045 46.7372 19.4638 46.7254C16.8698 46.6692 15.1558 46.6323 11.768 49.3847C11.5417 49.5685 11.2695 49.658 10.9989 49.658C10.644 49.658 10.2921 49.504 10.0508 49.207C9.62571 48.6838 9.7052 47.9149 10.2284 47.4898C14.312 44.1722 16.7238 44.2244 19.5164 44.2846C20.035 44.2958 20.571 44.3074 21.144 44.2985C21.465 44.2937 21.7782 44.3001 22.1101 44.3068C23.5775 44.3371 25.095 44.3682 27.2878 43.3822L43.0753 36.2017C44.1255 35.6868 45.2107 35.0747 45.805 34.6687C45.8584 34.4376 45.863 34.169 45.6848 33.9875C45.3135 33.6094 43.9033 33.2768 40.9736 34.4286C37.8538 35.6551 33.7135 37.0009 31.3426 37.5591C31.3358 37.5606 31.329 37.5613 31.3222 37.5628C31.2025 37.7397 31.0666 37.9083 30.9129 38.0667C28.901 40.1409 24.5395 40.1331 20.6091 39.9632C20.2277 39.9467 19.8982 39.9324 19.639 39.9269C18.965 39.9126 18.4302 39.3545 18.4446 38.6805C18.4588 38.0064 19.0166 37.4691 19.6909 37.486C19.977 37.4921 20.3189 37.5068 20.7147 37.524C22.8179 37.6149 27.7433 37.828 29.1606 36.3668C29.4201 36.0992 29.5219 35.7908 29.4906 35.3667C29.437 34.6415 28.6634 34.2668 27.1911 34.253C23.5515 34.2189 20.3025 33.9482 16.2445 33.5223C11.0987 33.1765 6.9093 37.8139 3.84836 41.2002C3.60745 41.4668 3.27551 41.6023 2.94241 41.6023C2.65061 41.6023 2.35784 41.4983 2.12424 41.2872C1.62405 40.8352 1.58508 40.0632 2.03723 39.5631C3.96887 37.4261 5.88948 35.3743 8.14358 33.762C10.9304 31.7686 13.6427 30.8938 16.4346 31.0882C16.4489 31.0892 16.4631 31.0904 16.4774 31.0919C20.4743 31.5117 23.6646 31.7785 27.214 31.8117C30.8954 31.8462 31.7203 33.7974 31.892 34.8987C34.2138 34.2661 37.4995 33.171 40.0805 32.1564C44.6177 30.3727 46.6307 31.4663 47.4268 32.2769C48.3239 33.1903 48.5259 34.5412 47.9671 35.8901L47.9669 35.8903ZM10.3271 29.0483C10.5178 26.9314 11.4877 24.9709 13.0581 23.5278C13.7222 22.9176 14.4705 22.4243 15.2735 22.0554C14.5614 21.2299 14.1292 20.1564 14.1292 18.9834C14.1292 16.3861 16.2422 14.2731 18.8395 14.2731C21.4367 14.2731 23.5497 16.3861 23.5497 18.9834C23.5497 20.1565 23.1176 21.23 22.4055 22.0554C23.2084 22.4242 23.9568 22.9176 24.6208 23.5278C26.1912 24.9708 27.1612 26.9314 27.3519 29.0483C27.4123 29.7197 26.9171 30.3132 26.2456 30.3736C26.2084 30.377 26.1713 30.3786 26.1347 30.3786C25.51 30.3786 24.9775 29.9017 24.9203 29.2674C24.6353 26.1032 22.0211 23.7172 18.8394 23.7172C15.6576 23.7172 13.0436 26.1032 12.7585 29.2674C12.698 29.9389 12.1036 30.4335 11.4332 30.3736C10.7618 30.3131 10.2666 29.7197 10.3271 29.0483ZM16.5707 18.9834C16.5707 20.2345 17.5885 21.2521 18.8396 21.2521C20.0906 21.2521 21.1084 20.2344 21.1084 18.9834C21.1084 17.7324 20.0906 16.7146 18.8396 16.7146C17.5885 16.7146 16.5707 17.7323 16.5707 18.9834ZM36.5667 14.2731C39.164 14.2731 41.277 16.3861 41.277 18.9834C41.277 20.1565 40.8448 21.23 40.1328 22.0554C40.9358 22.4242 41.6841 22.9176 42.3482 23.5278C43.9187 24.9708 44.8885 26.9314 45.0792 29.0483C45.1397 29.7197 44.6444 30.3132 43.973 30.3736C43.3024 30.4341 42.7081 29.9388 42.6477 29.2674C42.3626 26.1032 39.7485 23.7172 36.5667 23.7172C33.385 23.7172 30.7709 26.1033 30.4858 29.2674C30.4286 29.9016 29.896 30.3786 29.2714 30.3786C29.2347 30.3786 29.1978 30.377 29.1605 30.3736C28.489 30.3131 27.9938 29.7197 28.0542 29.0483C28.245 26.9314 29.2149 24.9709 30.7853 23.5278C31.4493 22.9176 32.1977 22.4242 33.0006 22.0554C32.2885 21.2299 31.8565 20.1564 31.8565 18.9834C31.8565 16.3861 33.9695 14.2731 36.5667 14.2731ZM34.2979 18.9834C34.2979 20.2345 35.3156 21.2521 36.5667 21.2521C37.8178 21.2521 38.8356 20.2344 38.8356 18.9834C38.8356 17.7324 37.8178 16.7146 36.5667 16.7146C35.3156 16.7146 34.2979 17.7323 34.2979 18.9834ZM19.9927 12.2005C20.8673 10.3764 22.3587 8.95215 24.1424 8.13018C23.4272 7.30391 22.9929 6.22803 22.9929 5.05205C22.9929 2.45479 25.1059 0.341797 27.7031 0.341797C30.3004 0.341797 32.4133 2.45479 32.4133 5.05205C32.4133 6.22813 31.979 7.304 31.2638 8.13018C33.0475 8.95215 34.539 10.3764 35.4136 12.2005C35.705 12.8084 35.4486 13.5375 34.8406 13.829C34.6704 13.9105 34.4907 13.9492 34.3137 13.9492C33.8586 13.9492 33.422 13.6937 33.2121 13.256C32.2014 11.1479 30.039 9.78574 27.703 9.78574C25.3671 9.78574 23.2048 11.1479 22.1941 13.256C21.9027 13.8639 21.1735 14.1203 20.5655 13.8289C19.9576 13.5374 19.7011 12.8083 19.9926 12.2004L19.9927 12.2005ZM25.4343 5.05195C25.4343 6.30303 26.4521 7.3207 27.7031 7.3207C28.9542 7.3207 29.9719 6.30293 29.9719 5.05195C29.9719 3.80098 28.9541 2.78311 27.7031 2.78311C26.4522 2.78311 25.4343 3.80088 25.4343 5.05195Z" fill="white"/>
        </svg>      </div>
      <div className="flex flex-col w-[230px]">
        <h3 className="text-[28px] text-[#04436F] font-metropolis font-[600] leading-[33.6px] mb-2">
          Unterstützung
        </h3>
        <p className="text-[16px] text-[#04436F] font-metropolis font-normal leading-[18px]">
          Wir kümmern uns um die Organisation – du konzentrierst dich auf die Betreuung
        </p>
      </div>
    </div>
  </div>
</section>

                    <section className="lg:block hidden lg:flex justify-center items-center gap-16 lg:mt-[160px]">
                    {/* Left Image */}
                    <div
                    className="w-[309.83px] h-[629px] flex-shrink-0 rounded-[20px]"
                    style={{
                        background: "url('/images/phc-image.png') lightgray 50% / cover no-repeat",
                    }}
                    >
                    </div>


                    {/* Right Content */}
                    <div className="flex flex-col gap-[30px] max-w-[600px]">
                        {/* Title */}
                        <h2 className="text-[#04436F] font-metropolis md:mb-[-30px] text-[55px] font-semibold leading-[61.5px]">
                        Wen suchen wir?
                    </h2>
                        {/* Subtitle */}
                        <p className="text-[#04436F] font-metropolis text-[24px] font-normal leading-[40px] w-[697px]">
                        Wir suchen engagierte Menschen, die Betreuung mit Leidenschaft und Herz leisten möchten. 
                    </p>

                        {/* Points */}
                        <ul className="flex flex-col gap-[30px]">
                        {/* Point 1 */}
                        <li className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className="flex items-center gap-4">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "15px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
  <g clip-path="url(#clip0_479_1154)">
    <path d="M11.3854 20.2538C11.3618 20.7647 10.9283 21.1598 10.4172 21.1361C9.9063 21.1124 9.51118 20.679 9.53491 20.1679C9.55864 19.6569 9.99204 19.2619 10.5031 19.2856C11.014 19.3093 11.409 19.7428 11.3854 20.2538ZM48.351 35.6648L45.5715 36.7423C45.3178 36.8407 45.0566 36.8873 44.7996 36.8873C43.9404 36.8873 43.1281 36.3669 42.7994 35.519L42.5569 34.8936L40.2948 35.8375C40.4039 36.4783 40.299 37.1444 39.9808 37.723C39.6034 38.4093 38.9782 38.9068 38.2206 39.1236C38.1894 39.1326 38.1581 39.141 38.1267 39.1489C38.3742 39.8945 38.3247 40.7341 37.9207 41.4686C37.3245 42.5528 36.1354 43.1087 34.9764 42.9549C35.0111 43.4885 34.9003 44.0361 34.6258 44.5351C34.2495 45.2195 33.6266 45.716 32.8722 45.9331C32.4006 46.0688 31.9149 46.0843 31.4511 45.9836C31.4662 46.4865 31.352 46.9985 31.0937 47.4682C30.7172 48.1527 30.0677 48.6668 29.3121 48.8786C29.051 48.9518 28.7864 48.9879 28.5243 48.9879C28.0334 48.9879 27.5511 48.861 27.1173 48.6118L26.3511 48.1717C25.9711 48.7066 25.4273 49.0998 24.7862 49.294C24.4987 49.3811 24.205 49.4243 23.9133 49.4243C23.4301 49.4243 22.9521 49.3057 22.5154 49.0721C21.8673 48.7255 21.3891 48.1663 21.1385 47.5135C20.3292 47.8577 19.38 47.8419 18.5602 47.4035C17.9796 47.0929 17.5331 46.6057 17.2664 46.0329C16.4134 46.4947 15.3537 46.5344 14.4387 46.0451C13.2946 45.4331 12.7116 44.1767 12.8975 42.9616C12.3943 42.9731 11.8885 42.8587 11.4274 42.612C10.7271 42.2375 10.2139 41.6104 9.98237 40.8463C9.75083 40.0823 9.82964 39.2758 10.2041 38.5756L10.9522 37.1769C10.785 36.7794 10.7026 36.3449 10.6236 35.9202C10.4803 35.1498 10.3688 34.6725 10.0282 34.5403C9.89409 34.4883 9.57612 34.356 8.4104 33.8364L8.10991 34.5163C7.87915 35.0383 7.45757 35.4399 6.9229 35.6468C6.67085 35.7444 6.40815 35.793 6.14634 35.793C5.85268 35.793 5.56001 35.7319 5.28403 35.6099L2.55747 34.4048C1.477 33.9271 0.986375 32.6594 1.46391 31.579L7.72358 17.4153C7.95434 16.8932 8.37602 16.4918 8.91069 16.2848C9.44565 16.0779 10.0277 16.0911 10.5496 16.3218L13.276 17.5269C13.7981 17.7577 14.1997 18.1793 14.4065 18.7139C14.6134 19.2487 14.6002 19.8307 14.3696 20.3528L13.9 21.4151L15.6748 22.2339C15.6937 22.2426 15.7124 22.2521 15.7305 22.2624C16.2541 22.557 16.7905 22.6235 17.3743 22.5763C15.48 20.3317 14.4509 17.5043 14.4509 14.4697V6.16725C14.4509 5.85475 14.6372 5.57233 14.9245 5.44918L25.1921 1.04879C25.3886 0.964612 25.6112 0.964612 25.8077 1.04879L36.0754 5.44918C36.3626 5.57223 36.549 5.85475 36.549 6.16725V14.4697C36.549 17.5849 35.463 20.4851 33.4693 22.758C34.5847 23.1848 35.3593 23.383 36.0805 23.0078L37.628 22.1795L37.2021 21.0807C36.775 19.9793 37.3238 18.7356 38.4253 18.3086L41.2047 17.231C42.3058 16.8041 43.5499 17.3527 43.977 18.4543L49.5743 32.8925C50.0013 33.9941 49.4525 35.2377 48.351 35.6648ZM16.0135 14.4696C16.0135 17.4381 17.1341 20.1782 19.1768 22.2321C19.6234 22.128 20.0964 22.0223 20.5952 21.9503C18.4574 20.114 17.1854 17.4581 17.1854 14.4696V7.97028C17.1854 7.65778 17.3716 7.37526 17.6589 7.25221L25.1922 4.02369C25.3887 3.93951 25.6113 3.93951 25.8078 4.02369L33.3412 7.25221C33.6284 7.37535 33.8147 7.65778 33.8147 7.97028V14.4696C33.8147 17.3216 32.6418 19.9283 30.5971 21.7793C31.0541 21.8772 31.4881 22.0094 31.9001 22.1542C33.8937 20.1092 34.9866 17.3992 34.9866 14.4697V6.68239L25.5 2.61686L16.0135 6.68239V14.4696ZM28.0862 21.6858C30.7349 20.151 32.252 17.5281 32.252 14.4696V8.48551L25.5 5.59176L18.7479 8.48541V14.4696C18.7479 18.4213 21.4044 21.6869 25.388 22.6807C26.3502 22.1173 27.2483 21.8136 28.0862 21.6858ZM12.9405 19.7211C13.0026 19.5806 13.0057 19.4232 12.9495 19.2777C12.8931 19.1322 12.7848 19.0179 12.6445 18.9559L9.91792 17.7508C9.62583 17.6219 9.28208 17.7543 9.15278 18.0469L2.89272 32.2104C2.76343 32.503 2.89624 32.8463 3.18882 32.9755L5.91538 34.1805C6.05581 34.2426 6.21323 34.2458 6.35864 34.1894C6.50405 34.1331 6.61841 34.0248 6.68042 33.8844L12.9405 19.7211ZM13.7063 41.1008L15.4919 38.0103C15.7856 37.3346 15.5124 36.5405 14.8611 36.1928C14.1699 35.824 13.3078 36.085 12.9387 36.7749L11.5817 39.3124C11.404 39.6446 11.3669 40.0285 11.4774 40.393C11.5879 40.7576 11.8318 41.0563 12.164 41.2339C12.659 41.4988 13.2652 41.4427 13.7063 41.1008ZM17.1016 44.0764L19.0742 40.2563C19.1932 39.6506 18.8996 39.0161 18.3542 38.7251C17.8547 38.4584 17.2443 38.517 16.8028 38.8649L14.593 42.7456C14.2239 43.4359 14.4851 44.2979 15.1755 44.6672C15.8651 45.0359 16.729 44.771 17.1016 44.0764ZM21.0944 45.6338L22.8438 42.2714C22.9624 41.666 22.6687 41.032 22.1238 40.7412C21.5805 40.4511 20.8942 40.5556 20.4572 40.9836L18.5515 44.6741C18.5142 45.229 18.8038 45.7618 19.2969 46.0256C19.9102 46.3536 20.6747 46.1837 21.0944 45.6338ZM25.1738 47.112L26.4751 44.6786C26.7313 44.1996 26.6869 43.6044 26.3619 43.1624C26.2376 42.9933 26.0798 42.857 25.8928 42.757C25.3497 42.4668 24.6627 42.5717 24.2256 43.0006L22.5105 46.2972C22.4528 46.8694 22.7415 47.4212 23.2522 47.6943C23.5843 47.8719 23.9681 47.9089 24.3329 47.7985C24.6974 47.688 24.9961 47.4443 25.1738 47.112ZM29.1873 44.8659C29.1452 44.8422 28.1878 44.2855 28.1878 44.2855C28.1527 44.6755 28.0428 45.0605 27.8531 45.4154L27.1096 46.8056L27.8954 47.2569C28.1942 47.4286 28.5476 47.4701 28.8903 47.3741C29.2448 47.2747 29.5489 47.0345 29.7246 46.7152C30.0833 46.0627 29.8423 45.2332 29.1873 44.8659ZM38.6368 35.7302C38.5126 35.4744 38.3155 35.2642 38.0667 35.1223L30.6743 30.9088C29.419 30.1932 27.8507 30.8282 26.0351 31.5632C24.6777 32.1128 23.1518 32.7302 21.6057 32.7304C20.0951 32.7305 18.5653 32.1413 17.1524 30.3234C16.969 30.0879 16.8959 29.7842 16.9525 29.491C17.009 29.1976 17.1898 28.9427 17.4484 28.7918C19.5331 27.5752 21.2937 26.247 22.6815 24.8446C23.0517 24.4705 23.4139 24.1365 23.7683 23.8379C22.1701 23.1367 20.8031 23.4559 19.3697 23.7917C17.953 24.1236 16.4884 24.4668 14.9931 23.64L13.2682 22.8443L9.04165 32.4071C10.088 32.8734 10.4673 33.0347 10.5933 33.0836C11.6348 33.4879 11.9307 34.4827 12.099 35.3187C13.0043 34.4295 14.4191 34.1857 15.5967 34.8143C16.4691 35.2798 17.0197 36.1261 17.1451 37.0459C17.795 36.9264 18.4814 37.0217 19.0899 37.3466C19.8211 37.7369 20.3333 38.3957 20.5501 39.1502C21.297 38.9126 22.1283 38.9726 22.8593 39.3627C23.5906 39.7529 24.1027 40.4116 24.3196 41.166C25.0667 40.9282 25.8984 40.9882 26.6292 41.3789C26.9783 41.5655 27.2792 41.813 27.5265 42.1158L31.4178 44.3184C31.7291 44.4914 32.0918 44.5315 32.4397 44.4314C32.7917 44.33 33.0818 44.0995 33.2564 43.782C33.6132 43.1332 33.3705 42.3053 32.7151 41.9365C32.6723 41.9125 27.2541 38.8479 27.2541 38.8479C26.878 38.6363 26.7447 38.1599 26.9563 37.7839C27.1679 37.4079 27.6442 37.2746 28.0203 37.4861L34.7099 41.2504C35.3648 41.6102 36.1911 41.3704 36.5512 40.7155C36.9082 40.0667 36.6653 39.2387 36.0099 38.8699C36.0097 38.8698 36.0095 38.8696 36.0092 38.8695C34.4395 37.9903 32.6606 36.9939 30.9171 35.9959C30.5427 35.7815 30.4129 35.3042 30.6272 34.9297C30.8415 34.5553 31.3186 34.4254 31.6934 34.6399C33.4314 35.6348 35.2077 36.6297 36.7748 37.5076C37.0831 37.6801 37.4436 37.7207 37.7903 37.6214C38.1445 37.5201 38.436 37.2887 38.6113 36.9701C38.8234 36.585 38.8325 36.1332 38.6368 35.7302ZM41.9918 33.4363L38.1969 23.6471L36.8096 24.3897C35.3041 25.173 33.8304 24.5864 32.4053 24.0193C30.0391 23.0774 27.5921 22.1037 23.7921 25.9438C22.4303 27.3201 20.7438 28.6227 18.7731 29.8214C20.7965 31.9987 22.9631 31.1213 25.4487 30.1151C27.4573 29.3018 29.5345 28.461 31.4479 29.5515L38.8404 33.765C39.1438 33.938 39.411 34.1596 39.633 34.4206L41.9918 33.4363ZM48.1174 33.4573L42.5202 19.019C42.4312 18.7894 42.2112 18.6486 41.9786 18.6486C41.9089 18.6486 41.8381 18.6612 41.7694 18.6879L38.9901 19.7653C38.6918 19.8809 38.5433 20.2176 38.6588 20.5159L44.2561 34.9543C44.3717 35.2525 44.7086 35.4011 45.0068 35.2855L47.7863 34.208C48.0845 34.0922 48.233 33.7555 48.1174 33.4573ZM41.1138 20.194C40.6037 20.194 40.1875 20.61 40.1875 21.1203C40.1875 21.6304 40.6037 22.0465 41.1138 22.0465C41.624 22.0465 42.0401 21.6304 42.0401 21.1203C42.0401 20.61 41.624 20.194 41.1138 20.194ZM25.8316 17.9927C25.4472 18.3771 24.9362 18.5887 24.3925 18.5887C23.849 18.5887 23.3378 18.3771 22.9536 17.9927L20.1752 15.2144C19.3819 14.421 19.3818 13.1298 20.1752 12.3364C20.5596 11.952 21.0707 11.7404 21.6143 11.7404C22.158 11.7404 22.6691 11.952 23.0534 12.3364L24.387 13.6701L27.9453 10.0764C28.3272 9.69069 28.8368 9.47721 29.3799 9.47516H29.3878C29.929 9.47516 30.4378 9.68502 30.8217 10.0668C31.615 10.8556 31.6193 12.1445 30.8312 12.9399C30.2121 13.5647 29.5945 14.1912 28.9769 14.8176C27.9488 15.8603 26.8856 16.9386 25.8316 17.9927ZM24.7267 16.8879C25.7769 15.8377 26.838 14.7614 27.8642 13.7206C28.4828 13.0932 29.1012 12.4659 29.7213 11.8401C29.9041 11.6556 29.9035 11.3572 29.72 11.1747C29.6305 11.0858 29.5117 11.0409 29.3859 11.0377C29.2607 11.0381 29.1434 11.0873 29.0555 11.1759L24.9449 15.3275C24.7987 15.4752 24.5996 15.5586 24.3916 15.559C24.3911 15.559 24.3904 15.559 24.3897 15.559C24.1825 15.559 23.9838 15.4767 23.8373 15.3302L21.9484 13.4414C21.8592 13.3521 21.7405 13.303 21.6142 13.303C21.4879 13.303 21.3692 13.3521 21.28 13.4414C21.0957 13.6256 21.0957 13.9255 21.28 14.1097L24.0583 16.888C24.1474 16.9772 24.2662 17.0263 24.3924 17.0263C24.5189 17.0262 24.6375 16.9771 24.7267 16.8879Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_479_1154">
      <rect width="50" height="50" fill="white" transform="translate(0.5 0.204956)"/>
    </clipPath>
  </defs>
</svg>
                        </div>

                        {/* Text Content */}
                        <div className='w-[550px] space-y-[6px]'>
                            {/* Title */}
                            <h3 className="text-[#04436F] font-metropolis text-[24px] font-semibold leading-[34px]">
                            Empathisch und zuverlässig
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] font-metropolis text-[20px] font-normal leading-[30px]">
                            Deine Fürsorge macht den Unterschied.
                            </p>
                        </div>
                        </div>
                    </li>

                {/* Point 2 */}
                <li className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className="flex items-center gap-4">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "15px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
  <path d="M36.0391 37.9364L32.7002 37.0809L29.5332 35.371V33.0634C30.3321 32.202 30.8594 31.0858 30.9766 29.8505H31.4278C32.5664 29.8505 33.4922 28.9237 33.4922 27.786C33.4922 27.119 33.1729 26.5262 32.6807 26.1493C32.8692 25.2675 32.9688 24.2977 32.9688 23.3182C32.9688 22.371 32.8799 21.454 32.7032 20.5946C32.2715 18.4823 30.5371 16.9471 28.3877 16.7743C26.2491 16.6024 23.9746 17.0917 22.4522 18.0507C22.2862 18.1552 22.1202 18.1796 21.9317 18.1278C21.667 18.0546 21.3936 18.0184 21.1182 18.0184C19.4161 18.0184 18.0313 19.4032 18.0313 21.1053V26.4169C17.7071 26.7821 17.5079 27.2606 17.5079 27.786C17.5079 28.9247 18.4336 29.8505 19.5723 29.8505H20.0235C20.1407 31.0848 20.668 32.202 21.4668 33.0634V35.371L18.2998 37.0809L14.961 37.9364C12.9161 38.4608 11.5411 40.2313 11.5411 42.3427V48.1542C11.5411 48.4774 11.8038 48.7401 12.127 48.7401H38.8721C39.1954 48.7401 39.458 48.4774 39.458 48.1542V42.3436C39.458 40.2323 38.084 38.4608 36.0391 37.9364ZM24.9073 44.2655H26.0918L27.5811 47.5682H23.419L24.9073 44.2655ZM26.0821 43.0936H24.918L24.086 41.119L25.501 40.2518L26.9161 41.119L26.0821 43.0936ZM22.6397 34.0233C23.4737 34.5331 24.4532 34.827 25.5 34.827C26.5469 34.827 27.5264 34.5331 28.3604 34.0233V35.496L25.5 38.6874L22.6397 35.4969V34.0233ZM26.4053 39.4325L29.0743 36.4559L31.5567 37.7958L28.8096 40.9071L26.4053 39.4325ZM31.4278 28.6786H31.002V26.8925H31.4278C31.92 26.8925 32.3204 27.2928 32.3204 27.785C32.3204 28.2772 31.92 28.6786 31.4278 28.6786ZM18.6797 27.786C18.6797 27.2938 19.0801 26.8934 19.5723 26.8934H19.9981V28.6796H19.5723C19.0801 28.6786 18.6797 28.2782 18.6797 27.786ZM20.295 22.8885C20.1114 22.993 19.9981 23.1874 19.9981 23.3983V25.7216H19.5723C19.4463 25.7216 19.3233 25.7343 19.2032 25.7567V21.1063C19.2032 20.0507 20.0625 19.1913 21.1182 19.1913C21.2891 19.1913 21.458 19.2137 21.6211 19.2587C22.128 19.3983 22.6319 19.3231 23.0772 19.0428C24.376 18.2245 26.4248 17.7919 28.295 17.9432C29.9444 18.076 31.2246 19.2089 31.5557 20.83C31.7159 21.6132 31.7969 22.4501 31.7969 23.3192C31.7969 24.1522 31.7178 24.9745 31.5694 25.7294C31.5225 25.7264 31.4746 25.7225 31.4268 25.7225H31.001V23.1346C31.001 22.9637 30.9258 22.8007 30.7959 22.6893C30.6661 22.578 30.4932 22.5302 30.3243 22.5555C29.4639 22.6913 28.8555 22.9335 28.2666 23.1678C27.419 23.5048 26.6192 23.8231 25.0137 23.8231C23.4004 23.8231 21.8575 23.4764 20.8848 22.8944C20.7032 22.787 20.4786 22.785 20.295 22.8885ZM21.17 24.3329C22.2461 24.7596 23.5948 24.996 25.0137 24.996C26.8428 24.996 27.7872 24.62 28.6993 24.2577C29.0664 24.1112 29.42 23.9706 29.8291 23.8593V29.327C29.8291 31.7147 27.8868 33.6571 25.4991 33.6571C23.1114 33.6571 21.169 31.7147 21.169 29.327V24.3329H21.17ZM21.9258 36.4559L24.5948 39.4325L22.1905 40.9071L19.4434 37.7958L21.9258 36.4559ZM12.7139 42.3436C12.7139 40.7762 13.7344 39.4618 15.253 39.0721L18.3145 38.287L21.6377 42.0516C21.752 42.1815 21.9141 42.2499 22.0772 42.2499C22.1827 42.2499 22.2881 42.2216 22.3829 42.1639L23.0752 41.7391L23.8897 43.6718L22.1338 47.5682H17.1621V44.9559C17.1621 44.6327 16.8995 44.37 16.5762 44.37C16.253 44.37 15.9903 44.6327 15.9903 44.9559V47.5682H12.7139V42.3436ZM38.2862 47.5682H35.0098V44.9559C35.0098 44.6327 34.7471 44.37 34.4239 44.37C34.1006 44.37 33.8379 44.6327 33.8379 44.9559V47.5682H28.8663L27.1104 43.6718L27.9248 41.7391L28.6172 42.1639C28.712 42.2225 28.8184 42.2499 28.9229 42.2499C29.086 42.2499 29.2481 42.1815 29.3623 42.0516L32.6856 38.287L35.7471 39.0721C37.2657 39.4608 38.2862 40.7762 38.2862 42.3436V47.5682ZM21.6875 10.4823L20.8184 14.7811C20.7725 15.0057 20.8623 15.2362 21.0479 15.371C21.2334 15.5057 21.4805 15.5204 21.6807 15.4071L25.5 13.2518L29.3194 15.4071C29.4092 15.4579 29.5088 15.4823 29.6075 15.4823C29.7286 15.4823 29.8496 15.4442 29.9522 15.37C30.1377 15.2352 30.2276 15.0048 30.1817 14.7802L29.3125 10.4813L32.543 7.51453C32.712 7.35925 32.7745 7.12 32.7041 6.90222C32.6329 6.68445 32.4414 6.52722 32.2139 6.50085L27.8565 5.99988L26.0332 2.01062C25.9375 1.80359 25.7295 1.6698 25.5 1.6698C25.2705 1.6698 25.0625 1.80359 24.9668 2.01257L23.1436 6.00183L18.7862 6.50281C18.5586 6.52917 18.3672 6.68542 18.2959 6.90417C18.2247 7.12195 18.2881 7.36218 18.4571 7.51648L21.6875 10.4823ZM23.6065 7.12781C23.8106 7.10437 23.9873 6.97546 24.0723 6.78894L25.5 3.66492L26.9278 6.78894C27.0127 6.97546 27.1895 7.10437 27.3936 7.12781L30.8057 7.52039L28.2764 9.84363C28.125 9.9823 28.0577 10.1903 28.0987 10.3915L28.7793 13.7577L25.7881 12.0702C25.6983 12.0194 25.5996 11.995 25.5 11.995C25.4004 11.995 25.3018 12.0204 25.212 12.0702L22.2207 13.7577L22.9014 10.3915C22.9424 10.1903 22.875 9.9823 22.7237 9.84363L20.1944 7.52039L23.6065 7.12781ZM14.6748 21.4979C14.7647 21.5487 14.8643 21.5731 14.9629 21.5731C15.084 21.5731 15.2051 21.535 15.3077 21.4608C15.4932 21.326 15.583 21.0956 15.5371 20.871L14.8516 17.4833L17.3975 15.1464C17.5664 14.9911 17.6289 14.7518 17.5586 14.5341C17.4873 14.3163 17.2959 14.1591 17.0684 14.1327L13.6348 13.7382L12.1983 10.5946C12.1026 10.3856 11.8946 10.2518 11.6651 10.2518C11.4356 10.2518 11.2276 10.3856 11.1319 10.5946L9.69535 13.7382L6.26176 14.1327C6.03422 14.1591 5.84281 14.3153 5.77153 14.5341C5.70024 14.7518 5.76371 14.9921 5.93266 15.1464L8.47856 17.4843L7.79301 20.8719C7.74711 21.0966 7.83696 21.327 8.0225 21.4618C8.20805 21.5966 8.45512 21.6102 8.65531 21.4979L11.6661 19.7987L14.6748 21.4979ZM9.19438 19.8475L9.69145 17.3925C9.73246 17.1913 9.66508 16.9833 9.51371 16.8446L7.66801 15.1503L10.1573 14.8641C10.3614 14.8407 10.5381 14.7118 10.6231 14.5253L11.6641 12.2469L12.7051 14.5253C12.7901 14.7118 12.9668 14.8407 13.1709 14.8641L15.6602 15.1503L13.8155 16.8446C13.6641 16.9833 13.5967 17.1913 13.6377 17.3925L14.1348 19.8485L11.9532 18.6171C11.8633 18.5663 11.7647 18.5419 11.6651 18.5419C11.5655 18.5419 11.4668 18.5673 11.377 18.6171L9.19438 19.8475ZM45.2295 14.5331C45.1582 14.3153 44.9668 14.1581 44.7393 14.1317L41.3057 13.7372L39.8692 10.5936C39.7735 10.3846 39.5655 10.2509 39.336 10.2509C39.1065 10.2509 38.8985 10.3846 38.8028 10.5936L37.3663 13.7372L33.9327 14.1317C33.7051 14.1581 33.5137 14.3143 33.4424 14.5331C33.3711 14.7509 33.4346 14.9911 33.6036 15.1454L36.1495 17.4833L35.4639 20.871C35.418 21.0956 35.5079 21.326 35.6934 21.4608C35.8789 21.5956 36.126 21.6093 36.3262 21.4969L39.337 19.7977L42.3477 21.4969C42.4375 21.5477 42.5371 21.5721 42.6358 21.5721C42.7569 21.5721 42.878 21.5341 42.9805 21.4598C43.1661 21.3251 43.2559 21.0946 43.21 20.87L42.5245 17.4823L45.0684 15.1464C45.2373 14.9911 45.3008 14.7518 45.2295 14.5331ZM41.4864 16.8446C41.335 16.9833 41.2676 17.1913 41.3086 17.3925L41.8057 19.8485L39.6241 18.6171C39.5342 18.5663 39.4356 18.5419 39.336 18.5419C39.2364 18.5419 39.1377 18.5673 39.0479 18.6171L36.8663 19.8485L37.3633 17.3925C37.4043 17.1913 37.337 16.9833 37.1856 16.8446L35.3409 15.1503L37.8301 14.8641C38.0342 14.8407 38.211 14.7118 38.2959 14.5253L39.337 12.2469L40.378 14.5253C40.4629 14.7118 40.6397 14.8407 40.8438 14.8641L43.333 15.1503L41.4864 16.8446Z" fill="white"/>
</svg>
                        </div>

                        {/* Text Content */}
                        <div className='w-[550px] space-y-[6px]'>
                            {/* Title */}
                            <h3 className="text-[#04436F] font-metropolis text-[24px] font-semibold leading-[34px]">
                            Erfahren und motiviert
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] font-metropolis text-[20px] font-normal leading-[30px]">
                            Ob Profi oder Quereinsteiger – wir bringen dich weiter. 
                            </p>
                        </div>
                        </div>
                    </li>
                {/* Point 3 */}
                <li className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className="flex items-center gap-4">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "15px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
  <g clip-path="url(#clip0_479_1167)">
    <path d="M9.98927 31.1621C8.74222 31.1622 7.52316 30.7924 6.48626 30.0996C5.44936 29.4068 4.64119 28.4221 4.16394 27.2699C3.6867 26.1178 3.56183 24.85 3.80511 23.6269C4.04839 22.4038 4.6489 21.2804 5.5307 20.3986C6.4125 19.5168 7.53599 18.9162 8.75908 18.673C9.98218 18.4297 11.2499 18.5546 12.4021 19.0318C13.5542 19.509 14.5389 20.3172 15.2317 21.3541C15.9245 22.391 16.2943 23.6101 16.2943 24.8571C16.2923 26.5287 15.6274 28.1313 14.4454 29.3132C13.2634 30.4952 11.6609 31.1602 9.98927 31.1621ZM9.98927 20.1153C9.05126 20.1152 8.1343 20.3934 7.35435 20.9145C6.57441 21.4356 5.96651 22.1763 5.60752 23.0429C5.24854 23.9095 5.15459 24.8631 5.33757 25.7831C5.52055 26.7031 5.97223 27.5481 6.6355 28.2114C7.29877 28.8747 8.14383 29.3264 9.06382 29.5094C9.9838 29.6924 10.9374 29.5985 11.804 29.2396C12.6706 28.8806 13.4113 28.2727 13.9325 27.4928C14.4536 26.7129 14.7318 25.7959 14.7318 24.8579C14.7306 23.6004 14.2306 22.3947 13.3415 21.5054C12.4524 20.6161 11.2468 20.1159 9.98927 20.1145V20.1153Z" fill="white"/>
    <path d="M17.6801 40.205H2.29871C2.09151 40.205 1.89279 40.1226 1.74628 39.9761C1.59977 39.8296 1.51746 39.6309 1.51746 39.4237V37.8435C1.51746 34.4842 4.15808 32.1375 7.94058 32.1375H12.0382C15.8195 32.1375 18.4614 34.4839 18.4614 37.8435V39.4237C18.4614 39.6309 18.3791 39.8296 18.2325 39.9761C18.086 40.1226 17.8873 40.205 17.6801 40.205ZM3.07996 38.6425H16.8989V37.8435C16.8989 34.9812 14.4576 33.7 12.0382 33.7H7.94058C5.52121 33.7 3.07996 34.9812 3.07996 37.8435V38.6425Z" fill="white"/>
    <path d="M20.5 40.205C20.2928 40.205 20.0941 40.1227 19.9476 39.9761C19.8011 39.8296 19.7188 39.6309 19.7188 39.4237C19.7188 39.2165 19.8011 39.0178 19.9476 38.8713C20.0941 38.7248 20.2928 38.6425 20.5 38.6425C24.1466 38.6425 27.7113 37.5611 30.7433 35.5352C33.7754 33.5093 36.1385 30.6297 37.534 27.2607C38.9295 23.8917 39.2946 20.1845 38.5832 16.608C37.8718 13.0315 36.1158 9.74621 33.5373 7.16768C30.9587 4.58915 27.6735 2.83315 24.097 2.12174C20.5205 1.41032 16.8133 1.77545 13.4443 3.17094C10.0753 4.56643 7.19572 6.92961 5.16978 9.96164C3.14384 12.9937 2.0625 16.5584 2.0625 20.205C2.0625 20.4122 1.98019 20.6109 1.83368 20.7574C1.68716 20.9039 1.48845 20.9862 1.28125 20.9862C1.07405 20.9862 0.875336 20.9039 0.728823 20.7574C0.58231 20.6109 0.5 20.4122 0.5 20.205C0.5 16.2493 1.67298 12.3825 3.87061 9.09356C6.06824 5.80458 9.19181 3.24113 12.8463 1.72737C16.5009 0.213622 20.5222 -0.182445 24.4018 0.589259C28.2814 1.36096 31.8451 3.26578 34.6421 6.06283C37.4392 8.85988 39.344 12.4235 40.1157 16.3032C40.8874 20.1828 40.4913 24.2041 38.9776 27.8586C37.4638 31.5132 34.9004 34.6367 31.6114 36.8344C28.3224 39.032 24.4556 40.205 20.5 40.205Z" fill="white"/>
    <path d="M25.108 23.6473C24.9708 23.6473 24.836 23.6112 24.7173 23.5424L20.108 20.8815C19.9895 20.8128 19.8911 20.7141 19.8228 20.5953C19.7545 20.4766 19.7186 20.3419 19.7188 20.2049V9.20667C19.7188 9.10407 19.739 9.00248 19.7782 8.90769C19.8175 8.81291 19.875 8.72678 19.9476 8.65424C20.0201 8.58169 20.1062 8.52415 20.201 8.48488C20.2958 8.44562 20.3974 8.42542 20.5 8.42542C20.6026 8.42542 20.7042 8.44562 20.799 8.48488C20.8938 8.52415 20.9799 8.58169 21.0524 8.65424C21.125 8.72678 21.1825 8.81291 21.2218 8.90769C21.261 9.00248 21.2813 9.10407 21.2813 9.20667V19.7535L25.5 22.1893C25.649 22.2753 25.7655 22.408 25.8313 22.5669C25.8972 22.7258 25.9088 22.9021 25.8642 23.0682C25.8197 23.2344 25.7216 23.3812 25.5851 23.4859C25.4486 23.5906 25.2814 23.6473 25.1094 23.6473H25.108Z" fill="white"/>
    <path d="M20.5 36.5073C20.2928 36.5073 20.0941 36.425 19.9476 36.2785C19.8011 36.132 19.7188 35.9332 19.7188 35.726C19.7188 35.5188 19.8011 35.3201 19.9476 35.1736C20.0941 35.0271 20.2928 34.9448 20.5 34.9448C23.3192 34.9455 26.0795 34.1381 28.4538 32.6181C30.8282 31.0981 32.717 28.9293 33.8965 26.3687C35.076 23.8081 35.4967 20.9631 35.1088 18.1707C34.7209 15.3784 33.5406 12.7557 31.7078 10.6136C29.875 8.4715 27.4665 6.89969 24.7678 6.08445C22.0691 5.26922 19.1932 5.24472 16.481 6.01388C13.7687 6.78304 11.3338 8.3136 9.46484 10.4242C7.59584 12.5348 6.37106 15.1369 5.93564 17.9223C5.92063 18.0243 5.88556 18.1224 5.83246 18.2108C5.77937 18.2992 5.70929 18.3762 5.62628 18.4374C5.54327 18.4986 5.44897 18.5427 5.34881 18.5673C5.24865 18.5919 5.14462 18.5964 5.04272 18.5805C4.94081 18.5647 4.84305 18.5288 4.75508 18.475C4.6671 18.4212 4.59065 18.3505 4.53013 18.267C4.46962 18.1835 4.42623 18.0888 4.40248 17.9885C4.37872 17.8881 4.37507 17.7841 4.39174 17.6823C4.87379 14.6031 6.22836 11.7265 8.29499 9.39348C10.3616 7.06043 13.0537 5.36865 16.0523 4.51856C19.0508 3.66847 22.2302 3.69571 25.2138 4.59704C28.1974 5.49837 30.86 7.23602 32.8864 9.60413C34.9128 11.9722 36.2179 14.8716 36.6471 17.9586C37.0763 21.0456 36.6117 24.191 35.3082 27.0221C34.0048 29.8532 31.9171 32.2514 29.2926 33.9324C26.6681 35.6135 23.6168 36.5071 20.5 36.5073Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_479_1167">
      <rect width="40" height="40" fill="white" transform="translate(0.5 0.204956)"/>
    </clipPath>
  </defs>
</svg>
                        </div>

                        {/* Text Content */}
                        <div className='w-[550px] space-y-[6px]'>
                            {/* Title */}
                            <h3 className="text-[#04436F] font-metropolis text-[24px] font-semibold leading-[34px]">
                            Mobil und flexibel
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] font-metropolis text-[20px] font-normal leading-[30px]">
                            Du bestimmst, wann und wo du arbeitest.
                            </p>
                        </div>
                        </div>
                    </li>
                    </ul>

                    {/* Call to Action */}
                    <div
                className="md:w-[620px] flex flex-col items-start rounded-[50px_0px_0px_50px] p-[4px_70px_4px_10px]"
                style={{
    background: "linear-gradient(92deg, #04436F 80%, rgba(4,67,111,0.8) 100%)",
                }}
                >
                <p className="text-[#FAFCFF] font-metropolis text-[16px] font-[400] leading-[25.6px] whitespace-nowrap">
                    Du hast Freude daran, anderen zu helfen? Dann bist du bei uns genau richtig!
                </p>
                </div>


                </div>
                </section>


                <section className="lg:hidden block lg:flex justify-center items-center gap-6 lg:mt-[160px] p-2">
                
                    {/* Right Content */}
                    <div className="flex flex-col gap-2 ">
                        {/* Title */}
                        <h2 className="text-[#04436F] text-center font-metropolis text-[32px] font-semibold leading-[32.5px]">
                        Wen suchen wir?
                    </h2>
                        {/* Subtitle */}
                        <p className="text-[#04436F] font-metropolis text-center text-[16px] font-normal leading-[16px] mb-[32px]">
                        Wir suchen engagierte Menschen, die<br></br> Betreuung mit Leidenschaft und Herz leisten möchten.
                    </p>

                        {/* Points */}
                        <ul className="flex flex-col md:items-center gap-[32px]">
                        {/* Point 1 */}
                        <li className="flex items-start gap-8">
                    {/* Icon Container */}
                    <div className="flex items-center gap-[40px]">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "15px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
  <g clip-path="url(#clip0_479_1154)">
    <path d="M11.3854 20.2538C11.3618 20.7647 10.9283 21.1598 10.4172 21.1361C9.9063 21.1124 9.51118 20.679 9.53491 20.1679C9.55864 19.6569 9.99204 19.2619 10.5031 19.2856C11.014 19.3093 11.409 19.7428 11.3854 20.2538ZM48.351 35.6648L45.5715 36.7423C45.3178 36.8407 45.0566 36.8873 44.7996 36.8873C43.9404 36.8873 43.1281 36.3669 42.7994 35.519L42.5569 34.8936L40.2948 35.8375C40.4039 36.4783 40.299 37.1444 39.9808 37.723C39.6034 38.4093 38.9782 38.9068 38.2206 39.1236C38.1894 39.1326 38.1581 39.141 38.1267 39.1489C38.3742 39.8945 38.3247 40.7341 37.9207 41.4686C37.3245 42.5528 36.1354 43.1087 34.9764 42.9549C35.0111 43.4885 34.9003 44.0361 34.6258 44.5351C34.2495 45.2195 33.6266 45.716 32.8722 45.9331C32.4006 46.0688 31.9149 46.0843 31.4511 45.9836C31.4662 46.4865 31.352 46.9985 31.0937 47.4682C30.7172 48.1527 30.0677 48.6668 29.3121 48.8786C29.051 48.9518 28.7864 48.9879 28.5243 48.9879C28.0334 48.9879 27.5511 48.861 27.1173 48.6118L26.3511 48.1717C25.9711 48.7066 25.4273 49.0998 24.7862 49.294C24.4987 49.3811 24.205 49.4243 23.9133 49.4243C23.4301 49.4243 22.9521 49.3057 22.5154 49.0721C21.8673 48.7255 21.3891 48.1663 21.1385 47.5135C20.3292 47.8577 19.38 47.8419 18.5602 47.4035C17.9796 47.0929 17.5331 46.6057 17.2664 46.0329C16.4134 46.4947 15.3537 46.5344 14.4387 46.0451C13.2946 45.4331 12.7116 44.1767 12.8975 42.9616C12.3943 42.9731 11.8885 42.8587 11.4274 42.612C10.7271 42.2375 10.2139 41.6104 9.98237 40.8463C9.75083 40.0823 9.82964 39.2758 10.2041 38.5756L10.9522 37.1769C10.785 36.7794 10.7026 36.3449 10.6236 35.9202C10.4803 35.1498 10.3688 34.6725 10.0282 34.5403C9.89409 34.4883 9.57612 34.356 8.4104 33.8364L8.10991 34.5163C7.87915 35.0383 7.45757 35.4399 6.9229 35.6468C6.67085 35.7444 6.40815 35.793 6.14634 35.793C5.85268 35.793 5.56001 35.7319 5.28403 35.6099L2.55747 34.4048C1.477 33.9271 0.986375 32.6594 1.46391 31.579L7.72358 17.4153C7.95434 16.8932 8.37602 16.4918 8.91069 16.2848C9.44565 16.0779 10.0277 16.0911 10.5496 16.3218L13.276 17.5269C13.7981 17.7577 14.1997 18.1793 14.4065 18.7139C14.6134 19.2487 14.6002 19.8307 14.3696 20.3528L13.9 21.4151L15.6748 22.2339C15.6937 22.2426 15.7124 22.2521 15.7305 22.2624C16.2541 22.557 16.7905 22.6235 17.3743 22.5763C15.48 20.3317 14.4509 17.5043 14.4509 14.4697V6.16725C14.4509 5.85475 14.6372 5.57233 14.9245 5.44918L25.1921 1.04879C25.3886 0.964612 25.6112 0.964612 25.8077 1.04879L36.0754 5.44918C36.3626 5.57223 36.549 5.85475 36.549 6.16725V14.4697C36.549 17.5849 35.463 20.4851 33.4693 22.758C34.5847 23.1848 35.3593 23.383 36.0805 23.0078L37.628 22.1795L37.2021 21.0807C36.775 19.9793 37.3238 18.7356 38.4253 18.3086L41.2047 17.231C42.3058 16.8041 43.5499 17.3527 43.977 18.4543L49.5743 32.8925C50.0013 33.9941 49.4525 35.2377 48.351 35.6648ZM16.0135 14.4696C16.0135 17.4381 17.1341 20.1782 19.1768 22.2321C19.6234 22.128 20.0964 22.0223 20.5952 21.9503C18.4574 20.114 17.1854 17.4581 17.1854 14.4696V7.97028C17.1854 7.65778 17.3716 7.37526 17.6589 7.25221L25.1922 4.02369C25.3887 3.93951 25.6113 3.93951 25.8078 4.02369L33.3412 7.25221C33.6284 7.37535 33.8147 7.65778 33.8147 7.97028V14.4696C33.8147 17.3216 32.6418 19.9283 30.5971 21.7793C31.0541 21.8772 31.4881 22.0094 31.9001 22.1542C33.8937 20.1092 34.9866 17.3992 34.9866 14.4697V6.68239L25.5 2.61686L16.0135 6.68239V14.4696ZM28.0862 21.6858C30.7349 20.151 32.252 17.5281 32.252 14.4696V8.48551L25.5 5.59176L18.7479 8.48541V14.4696C18.7479 18.4213 21.4044 21.6869 25.388 22.6807C26.3502 22.1173 27.2483 21.8136 28.0862 21.6858ZM12.9405 19.7211C13.0026 19.5806 13.0057 19.4232 12.9495 19.2777C12.8931 19.1322 12.7848 19.0179 12.6445 18.9559L9.91792 17.7508C9.62583 17.6219 9.28208 17.7543 9.15278 18.0469L2.89272 32.2104C2.76343 32.503 2.89624 32.8463 3.18882 32.9755L5.91538 34.1805C6.05581 34.2426 6.21323 34.2458 6.35864 34.1894C6.50405 34.1331 6.61841 34.0248 6.68042 33.8844L12.9405 19.7211ZM13.7063 41.1008L15.4919 38.0103C15.7856 37.3346 15.5124 36.5405 14.8611 36.1928C14.1699 35.824 13.3078 36.085 12.9387 36.7749L11.5817 39.3124C11.404 39.6446 11.3669 40.0285 11.4774 40.393C11.5879 40.7576 11.8318 41.0563 12.164 41.2339C12.659 41.4988 13.2652 41.4427 13.7063 41.1008ZM17.1016 44.0764L19.0742 40.2563C19.1932 39.6506 18.8996 39.0161 18.3542 38.7251C17.8547 38.4584 17.2443 38.517 16.8028 38.8649L14.593 42.7456C14.2239 43.4359 14.4851 44.2979 15.1755 44.6672C15.8651 45.0359 16.729 44.771 17.1016 44.0764ZM21.0944 45.6338L22.8438 42.2714C22.9624 41.666 22.6687 41.032 22.1238 40.7412C21.5805 40.4511 20.8942 40.5556 20.4572 40.9836L18.5515 44.6741C18.5142 45.229 18.8038 45.7618 19.2969 46.0256C19.9102 46.3536 20.6747 46.1837 21.0944 45.6338ZM25.1738 47.112L26.4751 44.6786C26.7313 44.1996 26.6869 43.6044 26.3619 43.1624C26.2376 42.9933 26.0798 42.857 25.8928 42.757C25.3497 42.4668 24.6627 42.5717 24.2256 43.0006L22.5105 46.2972C22.4528 46.8694 22.7415 47.4212 23.2522 47.6943C23.5843 47.8719 23.9681 47.9089 24.3329 47.7985C24.6974 47.688 24.9961 47.4443 25.1738 47.112ZM29.1873 44.8659C29.1452 44.8422 28.1878 44.2855 28.1878 44.2855C28.1527 44.6755 28.0428 45.0605 27.8531 45.4154L27.1096 46.8056L27.8954 47.2569C28.1942 47.4286 28.5476 47.4701 28.8903 47.3741C29.2448 47.2747 29.5489 47.0345 29.7246 46.7152C30.0833 46.0627 29.8423 45.2332 29.1873 44.8659ZM38.6368 35.7302C38.5126 35.4744 38.3155 35.2642 38.0667 35.1223L30.6743 30.9088C29.419 30.1932 27.8507 30.8282 26.0351 31.5632C24.6777 32.1128 23.1518 32.7302 21.6057 32.7304C20.0951 32.7305 18.5653 32.1413 17.1524 30.3234C16.969 30.0879 16.8959 29.7842 16.9525 29.491C17.009 29.1976 17.1898 28.9427 17.4484 28.7918C19.5331 27.5752 21.2937 26.247 22.6815 24.8446C23.0517 24.4705 23.4139 24.1365 23.7683 23.8379C22.1701 23.1367 20.8031 23.4559 19.3697 23.7917C17.953 24.1236 16.4884 24.4668 14.9931 23.64L13.2682 22.8443L9.04165 32.4071C10.088 32.8734 10.4673 33.0347 10.5933 33.0836C11.6348 33.4879 11.9307 34.4827 12.099 35.3187C13.0043 34.4295 14.4191 34.1857 15.5967 34.8143C16.4691 35.2798 17.0197 36.1261 17.1451 37.0459C17.795 36.9264 18.4814 37.0217 19.0899 37.3466C19.8211 37.7369 20.3333 38.3957 20.5501 39.1502C21.297 38.9126 22.1283 38.9726 22.8593 39.3627C23.5906 39.7529 24.1027 40.4116 24.3196 41.166C25.0667 40.9282 25.8984 40.9882 26.6292 41.3789C26.9783 41.5655 27.2792 41.813 27.5265 42.1158L31.4178 44.3184C31.7291 44.4914 32.0918 44.5315 32.4397 44.4314C32.7917 44.33 33.0818 44.0995 33.2564 43.782C33.6132 43.1332 33.3705 42.3053 32.7151 41.9365C32.6723 41.9125 27.2541 38.8479 27.2541 38.8479C26.878 38.6363 26.7447 38.1599 26.9563 37.7839C27.1679 37.4079 27.6442 37.2746 28.0203 37.4861L34.7099 41.2504C35.3648 41.6102 36.1911 41.3704 36.5512 40.7155C36.9082 40.0667 36.6653 39.2387 36.0099 38.8699C36.0097 38.8698 36.0095 38.8696 36.0092 38.8695C34.4395 37.9903 32.6606 36.9939 30.9171 35.9959C30.5427 35.7815 30.4129 35.3042 30.6272 34.9297C30.8415 34.5553 31.3186 34.4254 31.6934 34.6399C33.4314 35.6348 35.2077 36.6297 36.7748 37.5076C37.0831 37.6801 37.4436 37.7207 37.7903 37.6214C38.1445 37.5201 38.436 37.2887 38.6113 36.9701C38.8234 36.585 38.8325 36.1332 38.6368 35.7302ZM41.9918 33.4363L38.1969 23.6471L36.8096 24.3897C35.3041 25.173 33.8304 24.5864 32.4053 24.0193C30.0391 23.0774 27.5921 22.1037 23.7921 25.9438C22.4303 27.3201 20.7438 28.6227 18.7731 29.8214C20.7965 31.9987 22.9631 31.1213 25.4487 30.1151C27.4573 29.3018 29.5345 28.461 31.4479 29.5515L38.8404 33.765C39.1438 33.938 39.411 34.1596 39.633 34.4206L41.9918 33.4363ZM48.1174 33.4573L42.5202 19.019C42.4312 18.7894 42.2112 18.6486 41.9786 18.6486C41.9089 18.6486 41.8381 18.6612 41.7694 18.6879L38.9901 19.7653C38.6918 19.8809 38.5433 20.2176 38.6588 20.5159L44.2561 34.9543C44.3717 35.2525 44.7086 35.4011 45.0068 35.2855L47.7863 34.208C48.0845 34.0922 48.233 33.7555 48.1174 33.4573ZM41.1138 20.194C40.6037 20.194 40.1875 20.61 40.1875 21.1203C40.1875 21.6304 40.6037 22.0465 41.1138 22.0465C41.624 22.0465 42.0401 21.6304 42.0401 21.1203C42.0401 20.61 41.624 20.194 41.1138 20.194ZM25.8316 17.9927C25.4472 18.3771 24.9362 18.5887 24.3925 18.5887C23.849 18.5887 23.3378 18.3771 22.9536 17.9927L20.1752 15.2144C19.3819 14.421 19.3818 13.1298 20.1752 12.3364C20.5596 11.952 21.0707 11.7404 21.6143 11.7404C22.158 11.7404 22.6691 11.952 23.0534 12.3364L24.387 13.6701L27.9453 10.0764C28.3272 9.69069 28.8368 9.47721 29.3799 9.47516H29.3878C29.929 9.47516 30.4378 9.68502 30.8217 10.0668C31.615 10.8556 31.6193 12.1445 30.8312 12.9399C30.2121 13.5647 29.5945 14.1912 28.9769 14.8176C27.9488 15.8603 26.8856 16.9386 25.8316 17.9927ZM24.7267 16.8879C25.7769 15.8377 26.838 14.7614 27.8642 13.7206C28.4828 13.0932 29.1012 12.4659 29.7213 11.8401C29.9041 11.6556 29.9035 11.3572 29.72 11.1747C29.6305 11.0858 29.5117 11.0409 29.3859 11.0377C29.2607 11.0381 29.1434 11.0873 29.0555 11.1759L24.9449 15.3275C24.7987 15.4752 24.5996 15.5586 24.3916 15.559C24.3911 15.559 24.3904 15.559 24.3897 15.559C24.1825 15.559 23.9838 15.4767 23.8373 15.3302L21.9484 13.4414C21.8592 13.3521 21.7405 13.303 21.6142 13.303C21.4879 13.303 21.3692 13.3521 21.28 13.4414C21.0957 13.6256 21.0957 13.9255 21.28 14.1097L24.0583 16.888C24.1474 16.9772 24.2662 17.0263 24.3924 17.0263C24.5189 17.0262 24.6375 16.9771 24.7267 16.8879Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_479_1154">
      <rect width="50" height="50" fill="white" transform="translate(0.5 0.204956)"/>
    </clipPath>
  </defs>
</svg>
                        </div>

                        {/* Text Content */}
                        <div>
                            {/* Title */}
                            <h3 className="text-[#04436F] md:w-[300px] font-metropolis text-[24px] font-semibold leading-[24px] mb-2">
                            Empathisch und zuverlässig
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] md:w-[300px] font-metropolis text-[16px] font-normal leading-[16px]">
                            Deine Fürsorge macht den Unterschied.
                            </p>
                        </div>
                        </div>
                    </li>

                {/* Point 2 */}
                <li className="flex items-start gap-8 ">
                    {/* Icon Container */}
                    <div className="flex items-center gap-[40px]">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "15px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
  <path d="M36.0391 37.9364L32.7002 37.0809L29.5332 35.371V33.0634C30.3321 32.202 30.8594 31.0858 30.9766 29.8505H31.4278C32.5664 29.8505 33.4922 28.9237 33.4922 27.786C33.4922 27.119 33.1729 26.5262 32.6807 26.1493C32.8692 25.2675 32.9688 24.2977 32.9688 23.3182C32.9688 22.371 32.8799 21.454 32.7032 20.5946C32.2715 18.4823 30.5371 16.9471 28.3877 16.7743C26.2491 16.6024 23.9746 17.0917 22.4522 18.0507C22.2862 18.1552 22.1202 18.1796 21.9317 18.1278C21.667 18.0546 21.3936 18.0184 21.1182 18.0184C19.4161 18.0184 18.0313 19.4032 18.0313 21.1053V26.4169C17.7071 26.7821 17.5079 27.2606 17.5079 27.786C17.5079 28.9247 18.4336 29.8505 19.5723 29.8505H20.0235C20.1407 31.0848 20.668 32.202 21.4668 33.0634V35.371L18.2998 37.0809L14.961 37.9364C12.9161 38.4608 11.5411 40.2313 11.5411 42.3427V48.1542C11.5411 48.4774 11.8038 48.7401 12.127 48.7401H38.8721C39.1954 48.7401 39.458 48.4774 39.458 48.1542V42.3436C39.458 40.2323 38.084 38.4608 36.0391 37.9364ZM24.9073 44.2655H26.0918L27.5811 47.5682H23.419L24.9073 44.2655ZM26.0821 43.0936H24.918L24.086 41.119L25.501 40.2518L26.9161 41.119L26.0821 43.0936ZM22.6397 34.0233C23.4737 34.5331 24.4532 34.827 25.5 34.827C26.5469 34.827 27.5264 34.5331 28.3604 34.0233V35.496L25.5 38.6874L22.6397 35.4969V34.0233ZM26.4053 39.4325L29.0743 36.4559L31.5567 37.7958L28.8096 40.9071L26.4053 39.4325ZM31.4278 28.6786H31.002V26.8925H31.4278C31.92 26.8925 32.3204 27.2928 32.3204 27.785C32.3204 28.2772 31.92 28.6786 31.4278 28.6786ZM18.6797 27.786C18.6797 27.2938 19.0801 26.8934 19.5723 26.8934H19.9981V28.6796H19.5723C19.0801 28.6786 18.6797 28.2782 18.6797 27.786ZM20.295 22.8885C20.1114 22.993 19.9981 23.1874 19.9981 23.3983V25.7216H19.5723C19.4463 25.7216 19.3233 25.7343 19.2032 25.7567V21.1063C19.2032 20.0507 20.0625 19.1913 21.1182 19.1913C21.2891 19.1913 21.458 19.2137 21.6211 19.2587C22.128 19.3983 22.6319 19.3231 23.0772 19.0428C24.376 18.2245 26.4248 17.7919 28.295 17.9432C29.9444 18.076 31.2246 19.2089 31.5557 20.83C31.7159 21.6132 31.7969 22.4501 31.7969 23.3192C31.7969 24.1522 31.7178 24.9745 31.5694 25.7294C31.5225 25.7264 31.4746 25.7225 31.4268 25.7225H31.001V23.1346C31.001 22.9637 30.9258 22.8007 30.7959 22.6893C30.6661 22.578 30.4932 22.5302 30.3243 22.5555C29.4639 22.6913 28.8555 22.9335 28.2666 23.1678C27.419 23.5048 26.6192 23.8231 25.0137 23.8231C23.4004 23.8231 21.8575 23.4764 20.8848 22.8944C20.7032 22.787 20.4786 22.785 20.295 22.8885ZM21.17 24.3329C22.2461 24.7596 23.5948 24.996 25.0137 24.996C26.8428 24.996 27.7872 24.62 28.6993 24.2577C29.0664 24.1112 29.42 23.9706 29.8291 23.8593V29.327C29.8291 31.7147 27.8868 33.6571 25.4991 33.6571C23.1114 33.6571 21.169 31.7147 21.169 29.327V24.3329H21.17ZM21.9258 36.4559L24.5948 39.4325L22.1905 40.9071L19.4434 37.7958L21.9258 36.4559ZM12.7139 42.3436C12.7139 40.7762 13.7344 39.4618 15.253 39.0721L18.3145 38.287L21.6377 42.0516C21.752 42.1815 21.9141 42.2499 22.0772 42.2499C22.1827 42.2499 22.2881 42.2216 22.3829 42.1639L23.0752 41.7391L23.8897 43.6718L22.1338 47.5682H17.1621V44.9559C17.1621 44.6327 16.8995 44.37 16.5762 44.37C16.253 44.37 15.9903 44.6327 15.9903 44.9559V47.5682H12.7139V42.3436ZM38.2862 47.5682H35.0098V44.9559C35.0098 44.6327 34.7471 44.37 34.4239 44.37C34.1006 44.37 33.8379 44.6327 33.8379 44.9559V47.5682H28.8663L27.1104 43.6718L27.9248 41.7391L28.6172 42.1639C28.712 42.2225 28.8184 42.2499 28.9229 42.2499C29.086 42.2499 29.2481 42.1815 29.3623 42.0516L32.6856 38.287L35.7471 39.0721C37.2657 39.4608 38.2862 40.7762 38.2862 42.3436V47.5682ZM21.6875 10.4823L20.8184 14.7811C20.7725 15.0057 20.8623 15.2362 21.0479 15.371C21.2334 15.5057 21.4805 15.5204 21.6807 15.4071L25.5 13.2518L29.3194 15.4071C29.4092 15.4579 29.5088 15.4823 29.6075 15.4823C29.7286 15.4823 29.8496 15.4442 29.9522 15.37C30.1377 15.2352 30.2276 15.0048 30.1817 14.7802L29.3125 10.4813L32.543 7.51453C32.712 7.35925 32.7745 7.12 32.7041 6.90222C32.6329 6.68445 32.4414 6.52722 32.2139 6.50085L27.8565 5.99988L26.0332 2.01062C25.9375 1.80359 25.7295 1.6698 25.5 1.6698C25.2705 1.6698 25.0625 1.80359 24.9668 2.01257L23.1436 6.00183L18.7862 6.50281C18.5586 6.52917 18.3672 6.68542 18.2959 6.90417C18.2247 7.12195 18.2881 7.36218 18.4571 7.51648L21.6875 10.4823ZM23.6065 7.12781C23.8106 7.10437 23.9873 6.97546 24.0723 6.78894L25.5 3.66492L26.9278 6.78894C27.0127 6.97546 27.1895 7.10437 27.3936 7.12781L30.8057 7.52039L28.2764 9.84363C28.125 9.9823 28.0577 10.1903 28.0987 10.3915L28.7793 13.7577L25.7881 12.0702C25.6983 12.0194 25.5996 11.995 25.5 11.995C25.4004 11.995 25.3018 12.0204 25.212 12.0702L22.2207 13.7577L22.9014 10.3915C22.9424 10.1903 22.875 9.9823 22.7237 9.84363L20.1944 7.52039L23.6065 7.12781ZM14.6748 21.4979C14.7647 21.5487 14.8643 21.5731 14.9629 21.5731C15.084 21.5731 15.2051 21.535 15.3077 21.4608C15.4932 21.326 15.583 21.0956 15.5371 20.871L14.8516 17.4833L17.3975 15.1464C17.5664 14.9911 17.6289 14.7518 17.5586 14.5341C17.4873 14.3163 17.2959 14.1591 17.0684 14.1327L13.6348 13.7382L12.1983 10.5946C12.1026 10.3856 11.8946 10.2518 11.6651 10.2518C11.4356 10.2518 11.2276 10.3856 11.1319 10.5946L9.69535 13.7382L6.26176 14.1327C6.03422 14.1591 5.84281 14.3153 5.77153 14.5341C5.70024 14.7518 5.76371 14.9921 5.93266 15.1464L8.47856 17.4843L7.79301 20.8719C7.74711 21.0966 7.83696 21.327 8.0225 21.4618C8.20805 21.5966 8.45512 21.6102 8.65531 21.4979L11.6661 19.7987L14.6748 21.4979ZM9.19438 19.8475L9.69145 17.3925C9.73246 17.1913 9.66508 16.9833 9.51371 16.8446L7.66801 15.1503L10.1573 14.8641C10.3614 14.8407 10.5381 14.7118 10.6231 14.5253L11.6641 12.2469L12.7051 14.5253C12.7901 14.7118 12.9668 14.8407 13.1709 14.8641L15.6602 15.1503L13.8155 16.8446C13.6641 16.9833 13.5967 17.1913 13.6377 17.3925L14.1348 19.8485L11.9532 18.6171C11.8633 18.5663 11.7647 18.5419 11.6651 18.5419C11.5655 18.5419 11.4668 18.5673 11.377 18.6171L9.19438 19.8475ZM45.2295 14.5331C45.1582 14.3153 44.9668 14.1581 44.7393 14.1317L41.3057 13.7372L39.8692 10.5936C39.7735 10.3846 39.5655 10.2509 39.336 10.2509C39.1065 10.2509 38.8985 10.3846 38.8028 10.5936L37.3663 13.7372L33.9327 14.1317C33.7051 14.1581 33.5137 14.3143 33.4424 14.5331C33.3711 14.7509 33.4346 14.9911 33.6036 15.1454L36.1495 17.4833L35.4639 20.871C35.418 21.0956 35.5079 21.326 35.6934 21.4608C35.8789 21.5956 36.126 21.6093 36.3262 21.4969L39.337 19.7977L42.3477 21.4969C42.4375 21.5477 42.5371 21.5721 42.6358 21.5721C42.7569 21.5721 42.878 21.5341 42.9805 21.4598C43.1661 21.3251 43.2559 21.0946 43.21 20.87L42.5245 17.4823L45.0684 15.1464C45.2373 14.9911 45.3008 14.7518 45.2295 14.5331ZM41.4864 16.8446C41.335 16.9833 41.2676 17.1913 41.3086 17.3925L41.8057 19.8485L39.6241 18.6171C39.5342 18.5663 39.4356 18.5419 39.336 18.5419C39.2364 18.5419 39.1377 18.5673 39.0479 18.6171L36.8663 19.8485L37.3633 17.3925C37.4043 17.1913 37.337 16.9833 37.1856 16.8446L35.3409 15.1503L37.8301 14.8641C38.0342 14.8407 38.211 14.7118 38.2959 14.5253L39.337 12.2469L40.378 14.5253C40.4629 14.7118 40.6397 14.8407 40.8438 14.8641L43.333 15.1503L41.4864 16.8446Z" fill="white"/>
</svg>
                        </div>

                        {/* Text Content */}
                        <div>
                            {/* Title */}
                            <h3 className="text-[#04436F] md:w-[300px] font-metropolis text-[24px] font-semibold leading-[24px] mb-2">
                            Erfahren und<br></br> motiviert
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] md:w-[300px] font-metropolis text-[16px] font-normal leading-[16px]">
                            Ob Profi oder Quereinsteiger –<br></br> wir bringen dich weiter. 
                            </p>
                        </div>
                        </div>
                    </li>
                {/* Point 3 */}
                <li className="flex items-start gap-8">
                    {/* Icon Container */}
                    <div className="flex items-center gap-[40px]">
                        {/* Icon Container */}
                        <div
                            className="flex justify-center items-center rounded-full"
                            style={{
                            backgroundColor: "#04436F",
                            width: "80px",
                            height: "80px",
                            padding: "20px",
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
  <g clip-path="url(#clip0_479_1167)">
    <path d="M9.98927 31.1621C8.74222 31.1622 7.52316 30.7924 6.48626 30.0996C5.44936 29.4068 4.64119 28.4221 4.16394 27.2699C3.6867 26.1178 3.56183 24.85 3.80511 23.6269C4.04839 22.4038 4.6489 21.2804 5.5307 20.3986C6.4125 19.5168 7.53599 18.9162 8.75908 18.673C9.98218 18.4297 11.2499 18.5546 12.4021 19.0318C13.5542 19.509 14.5389 20.3172 15.2317 21.3541C15.9245 22.391 16.2943 23.6101 16.2943 24.8571C16.2923 26.5287 15.6274 28.1313 14.4454 29.3132C13.2634 30.4952 11.6609 31.1602 9.98927 31.1621ZM9.98927 20.1153C9.05126 20.1152 8.1343 20.3934 7.35435 20.9145C6.57441 21.4356 5.96651 22.1763 5.60752 23.0429C5.24854 23.9095 5.15459 24.8631 5.33757 25.7831C5.52055 26.7031 5.97223 27.5481 6.6355 28.2114C7.29877 28.8747 8.14383 29.3264 9.06382 29.5094C9.9838 29.6924 10.9374 29.5985 11.804 29.2396C12.6706 28.8806 13.4113 28.2727 13.9325 27.4928C14.4536 26.7129 14.7318 25.7959 14.7318 24.8579C14.7306 23.6004 14.2306 22.3947 13.3415 21.5054C12.4524 20.6161 11.2468 20.1159 9.98927 20.1145V20.1153Z" fill="white"/>
    <path d="M17.6801 40.205H2.29871C2.09151 40.205 1.89279 40.1226 1.74628 39.9761C1.59977 39.8296 1.51746 39.6309 1.51746 39.4237V37.8435C1.51746 34.4842 4.15808 32.1375 7.94058 32.1375H12.0382C15.8195 32.1375 18.4614 34.4839 18.4614 37.8435V39.4237C18.4614 39.6309 18.3791 39.8296 18.2325 39.9761C18.086 40.1226 17.8873 40.205 17.6801 40.205ZM3.07996 38.6425H16.8989V37.8435C16.8989 34.9812 14.4576 33.7 12.0382 33.7H7.94058C5.52121 33.7 3.07996 34.9812 3.07996 37.8435V38.6425Z" fill="white"/>
    <path d="M20.5 40.205C20.2928 40.205 20.0941 40.1227 19.9476 39.9761C19.8011 39.8296 19.7188 39.6309 19.7188 39.4237C19.7188 39.2165 19.8011 39.0178 19.9476 38.8713C20.0941 38.7248 20.2928 38.6425 20.5 38.6425C24.1466 38.6425 27.7113 37.5611 30.7433 35.5352C33.7754 33.5093 36.1385 30.6297 37.534 27.2607C38.9295 23.8917 39.2946 20.1845 38.5832 16.608C37.8718 13.0315 36.1158 9.74621 33.5373 7.16768C30.9587 4.58915 27.6735 2.83315 24.097 2.12174C20.5205 1.41032 16.8133 1.77545 13.4443 3.17094C10.0753 4.56643 7.19572 6.92961 5.16978 9.96164C3.14384 12.9937 2.0625 16.5584 2.0625 20.205C2.0625 20.4122 1.98019 20.6109 1.83368 20.7574C1.68716 20.9039 1.48845 20.9862 1.28125 20.9862C1.07405 20.9862 0.875336 20.9039 0.728823 20.7574C0.58231 20.6109 0.5 20.4122 0.5 20.205C0.5 16.2493 1.67298 12.3825 3.87061 9.09356C6.06824 5.80458 9.19181 3.24113 12.8463 1.72737C16.5009 0.213622 20.5222 -0.182445 24.4018 0.589259C28.2814 1.36096 31.8451 3.26578 34.6421 6.06283C37.4392 8.85988 39.344 12.4235 40.1157 16.3032C40.8874 20.1828 40.4913 24.2041 38.9776 27.8586C37.4638 31.5132 34.9004 34.6367 31.6114 36.8344C28.3224 39.032 24.4556 40.205 20.5 40.205Z" fill="white"/>
    <path d="M25.108 23.6473C24.9708 23.6473 24.836 23.6112 24.7173 23.5424L20.108 20.8815C19.9895 20.8128 19.8911 20.7141 19.8228 20.5953C19.7545 20.4766 19.7186 20.3419 19.7188 20.2049V9.20667C19.7188 9.10407 19.739 9.00248 19.7782 8.90769C19.8175 8.81291 19.875 8.72678 19.9476 8.65424C20.0201 8.58169 20.1062 8.52415 20.201 8.48488C20.2958 8.44562 20.3974 8.42542 20.5 8.42542C20.6026 8.42542 20.7042 8.44562 20.799 8.48488C20.8938 8.52415 20.9799 8.58169 21.0524 8.65424C21.125 8.72678 21.1825 8.81291 21.2218 8.90769C21.261 9.00248 21.2813 9.10407 21.2813 9.20667V19.7535L25.5 22.1893C25.649 22.2753 25.7655 22.408 25.8313 22.5669C25.8972 22.7258 25.9088 22.9021 25.8642 23.0682C25.8197 23.2344 25.7216 23.3812 25.5851 23.4859C25.4486 23.5906 25.2814 23.6473 25.1094 23.6473H25.108Z" fill="white"/>
    <path d="M20.5 36.5073C20.2928 36.5073 20.0941 36.425 19.9476 36.2785C19.8011 36.132 19.7188 35.9332 19.7188 35.726C19.7188 35.5188 19.8011 35.3201 19.9476 35.1736C20.0941 35.0271 20.2928 34.9448 20.5 34.9448C23.3192 34.9455 26.0795 34.1381 28.4538 32.6181C30.8282 31.0981 32.717 28.9293 33.8965 26.3687C35.076 23.8081 35.4967 20.9631 35.1088 18.1707C34.7209 15.3784 33.5406 12.7557 31.7078 10.6136C29.875 8.4715 27.4665 6.89969 24.7678 6.08445C22.0691 5.26922 19.1932 5.24472 16.481 6.01388C13.7687 6.78304 11.3338 8.3136 9.46484 10.4242C7.59584 12.5348 6.37106 15.1369 5.93564 17.9223C5.92063 18.0243 5.88556 18.1224 5.83246 18.2108C5.77937 18.2992 5.70929 18.3762 5.62628 18.4374C5.54327 18.4986 5.44897 18.5427 5.34881 18.5673C5.24865 18.5919 5.14462 18.5964 5.04272 18.5805C4.94081 18.5647 4.84305 18.5288 4.75508 18.475C4.6671 18.4212 4.59065 18.3505 4.53013 18.267C4.46962 18.1835 4.42623 18.0888 4.40248 17.9885C4.37872 17.8881 4.37507 17.7841 4.39174 17.6823C4.87379 14.6031 6.22836 11.7265 8.29499 9.39348C10.3616 7.06043 13.0537 5.36865 16.0523 4.51856C19.0508 3.66847 22.2302 3.69571 25.2138 4.59704C28.1974 5.49837 30.86 7.23602 32.8864 9.60413C34.9128 11.9722 36.2179 14.8716 36.6471 17.9586C37.0763 21.0456 36.6117 24.191 35.3082 27.0221C34.0048 29.8532 31.9171 32.2514 29.2926 33.9324C26.6681 35.6135 23.6168 36.5071 20.5 36.5073Z" fill="white"/>
  </g>
  <defs>
    <clipPath id="clip0_479_1167">
      <rect width="40" height="40" fill="white" transform="translate(0.5 0.204956)"/>
    </clipPath>
  </defs>
</svg>
                        </div>

                        {/* Text Content */}
                        <div>
                            {/* Title */}
                            <h3 className="text-[#04436F] md:w-[300px] font-metropolis text-[24px] font-semibold leading-[24px] mb-2">
                            Mobil und flexibel
                            </h3>

                            {/* Description */}
                            <p className="text-[#04436F] md:w-[300px] font-metropolis text-[16px] font-normal leading-[16px]">
                            Du bestimmst, wann und wo du arbeitest.
                            </p>
                        </div>
                        </div>
                    </li>
                    </ul>

                    {/* Call to Action */}
                    <div
                className="flex flex-col items-center rounded-[50px_50px_50px_50px] px-2 py-2 mt-[32px]"
                style={{
                    background: "linear-gradient(93deg, #04436F 60%, rgba(0, 0, 0, 0.00) 100%)",
                }}
                >
                <p className="text-[#FAFCFF] font-metropolis text-center text-[16px] font-[400] leading-[25.6px] whitespace-nowrap">
                    Du hast Freude daran, anderen zu helfen?<br></br> Dann bist du bei uns genau richtig!
                </p>
                </div>


                </div>
                </section>

      
    <section className="bg-[#EDF2FB] rounded-[20px] py-14 px-6 md:px-20 mb-[120px] mt-[120px]">
  <div className="max-w-xl mx-auto bg-white p-4 lg:p-10 rounded-2xl shadow-xl space-y-6 border border-[#F2E6C6]">
    <h2 className="text-[28px] lg:text-3xl font-bold text-[#04436F] text-center">
Mitarbeiter-Registrierung     </h2>

    <div className="space-y-4">
      <input
        type="email"
        placeholder="Ihre E-Mail-Adresse"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-5 py-3 text-base focus:ring-2 focus:ring-[#04436F] outline-none"
      />

      <label className="flex items-center space-x-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={agbAccepted}
          onChange={() => setAgbAccepted(!agbAccepted)}
          className="h-5 w-5 text-[#04436F] focus:ring-[#04436F] rounded border-gray-300"
        />
        <span>
          Ich akzeptiere die{" "}
          <a
            href="/nutzungsbedingungen"
            className="underline text-[#04436F] hover:text-[#B99B5F]"
          >
            Nutzungsbedingungen für Plattform
          </a>
        </span>
      </label>
<button
        onClick={() => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(email)) {
            alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
            return;
          }

          if (!agbAccepted) {
            alert("Bitte akzeptieren Sie die Nutzungsbedingungen.");
            return;
          }

          handleEmployeeStart();
        }}
        className="w-full py-3 bg-[#04436F] text-white font-semibold rounded-xl hover:bg-[#B99B5F] transition duration-200"
      >
        Jetzt Bewerben
      </button>
    </div>
  </div>
</section>


             {/* FAQ Section */}
             <section className="mt-[120px] mb-[120px] text-center">
             <h2 className="text-[#04436F] text-center text-[55px] font-semibold leading-[71.5px]">
             Haben Sie noch Fragen?
            </h2>


            <div className="mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="bg-[#EDF2FB] p-5 rounded-[20px] cursor-pointer"
          onClick={() => toggleFAQ(index)}
        >
          <div className="flex justify-between items-center">
            <h4 className="text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']">
              {faq.question}
            </h4>

            {/* Dropdown Icon Rotation */}
            <div
              className={`w-[24px] h-[26px] flex justify-center items-center transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="26"
                viewBox="0 0 24 26"
                fill="none"
              >
                <g clipPath="url(#clip0_1352_2251)">
                  <path
                    d="M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z"
                    fill="#04436F"
                  />
                  <path
                    d="M16.4443 10.409L11.9999 14.8535L7.5554 10.409"
                    stroke="white"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1352_2251">
                    <rect
                      width="24"
                      height="25"
                      fill="white"
                      transform="matrix(-1 0 0 -1 24 25.1309)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          {/* Answer Section */}
          {openIndex === index && (
            <p className="text-[#04436F] text-left mt-4 text-[16px] leading-[26px] font-['Metropolis']">
              {faq.answer}
            </p>
          )}
        </div>
      ))}
    </div>

        </section>

  <section className="bg-[#EDF2FB] mt-[180px] mb-[120px] max-w-[1430px] mx-auto p-4 px-4 py-4 lg:px-[70px] lg:py-[120px] rounded-[20px]">
        <h2 className="text-[#003588] font-['Metropolis'] text-left text-[32px] lg:text-[42px] font-semibold  mb-[50px]">
        Was unsere Kunden über uns sagen
      </h2>
      
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-[40px]">
        {/* Left Text Testimonial */}
          <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[347px]">
    
  <div className="p-[30px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>

          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
Die Unterstützung durch Prime Home Care gibt mir ein Gefühl von Sicherheit und Freiheit zugleich. Ich weiss, dass immer jemand da ist, wenn ich Hilfe brauche.   </p> 
       <div className="flex items-center gap-3 mt-auto lg:mt-[70px]">
            <div>
            <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Markus Steiner</p>
            <p className="text-[#04436F] text-[16px] leading-[25px]">Kanton Zürich</p>
            </div>
          </div>
          </div>
          
        </div>

        {/* Center Video Testimonial */}
          {/* Right Text Testimonial with Curved Design */}
          <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[347px]">
    
  <div className="p-[30px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>

          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
Die Betreuung ist sehr herzlich und professionell. Es tut gut, jemanden an der Seite zu haben, der sich Zeit nimmt und wirklich zuhört.</p>
          <div className="flex items-center gap-3 mt-auto lg:mt-[70px]">
            <div>
            <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Claudia Huber</p>
            <p className="text-[#04436F] text-[16px] leading-[25px]">Kanton Bern</p>
            </div>
          </div>
          </div>
          
        </div>
        {/* Right Text Testimonial with Curved Design */}
          <div className="bg-white  rounded-[20px]  relative lg:w-[396px] lg:h-[347px]">
    
  <div className="p-[30px]">
          <div className="flex gap-1 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="140" height="25" viewBox="0 0 140 25" fill="none">
            <path d="M8.38333 6.70392C8.84521 5.44002 9.07616 4.80807 9.27754 4.49847C10.5593 2.52786 13.4446 2.52786 14.7264 4.49847C14.9278 4.80807 15.1587 5.44002 15.6206 6.70393L15.6678 6.8331C15.7078 6.94265 15.7278 6.99743 15.7487 7.04632C16.0481 7.74765 16.7203 8.21768 17.4818 8.25819C17.5349 8.26101 17.5933 8.26101 17.7099 8.26101H18.2079C18.5417 8.26101 18.7086 8.26101 18.7907 8.26516C21.8177 8.41833 23.0059 12.2656 20.5924 14.099C20.5269 14.1487 20.3891 14.2428 20.1135 14.431C20.0649 14.4642 20.0407 14.4808 20.0193 14.4961C19.3092 15.0089 19.0153 15.9242 19.2943 16.7545C19.3026 16.7794 19.3138 16.8099 19.3361 16.8709C19.5762 17.5281 19.6963 17.8567 19.7378 18.0228C20.4134 20.7235 17.6023 22.9681 15.1181 21.7115C14.9653 21.6343 14.6883 21.4553 14.1343 21.0974L13.2911 20.5528C13.0948 20.4259 12.9966 20.3625 12.9002 20.3141C12.3351 20.03 11.6689 20.03 11.1038 20.3141C11.0074 20.3625 10.9092 20.4259 10.7128 20.5528L9.88664 21.0864C9.3189 21.4532 9.03502 21.6366 8.87825 21.7153C6.39788 22.9618 3.59742 20.7257 4.26402 18.031C4.30615 17.8607 4.4288 17.5251 4.67408 16.8538C4.69756 16.7896 4.7093 16.7575 4.71819 16.7309C4.99168 15.912 4.70881 15.01 4.01664 14.4939C3.99416 14.4772 3.96858 14.4592 3.91743 14.4232C3.62918 14.2207 3.48505 14.1194 3.41583 14.0649C1.06046 12.211 2.25684 8.42814 5.24988 8.26578C5.33784 8.26101 5.514 8.26101 5.86633 8.26101H6.29724C6.41079 8.26101 6.46757 8.261 6.51925 8.25834C7.28284 8.21879 7.95706 7.74734 8.2563 7.04373C8.27655 6.9961 8.29604 6.94278 8.33501 6.83613L8.38333 6.70392Z" fill="#04436F"/>
            <path d="M37.3833 6.70392C37.8452 5.44002 38.0761 4.80807 38.2775 4.49847C39.5592 2.52786 42.4446 2.52786 43.7264 4.49847C43.9278 4.80807 44.1587 5.44002 44.6206 6.70393L44.6677 6.8331C44.7077 6.94265 44.7277 6.99743 44.7486 7.04632C45.048 7.74765 45.7202 8.21768 46.4817 8.25819C46.5348 8.26101 46.5932 8.26101 46.7098 8.26101H47.2078C47.5416 8.26101 47.7085 8.26101 47.7906 8.26516C50.8176 8.41833 52.0058 12.2656 49.5923 14.099C49.5268 14.1487 49.3891 14.2428 49.1135 14.431C49.0649 14.4642 49.0407 14.4808 49.0193 14.4961C48.3092 15.0089 48.0152 15.9242 48.2942 16.7545C48.3025 16.7794 48.3137 16.8099 48.3361 16.8709C48.5762 17.5281 48.6962 17.8567 48.7377 18.0228C49.4133 20.7235 46.6022 22.9681 44.118 21.7115C43.9652 21.6343 43.6882 21.4553 43.1342 21.0974L42.291 20.5528C42.0947 20.4259 41.9965 20.3625 41.9001 20.3141C41.335 20.03 40.6688 20.03 40.1038 20.3141C40.0073 20.3625 39.9091 20.4259 39.7127 20.5528L38.8866 21.0864C38.3188 21.4532 38.035 21.6366 37.8782 21.7153C35.3978 22.9618 32.5974 20.7257 33.264 18.031C33.3061 17.8607 33.4287 17.5251 33.674 16.8538C33.6975 16.7896 33.7092 16.7575 33.7181 16.7309C33.9916 15.912 33.7087 15.01 33.0166 14.4939C32.9941 14.4772 32.9685 14.4592 32.9174 14.4232C32.6291 14.2207 32.485 14.1194 32.4158 14.0649C30.0604 12.211 31.2568 8.42814 34.2498 8.26578C34.3378 8.26101 34.5139 8.26101 34.8663 8.26101H35.2973C35.4108 8.26101 35.4676 8.261 35.5193 8.25834C36.2829 8.21879 36.9571 7.74734 37.2563 7.04373C37.2766 6.9961 37.2961 6.94278 37.3351 6.83613L37.3833 6.70392Z" fill="#04436F"/>
            <path d="M66.3833 6.70392C66.8452 5.44002 67.0762 4.80807 67.2776 4.49847C68.5593 2.52786 71.4446 2.52786 72.7264 4.49847C72.9278 4.80807 73.1586 5.44002 73.6205 6.70393L73.6677 6.8331C73.7077 6.94265 73.7278 6.99743 73.7487 7.04632C74.0481 7.74765 74.7203 8.21768 75.4818 8.25819C75.5349 8.26101 75.5932 8.26101 75.7098 8.26101H76.2078C76.5416 8.26101 76.7086 8.26101 76.7907 8.26516C79.8177 8.41833 81.0058 12.2656 78.5923 14.099C78.5268 14.1487 78.3891 14.2428 78.1135 14.431C78.0649 14.4642 78.0407 14.4808 78.0193 14.4961C77.3092 15.0089 77.0153 15.9242 77.2943 16.7545C77.3026 16.7794 77.3137 16.8099 77.336 16.8709C77.5761 17.5281 77.6962 17.8567 77.7377 18.0228C78.4133 20.7235 75.6023 22.9681 73.1181 21.7115C72.9653 21.6343 72.6882 21.4553 72.1342 21.0974L71.291 20.5528C71.0947 20.4259 70.9965 20.3625 70.9001 20.3141C70.335 20.03 69.6688 20.03 69.1037 20.3141C69.0073 20.3625 68.9091 20.4259 68.7127 20.5528L67.8867 21.0864C67.3189 21.4532 67.0351 21.6366 66.8783 21.7153C64.3979 22.9618 61.5974 20.7257 62.264 18.031C62.3061 17.8607 62.4287 17.5251 62.674 16.8538C62.6975 16.7896 62.7092 16.7575 62.7181 16.7309C62.9916 15.912 62.7087 15.01 62.0166 14.4939C61.9941 14.4772 61.9685 14.4592 61.9174 14.4232C61.6291 14.2207 61.485 14.1194 61.4158 14.0649C59.0604 12.211 60.2568 8.42814 63.2498 8.26578C63.3378 8.26101 63.5139 8.26101 63.8663 8.26101H64.2973C64.4108 8.26101 64.4676 8.261 64.5193 8.25834C65.2829 8.21879 65.9571 7.74734 66.2563 7.04373C66.2766 6.9961 66.296 6.94278 66.335 6.83613L66.3833 6.70392Z" fill="#04436F"/>
            <path d="M95.3833 6.70392C95.8452 5.44002 96.0762 4.80807 96.2776 4.49847C97.5593 2.52786 100.445 2.52786 101.726 4.49847C101.928 4.80807 102.159 5.44002 102.621 6.70393L102.668 6.8331C102.708 6.94265 102.728 6.99743 102.749 7.04632C103.048 7.74765 103.72 8.21768 104.482 8.25819C104.535 8.26101 104.593 8.26101 104.71 8.26101H105.208C105.542 8.26101 105.709 8.26101 105.791 8.26516C108.818 8.41833 110.006 12.2656 107.592 14.099C107.527 14.1487 107.389 14.2428 107.114 14.431C107.065 14.4642 107.041 14.4808 107.019 14.4961C106.309 15.0089 106.015 15.9242 106.294 16.7545C106.303 16.7794 106.314 16.8099 106.336 16.8709C106.576 17.5281 106.696 17.8567 106.738 18.0228C107.413 20.7235 104.602 22.9681 102.118 21.7115C101.965 21.6343 101.688 21.4553 101.134 21.0974L100.291 20.5528C100.095 20.4259 99.9965 20.3625 99.9001 20.3141C99.335 20.03 98.6688 20.03 98.1037 20.3141C98.0073 20.3625 97.9091 20.4259 97.7127 20.5528L96.8867 21.0864C96.3189 21.4532 96.0351 21.6366 95.8783 21.7153C93.3979 22.9618 90.5974 20.7257 91.264 18.031C91.3061 17.8607 91.4288 17.5251 91.6741 16.8538C91.6976 16.7896 91.7092 16.7575 91.7181 16.7309C91.9916 15.912 91.7087 15.01 91.0166 14.4939C90.9941 14.4772 90.9686 14.4592 90.9175 14.4232C90.6292 14.2207 90.485 14.1194 90.4158 14.0649C88.0604 12.211 89.2568 8.42814 92.2498 8.26578C92.3378 8.26101 92.5139 8.26101 92.8663 8.26101H93.2973C93.4108 8.26101 93.4676 8.261 93.5193 8.25834C94.2829 8.21879 94.9571 7.74734 95.2563 7.04373C95.2766 6.9961 95.296 6.94278 95.335 6.83613L95.3833 6.70392Z" fill="#04436F"/>
            <path d="M124.383 6.70392C124.845 5.44002 125.076 4.80807 125.278 4.49847C126.559 2.52786 129.445 2.52786 130.726 4.49847C130.928 4.80807 131.159 5.44002 131.621 6.70393L131.668 6.8331C131.708 6.94265 131.728 6.99743 131.749 7.04632C132.048 7.74765 132.72 8.21768 133.482 8.25819C133.535 8.26101 133.593 8.26101 133.71 8.26101H134.208C134.542 8.26101 134.709 8.26101 134.791 8.26516C137.818 8.41833 139.006 12.2656 136.592 14.099C136.527 14.1487 136.389 14.2428 136.114 14.431C136.065 14.4642 136.041 14.4808 136.019 14.4961C135.309 15.0089 135.015 15.9242 135.294 16.7545C135.303 16.7794 135.314 16.8099 135.336 16.8709C135.576 17.5281 135.696 17.8567 135.738 18.0228C136.413 20.7235 133.602 22.9681 131.118 21.7115C130.965 21.6343 130.688 21.4553 130.134 21.0974L129.291 20.5528C129.095 20.4259 128.997 20.3625 128.9 20.3141C128.335 20.03 127.669 20.03 127.104 20.3141C127.007 20.3625 126.909 20.4259 126.713 20.5528L125.887 21.0864C125.319 21.4532 125.035 21.6366 124.878 21.7153C122.398 22.9618 119.598 20.7257 120.264 18.031C120.306 17.8607 120.429 17.5251 120.674 16.8538C120.698 16.7896 120.709 16.7575 120.718 16.7309C120.992 15.912 120.709 15.01 120.017 14.4939C119.994 14.4772 119.969 14.4592 119.918 14.4232C119.629 14.2207 119.485 14.1194 119.416 14.0649C117.061 12.211 118.257 8.42814 121.25 8.26578C121.338 8.26101 121.514 8.26101 121.866 8.26101H122.297C122.411 8.26101 122.468 8.261 122.519 8.25834C123.283 8.21879 123.957 7.74734 124.256 7.04373C124.277 6.9961 124.296 6.94278 124.335 6.83613L124.383 6.70392Z" fill="#04436F"/>
            </svg>
          </div>

          <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mb-6">
Ich hätte nie gedacht, dass stundenweise Betreuung so viel Entlastung bringen kann. Prime Home Care macht meinen Alltag leichter und angenehmer. </p>
          <div className="flex items-center gap-3 mt-auto lg:mt-[70px]">
            <div>
            <p className="text-[#04436F] leading-[26px] font-[500] text-[22px]">Peter Keller</p>
            <p className="text-[#04436F] text-[16px] leading-[25px]">Kanton Luzern</p>
            </div>
          </div>
          
        </div>
        </div>
        </div>
    </section>

    </div>
   
  );
}
