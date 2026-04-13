import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const messages = await prisma.internalNote.findMany({
      where: {
        readByAdmin: false,
        author: { not: "Admin" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { firstName: true, lastName: true } },
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    const formatted = messages.map(m => ({
      id: m.id,
      text: m.text,
      author: m.author,
      createdAt: m.createdAt,
      userId: m.userId,
      employeeId: m.employeeId,
      userName: m.user ? `${m.user.firstName} ${m.user.lastName}` : null,
      employeeName: m.employee ? `${m.employee.firstName} ${m.employee.lastName}` : null,
    }));

    return res.status(200).json({ messages: formatted });
  } catch (err) {
    return res.status(500).json({ messages: [] });
  }
}
