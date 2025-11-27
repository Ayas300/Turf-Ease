const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Turf name is required'],
    trim: true,
    maxlength: [100, 'Turf name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: false
    },
    pincode: {
      type: String,
      required: false,
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
    },
    coordinates: {
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 }
    }
  },
  images: [{
    url: { type: String, required: true },
    publicId: String,
    caption: String
  }],
  sports: [{
    type: String,
    enum: ['football', 'cricket', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey'],
    required: true
  }],
  amenities: [{
    type: String,
    enum: ['parking', 'washroom', 'changing_room', 'lighting', 'seating', 'cafeteria', 'first_aid', 'equipment_rental']
  }],
  pricing: {
    hourlyRate: {
      type: Number,
      required: [true, 'Hourly rate is required'],
      min: [0, 'Hourly rate cannot be negative']
    },
    peakHourRate: {
      type: Number
    },
    currency: {
      type: String,
      default: 'TK'
    }
  },
  availability: {
    days: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
      },
      isOpen: { type: Boolean, default: true },
      openTime: { type: String, required: true }, // Format: "HH:MM"
      closeTime: { type: String, required: true }, // Format: "HH:MM"
      peakHours: {
        start: String, // Format: "HH:MM"
        end: String    // Format: "HH:MM"
      }
    }],
    holidays: [Date],
    maintenanceDates: [{
      date: Date,
      reason: String
    }]
  },
  capacity: {
    maxPlayers: {
      type: Number,
      required: [true, 'Maximum players capacity is required'],
      min: [1, 'Capacity must be at least 1']
    },
    recommendedPlayers: Number
  },
  rules: [String],
  contact: {
    phone: {
      type: String,
      required: [true, 'Contact phone is required']
    },
    email: String,
    whatsapp: String
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String,
    url: String
  }]
}, {
  timestamps: true
});

// Set default peakHourRate before saving
turfSchema.pre('save', function(next) {
  if (!this.pricing.peakHourRate && this.pricing.hourlyRate) {
    this.pricing.peakHourRate = this.pricing.hourlyRate * 1.5;
  }
  next();
});

// Index for location-based queries
turfSchema.index({ 'location.coordinates': '2dsphere' });
turfSchema.index({ 'location.city': 1, 'sports': 1 });
turfSchema.index({ 'rating.average': -1 });

// Virtual for formatted address
turfSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Method to check availability for a specific date and time
turfSchema.methods.isAvailable = function(date, startTime, endTime) {
  // Get day name from date object
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = daysOfWeek[date.getDay()];
  
  const daySchedule = this.availability.days.find(d => d.day === dayName);
  
  if (!daySchedule || !daySchedule.isOpen) return false;
  
  // Check if date is a holiday or maintenance day
  const isHoliday = this.availability.holidays.some(holiday => 
    holiday.toDateString() === date.toDateString()
  );
  
  const isMaintenance = this.availability.maintenanceDates.some(maintenance => 
    maintenance.date.toDateString() === date.toDateString()
  );
  
  return !isHoliday && !isMaintenance;
};

module.exports = mongoose.model('Turf', turfSchema);