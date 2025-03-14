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
const { auth } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/farmer/:id', getFarmerProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', auth, createProduct);
router.post('/:id/reviews', auth, createProductReview);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router; 