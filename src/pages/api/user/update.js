import { prisma } from "../../../lib/prisma.js";


export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  try {
    const {
      email,
      phone, address, frequency, duration, firstDate,
      emergencyContactName, emergencyContactPhone,
      cardNumber, expiryDate, cvc,
      languages, pets,
      allergies, specialRequests
    } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    await prisma.user.update({
      where: { email },
      data: {
        phone,
        address,
        frequency,
        duration,
        firstDate: new Date(firstDate),
        emergencyContactName,
        emergencyContactPhone,
        cardNumber,
        expiryDate,
        cvc,
        languages,
        pets,
        healthQuestion: {
          upsert: {
            create: { allergies, specialRequests },
            update: { allergies, specialRequests }
          }
        }
      }
    });

    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}
