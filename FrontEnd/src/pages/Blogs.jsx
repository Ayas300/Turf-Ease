import React, { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';
import './Blogs.css';

function Blogs() {
  const [blogsData, setBlogsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate fetching blogs (in future this would be an API call)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock blog data
        const mockBlogs = [
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
          },
          {
            id: 5,
            title: "Essential Guide to Booking Sports Facilities",
            excerpt: "Learn the best practices for booking sports venues, understanding pricing structures, and getting the most value from your facility rentals.",
            image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80",
            category: "Guide",
            author: "Booking Expert",
            date: "Dec 5, 2024",
            readTime: 8
          },
          {
            id: 6,
            title: "The Rise of Indoor Sports in Bangladesh",
            excerpt: "Exploring how indoor sports facilities are transforming the athletic landscape in Bangladesh, providing year-round training and competition opportunities.",
            image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
            category: "Trends",
            author: "Sports Journalist",
            date: "Dec 3, 2024",
            readTime: 6
          },
          {
            id: 7,
            title: "Youth Sports Development Programs",
            excerpt: "Discover how modern sports facilities are contributing to youth development through structured programs, coaching, and community engagement initiatives.",
            image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
            category: "Youth",
            author: "Youth Coach",
            date: "Dec 1, 2024",
            readTime: 5
          },
          {
            id: 8,
            title: "Technology in Modern Sports Facilities",
            excerpt: "How cutting-edge technology is revolutionizing sports facilities, from smart booking systems to advanced playing surfaces and performance analytics.",
            image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            category: "Technology",
            author: "Tech Analyst",
            date: "Nov 28, 2024",
            readTime: 7
          }
        ];
        
        setBlogsData(mockBlogs);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Ensure blogs is always an array with null/undefined checks
  const blogs = blogsData || [];
  
  // Filter blogs based on search term only
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="blogs-page">
        <div className="blogs-header">
          <h1>Sports Insights & Articles</h1>
          <p>Stay updated with the latest trends, tips, and discoveries in the world of sports facilities</p>
        </div>
        <div className="blogs-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="blogs-page">
        <div className="blogs-header">
          <h1>Sports Insights & Articles</h1>
          <p>Stay updated with the latest trends, tips, and discoveries in the world of sports facilities</p>
        </div>
        <div className="blogs-content">
          <div className="error-state">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state (no blogs available)
  if (blogs.length === 0) {
    return (
      <div className="blogs-page">
        <div className="blogs-header">
          <h1>Sports Insights & Articles</h1>
          <p>Stay updated with the latest trends, tips, and discoveries in the world of sports facilities</p>
        </div>
        <div className="blogs-content">
          <div className="empty-state">
            <h3>No articles available</h3>
            <p>Check back soon for new content!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-header">
        <h1>Sports Insights & Articles</h1>
        <p>Stay updated with the latest trends, tips, and discoveries in the world of sports facilities</p>
      </div>

      <div className="blogs-content">
        <div className="blogs-filters">
          <div className="search-filter">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="blogs-results">
          <div className="results-info">
            <h2>
              All Articles ({filteredBlogs.length})
            </h2>
            {searchTerm && (
              <p className="search-info">
                Search results for "{searchTerm}"
              </p>
            )}
          </div>

          <div className="blogs-grid">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <BlogCard key={blog.id} blog={blog} />
              ))
            ) : (
              <div className="no-results">
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogs;