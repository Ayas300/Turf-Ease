/**
 * Turf Data Mapper Utility
 * 
 * This utility provides functions to map between user-friendly display values
 * and backend-compatible formats for facility types and amenities.
 */

// Facility Type Mappings
const FACILITY_TYPE_MAP = {
  'Football Field': 'football',
  'Cricket Ground': 'cricket',
  'Basketball Court': 'basketball',
  'Tennis Court': 'tennis',
  'Badminton Court': 'badminton',
  'Volleyball Court': 'volleyball',
  'Hockey Field': 'hockey',
  'Multi-purpose Ground': 'football', // Default to football
  'Swimming Pool': 'football' // Not in backend enum, default to football
};

// Reverse mapping for facility types
const FACILITY_TYPE_REVERSE_MAP = {
  'football': 'Football Field',
  'cricket': 'Cricket Ground',
  'basketball': 'Basketball Court',
  'tennis': 'Tennis Court',
  'badminton': 'Badminton Court',
  'volleyball': 'Volleyball Court',
  'hockey': 'Hockey Field'
};

// Amenity Mappings
const AMENITY_MAP = {
  'Floodlights': 'lighting',
  'Parking': 'parking',
  'Changing Rooms': 'changing_room',
  'Cafeteria': 'cafeteria',
  'First Aid': 'first_aid',
  'Equipment Rental': 'equipment_rental',
  'Scoreboard': 'seating', // Not in backend enum, map to closest match
  'Seating Area': 'seating',
  'Washrooms': 'washroom',
  'Security': 'parking', // Not in backend enum, map to closest match
  'Air Conditioning': 'changing_room', // Not in backend enum, map to closest match
  'Wi-Fi': 'cafeteria' // Not in backend enum, map to closest match
};

// Reverse mapping for amenities
const AMENITY_REVERSE_MAP = {
  'lighting': 'Floodlights',
  'parking': 'Parking',
  'changing_room': 'Changing Rooms',
  'cafeteria': 'Cafeteria',
  'first_aid': 'First Aid',
  'equipment_rental': 'Equipment Rental',
  'seating': 'Seating Area',
  'washroom': 'Washrooms'
};

/**
 * Maps facility type display name to backend format
 * @param {string} displayType - User-friendly facility type (e.g., "Football Field")
 * @returns {string} Backend format (e.g., "football")
 */
export function mapFacilityTypeToBackend(displayType) {
  if (!displayType) {
    return 'football'; // Default fallback
  }
  
  const mapped = FACILITY_TYPE_MAP[displayType];
  
  // If not found in map, try to match by converting to lowercase
  if (!mapped) {
    const lowerType = displayType.toLowerCase();
    // Check if it's already in backend format
    if (Object.values(FACILITY_TYPE_MAP).includes(lowerType)) {
      return lowerType;
    }
    // Default fallback
    return 'football';
  }
  
  return mapped;
}

/**
 * Valid backend enum values for amenities
 * These must match the backend Turf model enum exactly
 */
export const VALID_BACKEND_AMENITIES = [
  'parking',
  'washroom',
  'changing_room',
  'lighting',
  'seating',
  'cafeteria',
  'first_aid',
  'equipment_rental'
];

/**
 * Valid backend enum values for sports
 * These must match the backend Turf model enum exactly
 */
export const VALID_BACKEND_SPORTS = [
  'football',
  'cricket',
  'basketball',
  'tennis',
  'badminton',
  'volleyball',
  'hockey'
];

/**
 * Maps amenity display name to backend format
 * @param {string} displayAmenity - User-friendly amenity (e.g., "Floodlights")
 * @returns {string|null} Backend format (e.g., "lighting") or null if not mappable
 */
export function mapAmenityToBackend(displayAmenity) {
  if (!displayAmenity) {
    return null;
  }
  
  const mapped = AMENITY_MAP[displayAmenity];
  
  // If not found in map, try to match by converting to lowercase with underscores
  if (!mapped) {
    const lowerAmenity = displayAmenity.toLowerCase().replace(/\s+/g, '_');
    // Check if it's already in backend format (valid enum value)
    if (VALID_BACKEND_AMENITIES.includes(lowerAmenity)) {
      return lowerAmenity;
    }
    // Return null for unmappable amenities
    return null;
  }
  
  return mapped;
}

/**
 * Maps array of amenities from display to backend format
 * @param {string[]} displayAmenities - Array of user-friendly amenities
 * @returns {string[]} Array of backend-formatted amenities (filters out null values)
 */
export function mapAmenitiesToBackend(displayAmenities) {
  if (!Array.isArray(displayAmenities)) {
    return [];
  }
  
  return displayAmenities
    .map(amenity => mapAmenityToBackend(amenity))
    .filter(amenity => amenity !== null && amenity !== undefined) // Remove unmappable amenities
    .filter(amenity => VALID_BACKEND_AMENITIES.includes(amenity)); // Ensure only valid enum values
}

/**
 * Maps backend facility type to display format (for reverse mapping)
 * @param {string} backendType - Backend format (e.g., "football")
 * @returns {string} Display format (e.g., "Football Field")
 */
export function mapFacilityTypeToDisplay(backendType) {
  if (!backendType) {
    return 'Football Field'; // Default fallback
  }
  
  const mapped = FACILITY_TYPE_REVERSE_MAP[backendType.toLowerCase()];
  
  // If not found, capitalize the backend type as fallback
  if (!mapped) {
    return backendType.charAt(0).toUpperCase() + backendType.slice(1) + ' Field';
  }
  
  return mapped;
}

/**
 * Maps backend amenity to display format (for reverse mapping)
 * @param {string} backendAmenity - Backend format (e.g., "lighting")
 * @returns {string} Display format (e.g., "Floodlights")
 */
export function mapAmenityToDisplay(backendAmenity) {
  if (!backendAmenity) {
    return '';
  }
  
  const mapped = AMENITY_REVERSE_MAP[backendAmenity.toLowerCase()];
  
  // If not found, convert snake_case to Title Case as fallback
  if (!mapped) {
    return backendAmenity
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return mapped;
}

/**
 * Validates if an amenity value is a valid backend enum value
 * @param {string} amenity - Amenity value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidBackendAmenity(amenity) {
  return VALID_BACKEND_AMENITIES.includes(amenity);
}

/**
 * Validates if a sport value is a valid backend enum value
 * @param {string} sport - Sport value to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidBackendSport(sport) {
  return VALID_BACKEND_SPORTS.includes(sport);
}

// Export mapping tables for testing purposes
export const MAPPINGS = {
  FACILITY_TYPE_MAP,
  FACILITY_TYPE_REVERSE_MAP,
  AMENITY_MAP,
  AMENITY_REVERSE_MAP
};
