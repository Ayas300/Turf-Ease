import React, { useState, useEffect } from 'react';
import TurfGrid from '../components/TurfGrid';
import { turfAPI } from '../services/api';
import './AvailableTurfs.css';

function AvailableTurfs() {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch turfs from API
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all turfs from the API
        const response = await turfAPI.getAll({ limit: 1000 });
        
        // Transform API data to match component expectations
        const transformedTurfs = response.data.turfs.map(turf => ({
          id: turf._id,
          name: turf.name,
          location: turf.location.city,
          price: turf.pricing.hourlyRate,
          type: turf.sports.length > 1 ? 'Multi-Sport' : turf.sports[0],
          rating: turf.rating.average,
          amenities: turf.amenities,
          image: turf.images && turf.images.length > 0 
            ? turf.images[0].url 
            : 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=400&q=80',
          email: turf.contact.email,
          contact: turf.contact.phone
        }));
        
        setTurfs(transformedTurfs);
      } catch (err) {
        console.error('Error fetching turfs:', err);
        setError(err.message || 'Failed to load turfs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  return (
    <div className="available-turfs-page">
      <div className="available-turfs-container">
        {loading ? (
          <div className="loading-skeleton">
            <div className="skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-location"></div>
                    <div className="skeleton-button"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Turfs</h2>
            <p>{error}</p>
            <button 
              className="retry-button" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : turfs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h2>No Turfs Available</h2>
            <p>There are currently no turfs available. Please check back later.</p>
          </div>
        ) : (
          <TurfGrid turfs={turfs} />
        )}
      </div>
    </div>
  );
}

export default AvailableTurfs;