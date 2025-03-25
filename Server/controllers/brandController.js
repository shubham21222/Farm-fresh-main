const FarmerBrand = require('../models/FarmerBrand');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get farmer's brand
// @route   GET /api/farmer/brand
// @access  Private (Farmer only)
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await FarmerBrand.findOne({ farmer: req.user.id });

  if (!brand) {
    return next(new ErrorResponse('Brand not found', 404));
  }

  res.status(200).json(brand);
});

// @desc    Create or update farmer's brand
// @route   PUT /api/farmer/brand
// @access  Private (Farmer only)
exports.updateBrand = asyncHandler(async (req, res, next) => {
  let brand = await FarmerBrand.findOne({ farmer: req.user.id });

  if (!brand) {
    // Create new brand
    brand = await FarmerBrand.create({
      ...req.body,
      farmer: req.user.id
    });
  } else {
    // Update existing brand
    brand = await FarmerBrand.findOneAndUpdate(
      { farmer: req.user.id },
      { ...req.body, farmer: req.user.id },
      { new: true, runValidators: true }
    );
  }

  res.status(200).json(brand);
});

// @desc    Upload brand image (logo or cover)
// @route   POST /api/farmer/brand/upload
// @access  Private (Farmer only)
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const brand = await FarmerBrand.findOne({ farmer: req.user.id });

  if (!brand) {
    return next(new ErrorResponse('Brand not found', 404));
  }

  // Update the image field based on the type (logo or coverImage)
  const imageType = req.body.type;
  if (!['logo', 'coverImage'].includes(imageType)) {
    return next(new ErrorResponse('Invalid image type', 400));
  }

  brand[imageType] = {
    url: req.file.path,
    publicId: req.file.filename
  };

  await brand.save();

  res.status(200).json({
    success: true,
    data: brand[imageType]
  });
}); 