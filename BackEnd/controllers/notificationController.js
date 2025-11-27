const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/email');

// Get user notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query;
    
    let query = { recipient: req.user.id };
    if (type) query.type = type;
    if (isRead !== undefined) query.isRead = isRead === 'true';

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ 
      recipient: req.user.id, 
      isRead: false 
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await notification.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: { notification }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Send notification (Admin)
const sendNotification = async (req, res) => {
  try {
    const { recipients, type, title, message, channels, data } = req.body;

    // Create notifications for all recipients
    const notifications = recipients.map(recipientId => ({
      recipient: recipientId,
      type,
      title,
      message,
      channels: channels || { push: true },
      data: data || {}
    }));

    const createdNotifications = await Notification.insertMany(notifications);

    // Send emails if email channel is enabled
    if (channels?.email) {
      // This would typically be handled by a background job
      // For now, we'll just mark the notifications as sent
      await Notification.updateMany(
        { _id: { $in: createdNotifications.map(n => n._id) } },
        { status: 'sent', sentAt: new Date() }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Notifications sent successfully',
      data: { count: createdNotifications.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all notifications (Admin)
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get notification analytics (Admin)
const getNotificationAnalytics = async (req, res) => {
  try {
    const totalNotifications = await Notification.countDocuments();
    const sentNotifications = await Notification.countDocuments({ status: 'sent' });
    const deliveredNotifications = await Notification.countDocuments({ status: 'delivered' });
    const readNotifications = await Notification.countDocuments({ isRead: true });

    // Notifications by type
    const notificationsByType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Recent activity
    const recentActivity = await Notification.find()
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalNotifications,
        sentNotifications,
        deliveredNotifications,
        readNotifications,
        readRate: totalNotifications > 0 ? (readNotifications / totalNotifications * 100).toFixed(2) : 0,
        notificationsByType,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper function to create notification
const createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    
    // Handle email sending if email channel is enabled
    if (notification.channels.email) {
      // This would typically be handled by a background job
      // For demo purposes, we'll simulate email sending
      notification.status = 'sent';
      notification.sentAt = new Date();
      await notification.save();
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification,
  getAllNotifications,
  getNotificationAnalytics,
  createNotification
};