import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const services = await prisma.service.findMany({
      include: {
        subServices: true,
      },
    });

    return res.status(200).json(services); // KTHE ARRAY DIREKT!
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}
