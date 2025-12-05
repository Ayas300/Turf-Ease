const express = require('express');
const notificationController = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// User notification routes
router.get('/', notificationController.getNotifications);
router.get('/unread-count', notificationController.getUnreadCount);
router.put('/:id/read', notificationController.markAsRead);
router.put('/mark-all-read', notificationController.markAllAsRead);
router.delete('/:id', notificationController.deleteNotification);

// Admin routes
router.post('/admin/send', authorize('admin'), notificationController.sendNotification);
router.get('/admin/all', authorize('admin'), notificationController.getAllNotifications);
router.get('/admin/analytics', authorize('admin'), notificationController.getNotificationAnalytics);

module.exports = router;