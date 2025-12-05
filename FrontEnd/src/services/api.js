import axios from 'axios';
import { saveToken, getToken, clearToken } from '../utils/tokenStorage';

// Base API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management functions (re-export from tokenStorage utility)
export const tokenStorage = {
  saveToken,
  getToken,
  clearToken
};

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor - add JWT token to Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No token found in storage for API request');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and extract data
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from successful response
    return response.data;
  },
  (error) => {
    // Handle different error scenarios
    const errorResponse = handleApiError(error);
    return Promise.reject(errorResponse);
  }
);

/**
 * Handle API errors and format them consistently
 * @param {Error} error - Axios error object
 * @returns {Object} Formatted error object
 */
function handleApiError(error) {
  // Network error (no response from server)
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return {
        message: 'Request timeout. Please check your connection and try again.',
        type: 'timeout',
        status: null
      };
    }
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      status: null
    };
  }

  // Server responded with error status
  const { status, data } = error.response;
  
  // Extract error message from response
  const message = data?.message || data?.error || 'An unexpected error occurred';
  
  // Handle specific status codes
  switch (status) {
    case 400:
      return {
        message,
        type: 'validation',
        status,
        errors: data?.errors || []
      };
    
    case 401:
      // Unauthorized - clear token
      tokenStorage.clearToken();
      return {
        message: message || 'Authentication required. Please login again.',
        type: 'authentication',
        status
      };
    
    case 403:
      return {
        message: message || 'You do not have permission to perform this action.',
        type: 'authorization',
        status
      };
    
    case 404:
      return {
        message: message || 'Resource not found.',
        type: 'not_found',
        status
      };
    
    case 409:
      return {
        message,
        type: 'conflict',
        status,
        conflict: data?.conflict || null
      };
    
    case 500:
    case 502:
    case 503:
      return {
        message: 'Server error. Please try again later.',
        type: 'server',
        status
      };
    
    default:
      return {
        message,
        type: 'unknown',
        status
      };
  }
}

// ============================================================================
// Authentication API Methods
// ============================================================================

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {Object} data - User registration data
   * @param {string} data.name - User's full name
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @param {string} data.phone - User's phone number
   * @param {string} data.role - User's role (user, owner, admin)
   * @returns {Promise<Object>} Response with token and user data
   */
  register(data) {
    return apiClient.post('/auth/register', data);
  },

  /**
   * Login user with credentials
   * @param {Object} data - Login credentials
   * @param {string} data.email - User's email address
   * @param {string} data.password - User's password
   * @returns {Promise<Object>} Response with token and user data
   */
  login(data) {
    return apiClient.post('/auth/login', data);
  },

  /**
   * Get current authenticated user's profile
   * Requires valid JWT token in Authorization header
   * @returns {Promise<Object>} Response with user data
   */
  getMe() {
    return apiClient.get('/auth/me');
  },

  /**
   * Logout current user
   * Clears token from storage
   * @returns {Promise<Object>} Response confirming logout
   */
  async logout() {
    try {
      // Call backend logout endpoint if it exists
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      // Even if backend call fails, clear token locally
      throw error;
    } finally {
      // Always clear token on logout
      tokenStorage.clearToken();
    }
  },

  /**
   * Update user profile information
   * @param {Object} data - Profile data to update
   * @param {string} [data.name] - Updated name
   * @param {string} [data.phone] - Updated phone number
   * @param {string} [data.avatar] - Updated avatar URL
   * @returns {Promise<Object>} Response with updated user data
   */
  updateProfile(data) {
    return apiClient.put('/auth/update-profile', data);
  },

  /**
   * Change user password
   * @param {Object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<Object>} Response confirming password change
   */
  changePassword(data) {
    return apiClient.put('/auth/change-password', data);
  }
};

// ============================================================================
// Turf API Methods
// ============================================================================

/**
 * Turf API endpoints
 */
export const turfAPI = {
  /**
   * Get all turfs with optional query parameters
   * @param {Object} [params] - Query parameters for filtering
   * @param {string} [params.sport] - Filter by sport type
   * @param {string} [params.city] - Filter by city
   * @param {string} [params.state] - Filter by state
   * @param {number} [params.minPrice] - Minimum hourly rate
   * @param {number} [params.maxPrice] - Maximum hourly rate
   * @param {number} [params.page] - Page number for pagination
   * @param {number} [params.limit] - Number of results per page
   * @param {string} [params.sort] - Sort field (e.g., 'rating', 'price')
   * @returns {Promise<Object>} Response with turfs array and pagination info
   */
  getAll(params = {}) {
    return apiClient.get('/turfs', { params });
  },

  /**
   * Get a single turf by ID
   * @param {string} id - Turf ID
   * @returns {Promise<Object>} Response with turf details
   */
  getById(id) {
    return apiClient.get(`/turfs/${id}`);
  },

  /**
   * Create a new turf (owner/admin only)
   * @param {Object} data - Turf data
   * @param {string} data.name - Turf name
   * @param {string} data.description - Turf description
   * @param {Object} data.location - Location details
   * @param {string} data.location.address - Street address
   * @param {string} data.location.city - City
   * @param {string} data.location.state - State
   * @param {string} data.location.pincode - Postal code
   * @param {Array<string>} data.sports - Available sports
   * @param {Object} data.pricing - Pricing information
   * @param {number} data.pricing.hourlyRate - Hourly rate
   * @param {Array<string>} [data.images] - Image URLs
   * @param {Array<string>} [data.amenities] - Available amenities
   * @returns {Promise<Object>} Response with created turf data
   */
  create(data) {
    return apiClient.post('/turfs', data);
  },

  /**
   * Update an existing turf (owner/admin only)
   * @param {string} id - Turf ID
   * @param {Object} data - Updated turf data (partial update supported)
   * @returns {Promise<Object>} Response with updated turf data
   */
  update(id, data) {
    return apiClient.put(`/turfs/${id}`, data);
  },

  /**
   * Delete a turf (owner/admin only)
   * @param {string} id - Turf ID
   * @returns {Promise<Object>} Response confirming deletion
   */
  delete(id) {
    return apiClient.delete(`/turfs/${id}`);
  },

  /**
   * Search turfs by query string
   * @param {Object} query - Search parameters
   * @param {string} [query.q] - Search query string (searches name, description, location)
   * @param {string} [query.sport] - Filter by sport type
   * @param {string} [query.city] - Filter by city
   * @param {number} [query.minPrice] - Minimum hourly rate
   * @param {number} [query.maxPrice] - Maximum hourly rate
   * @param {number} [query.minRating] - Minimum rating
   * @returns {Promise<Object>} Response with matching turfs
   */
  search(query) {
    return apiClient.get('/turfs/search', { params: query });
  },

  /**
   * Get availability for a turf on a specific date
   * @param {string} id - Turf ID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Object>} Response with available time slots
   */
  getAvailability(id, date) {
    return apiClient.get(`/turfs/${id}/availability`, { 
      params: { date } 
    });
  },

  /**
   * Get pending turfs for admin approval (admin only)
   * @returns {Promise<Object>} Response with pending turfs array
   */
  getPendingTurfs() {
    return apiClient.get('/turfs/admin/pending');
  },

  /**
   * Verify/approve a turf (admin only)
   * @param {string} id - Turf ID
   * @param {boolean} isVerified - Verification status (true to approve, false to reject)
   * @returns {Promise<Object>} Response with updated turf data
   */
  verifyTurf(id, isVerified) {
    return apiClient.put(`/turfs/${id}/verify`, { isVerified });
  }
};

// ============================================================================
// Booking API Methods
// ============================================================================

/**
 * Booking API endpoints
 */
export const bookingAPI = {
  /**
   * Get all bookings for the current authenticated user
   * Requires valid JWT token in Authorization header
   * @returns {Promise<Object>} Response with user's bookings array
   */
  getMyBookings() {
    return apiClient.get('/bookings/my-bookings');
  },

  /**
   * Get a single booking by ID
   * User can only access their own bookings
   * @param {string} id - Booking ID
   * @returns {Promise<Object>} Response with booking details
   */
  getById(id) {
    return apiClient.get(`/bookings/${id}`);
  },

  /**
   * Create a new booking
   * @param {Object} data - Booking data
   * @param {string} data.turf - Turf ID
   * @param {string} data.date - Booking date (YYYY-MM-DD format)
   * @param {Object} data.timeSlot - Time slot details
   * @param {string} data.timeSlot.startTime - Start time (HH:MM format)
   * @param {string} data.timeSlot.endTime - End time (HH:MM format)
   * @param {number} data.duration - Duration in hours
   * @param {Object} [data.players] - Player information
   * @param {number} data.players.count - Number of players
   * @param {string} [data.specialRequests] - Special requests or notes
   * @param {Object} [data.payment] - Payment information
   * @param {string} data.payment.method - Payment method
   * @returns {Promise<Object>} Response with created booking data
   */
  create(data) {
    return apiClient.post('/bookings', data);
  },

  /**
   * Cancel an existing booking
   * @param {string} id - Booking ID
   * @param {string} [reason] - Reason for cancellation
   * @returns {Promise<Object>} Response with updated booking data
   */
  cancel(id, reason) {
    return apiClient.put(`/bookings/${id}/cancel`, { reason });
  },

  /**
   * Process payment for a booking
   * @param {string} id - Booking ID
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.method - Payment method (e.g., 'card', 'upi', 'cash')
   * @param {string} [paymentData.transactionId] - Transaction ID from payment gateway
   * @param {number} [paymentData.amount] - Payment amount
   * @returns {Promise<Object>} Response with payment confirmation
   */
  processPayment(id, paymentData) {
    return apiClient.post(`/bookings/${id}/payment`, paymentData);
  },

  /**
   * Get all bookings for a specific turf (owner/admin only)
   * @param {string} turfId - Turf ID
   * @returns {Promise<Object>} Response with bookings array for the turf
   */
  getTurfBookings(turfId) {
    return apiClient.get(`/bookings/turf/${turfId}`);
  }
};

// Export the configured axios instance
export default apiClient;

// Export token management functions for convenience
export { getToken, saveToken, clearToken };
