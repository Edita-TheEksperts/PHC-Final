import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Alle Wiki-Artikel</h1>
      {blogs.map((blog) => (
        <div key={blog.slug} className="mb-6 border-b pb-4">
          <Link href={`/blog/${blog.slug}`}>
            <h2 className="text-xl font-semibold text-blue-800 cursor-pointer hover:underline">
              {blog.title.rendered}
            </h2>
          </Link>
          <p className="text-gray-500 text-sm">
            {blog.content.rendered ? "Inhalt vorhanden" : "Kein Inhalt vorhanden"}
          </p>
        </div>
      ))}
    </div>
  );
}
