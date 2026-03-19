import { prisma } from "../../../lib/prisma";


const formatBody = (text) => {
  return text
    .split(/\n+/)
    .map(line => line.trim())
    .filter(line => line)
    .map(line => `<p>${line}</p>`)
    .join("\n");
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const templates = await prisma.emailTemplate.findMany();
    return res.json(templates);
  }

  if (req.method === "PUT") {
    const { id, subject, body } = req.body;

    if (!id || !subject || !body) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const updated = await prisma.emailTemplate.update({
      where: { id },
      data: {
        subject,
        body: formatBody(body), 
      },
    });

    return res.json(updated);
  }

  res.status(405).json({ error: "Method not allowed" });
}
