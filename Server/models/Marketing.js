const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  applicableCategories: [String],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const loyaltyProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  pointsPerPurchase: {
    type: Number,
    required: true
  },
  pointsPerCurrency: {
    type: Number,
    required: true
  },
  minimumPoints: {
    type: Number,
    required: true
  },
  pointValue: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userLoyaltySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  pointsHistory: [{
    points: Number,
    type: {
      type: String,
      enum: ['earned', 'redeemed']
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = {
  Discount: mongoose.model('Discount', discountSchema),
  LoyaltyProgram: mongoose.model('LoyaltyProgram', loyaltyProgramSchema),
  UserLoyalty: mongoose.model('UserLoyalty', userLoyaltySchema)
}; 