import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogCard.css';

function BlogCard({ blog }) {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${blog.id}`);
  };

  return (
    <div className="blog-card">
      <div className="blog-image-container">
        <img src={blog.image} alt={blog.title} className="blog-image" />
        <div className="blog-category">
          <span className="category-tag">{blog.category}</span>
        </div>
      </div>
      
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-date">{blog.date}</span>
          <span className="blog-author">By {blog.author}</span>
        </div>
        
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.excerpt}</p>
        
        <div className="blog-footer">
          <div className="blog-stats">
            <span className="read-time">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx={12} cy={12} r={10} />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              {blog.readTime} min read
            </span>
          </div>
          
          <button className="read-more-btn" onClick={handleReadMore}>
            Read More
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;