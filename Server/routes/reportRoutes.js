const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  generateSalesReport,
  generateInventoryReport,
  getFarmerReports,
  getAdminReports
} = require('../controllers/reportController');

// Protected routes
router.get('/sales', protect, authorize('admin', 'farmer'), generateSalesReport);
router.get('/inventory', protect, authorize('admin', 'farmer'), generateInventoryReport);
router.get('/farmer', protect, authorize('farmer'), getFarmerReports);
router.get('/admin', protect, authorize('admin'), getAdminReports);

module.exports = router; 