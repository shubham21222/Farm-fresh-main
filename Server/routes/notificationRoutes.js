const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getUserNotifications,
  markNotificationAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount,
  markAllAsRead,
  getNotificationPreferences,
  updateNotificationPreferences
} = require('../controllers/notificationController');

// All routes are protected
router.use(protect);

// Get user notifications
router.get('/', getUserNotifications);

// Get unread notifications count
router.get('/unread', getUnreadCount);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', markAllAsRead);

// Create notification (admin/farmer only)
router.post('/', authorize('admin', 'farmer'), createNotification);

// Delete notification
router.delete('/:id', deleteNotification);

// Get notification preferences
router.get('/preferences', getNotificationPreferences);

// Update notification preferences
router.put('/preferences', updateNotificationPreferences);

module.exports = router; 