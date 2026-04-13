import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id, email, ...data } = req.body;

    if (!id && !email) {
      return res.status(400).json({ error: "Missing identifier" });
    }

    // Coerce date-like fields to Date objects (Prisma DateTime)
    const dateFields = ["birthDate", "availabilityFrom", "bankUpdatedAt"];
    for (const k of dateFields) {
      if (k in data) {
        if (data[k] === "" || data[k] === null) {
          data[k] = null;
        } else if (typeof data[k] === "string") {
          const parsed = new Date(data[k]);
          if (!Number.isNaN(parsed.getTime())) data[k] = parsed;
        }
      }
    }

    const updated = await prisma.employee.update({
      where: id ? { id } : { email },
      data,
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Could not update employee" });
  }
}
