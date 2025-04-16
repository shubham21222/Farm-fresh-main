const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get reported reviews
// @route   GET /api/reviews/reported
// @access  Private/Admin
const getReportedReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.reported': true })
      .populate('reviews.user', 'name email')
      .select('name reviews');

    const reportedReviews = products.reduce((acc, product) => {
      const reviews = product.reviews
        .filter(review => review.reported)
        .map(review => ({
          ...review.toObject(),
          productName: product.name,
          productId: product._id
        }));
      return [...acc, ...reviews];
    }, []);

    res.json({
      success: true,
      data: reportedReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Moderate review
// @route   PUT /api/reviews/:productId/reviews/:reviewId/moderate
// @access  Private/Admin
const moderateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { action, reason } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    switch (action) {
      case 'approve':
        review.reported = false;
        review.moderated = true;
        review.moderationStatus = 'approved';
        break;
      case 'reject':
        review.moderated = true;
        review.moderationStatus = 'rejected';
        review.moderationReason = reason;
        break;
      case 'delete':
        review.remove();
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    await product.save();

    // Update product rating
    product.updateRating();
    await product.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/statistics
// @access  Private/Admin
const getReviewStatistics = async (req, res) => {
  try {
    const products = await Product.find()
      .select('reviews rating numReviews');

    const statistics = {
      totalReviews: products.reduce((sum, product) => sum + product.numReviews, 0),
      averageRating: products.reduce((sum, product) => sum + product.rating, 0) / products.length,
      reportedReviews: products.reduce((sum, product) => 
        sum + product.reviews.filter(r => r.reported).length, 0),
      ratingDistribution: {
        1: products.reduce((sum, product) => 
          sum + product.reviews.filter(r => r.rating === 1).length, 0),
        2: products.reduce((sum, product) => 
          sum + product.reviews.filter(r => r.rating === 2).length, 0),
        3: products.reduce((sum, product) => 
          sum + product.reviews.filter(r => r.rating === 3).length, 0),
        4: products.reduce((sum, product) => 
          sum + product.reviews.filter(r => r.rating === 4).length, 0),
        5: products.reduce((sum, product) => 
          sum + product.reviews.filter(r => r.rating === 5).length, 0)
      }
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user review history
// @route   GET /api/reviews/user/:userId
// @access  Private/Admin
const getUserReviewHistory = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.user': req.params.userId })
      .select('name reviews')
      .populate('reviews.user', 'name email');

    const userReviews = products.reduce((acc, product) => {
      const reviews = product.reviews
        .filter(review => review.user._id.toString() === req.params.userId)
        .map(review => ({
          ...review.toObject(),
          productName: product.name,
          productId: product._id
        }));
      return [...acc, ...reviews];
    }, []);

    res.json({
      success: true,
      data: userReviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get product review statistics
// @route   GET /api/reviews/product/:productId/statistics
// @access  Private/Admin
const getProductReviewStatistics = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .select('reviews rating numReviews');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const statistics = {
      totalReviews: product.numReviews,
      averageRating: product.rating,
      reportedReviews: product.reviews.filter(r => r.reported).length,
      ratingDistribution: {
        1: product.reviews.filter(r => r.rating === 1).length,
        2: product.reviews.filter(r => r.rating === 2).length,
        3: product.reviews.filter(r => r.rating === 3).length,
        4: product.reviews.filter(r => r.rating === 4).length,
        5: product.reviews.filter(r => r.rating === 5).length
      },
      helpfulReviews: product.reviews.filter(r => r.helpfulVotes > 0).length,
      recentReviews: product.reviews
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getReportedReviews,
  moderateReview,
  getReviewStatistics,
  getUserReviewHistory,
  getProductReviewStatistics
}; 