const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFarmerProfile,
  getFarmerProducts,
  getFarmerOrders,
  getFarmerAnalytics,
  updateFarmerProfile,
  addProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getPublicFarmerProfile,
  getAllPublicFarmers,
  loginFarmer // Add this
} = require('../controllers/farmerController');

// Public routes (no auth required)
router.get('/all', getAllPublicFarmers);
router.get('/:id', getPublicFarmerProfile);
router.post('/login', loginFarmer); // Add farmer login route

// Protected routes (require authentication)
router.get('/profile', protect, authorize('farmer'), getFarmerProfile);
router.get('/products', protect, authorize('farmer'), getFarmerProducts);
router.get('/orders', protect, authorize('farmer'), getFarmerOrders);
router.get('/analytics', protect, authorize('farmer'), getFarmerAnalytics);
router.put('/profile', protect, authorize('farmer'), updateFarmerProfile);
router.post('/products', protect, authorize('farmer'), addProduct);
router.put('/products/:id', protect, authorize('farmer'), updateProduct);
router.delete('/products/:id', protect, authorize('farmer'), deleteProduct);
router.put('/orders/:id/status', protect, authorize('farmer'), updateOrderStatus);

module.exports = router;