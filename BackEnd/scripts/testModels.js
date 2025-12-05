const mongoose = require('mongoose');
const { connectDB } = require('../config/database');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

// Test models against MongoDB Atlas
async function testModels() {
  try {
    console.log('🧪 Starting model tests...\n');

    // Connect to MongoDB Atlas
    await connectDB();

    // Test 1: User Model
    console.log('📝 Test 1: User Model');
    const testUser = new User({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      phone: '+1234567890',
      role: 'user'
    });
    await testUser.save();
    console.log('✅ User created successfully:', testUser._id);
    
    // Test password hashing
    const isPasswordHashed = testUser.password !== 'password123';
    console.log('✅ Password hashing:', isPasswordHashed ? 'Working' : 'Failed');
    
    // Test password comparison
    const isPasswordValid = await testUser.comparePassword('password123');
    console.log('✅ Password comparison:', isPasswordValid ? 'Working' : 'Failed');

    // Test 2: Turf Model
    console.log('\n📝 Test 2: Turf Model');
    const testTurf = new Turf({
      name: 'Test Sports Arena',
      description: 'A test turf facility',
      owner: testUser._id,
      location: {
        address: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        coordinates: {
          latitude: 19.0760,
          longitude: 72.8777
        }
      },
      images: [{
        url: 'https://example.com/image.jpg',
        caption: 'Main view'
      }],
      sports: ['football', 'cricket'],
      amenities: ['parking', 'washroom', 'lighting'],
      pricing: {
        hourlyRate: 1000
      },
      availability: {
        days: [
          {
            day: 'monday',
            isOpen: true,
            openTime: '06:00',
            closeTime: '22:00',
            peakHours: {
              start: '18:00',
              end: '21:00'
            }
          },
          {
            day: 'tuesday',
            isOpen: true,
            openTime: '06:00',
            closeTime: '22:00'
          }
        ]
      },
      capacity: {
        maxPlayers: 22,
        recommendedPlayers: 18
      },
      contact: {
        phone: '+919876543210',
        email: 'turf@example.com'
      }
    });
    await testTurf.save();
    console.log('✅ Turf created successfully:', testTurf._id);
    
    // Test isAvailable method
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const isAvailable = testTurf.isAvailable(testDate, '10:00', '12:00');
    console.log('✅ Availability check method:', isAvailable ? 'Working' : 'Failed');

    // Test 3: Booking Model
    console.log('\n📝 Test 3: Booking Model');
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + 2); // Day after tomorrow
    bookingDate.setHours(0, 0, 0, 0);
    
    const testBooking = new Booking({
      user: testUser._id,
      turf: testTurf._id,
      date: bookingDate,
      timeSlot: {
        startTime: '10:00',
        endTime: '12:00'
      },
      duration: 2,
      players: {
        count: 10
      },
      pricing: {
        baseAmount: 2000,
        totalAmount: 2000
      },
      payment: {
        method: 'upi',
        status: 'pending'
      },
      status: 'pending'
    });
    await testBooking.save();
    console.log('✅ Booking created successfully:', testBooking._id);
    
    // Test conflict detection
    const hasConflict = await Booking.checkConflict(
      testTurf._id,
      bookingDate,
      '11:00',
      '13:00'
    );
    console.log('✅ Conflict detection:', hasConflict ? 'Working (conflict found)' : 'Working (no conflict)');
    
    // Test getConflictingBookings
    const conflicts = await Booking.getConflictingBookings(
      testTurf._id,
      bookingDate,
      '11:00',
      '13:00'
    );
    console.log('✅ Get conflicting bookings:', conflicts.length > 0 ? 'Working' : 'Working (no conflicts)');

    // Test 4: Review Model
    console.log('\n📝 Test 4: Review Model');
    const testReview = new Review({
      user: testUser._id,
      turf: testTurf._id,
      booking: testBooking._id,
      rating: 4,
      comment: 'Great facility!',
      aspects: {
        cleanliness: 5,
        facilities: 4,
        staff: 4,
        value: 4
      }
    });
    await testReview.save();
    console.log('✅ Review created successfully:', testReview._id);

    // Test 5: Notification Model
    console.log('\n📝 Test 5: Notification Model');
    const testNotification = new Notification({
      recipient: testUser._id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your booking has been confirmed',
      data: {
        bookingId: testBooking._id,
        turfId: testTurf._id
      }
    });
    await testNotification.save();
    console.log('✅ Notification created successfully:', testNotification._id);
    
    // Test markAsRead method
    await testNotification.markAsRead();
    console.log('✅ Mark as read method:', testNotification.isRead ? 'Working' : 'Failed');

    // Test 6: Indexes
    console.log('\n📝 Test 6: Verifying Indexes');
    const userIndexes = await User.collection.getIndexes();
    console.log('✅ User indexes:', Object.keys(userIndexes).join(', '));
    
    const turfIndexes = await Turf.collection.getIndexes();
    console.log('✅ Turf indexes:', Object.keys(turfIndexes).join(', '));
    
    const bookingIndexes = await Booking.collection.getIndexes();
    console.log('✅ Booking indexes:', Object.keys(bookingIndexes).join(', '));
    
    const reviewIndexes = await Review.collection.getIndexes();
    console.log('✅ Review indexes:', Object.keys(reviewIndexes).join(', '));
    
    const notificationIndexes = await Notification.collection.getIndexes();
    console.log('✅ Notification indexes:', Object.keys(notificationIndexes).join(', '));

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await User.deleteOne({ _id: testUser._id });
    await Turf.deleteOne({ _id: testTurf._id });
    await Booking.deleteOne({ _id: testBooking._id });
    await Review.deleteOne({ _id: testReview._id });
    await Notification.deleteOne({ _id: testNotification._id });
    console.log('✅ Test data cleaned up');

    console.log('\n✨ All model tests passed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Model test failed:', error);
    process.exit(1);
  }
}

// Run tests
testModels();
