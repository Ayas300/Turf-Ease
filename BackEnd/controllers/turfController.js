const { validationResult } = require('express-validator');
const Turf = require('../models/Turf');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const { handleDBError } = require('../utils/dbErrorHandler');

// Get all turfs with filtering and pagination
const getAllTurfs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 1000,
      city,
      sport,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build query
    let query = { isActive: true, isVerified: true };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (sport) query.sports = { $in: [sport] };
    if (minPrice || maxPrice) {
      query['pricing.hourlyRate'] = {};
      if (minPrice) query['pricing.hourlyRate'].$gte = Number(minPrice);
      if (maxPrice) query['pricing.hourlyRate'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') }
      ];
    }

    // Execute query with pagination and timeout
    const turfs = await Turf.find(query)
      .populate('owner', 'name email phone')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .maxTimeMS(30000) // 30 second query timeout
      .lean(); // Use lean() for better performance

    const total = await Turf.countDocuments(query).maxTimeMS(10000); // 10 second timeout for count

    res.status(200).json({
      success: true,
      data: {
        turfs,
        pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total,
          limit: Number(limit)
        }
      }
    });
  } catch (error) {
    return handleDBError(error, res);
  }
};

// Get turf by ID
const getTurfById = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf ID format'
      });
    }

    const turf = await Turf.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: -1 }, limit: 5 }
      })
      .maxTimeMS(15000); // 15 second timeout

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { turf }
    });
  } catch (error) {
    return handleDBError(error, res);
  }
};

// Create new turf
const createTurf = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Upload images to cloudinary
    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'turfs'));
      const uploadResults = await Promise.all(uploadPromises);
      images = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));
    } else if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      // If no files uploaded but image URLs provided in body, use those
      images = req.body.images;
    }

    const turfData = {
      ...req.body,
      owner: req.user.id,
      images
    };

    const turf = await Turf.create(turfData);

    res.status(201).json({
      success: true,
      message: 'Turf created successfully',
      data: { turf }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update turf
const updateTurf = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf ID format'
      });
    }

    let turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check ownership
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this turf'
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'turfs'));
      const uploadResults = await Promise.all(uploadPromises);
      const newImages = uploadResults.map(result => ({
        url: result.secure_url,
        publicId: result.public_id
      }));
      
      req.body.images = [...(turf.images || []), ...newImages];
    }

    turf = await Turf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      message: 'Turf updated successfully',
      data: { turf }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete turf
const deleteTurf = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf ID format'
      });
    }

    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Check ownership
    if (turf.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this turf'
      });
    }

    // Delete images from cloudinary (only if publicId exists)
    if (turf.images && turf.images.length > 0) {
      const deletePromises = turf.images
        .filter(image => image.publicId)
        .map(image => deleteFromCloudinary(image.publicId));
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises).catch(err => {
          console.error('Error deleting images from Cloudinary:', err);
          // Continue with turf deletion even if image deletion fails
        });
      }
    }

    await Turf.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Turf deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Search turfs
const searchTurfs = async (req, res) => {
  try {
    const { q, city, sport, lat, lng, radius = 10 } = req.query;

    let query = { isActive: true, isVerified: true };

    // Text search using regex (since text index may not be set up)
    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'location.address': new RegExp(q, 'i') },
        { 'location.city': new RegExp(q, 'i') }
      ];
    }

    // Filters
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (sport) query.sports = { $in: [sport] };

    // Location-based search (only if both lat and lng provided)
    let turfs;
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid latitude or longitude values'
        });
      }

      turfs = await Turf.find(query)
        .populate('owner', 'name phone')
        .limit(20);
      
      // Filter by distance manually if coordinates exist
      turfs = turfs.filter(turf => {
        if (!turf.location.coordinates) return false;
        
        const turfLat = turf.location.coordinates.latitude;
        const turfLng = turf.location.coordinates.longitude;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (turfLat - latitude) * Math.PI / 180;
        const dLng = (turfLng - longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(latitude * Math.PI / 180) * Math.cos(turfLat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return distance <= radius;
      });
    } else {
      turfs = await Turf.find(query)
        .populate('owner', 'name phone')
        .limit(20);
    }

    res.status(200).json({
      success: true,
      data: { turfs, count: turfs.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get nearby turfs
const getNearbyTurfs = async (req, res) => {
  try {
    const { lat, lng, radius = 10, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusNum = parseFloat(radius);
    const limitNum = parseInt(limit);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude values'
      });
    }

    // Get all active and verified turfs
    const allTurfs = await Turf.find({
      isActive: true,
      isVerified: true
    }).populate('owner', 'name phone');

    // Calculate distance for each turf and filter by radius
    const nearbyTurfs = allTurfs
      .map(turf => {
        if (!turf.location.coordinates) return null;
        
        const turfLat = turf.location.coordinates.latitude;
        const turfLng = turf.location.coordinates.longitude;
        
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (turfLat - latitude) * Math.PI / 180;
        const dLng = (turfLng - longitude) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(latitude * Math.PI / 180) * Math.cos(turfLat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        return { turf, distance };
      })
      .filter(item => item && item.distance <= radiusNum)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limitNum)
      .map(item => ({
        ...item.turf.toObject(),
        distance: Math.round(item.distance * 100) / 100 // Round to 2 decimal places
      }));

    res.status(200).json({
      success: true,
      data: { turfs: nearbyTurfs, count: nearbyTurfs.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get turf availability
const getTurfAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const turfId = req.params.id;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    // Validate ObjectId format
    if (!turfId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf ID format'
      });
    }

    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    // Parse and validate date
    const requestedDate = new Date(date);
    if (isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format'
      });
    }

    // Get bookings for the date
    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      turf: turfId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['confirmed', 'pending'] }
    })
      .select('timeSlot')
      .maxTimeMS(10000) // 10 second timeout
      .lean(); // Use lean() for better performance

    // Get day schedule
    const dayName = requestedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = turf.availability?.days?.find(d => d.day === dayName);

    if (!daySchedule || !daySchedule.isOpen) {
      return res.status(200).json({
        success: true,
        data: {
          isOpen: false,
          availableSlots: [],
          bookedSlots: []
        }
      });
    }

    // Generate time slots (1-hour intervals)
    const slots = [];
    const startHour = parseInt(daySchedule.openTime.split(':')[0]);
    const endHour = parseInt(daySchedule.closeTime.split(':')[0]);

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      const isBooked = bookings.some(booking => 
        booking.timeSlot.startTime <= startTime && booking.timeSlot.endTime > startTime
      );

      const isPeakHour = daySchedule.peakHours && 
        startTime >= daySchedule.peakHours.start && 
        startTime < daySchedule.peakHours.end;

      slots.push({
        startTime,
        endTime,
        isAvailable: !isBooked,
        isPeakHour,
        price: isPeakHour ? turf.pricing.peakHourRate : turf.pricing.hourlyRate
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isOpen: true,
        openTime: daySchedule.openTime,
        closeTime: daySchedule.closeTime,
        slots,
        bookedSlots: bookings.map(b => b.timeSlot)
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

// Get turf reviews
const getTurfReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const turfId = req.params.id;

    // Validate ObjectId format
    if (!turfId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid turf ID format'
      });
    }

    const reviews = await Review.find({ turf: turfId })
      .populate('user', 'name avatar')
      .populate('booking', 'date timeSlot')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .maxTimeMS(15000) // 15 second timeout
      .lean(); // Use lean() for better performance

    const total = await Review.countDocuments({ turf: turfId }).maxTimeMS(5000); // 5 second timeout

    res.status(200).json({
      success: true,
      data: {
        reviews,
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

// Add review
const addReview = async (req, res) => {
  try {
    const { rating, comment, aspects } = req.body;
    const turfId = req.params.id;
    const userId = req.user.id;

    // Check if user has a completed booking for this turf
    const booking = await Booking.findOne({
      user: userId,
      turf: turfId,
      status: 'completed'
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'You can only review turfs you have booked and used'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({
      user: userId,
      booking: booking._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    const review = await Review.create({
      user: userId,
      turf: turfId,
      booking: booking._id,
      rating,
      comment,
      aspects
    });

    // Update turf rating
    const reviews = await Review.find({ turf: turfId });
    const avgRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Turf.findByIdAndUpdate(turfId, {
      'rating.average': avgRating,
      'rating.count': reviews.length,
      $push: { reviews: review._id }
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    let review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
      runValidators: true
    }).populate('user', 'name avatar');

    // Recalculate turf rating
    const reviews = await Review.find({ turf: review.turf });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await Turf.findByIdAndUpdate(review.turf, {
      'rating.average': avgRating
    });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    // Update turf rating
    const reviews = await Review.find({ turf: review.turf });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    
    await Turf.findByIdAndUpdate(review.turf, {
      'rating.average': avgRating,
      'rating.count': reviews.length,
      $pull: { reviews: reviewId }
    });

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const turfId = req.params.id;
    const { availability } = req.body;

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
        message: 'Not authorized to update this turf'
      });
    }

    const updatedTurf = await Turf.findByIdAndUpdate(
      turfId,
      { availability },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: { turf: updatedTurf }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Verify turf (Admin only)
const verifyTurf = async (req, res) => {
  try {
    const turfId = req.params.id;
    const { isVerified } = req.body;

    const turf = await Turf.findByIdAndUpdate(
      turfId,
      { isVerified },
      { new: true }
    );

    if (!turf) {
      return res.status(404).json({
        success: false,
        message: 'Turf not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Turf ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: { turf }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get pending turfs (Admin only)
const getPendingTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find({ isVerified: false })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .maxTimeMS(15000) // 15 second timeout
      .lean(); // Use lean() for better performance

    res.status(200).json({
      success: true,
      data: { turfs }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
  searchTurfs,
  getNearbyTurfs,
  getTurfAvailability,
  getTurfReviews,
  addReview,
  updateReview,
  deleteReview,
  updateAvailability,
  verifyTurf,
  getPendingTurfs
};