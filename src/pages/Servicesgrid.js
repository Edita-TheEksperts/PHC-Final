import { useState } from 'react';

function Servicegrid() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleContent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const columnsData = [
    {
      title:(
        <p
          
        >
          Alltagsbegleitung<br></br> und Besorgungen​
        </p>
      ),
      items: [
        {
          heading: "- Begleitung zu Terminen",
          subItems: [
            "Arzt",
            "Physiotherapien",
            "Behördengänge",
            "Andere",
          ],
        },
        {
          heading: "- Einkäufe erledigen",
          subItems: [
            "Lebensmitteleinkäufe",
            "Apotheke",
            "Garteneinkäufe",
            "Kleidereinkäufe",
          ],
        },
        { heading: "- Postgänge" },
        { heading: "- Sonstige Begleitungen" },
      ],
    },
    {
      title: (
        <p
          
        >
          Freizeit und <br></br>soziale Aktivitäten​
        </p>
      ),
      items: [
        { heading: "- Gesellschaft leisten" },
        { heading: "- Gemeinsames Kochen" },
        { heading: "- Biographiarbeit" },
        { heading: "- Vorlesen" },
        { heading: "- Kartenspiele" },
        {
          heading: "- Ausflüge und Reisebegleitung:",
          subItems: [
            "Theaterbesuch",
            "Kinobesuch",
            "Konzertbesuch",
            "Sportanlass",
            "Urlaubsbegleitung",
          ],
        },
      ],
    },
    {
      title:(
        <p
          
        >
          Gesundheits<br />
          fürsorge
        </p>
      ),
      items: [
        { heading: "- Körperliche Unterstützung" },
        { heading: "- Nahrungsaufnahme" },
        { heading: "- Grundpflegerische Tätigkeiten" },
        { heading: "- Gesundheitsfördernde Aktivitäten" },
        { heading: "- Geistige Unterstützung" },
      ],
    },
    {
      title:(
        <p
          
        >
          Haushaltshilfe und<br></br> Wohnpflege​
        </p>
      ),
      items: [
        { heading: "- Hauswirtschaft" },
        { heading: "- Balkon und Blumenpflege" },
        { heading: "- Waschen / Bügeln" },
        { heading: "- Kochen" },
        { heading: "- Fenster Putzen" },
        { heading: "- Bettwäsche wechseln" },
        { heading: "- Aufräumen" },
        { heading: "- Trennung / Entsorgung / Abfall" },
        { heading: "- Abstauben" },
        { heading: "- Staubsaugen" },
        { heading: "- Boden wischen" },
        { heading: "- Vorhänge reinigen" },
      ],
    },
  ];

  return (
    <div className="mt-[160px] mb-[160px]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-[0.6rem] px-6">
        {columnsData.map((column, i) => (
          <div key={i} className="rounded-lg flex flex-col h-full">
            {/* Koka (header) e kolonës */}
            <div
              /* 
                MOBILE: 
                  bg-[#B99B5F] => sfond i artë
                  border => vija rrethore
                DESKTOP (lg):
                  bg-[url('/1.png')] => background image
                  border-0 => heqim vijën rrethore
              */
              className={`
                text-white text-[24px] leading-[24px] font-bold px-6 py-4 relative
                rounded-[20px]
                bg-[#B99B5F] border border-[#B99B5F]
                lg:bg-[url('/images/1.png')] lg:bg-cover lg:bg-center
                lg:border-0
              `}
              style={{
                fontFamily: "Metropolis",
                minHeight: "80px",
                display: "flex",
                alignItems: "center",
              }}
              onClick={() => toggleContent(i)}
            >
              {column.title}

              {/* Shenja + / - (vetëm mobile) */}
              <span
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer block lg:hidden"
              >
                {openIndex === i ? '-' : '+'}
              </span>
            </div>

            {/* Përmbajtja e kolonës */}
            <div
              className={`
                p-6 bg-[#FAFAFA] text-[#1C1B1D] text-[16px] leading-[25.6px]
                flex-grow min-h-[400px] rounded-[12px]
                ${openIndex === i ? 'block' : 'hidden'}
                lg:block
              `}
            >
              <ul className="space-y-4">
                {column.items.map((item, j) => (
                  <li key={j}>
                    <span className="font-[500] text-[#B99B5F] text-[16px] leading-[25.6x]">
                      {item.heading}
                    </span>
                    {item.subItems && (
                      <ul className="pl-6 mt-2 text-[#5E5E5E] font-[300] space-y-1 text-[14px] leading-[24px]">
                        {item.subItems.map((subItem, k) => (
                          <li key={k}>• {subItem}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Servicegrid;