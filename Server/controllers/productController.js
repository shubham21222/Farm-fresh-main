const Product = require('../models/Product');
const User = require('../models/User');
const Preorder = require('../models/Preorder');

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      stock,
      unit,
      isOrganic,
      harvestDate,
      expiryDate
    } = req.body;

    // Check if farmer is verified
    if (!req.user.isVerified) {
      return res.status(403).json({ message: 'Farmer needs to be verified to add products' });
    }

    const product = await Product.create({
      farmer: req.user._id,
      name,
      description,
      price,
      category,
      image,
      stock,
      unit,
      isOrganic,
      harvestDate,
      expiryDate
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, isOrganic, farmer } = req.query;
    let query = {};

    if (category) query.category = category;
    if (isOrganic) query.isOrganic = isOrganic;
    if (farmer) query.farmer = farmer;

    const products = await Product.find(query)
      .populate('farmer', 'name farmName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name farmName')
      .populate('reviews.user', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Farmer
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the farmer who created the product
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user is the farmer who created the product
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get farmer's products
// @route   GET /api/products/farmer/:id
// @access  Public
const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.params.id })
      .populate('farmer', 'name farmName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reserve stock for order
// @route   POST /api/products/:id/reserve-stock
// @access  Private
const reserveStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.availableStock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient stock available',
        availableStock: product.availableStock
      });
    }

    product.reservedStock += quantity;
    await product.save();

    res.json({
      success: true,
      data: {
        reservedStock: product.reservedStock,
        availableStock: product.availableStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Release reserved stock
// @route   POST /api/products/:id/release-stock
// @access  Private
const releaseStock = async (req, res) => {
  try {
    const { quantity } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.reservedStock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot release more stock than reserved',
        reservedStock: product.reservedStock
      });
    }

    product.reservedStock -= quantity;
    await product.save();

    res.json({
      success: true,
      data: {
        reservedStock: product.reservedStock,
        availableStock: product.availableStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create preorder
// @route   POST /api/products/:id/preorders
// @access  Private
const createPreorder = async (req, res) => {
  try {
    const { quantity, deliveryDate } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!product.preorderEnabled) {
      return res.status(400).json({ success: false, message: 'Preorders not enabled for this product' });
    }

    if (new Date() > product.preorderDeadline) {
      return res.status(400).json({ success: false, message: 'Preorder deadline has passed' });
    }

    const preorder = await Preorder.create({
      product: product._id,
      user: req.user._id,
      quantity,
      deliveryDate,
      status: 'pending',
      totalAmount: product.preorderPrice * quantity,
      depositAmount: product.preorderDeposit * quantity
    });

    res.status(201).json({
      success: true,
      data: preorder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel preorder
// @route   DELETE /api/products/:id/preorders/:preorderId
// @access  Private
const cancelPreorder = async (req, res) => {
  try {
    const preorder = await Preorder.findOne({
      _id: req.params.preorderId,
      product: req.params.id,
      user: req.user._id
    });

    if (!preorder) {
      return res.status(404).json({ success: false, message: 'Preorder not found' });
    }

    if (preorder.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Cannot cancel preorder in current status' });
    }

    preorder.status = 'cancelled';
    await preorder.save();

    res.json({
      success: true,
      data: preorder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get product preorders
// @route   GET /api/products/:id/preorders
// @access  Private/Farmer
const getPreorders = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const preorders = await Preorder.find({ product: product._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: preorders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update preorder status
// @route   PUT /api/products/:id/preorders/:preorderId/status
// @access  Private/Farmer
const updatePreorderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const preorder = await Preorder.findById(req.params.preorderId);
    if (!preorder) {
      return res.status(404).json({ success: false, message: 'Preorder not found' });
    }

    preorder.status = status;
    await preorder.save();

    res.json({
      success: true,
      data: preorder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name')
      .select('reviews');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      data: product.reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Report review
// @route   POST /api/products/:id/reviews/:reviewId/report
// @access  Private
const reportReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.reported = true;
    await product.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Vote review as helpful
// @route   POST /api/products/:id/reviews/:reviewId/vote
// @access  Private
const voteHelpful = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.helpfulVotes += 1;
    await product.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .populate('farmer', 'name farmName')
      .sort({ rating: -1 })
      .limit(10);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, isOrganic } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) searchQuery.category = category;
    if (isOrganic) searchQuery.isOrganic = isOrganic;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = minPrice;
      if (maxPrice) searchQuery.price.$lte = maxPrice;
    }

    const products = await Product.find(searchQuery)
      .populate('farmer', 'name farmName')
      .sort({ rating: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get product analytics
// @route   GET /api/products/:id/analytics
// @access  Private/Farmer
const getProductAnalytics = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get preorder statistics
    const preorders = await Preorder.find({ product: product._id });
    const preorderStats = {
      total: preorders.length,
      pending: preorders.filter(p => p.status === 'pending').length,
      fulfilled: preorders.filter(p => p.status === 'fulfilled').length,
      cancelled: preorders.filter(p => p.status === 'cancelled').length,
      totalRevenue: preorders.reduce((sum, p) => sum + p.totalAmount, 0)
    };

    // Get review statistics
    const reviewStats = {
      total: product.numReviews,
      averageRating: product.rating,
      ratingDistribution: {
        1: product.reviews.filter(r => r.rating === 1).length,
        2: product.reviews.filter(r => r.rating === 2).length,
        3: product.reviews.filter(r => r.rating === 3).length,
        4: product.reviews.filter(r => r.rating === 4).length,
        5: product.reviews.filter(r => r.rating === 5).length
      }
    };

    res.json({
      success: true,
      data: {
        preorderStats,
        reviewStats,
        stockStats: {
          total: product.stock,
          reserved: product.reservedStock,
          available: product.availableStock
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getFarmerProducts,
  reserveStock,
  releaseStock,
  createPreorder,
  cancelPreorder,
  getPreorders,
  updatePreorderStatus,
  getProductReviews,
  reportReview,
  voteHelpful,
  getFeaturedProducts,
  searchProducts,
  getProductAnalytics
}; 