import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).end();

  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Kein Token übergeben" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const {
      rooms = "",
      people = "",
      tasks = {} // format: { taskName: { answer: "Ja"/"Nein", details: "...", extra: "..." } }
    } = req.body;

    // Convert tasks object into a plain string for saving (you can use JSON.stringify or your format)
    const taskSummary = Object.entries(tasks).map(([task, values]) => {
      return `${task}: ${values.answer || "?"}${values.extra ? ` (${values.extra})` : ""}${values.details ? ` - ${values.details}` : ""}`;
    }).join("; ");

    await prisma.user.update({
      where: { id: userId },
      data: {
        appointments: taskSummary, // you can use a dedicated field if needed
        briefkasten: rooms.toString(),
        postfach: people.toString(),
        form1Completed: true
      }
    });

    res.status(200).json({ message: "Formular gespeichert" });
  } catch (err) {
    res.status(500).json({ message: "Serverfehler", detail: err.message });
  }
}
