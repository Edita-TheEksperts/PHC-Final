import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// static service → subservices map
const services = {
  "Alltagsbegleitung und Besorgungen": [
    "Beleitung zu Terminen",
    "Einkäufe erledigen",
      "Gemeinsames Kochen",
    "Postgänge",
    "Sonstige Begleitungen",
  ],
  "Freizeit und Soziale Aktivitäten": [
    "Gesellschaft leisten",
  "Biografiearbeit",
    "Vorlesen",
   "Gesellschaftspiele",
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

export default async function handler(req, res) {
  const { serviceName } = req.query;

  if (!serviceName) {
    return res.status(400).json({ message: "Missing service name" });
  }

  try {
    // get subservice names from static map
    const subNames = services[serviceName];

    if (!subNames) {
      return res.status(404).json({ message: "Service not recognized" });
    }

    // fetch matching subservices by name
    const subServices = await prisma.subService.findMany({
      where: {
        name: { in: subNames },
      },
    });

    return res.status(200).json(subServices);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
