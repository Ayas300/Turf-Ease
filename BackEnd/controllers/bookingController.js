const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');
const Notification = require('../models/Notification');

// Get user's bookings
const getMyBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user.id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('turf', 'name location images pricing')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('turf', 'name location contact pricing');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin/owner
    if (booking.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'owner') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Create new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { turf, date, timeSlot, players, payment } = req.body;

    // Validate time slot - end time must be after start time
    const [startHour, startMin] = timeSlot.startTime.split(':').map(Number);
    const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: 'End time must be after start time'
      });
    }

    // Validate booking date - must be today or in the future
    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book for past dates'
      });
    }

    // Check if turf exists and is active
    const turfDoc = await Turf.findById(turf);
    if (!turfDoc) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    if (!turfDoc.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Turf is currently inactive'
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await Booking.getConflictingBookings(
      turf, 
      bookingDate, 
      timeSlot.startTime, 
      timeSlot.endTime
    );

    if (conflictingBookings && conflictingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked',
        conflict: {
          bookings: conflictingBookings.map(b => ({
            id: b._id,
            date: b.date,
            timeSlot: b.timeSlot,
            status: b.status
          }))
        }
      });
    }

    // Validate player count against turf capacity
    if (turfDoc.capacity && turfDoc.capacity.maxPlayers) {
      if (players.count > turfDoc.capacity.maxPlayers) {
        return res.status(400).json({
          success: false,
          message: `Maximum ${turfDoc.capacity.maxPlayers} players allowed for this turf`
        });
      }
    }

    // Calculate duration in hours (with decimal support)
    const durationMinutes = endMinutes - startMinutes;
    const duration = durationMinutes / 60;

    // Calculate pricing
    const baseAmount = turfDoc.pricing.hourlyRate * duration;
    const taxes = baseAmount * 0.18; // 18% GST
    const totalAmount = baseAmount + taxes;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      turf,
      date: bookingDate,
      timeSlot,
      duration,
      players,
      pricing: {
        baseAmount,
        taxes,
        totalAmount
      },
      payment: {
        method: payment.method,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.populate('turf', 'name location contact');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check ownership - allow owner and admin to cancel as well
    const isOwner = booking.user.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    const isTurfOwner = req.user.role === 'owner'; // Will need to verify turf ownership

    if (!isOwner && !isAdmin && !isTurfOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking'
      });
    }

    if (booking.status === 'no_show') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a no-show booking'
      });
    }

    // Determine who cancelled
    let cancelledBy = 'user';
    if (req.user.role === 'admin') {
      cancelledBy = 'admin';
    } else if (req.user.role === 'owner' && booking.user.toString() !== req.user.id) {
      cancelledBy = 'owner';
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelledBy,
      cancelledAt: new Date(),
      reason: req.body.reason || 'Cancelled by user'
    };

    // If payment was completed, mark for refund
    if (booking.payment.status === 'completed') {
      booking.payment.status = 'refunded';
      booking.payment.refundedAt = new Date();
      booking.cancellation.refundAmount = booking.pricing.totalAmount;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if booking is cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot process payment for cancelled booking'
      });
    }

    // Check if payment is already completed
    if (booking.payment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this booking'
      });
    }

    // Validate transaction ID
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    // Simulate payment processing
    booking.payment.status = 'completed';
    booking.payment.transactionId = transactionId;
    booking.payment.paidAt = new Date();
    booking.status = 'confirmed';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get turf bookings (Owner/Admin)
const getTurfBookings = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { page = 1, limit = 10, status, date } = req.query;

    // Check if user owns the turf or is admin
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    let query = { turf: turfId };
    if (status) query.status = status;
    if (date) query.date = new Date(date);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .sort({ date: -1, 'timeSlot.startTime': 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get turf bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Confirm booking (Owner/Admin)
const confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Complete booking (Owner/Admin)
const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'completed';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking completed successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Mark as no-show (Owner/Admin)
const markNoShow = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('turf');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    booking.status = 'no_show';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking marked as no-show',
      data: { booking }
    });
  } catch (error) {
    console.error('Mark no-show error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all bookings (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date } = req.query;

    let query = {};
    if (status) query.status = status;
    if (date) query.date = new Date(date);

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('turf', 'name location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get booking analytics (Admin)
const getBookingAnalytics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getMyBookings,
  getBookingById,
  createBooking,
  cancelBooking,
  processPayment,
  getTurfBookings,
  confirmBooking,
  completeBooking,
  markNoShow,
  getAllBookings,
  getBookingAnalytics
};