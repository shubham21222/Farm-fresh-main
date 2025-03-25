const express = require('express');
const router = express.Router();
const { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFarmerProducts 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/farmer/:id', getFarmerProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, authorize('farmer'), createProduct);
router.post('/:id/reviews', protect, createProductReview);
router.put('/:id', protect, authorize('farmer'), updateProduct);
router.delete('/:id', protect, authorize('farmer'), deleteProduct);

module.exports = router; 