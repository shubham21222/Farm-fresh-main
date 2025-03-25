const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  getDeliveryZoneById
} = require('../controllers/deliveryZoneController');

// Public routes
router.get('/', getDeliveryZones);
router.get('/:id', getDeliveryZoneById);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createDeliveryZone);
router.put('/:id', protect, authorize('admin'), updateDeliveryZone);
router.delete('/:id', protect, authorize('admin'), deleteDeliveryZone);

module.exports = router; 