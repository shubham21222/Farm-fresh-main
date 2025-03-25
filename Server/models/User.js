const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'farmer', 'admin'],
    default: 'user'
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Add farmer-specific fields
  farmName: { type: String }, // From registration form
  farmAddress: { type: String }, // Map to address in getPublicFarmerProfile
  farmDescription: { type: String }, // Map to description
  farmProducts: [{ type: String }], // Array of product names (not references)
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to Product model
  avatar: { type: String }, // Profile image
  banner: { type: String }, // Banner image
  categories: [{ type: String }], // Specialty categories
  rating: { type: Number, default: 0 }, // Average rating
  totalReviews: { type: Number, default: 0 } // Number of reviews
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);