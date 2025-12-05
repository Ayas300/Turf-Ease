const express = require('express');
const turfController = require('../controllers/turfController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const dbHealthCheck = require('../middleware/dbHealthCheck');
const {
  validateCreateTurf,
  validateUpdateTurf,
  validateAddReview,
  validateMongoId
} = require('../middleware/validate');

const router = express.Router();

// Apply database health check to all routes
router.use(dbHealthCheck);

// Public routes
router.get('/', turfController.getAllTurfs);
router.get('/search', turfController.searchTurfs);
router.get('/nearby', turfController.getNearbyTurfs);
router.get('/:id', validateMongoId('id'), turfController.getTurfById);
router.get('/:id/availability', validateMongoId('id'), turfController.getTurfAvailability);
router.get('/:id/reviews', validateMongoId('id'), turfController.getTurfReviews);

// Protected routes
router.use(protect);

// Admin only routes (must come before /:id routes to avoid conflicts)
router.get('/admin/pending', authorize('admin'), turfController.getPendingTurfs);

// User routes
router.post('/:id/reviews', validateMongoId('id'), validateAddReview, turfController.addReview);
router.put('/reviews/:reviewId', validateMongoId('reviewId'), turfController.updateReview);
router.delete('/reviews/:reviewId', validateMongoId('reviewId'), turfController.deleteReview);

// Middleware to handle optional file uploads
const optionalUpload = (req, res, next) => {
  const contentType = req.get('Content-Type') || '';
  if (contentType.includes('multipart/form-data')) {
    // If multipart, use multer to handle file uploads
    upload.array('images', 10)(req, res, next);
  } else {
    // If JSON, skip multer and continue
    next();
  }
};

// Owner/Admin routes
router.post('/', authorize('owner', 'admin'), optionalUpload, validateCreateTurf, turfController.createTurf);
router.put('/:id', authorize('owner', 'admin'), validateMongoId('id'), optionalUpload, validateUpdateTurf, turfController.updateTurf);
router.delete('/:id', authorize('owner', 'admin'), validateMongoId('id'), turfController.deleteTurf);
router.put('/:id/availability', authorize('owner', 'admin'), validateMongoId('id'), turfController.updateAvailability);
router.put('/:id/verify', authorize('admin'), validateMongoId('id'), turfController.verifyTurf);

module.exports = router;