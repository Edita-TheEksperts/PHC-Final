import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, iban, accountHolder, bankName, bic } = req.body;


  // Collect missing fields
  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!iban) missingFields.push("iban");
  if (!accountHolder) missingFields.push("accountHolder");
  if (!bankName) missingFields.push("bankName");

  // If any are missing, return 400 with details
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Fehlende Bankdaten",
      missingFields,
    });
  }

  try {
    const updated = await prisma.employee.update({
      where: { email },
      data: {
        iban,
        accountHolder,
        bankName,
        bic: bic || null, // optional
      },
    });

    return res.status(200).json({ success: true, updated });
  } catch (error) {
    return res.status(500).json({ error: "Bankdaten konnten nicht gespeichert werden." });
  }
}
