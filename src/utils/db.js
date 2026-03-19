import { prisma } from "../lib/prisma";
import { subHours, isBefore } from "date-fns";

export async function getDueCaptures() {
  const now = new Date();
  const captureTime = subHours(now, 24); // 24h ago

  return await prisma.schedule.findMany({
    where: {
      captured: false,
      date: {
        lte: captureTime, // service is at least 24h ago
      },
      user: {
        paymentIntentId: { not: null },
      },
    },
    include: {
      user: true,
    },
  });
}
