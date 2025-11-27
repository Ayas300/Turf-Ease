const mongoose = require('mongoose');

// MongoDB Atlas connection string with database name
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://mdaiasrahaman2016_db_user:L0dvAS2RduY49FeU@cluster0.cig2htj.mongodb.net/turfease_production?retryWrites=true&w=majority&appName=Cluster0';

// Connection retry configuration
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY = 1000; // 1 second

// Exponential backoff delay calculation
const getRetryDelay = (retryCount) => {
  return INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
};

// Connect to MongoDB Atlas with retry logic
const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Increased from 5s to 10s
      socketTimeoutMS: 75000, // Increased from 45s to 75s
      maxPoolSize: 50, // Increased from 10 to 50 for better concurrency
      minPoolSize: 5, // Increased from 2 to 5 to maintain more connections
      maxIdleTimeMS: 60000, // Increased from 30s to 60s
      // Enable buffering to handle temporary connection issues gracefully
      bufferCommands: true,
      // Auto-reconnect settings
      autoIndex: true,
      // Connection pool monitoring
      monitorCommands: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Setup comprehensive connection event handlers
    setupConnectionHandlers();

    return conn;

  } catch (error) {
    console.error(`❌ Database connection failed (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
    
    // Retry with exponential backoff
    if (retryCount < MAX_RETRIES - 1) {
      const delay = getRetryDelay(retryCount);
      console.log(`⏳ Retrying connection in ${delay / 1000} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retryCount + 1);
    } else {
      console.error('💥 Max retry attempts reached. Exiting...');
      process.exit(1);
    }
  }
};

// Setup comprehensive connection event handlers
const setupConnectionHandlers = () => {
  // Connection successful
  mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connected to MongoDB Atlas');
  });

  // Connection error
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
    // Don't exit on connection errors, let mongoose handle reconnection
  });

  // Connection disconnected
  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected - will attempt to reconnect');
  });

  // Connection reconnected
  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected successfully');
  });

  // Connection reconnect failed
  mongoose.connection.on('reconnectFailed', () => {
    console.error('💥 MongoDB reconnection failed');
  });

  // Connection pool monitoring
  mongoose.connection.on('close', () => {
    console.log('🔌 MongoDB connection closed');
  });

  // Monitor connection pool events
  mongoose.connection.on('fullsetup', () => {
    console.log('✅ MongoDB replica set fully connected');
  });

  // Handle connection timeout
  mongoose.connection.on('timeout', () => {
    console.error('⏱️ MongoDB connection timeout');
  });

  // Graceful shutdown on SIGINT
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination (SIGINT)');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });

  // Graceful shutdown on SIGTERM
  process.on('SIGTERM', async () => {
    try {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination (SIGTERM)');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  });
};

module.exports = { connectDB };