const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  importProductsFromCSV,
  exportProductsToCSV,
  updateMultipleProducts,
  deleteMultipleProducts
} = require('../controllers/bulkProductController');
const upload = require('../middleware/upload');

// All routes are protected and require farmer role
router.use(protect);
router.use(authorize('farmer'));

// Import products from CSV
router.post('/import', upload.single('file'), importProductsFromCSV);

// Export products to CSV
router.get('/export', exportProductsToCSV);

// Update multiple products
router.put('/update', updateMultipleProducts);

// Delete multiple products
router.delete('/delete', deleteMultipleProducts);

module.exports = router; 