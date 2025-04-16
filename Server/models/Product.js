const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Other']
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  reservedStock: {
    type: Number,
    default: 0,
    min: 0
  },
  availableStock: {
    type: Number,
    default: 0,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'piece', 'dozen', 'litre', 'ml']
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  harvestDate: Date,
  expiryDate: Date,
  // Preorder settings
  preorderEnabled: {
    type: Boolean,
    default: false
  },
  preorderDeadline: Date,
  preorderPrice: Number,
  preorderDeposit: Number,
  preorderStock: Number,
  preorderFulfillmentDate: Date,
  // Subscription settings
  subscriptionEnabled: {
    type: Boolean,
    default: false
  },
  subscriptionFrequencies: [{
    type: String,
    enum: ['weekly', 'biweekly', 'monthly']
  }],
  // Delivery settings
  deliveryOptions: {
    pickup: {
      enabled: Boolean,
      locations: [{
        name: String,
        address: String,
        coordinates: {
          lat: Number,
          lng: Number
        }
      }]
    },
    delivery: {
      enabled: Boolean,
      zones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryZone'
      }],
      fees: [{
        zone: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DeliveryZone'
        },
        fee: Number
      }]
    }
  },
  // Reviews and ratings
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String],
    helpfulVotes: {
      type: Number,
      default: 0
    },
    reported: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Product status
  status: {
    type: String,
    enum: ['active', 'out_of_stock', 'preorder', 'discontinued'],
    default: 'active'
  },
  // Product visibility
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  // Metadata
  tags: [String],
  attributes: [{
    name: String,
    value: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate available stock
productSchema.pre('save', function(next) {
  this.availableStock = this.stock - this.reservedStock;
  next();
});

// Update product status based on stock
productSchema.pre('save', function(next) {
  if (this.availableStock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.preorderEnabled && this.preorderStock > 0) {
    this.status = 'preorder';
  } else {
    this.status = 'active';
  }
  next();
});

// Update average rating when reviews change
productSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }

  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema); 