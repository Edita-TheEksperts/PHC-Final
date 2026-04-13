import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const tasks = await prisma.internalNote.findMany({
      where: {
        noteType: "task",
        completed: false,
        dueDate: { not: null },
      },
      orderBy: { dueDate: "asc" },
      include: {
        user: { select: { firstName: true, lastName: true } },
        employee: { select: { firstName: true, lastName: true } },
      },
    });

    const formatted = tasks.map(t => ({
      id: t.id,
      text: t.text,
      dueDate: t.dueDate,
      userId: t.userId,
      employeeId: t.employeeId,
      userName: t.user ? `${t.user.firstName} ${t.user.lastName}` : null,
      employeeName: t.employee ? `${t.employee.firstName} ${t.employee.lastName}` : null,
    }));

    return res.status(200).json({ tasks: formatted });
  } catch (err) {
    return res.status(500).json({ tasks: [] });
  }
}
