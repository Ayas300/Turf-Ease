import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TurfCard.css';

// Default placeholder image for when image fails to load
const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=400&q=80';

/**
 * Validates and prepares turf data before navigation to ensure all required fields are present
 * @param {Object} turf - The turf object to validate
 * @returns {Object} - Validated and complete turf object
 */
function validateAndPrepareTurfData(turf) {
  // Ensure all required fields are present with proper fallbacks
  const validatedTurf = {
    id: turf.id || turf._id,
    _id: turf._id || turf.id,
    name: turf.name || 'Unnamed Turf',
    description: turf.description || 'No description available',
    location: turf.location || 'Location not specified',
    type: turf.type || 'Sports',
    price: turf.price !== undefined ? turf.price : 0,
    rating: turf.rating !== undefined ? turf.rating : 0,
    image: turf.image || DEFAULT_PLACEHOLDER,
    contact: turf.contact || 'N/A',
    email: turf.email || 'N/A',
    amenities: Array.isArray(turf.amenities) 
      ? turf.amenities.map(a => typeof a === 'string' ? a : a?.name || String(a))
      : []
  };
  
  console.log('[TurfCard] Validated turf data for navigation:', {
    id: validatedTurf.id,
    name: validatedTurf.name,
    hasAllFields: !!(validatedTurf.id && validatedTurf.name && validatedTurf.location && validatedTurf.image)
  });
  
  return validatedTurf;
}

function TurfCard({ turf }) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // DEBUG: Log turf prop to verify image URL is received correctly
  console.log('=== TURF CARD RENDER DEBUG ===');
  console.log(`TurfCard rendering for [${turf.id}]:`, {
    name: turf.name,
    image: turf.image,
    hasImage: !!turf.image,
    imageType: typeof turf.image
  });

  const handleViewMore = () => {
    // Validate and prepare turf data before navigation
    const validatedTurf = validateAndPrepareTurfData(turf);
    
    console.log('[TurfCard] Navigating to turf details with validated data:', validatedTurf.id);
    navigate(`/turf/${validatedTurf.id}`, { state: { turf: validatedTurf } });
  };

  // Handle image loading errors by falling back to placeholder
  const handleImageError = (e) => {
    console.log(`Image failed to load for turf [${turf.id}]: ${turf.image}`);
    if (!imageError) {
      setImageError(true);
      e.target.src = DEFAULT_PLACEHOLDER;
    }
  };

  return (
    <div className="turf-card-new">
      <div className="turf-card-image-wrap">
        <img 
          src={turf.image} 
          alt={turf.name} 
          className="turf-card-image"
          onError={handleImageError}
        />
      </div>
      <div className="turf-card-body">
        <h3 className="turf-card-title">{turf.name}</h3>
        <p className="turf-card-location">{turf.location}</p>
        <button className="turf-card-btn" onClick={handleViewMore}>
          View More
        </button>
      </div>
    </div>
  );
}

export default TurfCard;