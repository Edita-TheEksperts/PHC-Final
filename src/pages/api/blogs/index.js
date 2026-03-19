import { prisma } from "../../../lib/prisma";
import blogsData from "../../../data/blogsData";

const DE_MONTHS = {
  januar: 0, februar: 1, märz: 2, april: 3, mai: 4, juni: 5,
  juli: 6, august: 7, september: 8, oktober: 9, november: 10, dezember: 11,
};

function parseGermanDate(str) {
  if (!str) return new Date(0);
  const parts = str.trim().toLowerCase().split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = DE_MONTHS[parts[1]];
    const year = parseInt(parts[2]);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  const d = new Date(str);
  return isNaN(d) ? new Date(0) : d;
}

function normalizeStatic(b) {
  return {
    id: b.id || b.slug,
    slug: b.slug,
    title: b.title,
    category: b.category?.replace(/\u00A0/g, " ").trim(),
    image: b.image || null,
    date: b.date || "",
    maintext: b.maintext || "",
    published: true,
    _sortDate: parseGermanDate(b.date),
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { category } = req.query;

  // Fetch DB blogs
  let dbBlogs = [];
  try {
    dbBlogs = await prisma.blog.findMany({
      where: { published: true },
      select: {
        id: true, slug: true, title: true, category: true,
        image: true, date: true, maintext: true, published: true, createdAt: true,
      },
    });
  } catch { dbBlogs = []; }

  // Tag DB blogs with sort date
  const dbTagged = dbBlogs.map(b => ({
    ...b,
    _sortDate: b.date ? parseGermanDate(b.date) : new Date(b.createdAt),
  }));

  // Static blogs — exclude slugs already in DB
  const dbSlugs = new Set(dbBlogs.map(b => b.slug));
  const staticBlogs = blogsData
    .filter(b => !dbSlugs.has(b.slug))
    .map(normalizeStatic);

  // Merge and sort newest first
  let blogs = [...dbTagged, ...staticBlogs].sort(
    (a, b) => b._sortDate - a._sortDate
  );

  // Strip internal sort key
  blogs = blogs.map(({ _sortDate, createdAt, ...rest }) => rest);

  // Category filter
  if (category && category !== "Alle") {
    const term = category.replace(/-/g, " ").toLowerCase();
    blogs = blogs.filter(b => b.category?.toLowerCase().includes(term));
  }

  return res.status(200).json({ blogs });
}
