const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getFarmerBrand,
  updateFarmerBrand,
  deleteFarmerBrand
} = require('../controllers/farmerBrandController');
const fileUpload = require('../middleware/fileUpload');

// All routes are protected and require farmer role
router.use(protect);

// Get farmer brand
router.get('/', getFarmerBrand);

// Update or create farmer brand
router.put('/', fileUpload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateFarmerBrand);

// Delete farmer brand
router.delete('/', deleteFarmerBrand);

module.exports = router; 