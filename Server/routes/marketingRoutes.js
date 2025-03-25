const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getMarketingCampaigns,
  createMarketingCampaign,
  updateMarketingCampaign,
  deleteMarketingCampaign,
  getActiveCampaigns
} = require('../controllers/marketingController');

// Public routes
router.get('/', getMarketingCampaigns);
router.get('/active', getActiveCampaigns);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createMarketingCampaign);
router.put('/:id', protect, authorize('admin'), updateMarketingCampaign);
router.delete('/:id', protect, authorize('admin'), deleteMarketingCampaign);

module.exports = router; 