const mongoose = require('mongoose');

const preorderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  pickupLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PickupLocation'
  },
  deliveryOption: {
    type: String,
    enum: ['delivery', 'pickup'],
    required: true
  },
  notes: String,
  cancellationReason: String,
  refundAmount: Number,
  refundDate: Date,
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
preorderSchema.index({ product: 1, user: 1 });
preorderSchema.index({ status: 1 });
preorderSchema.index({ deliveryDate: 1 });

// Virtual for remaining amount
preorderSchema.virtual('remainingAmount').get(function() {
  return this.totalAmount - this.depositAmount;
});

// Method to calculate refund amount based on cancellation policy
preorderSchema.methods.calculateRefund = function(cancellationDate) {
  const daysUntilDelivery = Math.ceil((this.deliveryDate - cancellationDate) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDelivery >= 7) {
    return this.totalAmount; // Full refund
  } else if (daysUntilDelivery >= 3) {
    return this.totalAmount * 0.5; // 50% refund
  } else {
    return 0; // No refund
  }
};

module.exports = mongoose.model('Preorder', preorderSchema); 