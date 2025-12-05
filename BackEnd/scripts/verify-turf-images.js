const mongoose = require('mongoose');
const Turf = require('../models/Turf');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://mdaiasrahaman2016_db_user:L0dvAS2RduY49FeU@cluster0.cig2htj.mongodb.net/turfease_production?retryWrites=true&w=majority&appName=Cluster0';

async function verifyTurfImages() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB\n');

    // Fetch all turfs
    const turfs = await Turf.find({}).select('_id name images');
    
    console.log('=== TURF IMAGE VERIFICATION ===');
    console.log(`Total turfs in database: ${turfs.length}\n`);

    // Track image URLs to check for duplicates
    const imageUrlMap = new Map();
    let turfsWithoutImages = 0;
    let turfsWithImages = 0;

    turfs.forEach((turf, index) => {
      console.log(`Turf ${index + 1}:`);
      console.log(`  ID: ${turf._id}`);
      console.log(`  Name: ${turf.name}`);
      console.log(`  Images array:`, turf.images);
      
      if (!turf.images || turf.images.length === 0) {
        console.log(`  ⚠️  WARNING: No images found`);
        turfsWithoutImages++;
      } else {
        const imageUrl = turf.images[0]?.url;
        console.log(`  Image URL: ${imageUrl}`);
        turfsWithImages++;
        
        // Track duplicate image URLs
        if (imageUrl) {
          if (imageUrlMap.has(imageUrl)) {
            imageUrlMap.get(imageUrl).push(turf.name);
          } else {
            imageUrlMap.set(imageUrl, [turf.name]);
          }
        }
      }
      console.log('');
    });

    // Check for duplicate image URLs
    console.log('=== DUPLICATE IMAGE URL CHECK ===');
    let duplicatesFound = false;
    imageUrlMap.forEach((turfNames, imageUrl) => {
      if (turfNames.length > 1) {
        duplicatesFound = true;
        console.log(`⚠️  DUPLICATE IMAGE URL FOUND:`);
        console.log(`   URL: ${imageUrl}`);
        console.log(`   Used by ${turfNames.length} turfs: ${turfNames.join(', ')}`);
        console.log('');
      }
    });

    if (!duplicatesFound) {
      console.log('✅ No duplicate image URLs found - all turfs have unique images\n');
    }

    // Summary
    console.log('=== SUMMARY ===');
    console.log(`Total turfs: ${turfs.length}`);
    console.log(`Turfs with images: ${turfsWithImages}`);
    console.log(`Turfs without images: ${turfsWithoutImages}`);
    console.log(`Unique image URLs: ${imageUrlMap.size}`);
    console.log(`Duplicate image URLs: ${duplicatesFound ? 'YES ⚠️' : 'NO ✅'}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the verification
verifyTurfImages();
