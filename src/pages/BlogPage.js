import React, { useState, useEffect } from "react";
import Link from "next/link";

function slugifyCategory(cat) {
  return cat?.toLowerCase()
    .replace(/[äöü]/g, c => ({ ä: "ae", ö: "oe", ü: "ue" }[c]))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "";
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

export default function BlogPage() {
  const blogsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [allBlogs, setAllBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => setAllBlogs(d.blogs || []))
      .finally(() => setLoading(false));
  }, []);

  const normalizeCategory = (cat) => cat?.replace(/\u00A0/g, " ").trim() || "";

  const categories = [
    "Alle",
    ...new Set(allBlogs.map((blog) => normalizeCategory(blog.category))),
  ];

  const searchedBlogs = searchQuery.trim()
    ? allBlogs.filter(b => {
        const q = searchQuery.toLowerCase();
        return (
          b.title?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          stripHtml(b.maintext || "").toLowerCase().includes(q)
        );
      })
    : allBlogs;

  const filteredBlogs =
    selectedCategory === "Alle"
      ? searchedBlogs
      : searchedBlogs.filter((blog) => normalizeCategory(blog.category) === selectedCategory);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

  return (
    <div className="bg-[#FAFCFF] max-w-[1430px] mx-auto lg:px-6 p-4">
      {/* Header */}
      <div className="bg-[#B99B5F] max-w-[1400px] text-center py-[90px] rounded-[20px] mb-[120px]">
        <h1 className="text-white text-[44px] lg:text-[65px] font-semibold">Blogs</h1>
        <p className="text-white text-[16px] leading-[25.6px]">
          Erhalten Sie fundierte Experteneinschätzungen und detaillierte <br />
          Analysen zu aktuellen Trends und Entwicklungen in der Altenpflege
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-[600px] mx-auto">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Blogs durchsuchen…"
            className="w-full pl-11 pr-4 py-3 rounded-[12px] border border-gray-200 bg-white text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#04436F]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-[60px]">
        <h1 className="text-[#04436F] text-center text-[55px] font-semibold">Blog Kategorien</h1>
        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 mx-auto">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
              className={`p-[12px] rounded-[10px] text-[16px] font-medium cursor-pointer transition
                ${selectedCategory === category
                  ? "bg-[#04436F] text-white"
                  : "bg-[#B7B6BA] text-[#FAFCFF] hover:bg-[#04436F]"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#04436F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[60px]">
          {currentBlogs.map((blog, index) => (
            <div key={index} className="bg-white rounded-[10px] overflow-hidden shadow-md">
              <img
                src={blog.image || "/images/blog1.png"}
                alt={blog.title}
                className="w-full h-[300px] object-cover"
              />
              <div className="py-5 px-4">
                <div className="flex justify-between items-center">
                  <Link href={`/blog/category/${slugifyCategory(blog.category)}`}>
                    <span
                      className="text-[14px] font-[400] px-4 py-2 rounded-l-[20px] cursor-pointer hover:opacity-80 transition"
                      style={{ background: "linear-gradient(94deg, #04436F 0%, rgba(0,0,0,0.00) 100%)", color: "#fff" }}
                    >
                      {blog.category}
                    </span>
                  </Link>
                  <p className="text-[#04436F] text-[14px]">{blog.date}</p>
                </div>
                <h3 className="text-[#04436F] text-[26px] font-[600] mt-2">{blog.title}</h3>
                {blog.maintext && (
                  <p className="text-gray-500 text-[14px] leading-[22px] mt-2 line-clamp-3">
                    {stripHtml(blog.maintext).slice(0, 130)}{stripHtml(blog.maintext).length > 130 ? "…" : ""}
                  </p>
                )}
                <a href={`/blog/${blog.slug}`}>
                  <button className="bg-[#04436F] text-white mt-4 py-2 px-4 rounded-[20px] text-[16px] font-medium hover:bg-[#B99B5F] transition">
                    Mehr lesen
                  </button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mb-[100px] lg:justify-between mt-10 space-x-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Zurück
          </button>
          <span className="text-[#04436F] text-[18px] font-medium mt-4">{currentPage} / {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 lg:px-[150px] lg:py-[14px] rounded-full text-white bg-[#04436F] transition hover:bg-[#B99B5F] ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Weiter
          </button>
        </div>
      )}
    </div>
  );
}
