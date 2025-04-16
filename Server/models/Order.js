const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'returned', 'refunded'],
    default: 'pending'
  },
  returnReason: String,
  returnStatus: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'completed'],
    default: null
  },
  returnDate: Date,
  refundAmount: Number
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  deliveryMethod: {
    type: String,
    enum: ['delivery', 'pickup'],
    required: true
  },
  pickupLocation: {
    address: String,
    instructions: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  deliveryZone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryZone'
  },
  deliveryFee: Number,
  deliveryStatus: {
    type: String,
    enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'],
    default: 'pending'
  },
  deliveryProvider: {
    type: String,
    enum: ['self', 'third_party']
  },
  trackingNumber: String,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date,
  deliveryNotes: String,
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paymentGateway: String,
    paymentDate: Date
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  discountCode: String,
  discountAmount: {
    type: Number,
    default: 0
  },
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsRedeemed: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  isSubscription: {
    type: Boolean,
    default: false
  },
  subscriptionDetails: {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription'
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly']
    },
    nextDeliveryDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled'],
      default: 'active'
    },
    pauseReason: String,
    cancellationReason: String
  },
  notes: String,
  cancellationReason: String,
  refundAmount: Number,
  refundDate: Date,
  refundReason: String,
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

// Indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ deliveryStatus: 1 });
orderSchema.index({ 'subscriptionDetails.status': 1 });

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to calculate loyalty points
orderSchema.methods.calculateLoyaltyPoints = function() {
  const pointsPerDollar = 1; // 1 point per dollar spent
  return Math.floor(this.finalAmount * pointsPerDollar);
};

// Method to check if order is eligible for return
orderSchema.methods.isEligibleForReturn = function() {
  const maxReturnDays = 7;
  return this.ageInDays <= maxReturnDays && this.orderStatus === 'delivered';
};

// Method to calculate refund amount based on return policy
orderSchema.methods.calculateRefundAmount = function(returnedItems) {
  let refundAmount = 0;
  
  returnedItems.forEach(item => {
    const orderItem = this.items.id(item._id);
    if (orderItem) {
      refundAmount += orderItem.price * item.quantity;
    }
  });

  // Apply restocking fee if applicable
  const restockingFee = refundAmount * 0.1; // 10% restocking fee
  return refundAmount - restockingFee;
};

module.exports = mongoose.model('Order', orderSchema); 