import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No Authorization header provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
,
      include: {
        services: true,
        subServices: true,
        schedules: true, 
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
}