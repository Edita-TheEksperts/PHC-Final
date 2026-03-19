import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { sendTerminationEmail } from "../../lib/sendTerminationEmail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ message: "Termination reason required" });
    }

    // 🔍 Fetch user (for email)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, firstName: true, lastName: true },
    });

    // 1️⃣ Mark user as terminated
    await prisma.user.update({
      where: { id: userId },
      data: { status: "gekuendigt" },
    });

    // 2️⃣ Cancel all schedules
    await prisma.schedule.updateMany({
      where: {
        userId,
        NOT: { status: { in: ["cancelled", "done"] } },
      },
      data: { status: "terminated" },
    });

    // 3️⃣ Terminate assignments
    await prisma.assignment.updateMany({
      where: {
        userId,
        status: "active",
      },
      data: { status: "terminated" },
    });

if (user?.email) {

  await sendTerminationEmail({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  });

}


    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: "Termination failed" });
  }
}
