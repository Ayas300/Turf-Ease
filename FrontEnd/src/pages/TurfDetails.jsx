import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { showBookingSuccess, showError } from '../utils/toast';
import { turfAPI } from '../services/api';
import './TurfDetails.css';

/**
 * Validates that a turf object has all required fields for rendering
 * @param {Object} turfData - The turf object to validate
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
function validateTurfData(turfData) {
  const requiredFields = ['name', 'location', 'price', 'type', 'image'];
  const missingFields = [];
  
  if (!turfData || typeof turfData !== 'object') {
    return { isValid: false, missingFields: ['entire turf object'] };
  }
  
  // Check for required fields
  for (const field of requiredFields) {
    if (!turfData[field] && turfData[field] !== 0) {
      missingFields.push(field);
    }
  }
  
  // Check if id or _id exists
  if (!turfData.id && !turfData._id) {
    missingFields.push('id or _id');
  }
  
  // Accept data even with default values - they're better than nothing
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

function TurfDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [turf, setTurf] = useState(location.state?.turf || null);
  const [loading, setLoading] = useState(!location.state?.turf);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Add console logging to track data flow from navigation state
    console.log('[TurfDetails] Component mounted/updated');
    console.log('[TurfDetails] Turf ID from params:', id);
    console.log('[TurfDetails] Navigation state:', location.state);
    console.log('[TurfDetails] Turf from navigation state:', location.state?.turf);

    // If turf data is already available from navigation state, validate and use it
    if (location.state?.turf) {
      console.log('[TurfDetails] Using turf data from navigation state');
      const navTurf = location.state.turf;
      
      // Validate that the turf object has required fields
      const validationResult = validateTurfData(navTurf);
      if (!validationResult.isValid) {
        console.warn('[TurfDetails] Navigation state turf data is incomplete:', validationResult.missingFields);
        console.log('[TurfDetails] Will fetch from API instead');
        // Clear the turf and fetch from API
        setTurf(null);
        setLoading(true);
      } else {
        console.log('[TurfDetails] Navigation state turf data is valid');
        return;
      }
    }

    // Fetch turf data from API
    const fetchTurf = async () => {
      try {
        console.log('[TurfDetails] Fetching turf data from API for ID:', id);
        setLoading(true);
        setError(null);
        const response = await turfAPI.getById(id);
        
        console.log('[TurfDetails] API response received:', response);
        console.log('[TurfDetails] Response type:', typeof response);
        console.log('[TurfDetails] Response keys:', response ? Object.keys(response) : 'null');
        
        // Transform API response to match component's expected format
        // The API interceptor returns response.data from axios, which is the backend response body
        // Backend returns: { success: true, data: { turf: {...} } }
        let turfData = null;
        
        // Try to extract turf data from various possible response structures
        if (response?.data?.turf) {
          // Response structure: { success: true, data: { turf: {...} } }
          turfData = response.data.turf;
          console.log('[TurfDetails] Extracted from response.data.turf');
        } else if (response?.turf) {
          // Response structure: { success: true, turf: {...} }
          turfData = response.turf;
          console.log('[TurfDetails] Extracted from response.turf');
        } else if (response?.data && response.data._id) {
          // Response structure: { success: true, data: {...} } where data is the turf object
          turfData = response.data;
          console.log('[TurfDetails] Extracted from response.data (has _id)');
        } else if (response?._id) {
          // Response is the turf object directly
          turfData = response;
          console.log('[TurfDetails] Using response directly (has _id)');
        }
        
        console.log('[TurfDetails] Extracted turf data:', turfData);
        console.log('[TurfDetails] Turf data type:', typeof turfData);
        console.log('[TurfDetails] Turf data keys:', turfData ? Object.keys(turfData) : 'null');
        
        // Validate that we have actual turf data
        if (!turfData || typeof turfData !== 'object') {
          console.error('[TurfDetails] Failed to extract turf data from response');
          console.error('[TurfDetails] Full response object:', JSON.stringify(response, null, 2));
          throw new Error('Invalid turf data received from API - could not extract turf object from response');
        }
        
        // Additional validation - check if turfData has _id
        if (!turfData._id && !turfData.id) {
          console.error('[TurfDetails] Turf data missing ID field');
          console.error('[TurfDetails] Turf data:', JSON.stringify(turfData, null, 2));
          throw new Error('Invalid turf data - missing ID field');
        }
        
        // Extract image URL with multiple fallback strategies
        let imageUrl = '/default-turf.jpg';
        if (turfData?.images && Array.isArray(turfData.images) && turfData.images.length > 0) {
          const firstImage = turfData.images[0];
          if (typeof firstImage === 'string') {
            imageUrl = firstImage;
          } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url;
          }
        }
        
        console.log('[TurfDetails] Extracted image URL:', imageUrl);
        
        // Map API data structure to component's expected structure
        const transformedTurf = {
          _id: turfData?._id || null,
          id: turfData?._id || turfData?.id || null, // Add id field mapped from _id
          name: turfData?.name || 'Unnamed Turf',
          description: turfData?.description || 'No description available',
          location: turfData?.location?.address || 
                   (turfData?.location?.city && turfData?.location?.state 
                     ? `${turfData.location.city}, ${turfData.location.state}` 
                     : 'Location not specified'),
          type: turfData?.sports?.[0] || 'Sports',
          price: turfData?.pricing?.hourlyRate || 0,
          rating: typeof turfData?.rating === 'number' ? turfData.rating : (turfData?.rating?.average ?? 0),
          image: imageUrl,
          contact: turfData?.contact?.phone || 'N/A',
          email: turfData?.contact?.email || 'N/A',
          amenities: Array.isArray(turfData?.amenities) 
            ? turfData.amenities.map(a => typeof a === 'string' ? a : a?.name || String(a))
            : []
        };
        
        console.log('[TurfDetails] Transformed turf data:', transformedTurf);
        
        // Validate the transformed data before setting state
        const validationResult = validateTurfData(transformedTurf);
        if (!validationResult.isValid) {
          console.error('[TurfDetails] Transformed turf data is incomplete:', validationResult.missingFields);
          throw new Error(`Incomplete turf data: missing ${validationResult.missingFields.join(', ')}`);
        }
        
        console.log('[TurfDetails] Turf data validation passed');
        setTurf(transformedTurf);
      } catch (err) {
        console.error('[TurfDetails] Error fetching turf details:', err);
        console.error('[TurfDetails] Error details:', { 
          message: err.message, 
          status: err.status, 
          type: err.type,
          stack: err.stack 
        });
        
        // Provide more specific error messages based on error type
        let errorMessage = 'Failed to load turf details';
        
        if (err.status === 404) {
          errorMessage = 'Turf not found. It may have been removed or the link is incorrect.';
        } else if (err.status === 500) {
          errorMessage = 'Server error occurred while loading turf details. Please try again later.';
        } else if (err.message?.includes('Network Error') || err.message?.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (err.message?.includes('Incomplete turf data')) {
          errorMessage = err.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        console.log('[TurfDetails] Setting error message:', errorMessage);
        setError(errorMessage);
        showError(errorMessage);
        
        // If turf not found, redirect to turfs page after a short delay
        if (err.status === 404) {
          console.log('[TurfDetails] Redirecting to turfs page in 2 seconds');
          setTimeout(() => {
            navigate('/turfs');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTurf();
    } else {
      console.error('[TurfDetails] No turf ID provided, redirecting to turfs page');
      navigate('/turfs');
    }
  }, [id, location.state, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="turf-details-page">
        <div className="turf-details-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading turf details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !turf) {
    console.log('[TurfDetails] Rendering error state');
    return (
      <div className="turf-details-page">
        <div className="turf-details-container">
          <div className="error-container">
            <h2>Unable to Load Turf Details</h2>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="retry-btn" onClick={() => window.location.reload()}>
                Try Again
              </button>
              <button className="back-btn-error" onClick={() => navigate('/turfs')}>
                Back to Turfs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No turf data available - validate before rendering
  if (!turf) {
    console.log('[TurfDetails] No turf data available, redirecting to turfs page');
    navigate('/turfs');
    return null;
  }
  
  // Final validation before rendering
  const validationResult = validateTurfData(turf);
  if (!validationResult.isValid) {
    console.error('[TurfDetails] Turf data validation failed before render:', validationResult.missingFields);
    return (
      <div className="turf-details-page">
        <div className="turf-details-container">
          <div className="error-container">
            <h2>Incomplete Turf Information</h2>
            <p className="error-message">
              This turf is missing some required information and cannot be displayed properly.
            </p>
            <p className="error-details">
              Missing fields: {validationResult.missingFields.join(', ')}
            </p>
            <button className="back-btn-error" onClick={() => navigate('/turfs')}>
              Back to Turfs
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  console.log('[TurfDetails] Rendering turf details for:', turf.name);

  const handleBookNow = () => {
    showBookingSuccess(turf.name, turf.contact, turf.email);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="turf-details-page">
      <div className="turf-details-container">
        {/* Back Button */}
        <button className="back-btn" onClick={handleGoBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Turfs
        </button>

        {/* Hero Section */}
        <div className="turf-hero">
          <div className="turf-image-container">
            <img src={turf.image} alt={turf.name} className="turf-hero-image" />
            <div className="turf-overlay">
              <div className="turf-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(turf.rating))}
                  {'☆'.repeat(5 - Math.floor(turf.rating))}
                </span>
                <span className="rating-number">{turf.rating}</span>
              </div>
            </div>
          </div>

          <div className="turf-hero-content">
            <h1 className="turf-title">{turf.name}</h1>
            <div className="turf-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <circle cx={12} cy={10} r={3} />
              </svg>
              {turf.location}
            </div>
            <div className="turf-type">
              <span className="type-badge">{turf.type}</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="turf-details-content">
          <div className="details-grid">
            {/* Pricing Card */}
            <div className="detail-card pricing-card">
              <h3>Booking Fee</h3>
              <div className="price-display">
                <span className="price">Tk{turf.price}</span>
                <span className="price-unit">per hour</span>
              </div>
              <button className="book-now-btn" onClick={handleBookNow}>
                Book Now
              </button>
            </div>

            {/* Contact Information */}
            <div className="detail-card contact-card">
              <h3>Contact Information</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{turf.contact}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{turf.email}</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="detail-card amenities-card">
              <h3>Available Amenities</h3>
              <div className="amenities-list">
                {turf.amenities && turf.amenities.length > 0 ? (
                  turf.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {typeof amenity === 'string' ? amenity : amenity?.name || JSON.stringify(amenity)}
                    </span>
                  ))
                ) : (
                  <p className="no-amenities">No amenities listed</p>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="detail-card info-card">
              <h3>Additional Information</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Sport Type:</span>
                  <span className="info-value">{turf.type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Rating:</span>
                  <span className="info-value">{turf.rating}/5.0</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{turf.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TurfDetails;