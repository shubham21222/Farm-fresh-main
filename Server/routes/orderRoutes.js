const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrderDetails,
  updateOrderStatus,
  getUserOrders,
  getFarmerOrders,
  getAllOrders
} = require('../controllers/orderController');

// Public routes
router.post('/', protect, createOrder);
router.get('/user', protect, getUserOrders);
router.get('/farmer', protect, authorize('farmer'), getFarmerOrders);
router.get('/admin', protect, authorize('admin'), getAllOrders);
router.get('/:id', protect, getOrderDetails);
router.patch('/:id/status', protect, authorize('farmer', 'admin'), updateOrderStatus);

module.exports = router; 