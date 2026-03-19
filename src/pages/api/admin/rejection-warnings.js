import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const warnings = await prisma.rejectionWarning.findMany({
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { sentAt: "desc" },
    });

    res.status(200).json(warnings);
  } catch (err) {
    res.status(500).json({ message: "Serverfehler" });
  }
}
