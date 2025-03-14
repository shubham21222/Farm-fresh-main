const express = require('express');
const router = express.Router();
const {
  registerUser,
  registerFarmer,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getFarmers,
  verifyFarmer,
  deleteUser,
  sendVerificationEmail,
  verifyEmail,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/farmer/register', registerFarmer);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Email verification routes
router.post('/send-verification', protect, sendVerificationEmail);
router.post('/verify-email', verifyEmail);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/farmers', protect, admin, getFarmers);
router.put('/farmers/:id/verify', protect, admin, verifyFarmer);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router; 