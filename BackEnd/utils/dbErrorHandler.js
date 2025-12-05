/**
 * Handle MongoDB-specific errors and return appropriate response
 * @param {Error} error - The error object
 * @param {Object} res - Express response object
 */
const handleDBError = (error, res) => {
  // Handle MongoDB connection timeout
  if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection issue. Please try again.',
      error: 'Connection timeout'
    });
  }

  // Handle MongoDB query timeout (maxTimeMS exceeded)
  if (error.name === 'MongoServerError' && error.code === 50) {
    return res.status(408).json({
      success: false,
      message: 'Request took too long. Please try again.',
      error: 'Query timeout'
    });
  }

  // Handle MongoDB network errors
  if (error.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      message: 'Database connection lost. Please try again.',
      error: 'Network error'
    });
  }

  // Handle MongoDB topology errors
  if (error.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      success: false,
      message: 'Unable to connect to database. Please try again later.',
      error: 'Server selection error'
    });
  }

  // Handle connection pool errors
  if (error.message && error.message.includes('pool destroyed')) {
    return res.status(503).json({
      success: false,
      message: 'Database connection pool issue. Please try again.',
      error: 'Pool error'
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Server error',
    error: error.message
  });
};

module.exports = { handleDBError };
