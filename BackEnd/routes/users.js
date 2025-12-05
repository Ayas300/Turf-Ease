const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User profile routes
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/avatar', upload.single('avatar'), userController.uploadAvatar);
router.delete('/avatar', userController.deleteAvatar);

// User preferences
router.get('/preferences', userController.getPreferences);
router.put('/preferences', userController.updatePreferences);

// User bookings and history
router.get('/booking-history', userController.getBookingHistory);
router.get('/favorite-turfs', userController.getFavoriteTurfs);
router.post('/favorite-turfs/:turfId', userController.addToFavorites);
router.delete('/favorite-turfs/:turfId', userController.removeFromFavorites);

// Admin routes
router.get('/admin/all', authorize('admin'), userController.getAllUsers);
router.get('/admin/:id', authorize('admin'), userController.getUserById);
router.put('/admin/:id/role', authorize('admin'), userController.updateUserRole);
router.put('/admin/:id/status', authorize('admin'), userController.updateUserStatus);
router.delete('/admin/:id', authorize('admin'), userController.deleteUser);

module.exports = router;