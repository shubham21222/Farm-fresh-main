const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getFarmerAnalytics,
  getAdminAnalytics
} = require('../controllers/analyticsController');

// All routes are protected
router.use(protect);

// Farmer analytics
router.get('/farmer', authorize('farmer'), getFarmerAnalytics);

// Admin analytics
router.get('/admin', authorize('admin'), getAdminAnalytics);

module.exports = router; 