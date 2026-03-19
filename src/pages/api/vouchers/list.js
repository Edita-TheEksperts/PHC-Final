import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        usedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ vouchers });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
