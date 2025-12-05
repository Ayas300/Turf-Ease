const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 
  'mongodb+srv://mdaiasrahaman2016_db_user:L0dvAS2RduY49FeU@cluster0.cig2htj.mongodb.net/turfease_production?retryWrites=true&w=majority&appName=Cluster0';

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Test users data
const usersData = [
  {
    name: 'John Doe',
    email: 'john.user@example.com',
    password: 'password123',
    phone: '+91-9876543210',
    role: 'user',
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true
      },
      favoriteLocations: ['Mumbai', 'Pune'],
      preferredSports: ['football', 'cricket']
    }
  },
  {
    name: 'Sarah Smith',
    email: 'sarah.owner@example.com',
    password: 'password123',
    phone: '+91-9876543211',
    role: 'owner',
    isVerified: true,
    preferences: {
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike.owner@example.com',
    password: 'password123',
    phone: '+91-9876543212',
    role: 'owner',
    isVerified: true
  },
  {
    name: 'Admin User',
    email: 'admin@turfease.com',
    password: 'admin123',
    phone: '+91-9876543213',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Alice Brown',
    email: 'alice.user@example.com',
    password: 'password123',
    phone: '+91-9876543214',
    role: 'user',
    isVerified: true,
    preferences: {
      preferredSports: ['badminton', 'tennis']
    }
  }
];

// Test turfs data (will be populated with owner IDs after users are created)
const getTurfsData = (owners) => [
  {
    name: 'Green Valley Turf',
    description: 'Premium football turf with FIFA-standard grass and professional lighting. Perfect for competitive matches and training sessions.',
    owner: owners[0]._id, // Sarah Smith
    location: {
      address: '123 Sports Complex, Andheri West',
      city: 'Sylhet',
      state: 'Sylhet',
      pincode: '400058',
      coordinates: {
        latitude: 19.1136,
        longitude: 72.8697
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1459865264687-595d652de67e',
        caption: 'Main field view'
      },
      {
        url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
        caption: 'Night view with lighting'
      }
    ],
    sports: ['football'],
    amenities: ['parking', 'washroom', 'changing_room', 'lighting', 'seating', 'cafeteria', 'first_aid'],
    pricing: {
      hourlyRate: 2000,
      peakHourRate: 3000,
      currency: 'INR'
    },
    availability: {
      days: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '18:00', end: '22:00' } },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '18:00', end: '22:00' } },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '18:00', end: '22:00' } },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '18:00', end: '22:00' } },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '18:00', end: '22:00' } },
        { day: 'saturday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '08:00', end: '22:00' } },
        { day: 'sunday', isOpen: true, openTime: '06:00', closeTime: '23:00', peakHours: { start: '08:00', end: '22:00' } }
      ]
    },
    capacity: {
      maxPlayers: 22,
      recommendedPlayers: 14
    },
    rules: [
      'Wear appropriate sports shoes',
      'No metal studs allowed',
      'Arrive 10 minutes before booking time',
      'Respect other players and staff'
    ],
    contact: {
      phone: '+91-9876543211',
      email: 'champions@example.com',
      whatsapp: '+91-9876543211'
    },
    rating: {
      average: 4.5,
      count: 28
    },
    isActive: true,
    isVerified: true
  },
  {
    name: 'Elite Cricket Ground',
    description: 'Professional cricket ground with turf wicket and practice nets. Ideal for matches and coaching sessions.',
    owner: owners[0]._id, // Sarah Smith
    location: {
      address: '456 Stadium Road, Bandra',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      coordinates: {
        latitude: 19.0596,
        longitude: 72.8295
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e',
        caption: 'Cricket ground overview'
      }
    ],
    sports: ['cricket'],
    amenities: ['parking', 'washroom', 'changing_room', 'lighting', 'seating', 'equipment_rental'],
    pricing: {
      hourlyRate: 2500,
      peakHourRate: 3500,
      currency: 'INR'
    },
    availability: {
      days: [
        { day: 'monday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'tuesday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'wednesday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'thursday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'friday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'saturday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '09:00', end: '21:00' } },
        { day: 'sunday', isOpen: true, openTime: '07:00', closeTime: '22:00', peakHours: { start: '09:00', end: '21:00' } }
      ]
    },
    capacity: {
      maxPlayers: 22,
      recommendedPlayers: 16
    },
    rules: [
      'Cricket shoes mandatory',
      'Bring your own equipment or rent from us',
      'No hard ball practice without supervision'
    ],
    contact: {
      phone: '+91-9876543211',
      email: 'elite@example.com'
    },
    rating: {
      average: 4.7,
      count: 42
    },
    isActive: true,
    isVerified: true
  },
  {
    name: 'Ace Badminton Center',
    description: 'Indoor badminton courts with wooden flooring and excellent ventilation. Multiple courts available for booking.',
    owner: owners[1]._id, // Mike Johnson
    location: {
      address: '789 Sports Hub, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      coordinates: {
        latitude: 19.1176,
        longitude: 72.9060
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea',
        caption: 'Indoor badminton courts'
      }
    ],
    sports: ['badminton'],
    amenities: ['parking', 'washroom', 'changing_room', 'seating', 'cafeteria', 'equipment_rental'],
    pricing: {
      hourlyRate: 800,
      peakHourRate: 1200,
      currency: 'INR'
    },
    availability: {
      days: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'saturday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '08:00', end: '20:00' } },
        { day: 'sunday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '08:00', end: '20:00' } }
      ]
    },
    capacity: {
      maxPlayers: 4,
      recommendedPlayers: 4
    },
    rules: [
      'Non-marking shoes only',
      'Book in advance for peak hours',
      'Maximum 4 players per court'
    ],
    contact: {
      phone: '+91-9876543212',
      email: 'ace@example.com',
      whatsapp: '+91-9876543212'
    },
    rating: {
      average: 4.3,
      count: 35
    },
    isActive: true,
    isVerified: true
  },
  {
    name: 'Pro Basketball Court',
    description: 'Outdoor basketball court with professional markings and quality hoops. Great for casual games and tournaments.',
    owner: owners[1]._id, // Mike Johnson
    location: {
      address: '321 Court Street, Juhu',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400049',
      coordinates: {
        latitude: 19.1075,
        longitude: 72.8263
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc',
        caption: 'Basketball court'
      }
    ],
    sports: ['basketball'],
    amenities: ['parking', 'washroom', 'lighting', 'seating', 'first_aid'],
    pricing: {
      hourlyRate: 1000,
      peakHourRate: 1500,
      currency: 'INR'
    },
    availability: {
      days: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '17:00', end: '21:00' } },
        { day: 'saturday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '09:00', end: '20:00' } },
        { day: 'sunday', isOpen: true, openTime: '06:00', closeTime: '22:00', peakHours: { start: '09:00', end: '20:00' } }
      ]
    },
    capacity: {
      maxPlayers: 10,
      recommendedPlayers: 10
    },
    rules: [
      'Basketball shoes recommended',
      'Respect court boundaries',
      'Clean up after use'
    ],
    contact: {
      phone: '+91-9876543212',
      email: 'probasket@example.com'
    },
    rating: {
      average: 4.1,
      count: 19
    },
    isActive: true,
    isVerified: true
  },
  {
    name: 'Tennis Paradise',
    description: 'Clay and hard court tennis facilities with professional coaching available. Perfect for all skill levels.',
    owner: owners[0]._id, // Sarah Smith
    location: {
      address: '555 Tennis Lane, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
      coordinates: {
        latitude: 19.0176,
        longitude: 72.8181
      }
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8',
        caption: 'Tennis courts'
      }
    ],
    sports: ['tennis'],
    amenities: ['parking', 'washroom', 'changing_room', 'lighting', 'seating', 'cafeteria', 'equipment_rental'],
    pricing: {
      hourlyRate: 1500,
      peakHourRate: 2000,
      currency: 'INR'
    },
    availability: {
      days: [
        { day: 'monday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '17:00', end: '20:00' } },
        { day: 'tuesday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '17:00', end: '20:00' } },
        { day: 'wednesday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '17:00', end: '20:00' } },
        { day: 'thursday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '17:00', end: '20:00' } },
        { day: 'friday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '17:00', end: '20:00' } },
        { day: 'saturday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '08:00', end: '19:00' } },
        { day: 'sunday', isOpen: true, openTime: '06:00', closeTime: '21:00', peakHours: { start: '08:00', end: '19:00' } }
      ]
    },
    capacity: {
      maxPlayers: 4,
      recommendedPlayers: 2
    },
    rules: [
      'Tennis shoes mandatory',
      'Book courts in advance',
      'Coaching sessions available on request'
    ],
    contact: {
      phone: '+91-9876543211',
      email: 'tennis@example.com',
      whatsapp: '+91-9876543211'
    },
    rating: {
      average: 4.6,
      count: 31
    },
    isActive: true,
    isVerified: true
  }
];

// Test bookings data (will be populated after users and turfs are created)
const getBookingsData = (users, turfs) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      user: users[0]._id, // John Doe
      turf: turfs[0]._id, // Champions Football Arena
      date: tomorrow,
      timeSlot: {
        startTime: '18:00',
        endTime: '20:00'
      },
      duration: 2,
      players: {
        count: 14,
        details: [
          { name: 'John Doe', phone: '+91-9876543210', email: 'john.user@example.com' }
        ]
      },
      pricing: {
        baseAmount: 6000,
        peakHourCharges: 0,
        taxes: 1080,
        discount: 0,
        totalAmount: 7080
      },
      payment: {
        method: 'upi',
        status: 'completed',
        transactionId: 'TXN123456789',
        paidAt: new Date()
      },
      status: 'confirmed',
      specialRequests: 'Please ensure the field is well-lit'
    },
    {
      user: users[4]._id, // Alice Brown
      turf: turfs[2]._id, // Ace Badminton Center
      date: today,
      timeSlot: {
        startTime: '10:00',
        endTime: '11:00'
      },
      duration: 1,
      players: {
        count: 4,
        details: [
          { name: 'Alice Brown', phone: '+91-9876543214', email: 'alice.user@example.com' }
        ]
      },
      pricing: {
        baseAmount: 800,
        peakHourCharges: 0,
        taxes: 144,
        discount: 0,
        totalAmount: 944
      },
      payment: {
        method: 'card',
        status: 'completed',
        transactionId: 'TXN987654321',
        paidAt: new Date()
      },
      status: 'completed'
    },
    {
      user: users[0]._id, // John Doe
      turf: turfs[1]._id, // Elite Cricket Ground
      date: nextWeek,
      timeSlot: {
        startTime: '09:00',
        endTime: '12:00'
      },
      duration: 3,
      players: {
        count: 16,
        details: [
          { name: 'John Doe', phone: '+91-9876543210', email: 'john.user@example.com' }
        ]
      },
      pricing: {
        baseAmount: 7500,
        peakHourCharges: 0,
        taxes: 1350,
        discount: 500,
        totalAmount: 8350
      },
      payment: {
        method: 'upi',
        status: 'pending'
      },
      status: 'pending',
      specialRequests: 'Need practice nets as well'
    },
    {
      user: users[4]._id, // Alice Brown
      turf: turfs[4]._id, // Tennis Paradise
      date: tomorrow,
      timeSlot: {
        startTime: '07:00',
        endTime: '08:00'
      },
      duration: 1,
      players: {
        count: 2,
        details: [
          { name: 'Alice Brown', phone: '+91-9876543214', email: 'alice.user@example.com' }
        ]
      },
      pricing: {
        baseAmount: 1500,
        peakHourCharges: 0,
        taxes: 270,
        discount: 0,
        totalAmount: 1770
      },
      payment: {
        method: 'wallet',
        status: 'completed',
        transactionId: 'TXN456789123',
        paidAt: new Date()
      },
      status: 'confirmed'
    }
  ];
};

// Seed database function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Check if data already exists (idempotent check)
    const existingUsersCount = await User.countDocuments();
    const existingTurfsCount = await Turf.countDocuments();
    const existingBookingsCount = await Booking.countDocuments();

    if (existingUsersCount > 0 || existingTurfsCount > 0 || existingBookingsCount > 0) {
      console.log('⚠️  Database already contains data:');
      console.log(`   - Users: ${existingUsersCount}`);
      console.log(`   - Turfs: ${existingTurfsCount}`);
      console.log(`   - Bookings: ${existingBookingsCount}`);
      console.log('\n❓ Do you want to clear existing data and reseed? (This will delete all data)');
      console.log('   To proceed, run: npm run seed -- --force\n');
      
      // Check if --force flag is provided
      const forceFlag = process.argv.includes('--force') || process.argv.includes('-f');
      if (!forceFlag) {
        console.log('✅ Seeding cancelled. Use --force flag to clear and reseed.');
        console.log('   Example: npm run seed -- --force');
        process.exit(0);
      }

      console.log('🗑️  Clearing existing data...');
      await User.deleteMany({});
      await Turf.deleteMany({});
      await Booking.deleteMany({});
      console.log('✅ Existing data cleared\n');
    }

    // Create users (one by one to trigger password hashing middleware)
    console.log('👥 Creating test users...');
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);
    createdUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.role}) - ${user.email}`);
    });

    // Separate users by role for easier reference
    const regularUsers = createdUsers.filter(u => u.role === 'user');
    const owners = createdUsers.filter(u => u.role === 'owner');
    const admins = createdUsers.filter(u => u.role === 'admin');

    // Create turfs
    console.log('\n🏟️  Creating test turfs...');
    const turfsData = getTurfsData(owners);
    const createdTurfs = await Turf.insertMany(turfsData);
    console.log(`✅ Created ${createdTurfs.length} turfs`);
    createdTurfs.forEach(turf => {
      console.log(`   - ${turf.name} (${turf.sports.join(', ')}) - ${turf.location.city}`);
    });

    // Create bookings
    console.log('\n📅 Creating sample bookings...');
    const bookingsData = getBookingsData(createdUsers, createdTurfs);
    const createdBookings = await Booking.insertMany(bookingsData);
    console.log(`✅ Created ${createdBookings.length} bookings`);
    createdBookings.forEach(booking => {
      console.log(`   - Booking for ${booking.timeSlot.startTime}-${booking.timeSlot.endTime} (${booking.status})`);
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Database seeding completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   - Total Users: ${createdUsers.length}`);
    console.log(`     • Regular Users: ${regularUsers.length}`);
    console.log(`     • Owners: ${owners.length}`);
    console.log(`     • Admins: ${admins.length}`);
    console.log(`   - Total Turfs: ${createdTurfs.length}`);
    console.log(`   - Total Bookings: ${createdBookings.length}`);
    
    console.log('\n🔑 Test Credentials:');
    console.log('   User Account:');
    console.log('     Email: john.user@example.com');
    console.log('     Password: password123');
    console.log('\n   Owner Account:');
    console.log('     Email: sarah.owner@example.com');
    console.log('     Password: password123');
    console.log('\n   Admin Account:');
    console.log('     Email: admin@turfease.com');
    console.log('     Password: admin123');
    console.log('\n');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await seedDatabase();
  await mongoose.connection.close();
  console.log('🔌 Database connection closed');
  process.exit(0);
};

// Run the script
main();
