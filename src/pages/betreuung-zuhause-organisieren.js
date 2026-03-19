import Link from "next/link";
export default function HomeCarePage() {
    return (
      <div className="bg-[#FAFCFF] px-4 mx-auto max-w-[1430px]">
        
        {/* Hero Section */}
        <section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
      
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
        <p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter']">
        Stundenweise Betreuung Schweiz
</p>
        <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']">
  <span className="text-[#FFFFFF]">Professionelle<br></br> stundenweise<br></br> Unterstützung im Alltag <br></br>in der Schweiz</span>
</h1>


<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
Prime Home Care – Ihr zuverlässiger Partner für die Seniorenbetreuung <br></br>zuhause in der Schweiz!  </p>

          </div>
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/phc-hero-servicess.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
          
        </section>
  
        {/* Introduction Section */}
        <section className="mt-[120px] lg:px-6  flex flex-col lg:flex-row items-top gap-20">
          <img src="/images/phc-intro2.png" alt="Senior care" className="w-full lg:w-1/2 rounded-lg lg:h-[700px] items-start flex justify-start align-top" />
          <div className="lg:w-1/2 text-left">
          <h2 className="text-[#04436F] text-[40px] lg:text-[56px] font-semibold leading-[50px] lg:leading-[64px] font-['Instrument Sans']">
          Professionelle <br></br>stundenweise Betreuung <br></br>für den Alltag im eigenen Zuhause
</h2>

<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-2">
Die private Seniorenbetreuung zuhause stellt einen stetig wichtiger werdenden Bestandteil des Lebens dar.</p>
<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4">
Bei alltäglichen Aktivitäten wie der Körperpflege, der Zubereitung von Mahlzeiten, beim Einkaufen sowie bei der Hausarbeit können erfahrene und qualifizierte Betreuerinnen und Betreuer eine weitreichende Unterstützung leisten. Sie begleiten sie zu Arztterminen oder anderen Terminen, bieten Gesellschaft und Unterhaltung. Sie kümmern sich gerne um Haustiere und teilweise auch um Balkon und Pflanzen. Zudem wünschen sich viele Angehörige, dass stets eine vertraute Ansprechperson vor Ort ist, die im Haus für Schutz und Sicherheit sorgen kann.</p>
<p className="text-[#04436F] text-[16px] lg:text-[18px] font-light leading-[25.6px] lg:leading-[28px] font-['Metropolis'] mt-4">

Die Prime Home Care organisiert stundenweise Unterstützung sowie Betreuung und Pflege für das selbstbestimmte Leben im gewohnten Zuhause</p>



          </div>
        </section>
  
  
        {/* Call-to-Action Section */}
        <section className="rounded-[20px] mt-[120px] px-6 py-6 text-left bg-[#EDF2FB] lg:py-[120px] lg:px-[70px]">
        <p className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
  Sie müssen private Betreuung für sich <br></br>oder für einen nahen Angehörigen<br></br> organisieren?
</p>

<p className="text-[#003588] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-[16px]">
Sie haben das Gefühl, nicht alle Fakten zu kennen und sollen <br></br>weitreichende und kostspielige Entscheidungen erst noch unter<br></br> Zeitdruck treffen?<br></br>
Registrieren Sie sich und erstellen Sie ihre eigene Offerte direkt<br></br> und einfach
</p>
<Link href="/register-client">

          <button className="bg-[#04436F] text-white lg:mt-[60px] px-6 py-3 rounded-full text-[18px] font-medium mt-6 transition duration-300 hover:bg-[#6FCF97]">
          Buchen Sie jetzt                   </button> </Link>
        </section>
  
        {/* Image & Text Grid */}
        <section className="mt-[120px] px-0 lg:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
  
  {/* Left Side - Images */}
  <div className="flex lg:flex-row flex-col gap-8 lg:gap-0 items-start">
    <img src="/images/phc-photo1testt.png" alt="Care 1" 
         className="rounded-[20px] lg:max-w-[294px] w-full lg:mt-[305px]" />
    <img src="/images/phc-photo2testt.png" alt="Care 2" 
         className="rounded-[20px] lg:max-w-[405px] w-full  lg:ml-[-120px]" />
    <img src="/images/phc-photo3testt.png" alt="Care 3" 
         className=" lg:max-w-[405px] rounded-[20px] w-full lg:mt-[250px] lg:ml-[-140px]" />
  </div>

  {/* Right Side - Text Content */}
  <div className="text-left lg:ml-[190px]">
    
    {/* Heading */}
    <h3 className="text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
    Unsere Lösungen <br></br>für eine optimale<br></br> Betreuungs-<br></br>Organisation
    </h3>

    {/* Description */}
    <p className="text-[#04436F] text-[20px] font-light leading-[27px] font-['Metropolis'] mt-4">
    Wir bei Prime Home Care haben viele Jahre<br></br> Erfahrung in der professionellen Betreuung von Senioren und pflegebedürftigen Menschen<br></br> gesammelt. Hand in Hand mit externen<br></br> Pflegefachleuten, die uns bei der<br></br> Bedarfsanalyse unterstützen, organisieren wir<br></br> für Sie und Ihre Angehörigen individuelle und<br></br> ganzheitliche Betreuungslösungen.<br></br>Wir haben uns zum Ziel gesetzt, unseren<br></br> Kunden eine umfassende und neutrale Beratung sowie eine nahtlose Organisation rund um das Thema Pflege und Seniorenbetreuung zuhause<br></br> zu bieten. Im Folgenden stellen wir Ihnen einige unserer Lösungen vor.
    </p>

  </div>

</section>

<section className="mt-[120px] lg:px-6  flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 text-left">

          <h2 className="text-[#003588] text-[33px] lg:text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Moderne Seniorenbetreuung –<br></br> digital, flexibel und persönlich</h2>

<p className="text-[#04436F] text-[20px]  font-light leading-[27px]  font-['Metropolis'] mt-2">
Die Prime Home Care organisiert bedarfsgerechte und qualitativ hochwertige Seniorenbetreuung für das eigene Zuhause. Ganzheitlich überblicken wir den gesamten Prozess der häuslichen Betreuung mit allen dafür benötigten Pflegeleistungen und beziehen auch die benötigten Hilfsmittel und baulichen Massnahmen mit in unsere Überlegungen ein.
  </p>
<p className="text-[#04436F] text-[20px]  font-light leading-[27px]  font-['Metropolis'] mt-4">
Die Prime Home Care ist selbst kein Pflege-Anbieter oder Personaldienstleister. Es ist jedoch unser Ziel, die jeweils individuell beste und günstigste Hilfe für den Alltag in der gewohnten Umgebung zu organisieren.</p>
<p className="text-[#04436F] text-[20px]  font-light leading-[27px] font-['Metropolis'] mt-4">
Bei der Organisation professioneller Seniorenbetreuung in der Schweiz ist dieser Ansatz völlig neu. Erfahren Sie mehr über unsere Lösungen für die häufigsten Probleme bei der privaten Altenbetreuung zu Hause.</p>
          </div>
          <img src="/images/image123.png" alt="Senior care" className="w-full lg:w-1/2 rounded-lg lg:h-[547px] items-start flex justify-start align-top" />

        </section>
  
        <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
    Join our community of care
  </h2>
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10">
    At Prime Home Care, we're here to provide compassionate and personalized care to you<br></br> or your loved ones.
  </p>
  <button className="bg-[#04436F] w-[180px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Buchen Sie jetzt
  </button>
</section>



  
        {/* Flexible Care Models */}
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <img src="/images/phc-section1.png" alt="Care model" className="lg:h-[680px] w-full lg:w-1/2 rounded-[20px]" />
          <div className="lg:w-1/2 text-left lg:px-6">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Qualifizierte Betreuung –<br></br> intelligent gematcht</h3>
<p className="text-[#04436F]  text-[20px] font-normal leading-[27px] font-['Metropolis'] mt-2">
Die eigene Suche nach geeigneten, qualifizierten und zuverlässigen Betreuerinnen und Betreuern ist oft ein langwieriger und mühsamer Prozess. Lieber möchten sich Senioren und Angehörige auf professionelle Anbieter verlassen. Wer aber stellt sicher, dass Betreuungskräfte über die notwendigen Fähigkeiten verfügen, sie sorgfältig ausgewählt und geschult werden? 
Werden Betreuungskräfte eingesetzt, die mindestens über ein in der Schweiz anerkanntes Pflegehelfer-Zertifikat verfügen, so können diejenigen Stunden, welche Grundpflege darstellen, kassenfähig gestaltet werden. Dafür sorgen wir aufgrund unserer Zusammenarbeit mit bewilligten Spitex-Partnern unter deren unter Weisung und Obhut dann die Pflege erfolgt. So wird sichergestellt, dass jede Betreuungskraft über ausreichende Erfahrung und Qualifikationen verfügt. Die Betreuungs- und Pflegekräfte erhalten neben Weiterbildung so auch eine Entlastung bei ihrer Pflegearbeit. <br></br>
Dank der Beteiligung der Krankenkassen an den Betreuungskosten können Sie den Pflegekräften gerne ein überdurchschnittliches Gehalt bezahlen, ohne dass sich dies negativ auf Ihre Gesamtkosten auswirkt. 
</p>

          </div>
        </section>
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <div className="lg:w-1/2 text-left ">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Individuell wählbare Leistungen – Betreuung nach Ihren <br></br>Wünschen
</h3>
<p className="text-[#04436F]  text-[20px] font-normal leading-[27px] font-['Metropolis'] mt-2">
Bei der Prime Home Care AG steht nicht ein starres Betreuungspaket im Vordergrund, sondern Ihre individuelle Auswahl. Über unsere benutzerfreundliche Online-Plattform stellen Sie sich Ihre gewünschten Dienstleistungen einfach und bequem selbst zusammen – ganz nach Ihrem Bedarf, ohne unnötige Zusatzleistungen. 
  <br /><br />
  Ob Alltagshilfe, Begleitung zu Terminen, Unterstützung im Haushalt oder soziale Aktivitäten – Sie entscheiden, was gebraucht wird, wann es gebraucht wird und wie oft. Unsere digitale Lösung ermöglicht es Ihnen, alles übersichtlich zu planen, direkt zu buchen und jederzeit flexibel anzupassen.
</p>

          </div>
          <img src="/images/phc-section3.png" alt="Care model" className="lg:h-[500px] w-full lg:w-1/2 rounded-[20px]" />

        </section>
        <section className="mt-[120px]  flex flex-col lg:flex-row items-start gap-10">
          <img src="/images/phc-section2.png" alt="Care model" className="lg:h-[630px] w-full lg:w-1/2 rounded-[20px]" />
          <div className="lg:w-1/2 text-left lg:px-6">
          <h3 className="text-[#003588] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
          Transparente und faire Preise</h3>
<p className="text-[#04436F]  text-[20px] font-normal leading-[27px] font-['Metropolis'] mt-2">
Die Prime Home Care AG verfolgt das Ziel, hochwertige Betreuung und faire Löhne in ein ausgewogenes und nachhaltiges Verhältnis zu bringen. Dank unserer digitalen Plattform und durchdachter Prozessgestaltung ermöglichen wir ein effizientes Modell, das sowohl Betreuungspersonen gerecht entlohnt als auch unseren Kunden faire, transparente Kosten bietet. Als Kunde profitieren Sie doppelt:
Einerseits von motivierten Betreuungspersonen, die mit Freude und Engagement arbeiten – andererseits von einer übersichtlichen Kostenstruktur ohne versteckte Gebühren. Über unsere Plattform erhalten Sie auf Knopfdruck eine klare Offerte, basierend auf Ihren gewählten Leistungen. Durch digitale Abläufe, direkte Buchung und automatisierte Planung schaffen wir es, erstklassige stundenweise Betreuung zu einem sehr fairen Preis-Leistungs-Verhältnis anzubieten – einfach, effizient und menschlich.Wir bieten Ihnen ein klar strukturiertes, transparentes Preismodell, das Betreuung planbar und sorgenfrei macht – mit einem digitalen Ansprechpartner an Ihrer Seite.
Prime Home Care AG – Betreuung nach Mass, digital organisiert.</p>

          </div>
        </section>
  
        {/* FAQ Section */}
        <section className="mt-[120px] text-center">
        <h2 className="text-[#04436F] text-[40px] font-semibold leading-[48px] font-['Metropolis']">
    Häufig gestellte Fragen bei der Betreuungs-Organisation
  </h2>

  {/* Paragraph */}
  <p className="text-[#04436F] lg:px-[60px] text-[24px] font-normal leading-[32px] font-['Metropolis'] mt-3">
    Wir haben hier für Sie einige der am häufigsten gestellten Fragen zusammengestellt.
    <br /><br />
    Ihre Frage wurde nicht beantwortet? Warum treten Sie nicht direkt mit uns in Kontakt? 
    Unser<br></br> Team freut sich, von Ihnen zu hören!
  </p>
  <div className="mt-6 lg:mt-[60px] space-y-[30px] lg:px-[80px] mb-[70px]">
  {[
    "Wie wird sichergestellt, dass die Pflegekräfte zuverlässig und qualifiziert sind?",
    "Wie funktioniert die Abrechnung und Bezahlung Ihrer Dienstleistungen?",
    "Was passiert, wenn sich die Betreuungs-Bedürfnisse im Laufe der Zeit ändern?",
    "Wie läuft die Betreuungs-Organisation ab, wenn Betreuung und Pflege kurzfristig notwendig ist oder unerwartet mehr Unterstützung benötigt wird?",
    "Wie wird sichergestellt, dass die Pflegekräfte individuelle Bedürfnisse und Wünsche verstehen und umsetzen?",
  ].map((faq, index) => (
    <div 
      key={index} 
      className="bg-[#EDF2FB] p-5 rounded-[20px] flex justify-between items-center cursor-pointer"
    >
      {/* FAQ Text */}
      <h4 className="text-[#04436F] lg:w-[850px] text-left text-[20px] font-semibold leading-[28px] font-['Metropolis']">
        {faq}
      </h4>

      {/* Dropdown Icon */}
      <div className="w-[24px] h-[26px] flex justify-center items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
          <g clip-path="url(#clip0_1352_2251)">
            <path d="M12 0.630859C5.37258 0.630859 0 6.00344 0 12.6309C0 19.2583 5.37258 24.6309 12 24.6309C18.6274 24.6309 24 19.2583 24 12.6309C24 6.00344 18.6274 0.630859 12 0.630859Z" fill="#04436F"/>
            <path d="M16.4443 10.409L11.9999 14.8535L7.5554 10.409" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_1352_2251">
              <rect width="24" height="25" fill="white" transform="matrix(-1 0 0 -1 24 25.1309)"/>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  ))}
</div>

        </section>
  
      </div>
    );
  }
  