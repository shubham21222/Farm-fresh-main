const FarmerBrand = require('../models/FarmerBrand');
const cloudinary = require('../utils/cloudinary');
const asyncHandler = require('../middleware/async');

// @desc    Get farmer brand
// @route   GET /api/farmer/brand
// @access  Private (Farmer only)
exports.getFarmerBrand = asyncHandler(async (req, res) => {
  const brand = await FarmerBrand.findOne({ farmer: req.user.id });

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  res.status(200).json({
    success: true,
    data: brand
  });
});

// @desc    Create or update farmer brand
// @route   PUT /api/farmer/brand
// @access  Private (Farmer only)
exports.updateFarmerBrand = asyncHandler(async (req, res) => {
  let brand = await FarmerBrand.findOne({ farmer: req.user.id });

  // Handle image uploads if present
  if (req.files) {
    if (req.files.logo) {
      const logoResult = await cloudinary.uploader.upload(req.files.logo.tempFilePath, {
        folder: 'farmer-brands/logos',
        width: 150,
        crop: 'scale'
      });
      req.body.logo = {
        url: logoResult.secure_url,
        publicId: logoResult.public_id
      };
    }

    if (req.files.coverImage) {
      const coverResult = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
        folder: 'farmer-brands/covers',
        width: 1200,
        crop: 'scale'
      });
      req.body.coverImage = {
        url: coverResult.secure_url,
        publicId: coverResult.public_id
      };
    }
  }

  if (!brand) {
    // Create new brand
    req.body.farmer = req.user.id;
    brand = await FarmerBrand.create(req.body);
  } else {
    // Update existing brand
    brand = await FarmerBrand.findOneAndUpdate(
      { farmer: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
  }

  res.status(200).json({
    success: true,
    data: brand
  });
});

// @desc    Delete farmer brand
// @route   DELETE /api/farmer/brand
// @access  Private (Farmer only)
exports.deleteFarmerBrand = asyncHandler(async (req, res) => {
  const brand = await FarmerBrand.findOne({ farmer: req.user.id });

  if (!brand) {
    return res.status(404).json({
      success: false,
      message: 'Brand not found'
    });
  }

  // Delete images from cloudinary if they exist
  if (brand.logo?.publicId) {
    await cloudinary.uploader.destroy(brand.logo.publicId);
  }
  if (brand.coverImage?.publicId) {
    await cloudinary.uploader.destroy(brand.coverImage.publicId);
  }

  await brand.remove();

  res.status(200).json({
    success: true,
    message: 'Brand deleted successfully'
  });
}); 