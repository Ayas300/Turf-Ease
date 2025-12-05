const express = require('express');
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateCreateBooking,
  validateCancelBooking,
  validateProcessPayment,
  validateMongoId
} = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User routes
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/:id', validateMongoId('id'), bookingController.getBookingById);
router.post('/', validateCreateBooking, bookingController.createBooking);
router.put('/:id/cancel', validateMongoId('id'), validateCancelBooking, bookingController.cancelBooking);
router.post('/:id/payment', validateMongoId('id'), validateProcessPayment, bookingController.processPayment);

// Owner routes - manage bookings for their turfs
router.get('/turf/:turfId', authorize('owner', 'admin'), validateMongoId('turfId'), bookingController.getTurfBookings);
router.put('/:id/confirm', authorize('owner', 'admin'), validateMongoId('id'), bookingController.confirmBooking);
router.put('/:id/complete', authorize('owner', 'admin'), validateMongoId('id'), bookingController.completeBooking);
router.put('/:id/mark-no-show', authorize('owner', 'admin'), validateMongoId('id'), bookingController.markNoShow);

// Admin routes
router.get('/admin/all', authorize('admin'), bookingController.getAllBookings);
router.get('/admin/analytics', authorize('admin'), bookingController.getBookingAnalytics);

module.exports = router;