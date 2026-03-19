import { prisma } from "../../../lib/prisma";
import blogsData from "../../../data/blogsData";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { slug } = req.query;

  // Try DB first
  try {
    const blog = await prisma.blog.findUnique({ where: { slug: String(slug) } });
    if (blog) return res.status(200).json({ blog });
  } catch { /* fall through to static */ }

  // Fall back to static data
  const staticBlog = blogsData.find(b => b.slug === slug);
  if (staticBlog) {
    return res.status(200).json({
      blog: {
        ...staticBlog,
        authorName: staticBlog.author?.name || "Martin Kälin",
        authorPosition: staticBlog.author?.position || "Redakteur für Prime Home Care",
        authorImage: staticBlog.author?.image || "/images/phc-author.png",
        authorDescription: staticBlog.author?.description || "",
      },
    });
  }

  return res.status(404).json({ error: "Blog not found" });
}
