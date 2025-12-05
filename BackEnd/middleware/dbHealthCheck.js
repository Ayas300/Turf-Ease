const mongoose = require('mongoose');

/**
 * Middleware to check database connection health before processing requests
 * This helps prevent requests from failing due to stale connections
 */
const dbHealthCheck = async (req, res, next) => {
  try {
    // Check if mongoose is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️ Database not connected, readyState:', mongoose.connection.readyState);
      
      // Return 503 Service Unavailable if database is not connected
      return res.status(503).json({
        success: false,
        message: 'Database temporarily unavailable. Please try again in a moment.',
        error: 'Database connection not ready'
      });
    }
    
    // Connection is healthy, proceed
    next();
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return res.status(503).json({
      success: false,
      message: 'Database health check failed. Please try again.',
      error: error.message
    });
  }
};

module.exports = dbHealthCheck;
