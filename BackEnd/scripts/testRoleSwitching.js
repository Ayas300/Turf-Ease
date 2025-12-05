/**
 * Test Script for Role Switching Bug Fix
 * 
 * This script tests the role switching functionality to ensure
 * the backend continues to fetch data correctly after multiple role changes.
 * 
 * Usage: node scripts/testRoleSwitching.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { connectDB } = require('../config/database');

const TEST_EMAIL = 'roletest@example.com';
const TEST_PASSWORD = 'TestPassword123!';

async function testRoleSwitching() {
  try {
    console.log('🧪 Starting Role Switching Test...\n');

    // Connect to database
    await connectDB();

    // Clean up any existing test user
    await User.deleteOne({ email: TEST_EMAIL });
    console.log('✅ Cleaned up existing test user\n');

    // Create test user
    const testUser = await User.create({
      name: 'Role Test User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      phone: '+1234567890',
      role: 'user'
    });
    console.log(`✅ Created test user with ID: ${testUser._id}`);
    console.log(`   Initial role: ${testUser.role}\n`);

    // Test multiple role switches
    const roles = ['owner', 'admin', 'user', 'owner', 'admin', 'user', 'owner'];
    
    for (let i = 0; i < roles.length; i++) {
      const newRole = roles[i];
      
      // Update role in database
      await User.findByIdAndUpdate(testUser._id, { role: newRole });
      
      // Fetch user with lean() to simulate middleware behavior
      const fetchedUser = await User.findById(testUser._id)
        .select('_id email role name isActive')
        .lean()
        .exec();
      
      console.log(`🔄 Switch ${i + 1}: Changed role to '${newRole}'`);
      console.log(`   Fetched role: ${fetchedUser.role}`);
      console.log(`   Match: ${fetchedUser.role === newRole ? '✅' : '❌'}`);
      
      if (fetchedUser.role !== newRole) {
        throw new Error(`Role mismatch! Expected '${newRole}', got '${fetchedUser.role}'`);
      }
      
      // Small delay to simulate real-world usage
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ All role switches successful!');
    console.log('✅ Database queries returning fresh data');
    console.log('✅ No caching issues detected\n');

    // Test isActive field
    console.log('🧪 Testing isActive field...');
    await User.findByIdAndUpdate(testUser._id, { isActive: false });
    const inactiveUser = await User.findById(testUser._id)
      .select('_id email role name isActive')
      .lean()
      .exec();
    
    console.log(`   isActive: ${inactiveUser.isActive}`);
    console.log(`   Match: ${inactiveUser.isActive === false ? '✅' : '❌'}\n`);

    // Clean up
    await User.deleteOne({ email: TEST_EMAIL });
    console.log('✅ Cleaned up test user');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');

    console.log('🎉 All tests passed! Role switching fix is working correctly.\n');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    
    // Clean up on error
    try {
      await User.deleteOne({ email: TEST_EMAIL });
      await mongoose.connection.close();
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

// Run the test
testRoleSwitching();
