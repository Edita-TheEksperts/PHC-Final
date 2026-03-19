import { prisma } from "../../../../lib/prisma";
import blogsData from "../../../../data/blogsData";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const results = { created: 0, skipped: 0, errors: [] };

  for (const blog of blogsData) {
    try {
      const existing = await prisma.blog.findUnique({ where: { slug: blog.slug } });
      if (existing) { results.skipped++; continue; }

      await prisma.blog.create({
        data: {
          slug: blog.slug,
          title: blog.title,
          metaTitle: blog.metaTitle || blog.title,
          metaDescription: blog.metaDescription || blog.maintext?.slice(0, 160) || "",
          category: blog.category?.replace(/\u00A0/g, " ").trim(),
          image: blog.image || null,
          date: blog.date || "",
          maintext: blog.maintext || "",
          authorName: blog.author?.name || "Martin Kälin",
          authorPosition: blog.author?.position || "Redakteur für Prime Home Care",
          authorImage: blog.author?.image || "/images/phc-author.png",
          authorDescription: blog.author?.description || "",
          sections: blog.sections || [],
          published: true,
        },
      });
      results.created++;
    } catch (err) {
      results.errors.push({ slug: blog.slug, error: err.message });
    }
  }

  return res.status(200).json({ success: true, ...results });
}
