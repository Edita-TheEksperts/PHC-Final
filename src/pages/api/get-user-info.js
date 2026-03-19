import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  const email = decoded.email;
  if (!email) {
    return res.status(400).json({ message: "Invalid token payload" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email || "" }, // ensure string
      select: {
        languages: true,
        pets: true,
        allergies: true,
        specialRequests: true,
        emergencyContactName: true,
        emergencyContactPhone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user info", error: error.message });
  }
}
