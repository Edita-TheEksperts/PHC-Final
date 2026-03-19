import { prisma } from "../../../lib/prisma";


export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const { vacationId, newEmployeeId } = req.body;

      const updated = await prisma.vacation.update({
        where: { id: vacationId },
        data: {
          employee: { connect: { id: newEmployeeId } },
        },
        include: { employee: true },
      });

      return res.status(200).json({
        message: `Vacation reassigned to ${updated.employee.firstName} ${updated.employee.lastName}`,
        vacation: updated,
      });
    } catch (err) {
      return res.status(500).json({ message: "Error reassigning vacation" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
