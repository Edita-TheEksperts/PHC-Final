import Link from "next/link";
export default function HomeCarePage() {
    return (
      <div className="bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]">
        
        {/* Hero Section */}
<section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-center">
  <div className="lg:w-1/2 flex flex-col justify-center">
    <h1 className="text-[32px] lg:text-[48px] font-semibold lg:leading-[56px] leading-[37px] text-center lg:text-left">
      <span className="text-[#FFFFFF]">Entdecken Sie unser umfassendes Dienstleistungsangebot</span>
    </h1>
  </div>

  <div className="lg:w-1/2 mt-6 lg:mt-0 flex justify-center">
    <img src="/images/phc-hero-services.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
  </div>
</section>

  
      {/* Services Grid */}
        <div className="max-w-[1000px] mx-auto text-center px-4">
  <h2 className="text-[#04436F] text-[40px] font-semibold leading-[48px] mt-[120px]">
    Entdecken Sie eine Vielzahl von Dienstleistungen, die darauf ausgerichtet sind, einfühlsame und professionelle Betreuung in der Geborgenheit Ihres Zuhauses zu bieten

  </h2>
</div>

<section className="grid grid-cols-1 p-2 md:grid-cols-2 lg:grid-cols-2 gap-[16px] mt-[40px]">
  {[
    {
      icon: "/images/shopping-cart.png",
      title: "Alltagsbegleitung und Besorgungen",
      description: [
        "Beleitung zu Terminen",
        "Einkäufe erledigen",
        "Postgänge",
        "Sonstige Begleitungen"
      ]
    },
    {
      icon: "/images/music (1).png",
      title: "Freizeit und Soziale Aktivitäten",
      description: [
        "Gesellschaft leisten",
        "Gemeinsames Kochen",
        "Vorlesen",
        "Biografiearbeit",
        "Kartenspiele",
        "Ausflüge und Reisebegleitung"
      ]
    },
    {
      icon: "/images/medical-report.png",
      title: "Gesundheitsführsorge",
      description: [
        "Körperliche Unterstützung",
        "Nahrungsaufnahme",
        "Grundpflegerische Tätigkeiten",
        "Gesundheitsfördernde Aktivitäten",
        "Geistige Unterstützung"
      ]
    },
    {
      icon: "/images/house (1).png",
      title: "Haushaltshilfe und Wohnpflege",
      description: [
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
        "Vorhänge reinigen"
      ]
    }
  ].map((service, index) => (
    <div
      key={index}
      className="p-8 bg-[#EDF2FB] rounded-[20px] flex flex-col justify-start text-left"
    >
      {/* Icon */}
      <div className="flex justify-center items-center p-4 bg-white w-[100px] h-[100px] rounded-full mb-[10px] lg:mb-[30px]">
        <img
          src={service.icon}
          alt={service.title}
          className="w-[40px] h-[40px] object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="text-[#04436F] text-[28px] mb-2 font-semibold leading-[33.6px]">
        {service.title}
      </h3>

      {/* Bullet List */}
      <ul className="text-[#04436F] text-[20px] font-normal leading-[28px] list-disc pl-5">
        {service.description.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  ))}
</section>

  
        {/* Join Community Section */}
        <section 
  className="bg-cover  bg-center bg-no-repeat lg:h-[310px] p-3 h-[400px] flex flex-col justify-center items-center rounded-[20px]  text-center mt-[120px] relative "
  style={{ backgroundImage: "url('/images/community-bg.png')" }} // Update with your image path
>
  {/* Heading */}
  <h2 className="text-[#FAFCFF] text-[44px] font-semibold leading-[52.8px]">
    Lassen Sie sich Zuhause betreuen
  </h2>

  {/* Button with hover effect */}
  <Link   href="/register-client" className="bg-[#B99B5F] text-[#FAFCFF] py-3 px-6 rounded-[50px] text-[14px] lg:text-[18px] font-medium mt-4 
                     transition duration-300 hover:bg-[#04436F]">

Buchen Sie jetzt
   </Link>

</section>

  
        {/* Why Choose Us */}
        <section className="flex flex-col gap-[20px] p-2 lg:px-4 lg:flex-row items-center justify-between mt-[120px] mx-auto mb-[120px]">
          <div className="lg:w-1/2">
          <h2 className="text-[#04436F] text-[55px] font-semibold leading-[71.5px] ">
          Warum die<br></br> <span className="text-[#B99B5F]">Prime Home Care AG?</span>
</h2>
<p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2">
Weil es auf Vertrauen, Herzlichkeit und Verlässlichkeit ankommt.<br></br>Die Entscheidung für eine Betreuung ist oft mit vielen Fragen verbunden – besonders, wenn es um die Unterstützung im eigenen Zuhause geht. Bei der Prime Home Care AG stehen Sie und Ihre individuellen Bedürfnisse im Mittelpunkt. Unsere stundenweise Betreuung bietet die perfekte Balance zwischen Selbstständigkeit <br></br> und gezielter Unterstützung.
</p>

<h1 className="text-[#04436F] text-[30px] leading-[36px] font-[600] mt-[30px]">Ihre Vorteile auf einen Blick</h1>
<div className="p-[16px] bg-[#EDF2FB] rounded-[16px] mb-[16px]">
  <h1 className="text-[#04436F] text-[24px] leading-[36px] font-[500]">Individuell & flexibel</h1>
  <p className="text-[#04436F] text-[16px] leading-[25px] font-[400]">Ob ein kurzer Einkauf, ein Arztbesuch oder einfach jemand zum Reden – wir passen uns Ihrem Alltag an, nicht umgekehrt.</p>
</div>
<div className="p-[16px] bg-[#EDF2FB] rounded-[16px] mb-[16px]">
  <h1 className="text-[#04436F] text-[24px] leading-[36px] font-[500]">Vertraute Gesichter</h1>
  <p className="text-[#04436F] text-[16px] leading-[25px] font-[400]">Als regional verankertes Unternehmen sind wir schnell zur Stelle, kennen die lokalen Gegebenheiten – und nehmen uns Zeit.</p>
</div>

<div className="p-[16px] bg-[#EDF2FB] rounded-[16px] mb-[16px]">
  <h1 className="text-[#04436F] text-[24px] leading-[36px] font-[500]">Mehr Lebensfreude zu Hause</h1>
  <p className="text-[#04436F] text-[16px] leading-[25px] font-[400]">Mit einfühlsamer Begleitung und kleinen Gesten schaffen wir Wohlbefinden im Alltag – für Sie oder Ihre Angehörigen.</p>
</div>
<div className="p-[16px] bg-[#EDF2FB] rounded-[16px] mb-[16px]">
  <h1 className="text-[#04436F] text-[24px] leading-[36px] font-[500]">Einfach & zuverlässig organisiert</h1>
  <p className="text-[#04436F] text-[16px] leading-[25px] font-[400]">Keine langen Wartezeiten, keine unnötige Bürokratie – dafür direkte Ansprechpartner und unkomplizierte Abläufe.</p>
</div>


          </div>
          <div className="lg:w-1/2 lg:mt-0 ">
            <img src="/images/phc-why-choose.png" alt="Why Choose Us" className="rounded-[20px] lg:h-[840px] h-[600px] lg:w-[600px] lg:ml-[80px] w-[380px]" />
          </div>
        </section>
  
        
  
    
  
      </div>
    );
  }
  