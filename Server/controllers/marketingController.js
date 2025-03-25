const Marketing = require('../models/Marketing');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all marketing campaigns
// @route   GET /api/marketing
// @access  Public
exports.getMarketingCampaigns = asyncHandler(async (req, res, next) => {
  const campaigns = await Marketing.find()
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns
  });
});

// @desc    Get active marketing campaigns
// @route   GET /api/marketing/active
// @access  Public
exports.getActiveCampaigns = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const campaigns = await Marketing.find({
    startDate: { $lte: now },
    endDate: { $gte: now },
    isActive: true
  }).sort('-createdAt');

  res.status(200).json({
    success: true,
    count: campaigns.length,
    data: campaigns
  });
});

// @desc    Create marketing campaign
// @route   POST /api/marketing
// @access  Private (Admin)
exports.createMarketingCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Marketing.create({
    ...req.body,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: campaign
  });
});

// @desc    Update marketing campaign
// @route   PUT /api/marketing/:id
// @access  Private (Admin)
exports.updateMarketingCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Marketing.findById(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse('Marketing campaign not found', 404));
  }

  // Update campaign
  Object.keys(req.body).forEach(key => {
    campaign[key] = req.body[key];
  });

  await campaign.save();

  res.status(200).json({
    success: true,
    data: campaign
  });
});

// @desc    Delete marketing campaign
// @route   DELETE /api/marketing/:id
// @access  Private (Admin)
exports.deleteMarketingCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Marketing.findById(req.params.id);

  if (!campaign) {
    return next(new ErrorResponse('Marketing campaign not found', 404));
  }

  await campaign.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 