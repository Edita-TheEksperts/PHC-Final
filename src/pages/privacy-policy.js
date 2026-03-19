export default function Impressum() {
  return (
    <div className="flex flex-col items-center bg-[#FAFCFF] min-h-screen py-10 px-4">
      
      {/* Top Hero Section */}
      <div className="flex flex-col items-center bg-[#B99B5F] w-full max-w-[1410px] py-[60px] md:py-[90px] rounded-[20px]">
        <h1 className="text-[#FAFCFF] text-[40px] md:text-[64px] font-bold leading-[43.2px]">
          Privacy Policy
        </h1>
        <p className="text-[#FAFCFF] text-[16px] md:text-[18px] font-normal mt-4">
          Lorem ipsum text
        </p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-start w-full max-w-[920px] mt-[80px] mb-[80px]">
        
        {/* Main Title */}
        <h2 className="text-[#04436F] text-[36px] md:text-[48px] lg:text-[64px] lg:leading-[43.2px] font-bold leading-[43.2px] md:leading-[55px] mb-[30px]">
          Impressum
        </h2>

        {/* Section Title */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          Kontaktadresse
        </h2>

        {/* Contact Info */}
        <p className="text-[#04436F] text-[20px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          Prime Home Care AG<br />
          Schulhausstrasse 1<br />
          8834 Schindellegi<br />
          Telefon: +41 43 200 10 20<br />
          E-Mail: info@phc.ch
        </p>

        {/* Handelsregister */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          Handelsregistereintrag
        </h2>

        <p className="text-[#04436F] text-[20px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          Vertretungsberechtigte Personen:<br />
          Bettina Frei, Silvain Philip Kocher
        </p>

        {/* UID */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          UID-Nummer
        </h2>

        <p className="text-[#04436F] text-[20px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          CHE-215.205.279
        </p>

        {/* MWST */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          Mehrwertsteuernummer
        </h2>

        <p className="text-[#04436F] text-[20px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          CHE-215.205.279 MWST
        </p>

        {/* Haftungsausschluss */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          Haftungsausschluss
        </h2>

        <p className="text-[#04436F] text-[18px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen. Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
        </p>

        {/* Links Disclaimer */}
        <h2 className="text-[#04436F] font-bold text-[26px] md:text-[36px] leading-[35px] md:leading-[43.2px] mb-[20px]">
          Haftung für Links
        </h2>

        <p className="text-[#04436F] text-[18px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mb-[20px]">
          Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
        </p>

        {/* Address Footer */}
        <p className="text-[#04436F] text-[20px] md:text-[24px] font-normal leading-[30px] md:leading-[43.2px] mt-10">
          8834 Schindellegi, Schweiz
        </p>

      </div>
    </div>
  );
}
