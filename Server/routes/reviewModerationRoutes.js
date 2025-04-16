const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getReportedReviews,
  moderateReview,
  getReviewStatistics,
  getUserReviewHistory,
  getProductReviewStatistics
} = require('../controllers/reviewModerationController');

// Protect all routes
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

// Get reported reviews
router.get('/reported', getReportedReviews);

// Moderate review
router.put('/:productId/reviews/:reviewId/moderate', moderateReview);

// Get review statistics
router.get('/statistics', getReviewStatistics);

// Get user review history
router.get('/user/:userId', getUserReviewHistory);

// Get product review statistics
router.get('/product/:productId/statistics', getProductReviewStatistics);

module.exports = router; 