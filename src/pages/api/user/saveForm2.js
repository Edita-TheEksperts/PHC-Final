import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      mobility = [],
      transport = [],
      companionship = "",
      cooking = "",
      hasAllergies = "",
      allergyDetails = "",
      hasTech = "",
      reads = "",
      playsCards = "",
      outings = []
    } = req.body;

    await prisma.user.update({
      where: { id: userId },
      data: {
        mobility: mobility.join(", "),
        transport: transport.join(", "),
        companionship,
        cooking,
        hasAllergies,
        allergyDetails,
        hasTech,
        reads,
        playsCards,
        outings: outings.join(", "),
        form2Completed: true
      }
    });

    res.status(200).json({ message: "Form 2 saved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
