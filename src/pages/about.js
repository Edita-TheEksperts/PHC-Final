
import Link from 'next/link';

const teamMembers = [
  { name: "Emma Johnson, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "David Miller, LPN", position: "Lorem", image: "/images/team1.png" },
  { name: "Olivia Martinez, RN", position: "Lorem", image: "/images/team1.png" },
  { name: "Sophia Brown, CNA", position: "Lorem", image: "/images/team1.png" }
];
export default function About() {
  return (
    <div className="bg-[#FAFCFF] px-4 py-4 max-w-[1430px] mx-auto lg:py-0">
 
                <section className="bg-[#B99B5F] gap-10 lg:gap-[100px] text-white p-4 lg:p-[60px] rounded-[20px] flex flex-col lg:flex-row items-start">
        <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img src="/images/hero-services.png" alt="Home Care" className="rounded-lg lg:w-[545px] lg:h-[335px] w-full" />
          </div>
        <div className="lg:w-1/2 flex flex-col justify-start items-start">
  
        <h1 className="text-[40px] lg:text-[52px] font-semibold leading-[47px] mt-2 lg:mt-[38px] lg:leading-[60px] tracking-[-1.04px] font-['Metropolis']">
  <span className="text-[#FFFFFF]">Über die Prime Home Care AG</span>
</h1>


<p className="text-[#FFFFFF] text-[16px] font-normal leading-[25.6px] font-['Inter'] mt-2">
Willkommen bei der Prime Home Care AG – Ihrem zuverlässigen Partner für individuelle und professionelle stundenweise Betreuung zu Hause </p>

          </div>
          
        </section>

      {/* Content with Image */}
      <section className="flex flex-col p-4 lg:flex-row items-center justify-between mt-[120px] gap-[40px]">
        <div className="flex-1">
          <h2 className="text-[#04436F] text-[40px] font-semibold leading-[48px] ">
          Verpflichtet zu fürsorglicher Seniorenbetreuung in den<br></br> eigenen vier Wänden
          </h2>
          <p className="text-[#04436F] lg:pr-[80px] text-[16px] font-normal leading-[25.6px] mt-4">
          Seit unserer Gründung verfolgen wir das Ziel, Menschen in ihrem vertrauten Umfeld die bestmögliche Betreuung und Unterstützung zu bieten. Mit einem engagierten Team aus erfahrenen Mitarbeitern und einem breiten Spektrum an Dienstleistungen setzen wir uns täglich dafür ein, die Lebensqualität unserer Kundinnen und Kunden zu verbessern.
</p>

<div className="flex flex-col justify-center mt-[30px]">
  {/* Row for image + heading */}
  <div className="flex items-center gap-3">
    <img 
      src="/images/philosophy-icon.png"  // <-- replace with your actual image path
      alt="Philosophie Icon"
      className="w-[50px] h-[50px] bg-[#B99B5F] rounded-full object-contain p-2"
    />
    <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px] mt-3">
      Unsere Philosophie
    </p>
  </div>

  {/* Paragraph text */}
  <p className="text-[#04436F] lg:pr-[70px] text-[16px] font-normal leading-[25.6px] mt-2">
    Unsere Philosophie basiert auf Empathie, Respekt und Kompetenz. Wir wissen, dass jede Person einzigartige Bedürfnisse hat. Daher legen wir grossen Wert auf eine persönliche und flexible Betreuung, die genau auf die individuellen Anforderungen abgestimmt ist. Von Betreuung und Gesellschaft bis hin zu hauswirtschaftlichen Dienstleistungen – wir stehen Ihnen zuverlässig zur Seite 
  </p>
</div>

        <div className="flex flex-col justify-center mt-[30px]">
       <div className="flex items-center gap-3">
    <img 
      src="/images/security.png"  // <-- replace with your actual image path
      alt="Philosophie Icon"
      className="w-[50px] h-[50px] bg-[#B99B5F] rounded-full object-contain p-2"
    />
          <p className="text-[#04436F] text-[28px] font-[500] leading-[33.6px]  mt-3">
          Unsere Vision
        </p>
        </div>
          <p className="text-[#04436F] lg:pr-[70px] text-[16px] font-normal leading-[25.6px] mt-2">
          Als digitales Unternehmen verbinden wir professionelle Betreuung mit modernster Technologie. Über unsere benutzerfreundliche digitale Plattform ermöglichen wir es Ihnen, flexibel und unkompliziert die passende Betreuung zu finden und zu buchen. Unser Ziel ist es, Menschen in ihrem vertrauten Umfeld die bestmögliche Unterstützung zu bieten – individuell abgestimmt und genau dann, wenn sie gebraucht wird.           </p>
        </div>
        
        </div>
        <div className="mt-10 lg:mt-0 lg:max-w-[625px] flex-1">
          <img src="/images/phc-about-image1.png" alt="Elderly care" className="w-full h-auto rounded-[20px]" />
        </div>
      </section>


      <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
 Mehr Zeit und Entlastung gewinnen  </h2>
  <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2 mb-10">
Bei Prime Home Care bieten wir einfühlsame und individuelle Betreuung – für Sie oder Ihre Liebsten.   </p>
  <Link   href="/register-client" className="bg-[#04436F] hover:bg-[#B99B5F] w-[180px] text-[#FAFCFF] text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Buchen Sie jetzt
  </Link>
</section>


      <section className="flex flex-col lg:flex-row items-center justify-between mx-auto mt-[120px] lg:px-[70px] gap-[70px] ">
      {/* Images */}
      <div className="flex flex-col lg:flex-row gap-10">
        <img
          src="/images/photo11.png"
          alt="Elderly care 1"
          className="lg:max-w-[294.59px] lg:h-[306px] lg:mt-[150px] w-full h-auto rounded-[20px]"
        />
        <img
          src="/images/phc-2-container1.png"
          alt="Elderly care 2"
          className="max-w-[368.25px] lg:h-[406px] w-full h-auto rounded-[20px]"
        />
      </div>

      {/* Text Content */}
      <div className=" flex-1 text-left p-4 lg:p-0">
        <h2 className="text-[#04436F] text-[50px] lg:text-[55px] font-semibold leading-[71.5px]">
        Unsere Werte
        </h2>
        <p className="text-[#04436F] text-[16px] font-normal leading-[25.6px] mt-2">
        Qualität und Vertrauen sind die Grundlagen unseres Handelns. Durch kontinuierliche Weiterbildung und hohe Standards in der Betreuung, stellen wir sicher, dass unsere Kundinnen und Kunden jederzeit in besten Händen sind. Unsere digitale Plattform sorgt zudem für maximale Transparenz und Effizienz – von der Buchung bis zur Abrechnung.        
        </p>
      </div>
    </section>
   <section 
  className="bg-[#F1F1F1] lg:h-[300px] h-[400px] flex flex-col rounded-[20px] justify-center items-center text-center mt-[120px] relative overflow-hidden" 
  style={{ backgroundImage: 'url(/images/phc-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <h2 className="text-[#04436F] text-[44px] font-semibold leading-[52.8px]">
 Haben Sie Fragen?<br></br> Kontaktieren Sie uns über unser Kontaktformular
   </h2>
  <Link href="/contact">
  <button className="bg-[#04436F]  hover:bg-[#B99B5F] w-[180px] text-[#FAFCFF] mt-4 text-[18px] font-medium leading-[21.6px] py-3 px-5 rounded-[50px]">
    Kontakt
  </button>
</Link>
</section>

    <section className="bg-[#FAFCFF] mt-[120px] mb-[40px] px-4 lg:px-[20px] text-center">
      {/* Title */}
      <h2 className="text-[#04436F] text-left text-[40px] leading-[47px] lg:text-[55px] font-semibold lg:leading-[71.5px]  mb-[30px]">
      Ihre Zufriedenheit ist unser Antrieb      
      </h2>
      <h2 className="text-[#04436F] text-left text-[24px] font-[400] leading-[27.5px]  mb-[120px]">
      Wir bei der Prime Home Care AG sind stolz darauf, Ihnen ein Stück Lebensqualität und Selbstständigkeit zurückzugeben – in Ihrem Zuhause, wo Sie sich am wohlsten fühlen.      </h2>
    </section>
      </div>
  );
}
