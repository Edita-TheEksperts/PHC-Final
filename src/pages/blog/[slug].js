export const dynamic = "force-dynamic";

import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;

  const [blog, setBlog] = useState(null);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqOpen, setFaqOpen] = useState(null);
  const sectionsRef = useRef([]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blogs/${slug}`)
      .then((r) => r.json())
      .then((d) => { if (d.blog) setBlog(d.blog); })
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!blog) return;
    fetch("/api/blogs")
      .then((r) => r.json())
      .then((d) => {
        const others = (d.blogs || []).filter((b) => b.slug !== slug);
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRecommendedBlogs(shuffled.slice(0, 4));
      });
  }, [blog, slug]);

  const scrollToSection = (index) => {
    const offset = 120;
    const element = sectionsRef.current[index];
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const sections = Array.isArray(blog?.sections) ? blog.sections : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#04436F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-[#04436F] text-[30px] font-semibold">Blog Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find the blog you're looking for.</p>
        <Link href="/BlogPage">
          <button className="mt-4 px-6 py-2 bg-[#04436F] text-white rounded-full">Back to Blogs</button>
        </Link>
      </div>
    );
  }

  const siteUrl = "https://www.phc.ch";
  const canonicalUrl = `${siteUrl}/blog/${blog.slug}`;
  const ogImage = blog.image?.startsWith("http") ? blog.image : `${siteUrl}${blog.image || "/images/blog1.png"}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.metaTitle || blog.title,
    "description": blog.metaDescription || blog.maintext,
    "image": ogImage,
    "author": {
      "@type": "Person",
      "name": blog.authorName || "Martin Kälin",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Prime Home Care AG",
      "logo": { "@type": "ImageObject", "url": `${siteUrl}/phc-logo.png` },
    },
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
  };

  return (
    <>
      <Head>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription || blog.maintext?.slice(0, 160)} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.maintext?.slice(0, 160)} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Prime Home Care AG" />
        <meta property="article:published_time" content={blog.createdAt} />
        <meta property="article:section" content={blog.category} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription || blog.maintext?.slice(0, 160)} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div className="max-w-[1410px] mx-auto px-6">
        {/* Back button */}
        <div className="mt-6">
          <Link href="/BlogPage" className="inline-flex items-center gap-2 text-[#04436F] text-[15px] font-medium hover:text-[#B99B5F] transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Zurück zu Blogs
          </Link>
        </div>

        {/* Header */}
        <div className="grid grid-cols-1 mt-[50px] lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-[#003588] font-['Instrument Sans'] text-[40px] leading-[50px] lg:text-[60px] font-semibold lg:leading-[65px]">
              {blog.title}
            </h1>
            <p className="text-black mt-2">{blog.date} | {blog.category}</p>

            {blog.maintext && (
              blog.maintext.startsWith("<") ? (
                <div className="text-[#04436F] font-['Metropolis'] text-[18px] font-light leading-[28px] mt-6 blog-content"
                  dangerouslySetInnerHTML={{ __html: blog.maintext }} />
              ) : (
                <p className="text-[#04436F] font-['Metropolis'] text-[18px] font-light leading-[24px] mt-6">
                  {blog.maintext}
                </p>
              )
            )}

            <div className="flex flex-row gap-[8px]">
              <button
                className="mt-6 px-6 py-3 bg-[#04436F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[21.6px] underline rounded-[100px] flex items-center gap-2 hover:bg-[#033559] transition"
                onClick={() => scrollToSection(0)}
              >
                Unten weiterlesen
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="22" viewBox="0 0 16 22" fill="none" className="ml-2">
                  <g clipPath="url(#clip0_1541_6690)">
                    <path d="M7.75 1L7.75 21M7.75 21L1.5 14.75M7.75 21L14 14.75" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1541_6690">
                      <rect width="22" height="15" fill="white" transform="translate(0.5 22) rotate(-90)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <span className="mt-6 px-6 py-3 bg-[#B99B5F] text-[#FAFCFF] text-center font-['Inter'] text-[18px] font-medium leading-[20px] rounded-[100px] flex items-center hover:bg-[#033559] transition">
                {blog.category}
              </span>
            </div>
          </div>

          <img src={blog.image || "/images/blog1.png"} alt={blog.title} className="w-full rounded-[20px] lg:h-[620px] mt-2 object-cover" />
        </div>

        {/* Author & Table of Contents */}
        <div className="mt-[120px] flex flex-col lg:flex-row items-start gap-6">
          <div className="lg:w-1/3 bg-[#F9FAFB] shadow-md rounded-[16px] p-6 flex flex-col items-center text-center">
            <img
              src={blog.authorImage || "/images/phc-author.png"}
              alt={blog.authorName}
              className="w-40 h-40 rounded-full object-cover shadow-md"
            />
            <h3 className="mt-6 font-['Instrument Sans'] text-[#04436F] text-[22px] font-semibold">
              {blog.authorName}
            </h3>
            <p className="text-[#6B7280] text-[16px] font-medium">{blog.authorPosition}</p>
            <p className="mt-4 text-[#374151] text-[15px] leading-[24px]">{blog.authorDescription}</p>
          </div>

          <div className="lg:w-2/3 p-2">
            <ul className="space-y-3">
              {sections.map((section, index) => (
                <li
                  key={section.id || index}
                  className="cursor-pointer flex justify-between items-center bg-[#EDF2FB] p-4 rounded-[12px]"
                  onClick={() => scrollToSection(index)}
                >
                  <span className="text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline">
                    {section.title}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
                    <g clipPath="url(#clip0_1352_2701)">
                      <path d="M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z" fill="#04436F"/>
                      <path d="M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_1352_2701">
                        <rect width="24" height="25" fill="white" transform="matrix(-1 0 0 -1 24 25.1699)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Blog Sections */}
        <div className="max-w-[1410px] mx-auto px-4">
          {sections.length > 0 && (
            <div className="max-w-[1410px] mx-auto lg:px-4">
              {sections.map((section, sectionIndex) => (
                <div
                  key={section.id || sectionIndex}
                  ref={(el) => (sectionsRef.current[sectionIndex] = el)}
                  className="space-y-[24px] mt-12 lg:mt-[80px]"
                >
                  <h2 className="text-[#003588] font-['Metropolis'] text-[24px] lg:text-[40px] font-semibold lg:leading-[48px]">
                    {sectionIndex + 1}. {section.title}
                  </h2>
                  {section.title2 && (
                    <h3 className="text-[#003588] font-['Metropolis'] text-[24px] font-[400] leading-[25.6px]">
                      {section.title2}
                    </h3>
                  )}
                  {section.paragraphs?.length > 0 && (
                    <div className="mt-2 text-[#04436F] font-['Metropolis'] text-[18px] lg:text-[20px] font-normal leading-[32px] space-y-3 blog-content">
                      {section.paragraphs.map((p, pi) =>
                        p.text?.startsWith("<") ? (
                          <div key={pi} dangerouslySetInnerHTML={{ __html: p.text }} />
                        ) : (
                          <p key={pi}>{p.text}</p>
                        )
                      )}
                    </div>
                  )}
                  {section.faqs?.length > 0 && (
                    <div className="mt-10 space-y-4">
                      {section.faqs.map((faq, faqIndex) => (
                        <div key={faq.id || faqIndex} className="bg-[#EDF2FB] p-4 rounded-[12px]">
                          <button
                            className="w-full flex justify-between items-center text-[#04436F] font-['Metropolis'] text-[20px] font-semibold leading-[28px] underline"
                            onClick={() => setFaqOpen(faqOpen === `${sectionIndex}-${faqIndex}` ? null : `${sectionIndex}-${faqIndex}`)}
                          >
                            {faq.question}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none"
                              className={`transform transition-transform ${faqOpen === `${sectionIndex}-${faqIndex}` ? "rotate-180" : ""}`}>
                              <g clipPath="url(#clip0_faq)">
                                <path d="M12 0.669922C5.37258 0.669922 0 6.04251 0 12.6699C0 19.2973 5.37258 24.6699 12 24.6699C18.6274 24.6699 24 19.2973 24 12.6699C24 6.04251 18.6274 0.669922 12 0.669922Z" fill="#04436F"/>
                                <path d="M16.4443 10.4481L11.9999 14.8926L7.5554 10.4481" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              </g>
                              <defs><clipPath id="clip0_faq"><rect width="24" height="25" fill="white" transform="matrix(-1 0 0 -1 24 25.1699)"/></clipPath></defs>
                            </svg>
                          </button>
                          {faqOpen === `${sectionIndex}-${faqIndex}` && (
                            <p className="mt-3 text-[#04436F] font-['Metropolis'] text-[16px] font-normal leading-[24px]">
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Blogs */}
        <div className="max-w-[1410px] mx-auto mt-[120px] mb-[150px]">
          <h2 className="text-[40px] leading-[48px] font-[600] text-[#04436F] text-left">Auch lesenswert</h2>
          <p className="text-[#555] text-[18px] leading-[28px] mt-2 max-w-[900px]">
            Entdecken Sie weitere spannende Beiträge, die Sie bisher noch nicht gelesen haben.<br />
            Diese Empfehlungen eröffnen Ihnen neue Perspektiven und zusätzliche Informationen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {recommendedBlogs.map((b) => (
              <Link key={b.slug} href={`/blog/${b.slug}`} passHref>
                <div className="cursor-pointer bg-[#f1f1f1] p-4 rounded-[20px] hover:shadow-lg transition-shadow h-full flex flex-col">
                  <img src={b.image || "/images/blog1.png"} alt={b.title} className="w-full h-[200px] rounded-[20px] object-cover" />
                  <div className="flex flex-row justify-between mt-4">
                    <span className="bg-[#E6F0FA] text-[#04436F] text-[14px] font-medium leading-[22px] px-4 py-1 rounded-full">
                      {b.category}
                    </span>
                    <p className="text-[#04436F] text-[14px] font-[400] leading-[25px] ml-2">{b.date}</p>
                  </div>
                  <h3 className="text-[#04436F] text-[26px] leading-[33px] font-[600] mt-2">{b.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
