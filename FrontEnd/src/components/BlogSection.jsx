import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from './BlogCard';
import './BlogSection.css';

function BlogSection() {
  const navigate = useNavigate();
  const [blogs] = useState([
    {
      id: 1,
      title: "Exploring the Top Futsal Fields Around Chittagong",
      excerpt: "Discover the best futsal venues in Chittagong with state-of-the-art facilities, perfect lighting, and professional-grade surfaces that will elevate your game to the next level.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80",
      category: "Chittagong",
      author: "Sports Team",
      date: "Dec 15, 2024",
      readTime: 5
    },
    {
      id: 2,
      title: "Top 3 Futsal Fields in Sylhet: Where to Play Your Best Game",
      excerpt: "From premium indoor courts to outdoor fields with stunning views, explore Sylhet's finest futsal destinations that offer exceptional playing experiences for all skill levels.",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=600&q=80",
      category: "Sylhet",
      author: "Field Expert",
      date: "Dec 12, 2024",
      readTime: 5
    },
    {
      id: 3,
      title: "Best Cricket Grounds for Tournament Play in Chittagong and Sylhet",
      excerpt: "Professional cricket facilities across Bangladesh featuring world-class pitches, modern amenities, and tournament-ready infrastructure for competitive matches.",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
      category: "Cricket",
      author: "Cricket Pro",
      date: "Dec 10, 2024",
      readTime: 6
    },
    {
      id: 4,
      title: "Multi-Sport Complexes: The Future of Sports",
      excerpt: "Modern multi-sport facilities that combine football, basketball, tennis, and more under one roof, offering versatile spaces for athletes and sports enthusiasts.",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=600&q=80",
      category: "Multi-Sport",
      author: "Sports Analyst",
      date: "Dec 8, 2024",
      readTime: 4
    }
  ]);

  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <h2 className="blog-section-title">Latest Sports Insights</h2>
          <p className="blog-section-subtitle">
            Stay updated with the latest trends, tips, and discoveries in the world of sports facilities
          </p>
        </div>

        <div className="blog-grid">
          {blogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        <div className="blog-footer">
          <button className="view-all-blogs-btn" onClick={() => navigate('/blogs')}>
            <span>View All Articles</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default BlogSection;