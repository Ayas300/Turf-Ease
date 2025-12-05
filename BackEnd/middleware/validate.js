const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Phone number must be 10 digits'),
  
  body('role')
    .optional()
    .isIn(['user', 'owner', 'admin']).withMessage('Role must be user, owner, or admin'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

// Turf validation rules
const validateCreateTurf = [
  body('name')
    .trim()
    .notEmpty().withMessage('Turf name is required')
    .isLength({ max: 100 }).withMessage('Turf name must not exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('location.address')
    .trim()
    .notEmpty().withMessage('Address is required'),
  
  body('location.city')
    .trim()
    .notEmpty().withMessage('City is required'),
  
  body('location.state')
    .optional()
    .trim(),
  
  body('location.pincode')
    .optional()
    .trim()
    .matches(/^[0-9]{6}$/).withMessage('Pincode must be 6 digits'),
  
  body('location.coordinates.latitude')
    .optional()
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
  
  body('location.coordinates.longitude')
    .optional()
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  
  body('sports')
    .isArray({ min: 1 }).withMessage('At least one sport must be selected'),
  
  body('pricing.hourlyRate')
    .notEmpty().withMessage('Hourly rate is required')
    .isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  
  body('pricing.peakHourRate')
    .optional()
    .isFloat({ min: 0 }).withMessage('Peak hour rate must be a positive number'),
  
  body('capacity.maxPlayers')
    .notEmpty().withMessage('Maximum players capacity is required')
    .isInt({ min: 1 }).withMessage('Maximum players must be at least 1'),
  
  body('contact.phone')
    .trim()
    .notEmpty().withMessage('Contact phone is required')
    .matches(/^[0-9]{10}$/).withMessage('Contact phone must be 10 digits'),
  
  handleValidationErrors
];

const validateUpdateTurf = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Turf name must not exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  body('pricing.hourlyRate')
    .optional()
    .isFloat({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  
  body('pricing.peakHourRate')
    .optional()
    .isFloat({ min: 0 }).withMessage('Peak hour rate must be a positive number'),
  
  handleValidationErrors
];

// Booking validation rules
const validateCreateBooking = [
  body('turf')
    .notEmpty().withMessage('Turf ID is required')
    .isMongoId().withMessage('Invalid turf ID'),
  
  body('date')
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)'),
  
  body('timeSlot.startTime')
    .notEmpty().withMessage('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format'),
  
  body('timeSlot.endTime')
    .notEmpty().withMessage('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format'),
  
  body('players.count')
    .notEmpty().withMessage('Number of players is required')
    .isInt({ min: 1 }).withMessage('At least 1 player is required'),
  
  body('payment.method')
    .notEmpty().withMessage('Payment method is required')
    .isIn(['cash', 'card', 'upi', 'wallet']).withMessage('Invalid payment method'),
  
  handleValidationErrors
];

const validateCancelBooking = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Cancellation reason must not exceed 500 characters'),
  
  handleValidationErrors
];

const validateProcessPayment = [
  body('transactionId')
    .notEmpty().withMessage('Transaction ID is required')
    .trim(),
  
  handleValidationErrors
];

// Review validation rules
const validateAddReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters'),
  
  body('aspects.cleanliness')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Cleanliness rating must be between 1 and 5'),
  
  body('aspects.facilities')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Facilities rating must be between 1 and 5'),
  
  body('aspects.staff')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Staff rating must be between 1 and 5'),
  
  handleValidationErrors
];

// ID parameter validation
const validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateCreateTurf,
  validateUpdateTurf,
  validateCreateBooking,
  validateCancelBooking,
  validateProcessPayment,
  validateAddReview,
  validateMongoId,
  validatePagination
};
