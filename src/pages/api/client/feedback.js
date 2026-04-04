import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  // GET – fetch feedback submitted by a client
  if (req.method === "GET") {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    try {
      const feedback = await prisma.feedback.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(feedback);
    } catch {
      return res.status(500).json({ error: "Failed to fetch feedback" });
    }
  }

  // POST – submit a rating for an employee
  if (req.method === "POST") {
    const { userId, employeeId, rating, comment } = req.body;

    if (!userId || !employeeId || !rating) {
      return res.status(400).json({ error: "userId, employeeId and rating are required" });
    }
    if (rating < 1 || rating > 6) {
      return res.status(400).json({ error: "Rating must be between 1 and 6" });
    }

    try {
      const feedback = await prisma.feedback.create({
        data: {
          userId,
          employeeId,
          rating: parseInt(rating),
          comment: comment || "",
        },
      });
      return res.status(201).json({ success: true, feedback });
    } catch {
      return res.status(500).json({ error: "Failed to save feedback" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
