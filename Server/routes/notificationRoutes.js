const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');

// Public routes
router.get('/', protect, getUserNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.post('/', protect, authorize('admin', 'farmer'), createNotification);
router.patch('/:id/read', protect, markNotificationAsRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router; 