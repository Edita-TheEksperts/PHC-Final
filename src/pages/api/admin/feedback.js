import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const { employeeId, userId } = req.query;
    const where = {};
    if (employeeId) where.employeeId = employeeId;
    if (userId) where.userId = userId;

    const feedback = await prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    // Calculate average rating per employee
    const byEmployee = {};
    feedback.forEach(f => {
      if (!byEmployee[f.employeeId]) byEmployee[f.employeeId] = { total: 0, count: 0, ratings: [] };
      byEmployee[f.employeeId].total += f.rating;
      byEmployee[f.employeeId].count += 1;
      byEmployee[f.employeeId].ratings.push(f);
    });

    const averages = Object.entries(byEmployee).map(([empId, data]) => ({
      employeeId: empId,
      averageRating: Math.round((data.total / data.count) * 10) / 10,
      totalRatings: data.count,
    }));

    return res.status(200).json({ feedback, averages });
  } catch (err) {
    return res.status(500).json({ message: "Fehler beim Laden der Bewertungen" });
  }
}
