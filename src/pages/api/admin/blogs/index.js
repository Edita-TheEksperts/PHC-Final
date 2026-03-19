import { prisma } from "../../../../lib/prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "asmtp.mail.hostpoint.ch",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "landingpage@phc.ch",
    pass: process.env.EMAIL_PASS,
  },
});

async function sendBlogNotification(blog) {
  try {
    const clients = await prisma.user.findMany({
      where: { status: "aktiv" },
      select: { email: true, firstName: true },
    });

    if (!clients.length) return;

    const siteUrl = "https://www.phc.ch";
    const blogUrl = `${siteUrl}/blog/${blog.slug}`;
    const imgTag = blog.image
      ? `<img src="${blog.image.startsWith("http") ? blog.image : siteUrl + blog.image}" alt="${blog.title}" style="width:100%;max-height:280px;object-fit:cover;border-radius:12px;margin-bottom:20px;" />`
      : "";

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9fafb;border-radius:12px;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src="${siteUrl}/phc-logo.png" alt="Prime Home Care AG" style="height:50px;" />
        </div>
        ${imgTag}
        <h2 style="color:#04436F;font-size:22px;margin-bottom:8px;">${blog.title}</h2>
        <p style="color:#555;font-size:14px;margin-bottom:4px;">${blog.category} · ${blog.date}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;" />
        <p style="color:#374151;font-size:15px;line-height:1.6;">${blog.maintext?.replace(/<[^>]*>/g, "").slice(0, 200) || ""}…</p>
        <div style="text-align:center;margin-top:24px;">
          <a href="${blogUrl}" style="background:#04436F;color:#fff;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:600;font-size:15px;">Jetzt lesen</a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:24px;">Prime Home Care AG · Birkenstrasse 49, 6343 Rotkreuz · <a href="${siteUrl}" style="color:#9ca3af;">phc.ch</a></p>
      </div>`;

    // Send in batches to avoid overwhelming the mail server
    for (const client of clients) {
      await transporter.sendMail({
        from: '"Prime Home Care AG" <landingpage@phc.ch>',
        to: client.email,
        subject: `Neuer Blog: ${blog.title}`,
        html,
      }).catch(() => {}); // skip failed individual sends
    }
  } catch { /* non-blocking */ }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, slug: true, title: true, category: true,
        image: true, date: true, published: true, createdAt: true,
      },
    });
    return res.status(200).json({ blogs });
  }

  if (req.method === "POST") {
    const {
      slug, title, metaTitle, metaDescription, category, image, date,
      maintext, authorName, authorPosition, authorImage, authorDescription,
      sections, published,
    } = req.body;

    if (!slug || !title || !category) {
      return res.status(400).json({ error: "slug, title and category are required" });
    }

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) return res.status(400).json({ error: "Slug already exists" });

    const blog = await prisma.blog.create({
      data: {
        slug, title, metaTitle, metaDescription, category,
        image: image || null,
        date: date || new Date().toLocaleDateString("de-CH", { day: "2-digit", month: "long", year: "numeric" }),
        maintext, authorName, authorPosition, authorImage, authorDescription,
        sections: sections || [],
        published: published !== false,
      },
    });

    // Fire-and-forget email notification to active clients
    if (blog.published) {
      sendBlogNotification(blog);
    }

    return res.status(201).json({ blog });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
