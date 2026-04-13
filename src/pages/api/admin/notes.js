import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId, employeeId, messagesOnly } = req.query;
    try {
      const where = {};
      if (userId) where.userId = userId;
      if (employeeId) where.employeeId = employeeId;
      // When client/employee fetches their messages, hide admin tasks (Aufgabe type)
      if (messagesOnly === "true") {
        where.NOT = { noteType: "task" };
      }

      const notes = await prisma.internalNote.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ notes });
    } catch (err) {
      return res.status(500).json({ message: "Fehler beim Laden der Notizen" });
    }
  }

  if (req.method === "POST") {
    const { text, author, userId, employeeId, noteType, dueDate } = req.body;
    if (!text || (!userId && !employeeId)) {
      return res.status(400).json({ message: "Text und userId oder employeeId erforderlich" });
    }
    try {
      const isAdminAuthor = !author || author === "Admin";
      const note = await prisma.internalNote.create({
        data: {
          text,
          author: author || "Admin",
          noteType: noteType || "note",
          // Messages from clients/employees start unread for admin
          readByAdmin: isAdminAuthor,
          ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
          ...(userId ? { userId } : {}),
          ...(employeeId ? { employeeId } : {}),
        },
      });
      return res.status(201).json(note);
    } catch (err) {
      return res.status(500).json({ message: "Fehler beim Speichern der Notiz" });
    }
  }

  if (req.method === "PATCH") {
    const { id, completed, readByAdmin } = req.body;
    if (!id) return res.status(400).json({ message: "id erforderlich" });
    try {
      const data = {};
      if (typeof completed === "boolean") data.completed = completed;
      if (typeof readByAdmin === "boolean") data.readByAdmin = readByAdmin;
      const note = await prisma.internalNote.update({
        where: { id },
        data,
      });
      return res.status(200).json(note);
    } catch (err) {
      return res.status(500).json({ message: "Fehler beim Aktualisieren" });
    }
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "id erforderlich" });
    try {
      await prisma.internalNote.delete({ where: { id } });
      return res.status(200).json({ message: "Notiz gelöscht" });
    } catch (err) {
      return res.status(500).json({ message: "Fehler beim Löschen" });
    }
  }

  return res.status(405).end();
}
