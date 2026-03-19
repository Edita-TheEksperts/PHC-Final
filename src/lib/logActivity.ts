// lib/logActivity.ts
import { prisma } from "./prisma";

export async function logActivity({
  actorUserId,
  actorEmployeeId,
  action,
  targetType,
  targetId,
}: {
  actorUserId?: string;
  actorEmployeeId?: string;
  action: string;
  targetType: string;
  targetId?: string;
}) {
  return prisma.activityLog.create({
    data: {
      actorUserId,
      actorEmployeeId,
      action,
      targetType,
      targetId,
    },
  });
}
