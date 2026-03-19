import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("https://saddlebrown-elephant-938227.hostingersite.com/wp-json/wp/v2/wiki?per_page=100")
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Alle Wiki-Artikel</h1>
      {blogs.map(blog => (
        <div key={blog.id} className="my-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{blog.title.rendered}</h2>
          <p
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blog.content.rendered || 'Kein Inhalt vorhanden'),
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
