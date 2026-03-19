import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
   const services = await prisma.service.findMany({
  include: { subServices: { select: { id: true, name: true } } },
});


    res.status(200).json(services); // already in correct shape
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
