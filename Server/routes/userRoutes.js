const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerFarmer,
  loginUser,
  getUsers,
  getFarmers,
  verifyFarmer,
  deleteUser,
  sendVerificationEmail,
  verifyEmail,
  getProfile,
  updateProfile,
  updatePassword,
  updateBillingAddress,
  guestCheckout,
  updateNotificationPreferences,
  getLoyaltyInfo,
  addLoyaltyPoints,
  redeemLoyaltyPoints,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getSubscriptions,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/farmer/register', registerFarmer);
router.post('/login', loginUser);
router.post('/guest-checkout', guestCheckout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/billing-address', protect, updateBillingAddress);

// Notification preferences
router.put('/notifications', protect, updateNotificationPreferences);

// Loyalty program routes
router.get('/loyalty', protect, getLoyaltyInfo);
router.post('/loyalty/add-points', protect, addLoyaltyPoints);
router.post('/loyalty/redeem', protect, redeemLoyaltyPoints);

// Subscription routes
router.post('/subscriptions', protect, createSubscription);
router.put('/subscriptions/:id', protect, updateSubscription);
router.delete('/subscriptions/:id', protect, cancelSubscription);
router.get('/subscriptions', protect, getSubscriptions);

// Payment method routes
router.post('/payment-methods', protect, addPaymentMethod);
router.put('/payment-methods/:id', protect, updatePaymentMethod);
router.delete('/payment-methods/:id', protect, deletePaymentMethod);

// Email verification routes
router.post('/send-verification', protect, sendVerificationEmail);
router.post('/verify-email', verifyEmail);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/farmers', protect, authorize('admin'), getFarmers);
router.put('/farmers/:id/verify', protect, authorize('admin'), verifyFarmer);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 