// pages/api/updateUserData.js
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Only PUT method is allowed" });
  }

  try {
    const { id, addService, removeService, ...incomingData } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    // ➤ Shto shërbim
    if (addService) {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          services: {
            connectOrCreate: {
              where: { name: addService },
              create: { name: addService },
            },
          },
        },
        include: { services: true },
      });

      return res.status(200).json({
        message: "Service added",
        services: updatedUser.services,
      });
    }

    // ➤ Largo shërbim
    if (removeService) {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          services: {
            disconnect: { name: removeService },
          },
        },
        include: { services: true },
      });

      return res.status(200).json({
        message: "Service removed",
        services: updatedUser.services,
      });
    }

const allowedFields = [
  "fullName", "email", "phone", "address",

  "careCity",
  "careStreet",

  "emergencyContactName", "emergencyContactPhone",
  "frequency", "duration", "firstDate",
  "languages", "pets",
  "mobility", "transport", "appointments",
  "appointmentsOther", "shoppingAssist", "shoppingType",
  "briefkasten", "postfach", "sonstige",
  "form4Completed",
  "requestFirstName", "requestLastName", "requestPhone", "requestEmail",
];


    const safeData = {};
for (const key of allowedFields) {
  if (key in incomingData) {
    safeData[key] = incomingData[key];
  }
}


    const updatedUser = await prisma.user.update({
      where: { id },
      data: safeData,
      include: { services: true },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update user",
      error: err.message,
    });
  }
}
