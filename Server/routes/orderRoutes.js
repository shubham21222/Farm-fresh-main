const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrderDetails,
  updateOrderStatus,
  getUserOrders,
  getFarmerOrders,
  getAllOrders,
  createSubscriptionOrder,
  updateSubscriptionOrder,
  cancelSubscriptionOrder,
  getSubscriptionOrders,
  trackDelivery,
  updateDeliveryStatus,
  requestReturn,
  processReturn,
  getReturnRequests,
  updateReturnStatus,
  applyLoyaltyPoints,
  removeLoyaltyPoints,
  getOrderAnalytics
} = require('../controllers/orderController');

// Public routes
router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.get('/admin', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderDetails);
router.patch('/:id/status', protect, authorize('farmer', 'admin'), updateOrderStatus);

// Subscription routes
router.post('/subscriptions', protect, createSubscriptionOrder);
router.put('/subscriptions/:id', protect, updateSubscriptionOrder);
router.delete('/subscriptions/:id', protect, cancelSubscriptionOrder);
router.get('/subscriptions', protect, getSubscriptionOrders);

// Delivery tracking routes
router.get('/:id/tracking', protect, trackDelivery);
router.patch('/:id/delivery-status', protect, authorize('farmer', 'admin'), updateDeliveryStatus);

// Return routes
router.post('/:id/returns', protect, requestReturn);
router.post('/:id/returns/:returnId/process', protect, authorize('farmer', 'admin'), processReturn);
router.get('/returns', protect, authorize('farmer', 'admin'), getReturnRequests);
router.patch('/:id/returns/:returnId/status', protect, authorize('farmer', 'admin'), updateReturnStatus);

// Loyalty points routes
router.post('/:id/apply-loyalty', protect, applyLoyaltyPoints);
router.post('/:id/remove-loyalty', protect, removeLoyaltyPoints);

// Analytics routes
router.get('/analytics/farmer', protect, authorize('farmer'), getOrderAnalytics);
router.get('/analytics/admin', protect, authorize('admin'), getOrderAnalytics);

module.exports = router; 