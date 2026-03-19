// pages/api/admin/activity/index.ts (Next.js)

import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { actorType, targetType, limit = 20 } = req.query;

      const logs = await prisma.activityLog.findMany({
        where: {
          ...(actorType === "user" ? { actorUserId: { not: null } } : {}),
          ...(actorType === "employee" ? { actorEmployeeId: { not: null } } : {}),
          ...(targetType ? { targetType } : {}),
        },
        include: {
          actorUser: true,
          actorEmployee: true,
        },
        orderBy: { createdAt: "desc" },
        take: Number(limit),
      });

      res.json(logs);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
