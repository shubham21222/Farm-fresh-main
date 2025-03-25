const mongoose = require('mongoose');

const farmerBrandSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    url: String,
    publicId: String
  },
  coverImage: {
    url: String,
    publicId: String
  },
  brandColors: {
    primary: {
      type: String,
      default: '#4CAF50'
    },
    secondary: {
      type: String,
      default: '#45a049'
    },
    accent: {
      type: String,
      default: '#FFA726'
    }
  },
  typography: {
    headingFont: {
      type: String,
      default: 'Poppins'
    },
    bodyFont: {
      type: String,
      default: 'Inter'
    }
  },
  storeDescription: {
    type: String,
    maxLength: 500
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    website: String
  },
  contactInfo: {
    phone: String,
    email: String,
    address: String
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
farmerBrandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FarmerBrand', farmerBrandSchema); 