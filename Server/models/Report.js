const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sales', 'inventory', 'customer', 'delivery', 'subscription'],
    required: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly', 'custom'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  data: {
    totalOrders: Number,
    totalRevenue: Number,
    averageOrderValue: Number,
    topProducts: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: Number,
      revenue: Number
    }],
    customerMetrics: {
      newCustomers: Number,
      returningCustomers: Number,
      customerRetentionRate: Number
    },
    deliveryMetrics: {
      totalDeliveries: Number,
      onTimeDeliveries: Number,
      deliverySuccessRate: Number
    },
    subscriptionMetrics: {
      activeSubscriptions: Number,
      newSubscriptions: Number,
      cancelledSubscriptions: Number
    },
    inventoryMetrics: {
      lowStockItems: Number,
      outOfStockItems: Number,
      totalInventoryValue: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Report', reportSchema); 