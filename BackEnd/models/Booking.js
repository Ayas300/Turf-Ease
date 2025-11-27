const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Turf',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
    }
  },
  duration: {
    type: Number,
    required: true // in hours
  },
  players: {
    count: {
      type: Number,
      required: [true, 'Number of players is required'],
      min: [1, 'At least 1 player is required']
    },
    details: [{
      name: String,
      phone: String,
      email: String
    }]
  },
  pricing: {
    baseAmount: {
      type: Number,
      required: true
    },
    peakHourCharges: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date,
    refundId: String,
    refundedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['user', 'owner', 'admin']
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number
  },
  specialRequests: String,
  notes: String
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ user: 1, date: -1 });
bookingSchema.index({ turf: 1, date: 1 });
bookingSchema.index({ date: 1, status: 1 });

// Check for booking conflicts
bookingSchema.statics.checkConflict = async function(turfId, date, startTime, endTime, excludeBookingId = null) {
  // Normalize date to start of day for comparison
  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);
  
  const query = {
    turf: turfId,
    date: bookingDate,
    status: { $in: ['confirmed', 'pending'] },
    $and: [
      { 'timeSlot.startTime': { $lt: endTime } },
      { 'timeSlot.endTime': { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await this.findOne(query);
  return conflictingBooking !== null;
};

// Get conflicting bookings with details
bookingSchema.statics.getConflictingBookings = async function(turfId, date, startTime, endTime, excludeBookingId = null) {
  const bookingDate = new Date(date);
  bookingDate.setHours(0, 0, 0, 0);
  
  const query = {
    turf: turfId,
    date: bookingDate,
    status: { $in: ['confirmed', 'pending'] },
    $and: [
      { 'timeSlot.startTime': { $lt: endTime } },
      { 'timeSlot.endTime': { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  return await this.find(query).populate('user', 'name email');
};

// Calculate total amount
bookingSchema.methods.calculateTotal = function() {
  return this.pricing.baseAmount + this.pricing.peakHourCharges + this.pricing.taxes - this.pricing.discount;
};

module.exports = mongoose.model('Booking', bookingSchema);