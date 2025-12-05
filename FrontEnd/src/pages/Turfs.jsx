import React, { useState, useMemo, useEffect } from 'react';
import TurfCard from '../components/TurfCard';
import { turfAPI } from '../services/api';
import './Turfs.css';

function Turfs() {
  const [allTurfs, setAllTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch turfs from API on component mount
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await turfAPI.getAll({ limit: 1000 });
        
        // Handle different response structures
        const turfsData = response.data?.turfs || response.turfs || response.data || [];
        
        // DEBUG: Log raw API response to track image URLs
        console.log('=== TURFS API RESPONSE DEBUG ===');
        console.log('Total turfs received:', turfsData.length);
        turfsData.forEach((turf, index) => {
          console.log(`Turf ${index + 1} [${turf._id || turf.id}]:`, {
            name: turf.name,
            rawImages: turf.images,
            imageUrl: turf.images?.[0]?.url,
            fallbackImage: turf.image
          });
        });
        
        // Transform API data to match component expectations
        // Include all fields required by TurfDetails component
        const transformedTurfs = turfsData.map(turf => ({
          id: turf._id || turf.id,
          _id: turf._id || turf.id, // Include both id and _id for compatibility
          name: turf.name || 'Unnamed Turf',
          description: turf.description || 'No description available',
          location: turf.location?.city || turf.location || 'Location not specified',
          price: turf.pricing?.hourlyRate || turf.price || 0,
          type: turf.sports?.[0] || turf.type || 'Multi-Sport',
          rating: typeof turf.rating === 'number' ? turf.rating : (turf.rating?.average ?? 0),
          amenities: Array.isArray(turf.amenities) ? turf.amenities : [],
          image: turf.images?.[0]?.url || turf.image || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=400&q=80',
          email: turf.contact?.email || turf.email || 'N/A',
          contact: turf.contact?.phone || turf.contact || 'N/A'
        }));
        
        // DEBUG: Log transformed turfs to verify image URLs are preserved
        console.log('=== TRANSFORMED TURFS DEBUG ===');
        transformedTurfs.forEach((turf, index) => {
          console.log(`Transformed Turf ${index + 1} [${turf.id}]:`, {
            name: turf.name,
            image: turf.image
          });
        });
        
        setAllTurfs(transformedTurfs);
      } catch (err) {
        console.error('Error fetching turfs:', err);
        setError(err.message || 'Failed to load turfs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Retry function for error recovery
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    
    const fetchTurfs = async () => {
      try {
        const response = await turfAPI.getAll({ limit: 1000 });
        const turfsData = response.data?.turfs || response.turfs || response.data || [];
        
        // DEBUG: Log raw API response to track image URLs (retry handler)
        console.log('=== TURFS API RESPONSE DEBUG (RETRY) ===');
        console.log('Total turfs received:', turfsData.length);
        turfsData.forEach((turf, index) => {
          console.log(`Turf ${index + 1} [${turf._id || turf.id}]:`, {
            name: turf.name,
            rawImages: turf.images,
            imageUrl: turf.images?.[0]?.url,
            fallbackImage: turf.image
          });
        });
        
        const transformedTurfs = turfsData.map(turf => ({
          id: turf._id || turf.id,
          _id: turf._id || turf.id, // Include both id and _id for compatibility
          name: turf.name || 'Unnamed Turf',
          description: turf.description || 'No description available',
          location: turf.location?.city || turf.location || 'Location not specified',
          price: turf.pricing?.hourlyRate || turf.price || 0,
          type: turf.sports?.[0] || turf.type || 'Multi-Sport',
          rating: typeof turf.rating === 'number' ? turf.rating : (turf.rating?.average ?? 0),
          amenities: Array.isArray(turf.amenities) ? turf.amenities : [],
          image: turf.images?.[0]?.url || turf.image || 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=400&q=80',
          email: turf.contact?.email || turf.email || 'N/A',
          contact: turf.contact?.phone || turf.contact || 'N/A'
        }));
        
        // DEBUG: Log transformed turfs to verify image URLs are preserved (retry handler)
        console.log('=== TRANSFORMED TURFS DEBUG (RETRY) ===');
        transformedTurfs.forEach((turf, index) => {
          console.log(`Transformed Turf ${index + 1} [${turf.id}]:`, {
            name: turf.name,
            image: turf.image
          });
        });
        
        setAllTurfs(transformedTurfs);
      } catch (err) {
        console.error('Error fetching turfs:', err);
        setError(err.message || 'Failed to load turfs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTurfs();
  };

  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const turfsPerPage = 6;

  const filteredTurfs = useMemo(() => {
    let filtered = allTurfs;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(turf =>
        turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turf.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        turf.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation !== 'All') {
      filtered = filtered.filter(turf => turf.location === selectedLocation);
    }

    if (selectedPriceRange !== 'All') {
      switch (selectedPriceRange) {
        case '900':
          filtered = filtered.filter(turf => turf.price === 900);
          break;
        case '1000':
          filtered = filtered.filter(turf => turf.price === 1000);
          break;
        case '1100':
          filtered = filtered.filter(turf => turf.price === 1100);
          break;
        case '1200':
          filtered = filtered.filter(turf => turf.price === 1200);
          break;
        case 'budget':
          filtered = filtered.filter(turf => turf.price >= 900 && turf.price <= 1000);
          break;
        case 'premium':
          filtered = filtered.filter(turf => turf.price >= 1100 && turf.price <= 1200);
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [allTurfs, searchTerm, selectedLocation, selectedPriceRange]);

  const totalPages = Math.ceil(filteredTurfs.length / turfsPerPage);
  const startIndex = (currentPage - 1) * turfsPerPage;
  const endIndex = startIndex + turfsPerPage;
  const currentTurfs = useMemo(() => {
    return filteredTurfs.slice(startIndex, endIndex);
  }, [filteredTurfs, startIndex, endIndex]);



  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const resultsSection = document.querySelector('.turfs-results');
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
    setCurrentPage(1);
  };

  const handlePriceFilter = (priceRange) => {
    setSelectedPriceRange(priceRange);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="turfs-page">
      <div className="turfs-header">
        <h1>Find Your Perfect Turf</h1>
        <p>Discover and book the best sports facilities in your area</p>
      </div>

      <div className="turfs-content">
        {/* Search and Filters */}
        <div className="search-filters-container">
          <div className="search-section">
            <div className="search-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search turfs by name, type, or location..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
                disabled={loading}
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="clear-search"
                  aria-label="Clear search"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="filters-container">
            <div className="filter-wrapper">
              <span className="filter-text">Location:</span>
              <select
                className="filter-select"
                value={selectedLocation}
                onChange={(e) => handleLocationFilter(e.target.value)}
                disabled={loading}
              >
                <option value="All">All Locations</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
              </select>
            </div>

            <div className="filter-wrapper">
              <span className="filter-text">Price Range:</span>
              <select
                className="filter-select"
                value={selectedPriceRange}
                onChange={(e) => handlePriceFilter(e.target.value)}
                disabled={loading}
              >
                <option value="All">All Prices</option>
                <option value="budget">Budget (900-1000 ৳)</option>
                <option value="premium">Premium (1100-1200 ৳)</option>
                <option value="900">900 ৳ Only</option>
                <option value="1000">1000 ৳ Only</option>
                <option value="1100">1100 ৳ Only</option>
                <option value="1200">1200 ৳ Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="turfs-results">
          {/* Loading State */}
          {loading && (
            <div className="loading-container" style={{ textAlign: 'center', padding: '3rem' }}>
              <div className="loading-spinner" style={{ 
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #10b981',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p style={{ color: '#666', fontSize: '1.1rem' }}>Loading turfs...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-container" style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: '#fee',
              borderRadius: '8px',
              margin: '2rem 0'
            }}>
              <svg 
                style={{ width: '50px', height: '50px', color: '#dc2626', margin: '0 auto 1rem' }}
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2" />
              </svg>
              <h3 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Error Loading Turfs</h3>
              <p style={{ color: '#666', marginBottom: '1.5rem' }}>{error}</p>
              <button 
                onClick={handleRetry}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              <div className="results-header">
                <h2>
                  {(() => {
                    let title = '';
                    if (selectedLocation !== 'All') {
                      title += `Turfs in ${selectedLocation}`;
                    } else {
                      title += 'All Turfs';
                    }

                    if (selectedPriceRange !== 'All') {
                      const priceText = {
                        'budget': ' (Budget: 900-1000 ৳)',
                        'premium': ' (Premium: 1100-1200 ৳)',
                        '900': ' (900 ৳)',
                        '1000': ' (1000 ৳)',
                        '1100': ' (1100 ৳)',
                        '1200': ' (1200 ৳)'
                      };
                      title += priceText[selectedPriceRange] || '';
                    }

                    return `${title} (${filteredTurfs.length})`;
                  })()}
                </h2>
                {searchTerm && (
                  <p className="search-info">
                    Search results for "{searchTerm}"
                  </p>
                )}
                <p className="page-info">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredTurfs.length)} of {filteredTurfs.length} turfs
                </p>
              </div>

              {/* Empty State */}
              {filteredTurfs.length === 0 && (
                <div className="empty-state" style={{ 
                  textAlign: 'center', 
                  padding: '3rem',
                  color: '#666'
                }}>
                  <svg 
                    style={{ width: '60px', height: '60px', margin: '0 auto 1rem', opacity: 0.5 }}
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="8" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" strokeWidth="2" />
                  </svg>
                  <h3 style={{ marginBottom: '0.5rem' }}>No Turfs Found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}

              {/* Turfs Grid */}
              {filteredTurfs.length > 0 && (
                <>
                  <div className="turfs-grid">
                    {currentTurfs.map(turf => (
                      <TurfCard key={turf.id} turf={turf} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button
                        className={`pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`}
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNumber = index + 1;
                          return (
                            <button
                              key={pageNumber}
                              className={`pagination-number ${currentPage === pageNumber ? 'active' : ''}`}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        className={`pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Turfs;