const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public routes
router.post('/login', adminController.loginAdmin);

// Protected routes - require authentication and admin role
router.use(auth, isAdmin);

// Profile routes
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

// Get all users
router.get('/users', adminController.getAllUsers);

// Get all farmers
router.get('/farmers', adminController.getAllFarmers);

// Get all products
router.get('/products', adminController.getAllProducts);

// Get all orders
router.get('/orders', adminController.getAllOrders);

// Get admin analytics
router.get('/analytics', adminController.getAdminAnalytics);

// Get admin dashboard stats
router.get('/dashboard-stats', adminController.getAdminDashboardStats);

// Verify farmer
router.put('/farmers/:id/verify', adminController.verifyFarmer);

// Delete user
router.delete('/users/:id', adminController.deleteUser);

// Update product status
router.put('/products/:id/status', adminController.updateProductStatus);

module.exports = router; 