const express = require('express');
const router = express.Router();
const { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFarmerProducts,
  reserveStock,
  releaseStock,
  createPreorder,
  cancelPreorder,
  getPreorders,
  updatePreorderStatus,
  getProductReviews,
  reportReview,
  voteHelpful,
  getFeaturedProducts,
  searchProducts,
  getProductAnalytics
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/search', searchProducts);
router.get('/farmer/:id', getFarmerProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);

// Protected routes
router.post('/', protect, authorize('farmer'), createProduct);
router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/reviews/:reviewId/report', protect, reportReview);
router.post('/:id/reviews/:reviewId/vote', protect, voteHelpful);
router.put('/:id', protect, authorize('farmer'), updateProduct);
router.delete('/:id', protect, authorize('farmer'), deleteProduct);

// Stock management routes
router.post('/:id/reserve-stock', protect, reserveStock);
router.post('/:id/release-stock', protect, releaseStock);

// Preorder routes
router.post('/:id/preorders', protect, createPreorder);
router.delete('/:id/preorders/:preorderId', protect, cancelPreorder);
router.get('/:id/preorders', protect, authorize('farmer'), getPreorders);
router.put('/:id/preorders/:preorderId/status', protect, authorize('farmer'), updatePreorderStatus);

// Analytics routes (farmer only)
router.get('/:id/analytics', protect, authorize('farmer'), getProductAnalytics);

module.exports = router; 