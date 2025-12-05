/**
 * Token Storage Utility
 * 
 * Manages JWT token storage using localStorage for persistence across sessions
 * and tabs. This ensures the user stays logged in even after closing the browser.
 */

const TOKEN_KEY = 'turfease_auth_token';

/**
 * Save JWT token to localStorage
 * @param {string} token - JWT token to store
 */
export const saveToken = (token) => {
  if (!token) {
    console.warn('Attempted to save null or undefined token');
    return;
  }
  
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to save token to localStorage:', error);
    // Fallback: could implement in-memory storage here if needed
  }
};

/**
 * Retrieve JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve token from localStorage:', error);
    return null;
  }
};

/**
 * Remove JWT token from localStorage
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear token from localStorage:', error);
  }
};

/**
 * Check if a valid token exists
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasToken = () => {
  const token = getToken();
  return token !== null && token !== undefined && token.length > 0;
};
