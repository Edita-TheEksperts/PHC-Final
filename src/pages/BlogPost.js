import { useParams, Link } from "react-router-dom";
import blogsData from "../data/blogsData";

export default function BlogPost() {
  const { id } = useParams();
  const blog = blogsData.find((post) => post.id.toString() === id);

  if (!blog) return <h2 className="text-center text-[#04436F]">Blog not found!</h2>;

  // Get recommended blogs (excluding current blog)
  const recommendedBlogs = blogsData.filter((post) => post.id !== blog.id).slice(0, 3);

  return (
    <div className="bg-[#FAFCFF]  max-w-[900px] mx-auto px-6">
      
      {/* Blog Header */}
      <div className="bg-[#B99B5F] text-center py-[60px] rounded-[20px] mb-[50px]">
        <h1 className="text-white text-[44px] font-semibold leading-[52px] font-['Instrument Sans']">
          {blog.title}
        </h1>
        <p className="text-white text-[16px] font-normal leading-[25.6px] font-['Inter']">
          {blog.date} | {blog.category}
        </p>
      </div>

      {/* Blog Content */}
      <img src={blog.image} alt={blog.title} className="w-full rounded-lg mb-6" />
      <p className="text-[#04436F] text-[18px] font-light leading-[28px] font-['Metropolis']">
        {blog.content}
      </p>

      {/* Recommended Blogs Section */}
      <div className="mt-12">
        <h3 className="text-[#04436F] text-[30px] font-semibold leading-[40px] font-['Instrument Sans'] mb-6">
          Recommended Blogs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedBlogs.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-[10px] overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-[150px] object-cover" />
              <div className="p-4">
                <h4 className="text-[#04436F] text-[18px] font-semibold">{post.title}</h4>
                <p className="text-[#666] text-[14px] mt-1">{post.date}</p>
                <Link to={`/blog/${post.id}`}>
                  <button className="bg-[#04436F] text-white mt-4 py-2 px-4 rounded-full text-[14px] font-medium hover:bg-[#B99B5F] transition">
                    Mehr Lesen
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
