const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log error for debugging (detailed in development, minimal in production)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      statusCode: error.statusCode,
      stack: err.stack
    });
  } else {
    console.error('Error:', err.message);
  }

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    error.message = message;
    error.statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists`;
    error.message = message;
    error.statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message
    }));
    
    error.message = 'Validation failed';
    error.statusCode = 400;
    error.errors = errors;
  }

  // JWT errors - Authentication (401)
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please login again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired. Please login again.';
    error.statusCode = 401;
  }

  // Express-validator errors (handled in controllers, but as fallback)
  if (err.array && typeof err.array === 'function') {
    error.message = 'Validation failed';
    error.statusCode = 400;
    error.errors = err.array();
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File size too large. Maximum size is 5MB.';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error.message = 'Too many files. Maximum is 5 files.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Unexpected field in file upload.';
    } else {
      error.message = 'File upload error: ' + err.message;
    }
    error.statusCode = 400;
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
    error.message = 'Database connection error. Please try again later.';
    error.statusCode = 503;
  }

  // MongoDB server errors
  if (err.name === 'MongoServerError') {
    error.message = 'Database operation failed. Please try again.';
    error.statusCode = 500;
  }

  // Syntax errors (malformed JSON)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error.message = 'Invalid JSON format in request body';
    error.statusCode = 400;
  }

  // Build response object
  const response = {
    success: false,
    message: error.message || 'Server Error'
  };

  // Add validation errors if present
  if (error.errors) {
    response.errors = error.errors;
  }

  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Send response with appropriate status code
  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;