const DeliveryZone = require('../models/DeliveryZone');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all delivery zones
// @route   GET /api/delivery-zones
// @access  Public
exports.getDeliveryZones = asyncHandler(async (req, res, next) => {
  const zones = await DeliveryZone.find()
    .sort('name');

  res.status(200).json({
    success: true,
    count: zones.length,
    data: zones
  });
});

// @desc    Get delivery zone by ID
// @route   GET /api/delivery-zones/:id
// @access  Public
exports.getDeliveryZoneById = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.findById(req.params.id);

  if (!zone) {
    return next(new ErrorResponse('Delivery zone not found', 404));
  }

  res.status(200).json({
    success: true,
    data: zone
  });
});

// @desc    Create delivery zone
// @route   POST /api/delivery-zones
// @access  Private (Admin)
exports.createDeliveryZone = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.create(req.body);

  res.status(201).json({
    success: true,
    data: zone
  });
});

// @desc    Update delivery zone
// @route   PUT /api/delivery-zones/:id
// @access  Private (Admin)
exports.updateDeliveryZone = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.findById(req.params.id);

  if (!zone) {
    return next(new ErrorResponse('Delivery zone not found', 404));
  }

  // Update zone
  Object.keys(req.body).forEach(key => {
    zone[key] = req.body[key];
  });

  await zone.save();

  res.status(200).json({
    success: true,
    data: zone
  });
});

// @desc    Delete delivery zone
// @route   DELETE /api/delivery-zones/:id
// @access  Private (Admin)
exports.deleteDeliveryZone = asyncHandler(async (req, res, next) => {
  const zone = await DeliveryZone.findById(req.params.id);

  if (!zone) {
    return next(new ErrorResponse('Delivery zone not found', 404));
  }

  await zone.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 