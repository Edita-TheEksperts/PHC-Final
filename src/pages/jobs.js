export default function JobsPage() {
  const jobs = [
    {
      id: 1,
      title: "Pflegefachperson (60–100%)",
      location: "Schindellegi, Schweiz",
      type: "Vollzeit",
      description:
        "Sie übernehmen die Pflege und Betreuung von Klientinnen und Klienten im häuslichen Umfeld. Sie planen selbstständig Ihre Arbeitseinsätze und stellen die Qualität der Pflege sicher.",
    },
    {
      id: 2,
      title: "Haushaltshilfe / Betreuung (Teilzeit)",
      location: "Zürich, Schweiz",
      type: "Teilzeit",
      description:
        "Sie unterstützen hilfsbedürftige Personen bei der Haushaltsführung, Einkäufen und alltäglichen Aufgaben. Empathie und Zuverlässigkeit stehen im Zentrum Ihrer Arbeit.",
    },
  ];

  return (
    <section className="bg-[#FAFCFF] px-4 py-16 max-w-[1430px] mx-auto">
      {/* Hero Section */}
      <div className="bg-[rgba(4,67,111,0.10)] p-8 rounded-[20px] text-center mb-[80px]">
        <h1 className="text-[#04436F] text-[40px] lg:text-[60px] font-semibold leading-[55px] lg:leading-[80px] font-['Instrument Sans'] mb-4">
          Karriere bei PHC – Arbeiten mit Herz
        </h1>
        <p className="text-[#04436F] text-[18px] leading-[28px] max-w-[800px] mx-auto font-['Inter']">
          Bei PHC bieten wir Ihnen nicht nur einen Job, sondern eine sinnstiftende Aufgabe mit echtem Mehrwert für unsere Gesellschaft.
        </p>
      </div>

      {/* Job Listings */}
      <div className="grid gap-10">
        {jobs.map((job) => (
          <div key={job.id} className="bg-[#EAF1F8] rounded-[20px] p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="text-[#04436F] text-[22px] lg:text-[28px] font-bold mb-2">{job.title}</h2>
                <p className="text-[#2F2F2F] text-[16px] mb-1"><strong>Ort:</strong> {job.location}</p>
                <p className="text-[#2F2F2F] text-[16px]"><strong>Typ:</strong> {job.type}</p>
              </div>

              <a
                href="/contact"
                className="bg-[#04436F] text-white px-6 py-3 rounded-[12px] text-[16px] font-medium self-start lg:self-auto"
              >
                Jetzt bewerben
              </a>
            </div>

            <div className="mt-4 text-[#2F2F2F] text-[16px] leading-[26px]">
              {job.description}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-[100px] text-center">
        <h3 className="text-[#04436F] text-[24px] font-semibold mb-4">
          Nicht das passende gefunden?
        </h3>
        <p className="text-[#2F2F2F] text-[16px] mb-6">
          Wir freuen uns auch über Ihre Initiativbewerbung. Senden Sie uns einfach Ihre Unterlagen über das Kontaktformular.
        </p>
        <a
          href="/contact"
          className="bg-[#B99B5F] text-white px-6 py-3 rounded-[12px] text-[18px] font-medium"
        >
          Zum Kontaktformular
        </a>
      </div>
    </section>
  );
}
