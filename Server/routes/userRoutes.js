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
  updateBillingAddress
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/farmer/register', registerFarmer);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/billing-address', protect, updateBillingAddress);

// Email verification routes
router.post('/send-verification', protect, sendVerificationEmail);
router.post('/verify-email', verifyEmail);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/farmers', protect, authorize('admin'), getFarmers);
router.put('/farmers/:id/verify', protect, authorize('admin'), verifyFarmer);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router; 