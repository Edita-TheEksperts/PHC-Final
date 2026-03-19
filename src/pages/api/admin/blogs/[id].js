import { prisma } from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    const blog = await prisma.blog.findUnique({ where: { id: String(id) } });
    if (!blog) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ blog });
  }

  if (req.method === "PUT") {
    const {
      slug, title, metaTitle, metaDescription, category, image, date,
      maintext, authorName, authorPosition, authorImage, authorDescription,
      sections, published,
    } = req.body;

    const blog = await prisma.blog.update({
      where: { id: String(id) },
      data: {
        slug, title, metaTitle, metaDescription, category,
        image: image || null, date, maintext,
        authorName, authorPosition, authorImage, authorDescription,
        sections: sections || [],
        published: published !== false,
      },
    });
    return res.status(200).json({ blog });
  }

  if (req.method === "DELETE") {
    await prisma.blog.delete({ where: { id: String(id) } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
