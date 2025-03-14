const express = require('express');
const router = express.Router();
const { auth, isFarmer } = require('../middleware/auth');
const farmerController = require('../controllers/farmerController');

// Protect all routes and ensure farmer role
router.use(auth, isFarmer);

// Get farmer's profile
router.get('/profile', farmerController.getFarmerProfile);

// Get farmer's products
router.get('/products', farmerController.getFarmerProducts);

// Get farmer's orders
router.get('/orders', farmerController.getFarmerOrders);

// Get farmer's analytics
router.get('/analytics', farmerController.getFarmerAnalytics);

// Update farmer's profile
router.put('/profile', farmerController.updateFarmerProfile);

// Add a new product
router.post('/products', farmerController.addProduct);

// Update a product
router.put('/products/:id', farmerController.updateProduct);

// Delete a product
router.delete('/products/:id', farmerController.deleteProduct);

// Update order status
router.put('/orders/:id/status', farmerController.updateOrderStatus);

module.exports = router; 