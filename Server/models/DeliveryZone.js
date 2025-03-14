const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  areas: [{
    type: {
      type: String,
      enum: ['city', 'state', 'zipCode', 'custom'],
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  deliveryFee: {
    type: Number,
    required: true,
    min: 0
  },
  minimumOrderAmount: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  }],
  deliveryTimeSlots: [{
    start: String, // Format: "HH:mm"
    end: String,   // Format: "HH:mm"
    maxOrders: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema); 