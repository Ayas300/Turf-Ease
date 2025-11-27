const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'booking_confirmed',
      'booking_cancelled',
      'booking_reminder',
      'payment_success',
      'payment_failed',
      'review_request',
      'turf_approved',
      'turf_rejected',
      'promotional',
      'system_update'
    ],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  data: {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    turfId: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf' },
    actionUrl: String,
    metadata: mongoose.Schema.Types.Mixed
  },
  channels: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false }
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  sentAt: Date,
  deliveredAt: Date,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: 1 });
notificationSchema.index({ type: 1, recipient: 1 });

// Mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);