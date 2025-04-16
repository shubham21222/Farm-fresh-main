const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { sendSMS } = require('../config/sms');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getUserNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user.id })
    .sort('-createdAt')
    .limit(50);

  res.status(200).json({
    success: true,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Mark notification as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check if user is authorized
  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this notification', 403));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private
exports.createNotification = asyncHandler(async (req, res, next) => {
  const { userId, title, message, type, sendEmail, sendSMS } = req.body;

  // Create notification
  const notification = await Notification.create({
    user: userId,
    title,
    message,
    type,
    isRead: false
  });

  // Send email if requested
  if (sendEmail) {
    const user = await User.findById(userId);
    if (user && user.email) {
      // TODO: Implement email sending logic
      console.log(`Email notification sent to ${user.email}`);
    }
  }

  // Send SMS if requested
  if (sendSMS) {
    try {
      const user = await User.findById(userId);
      if (user && user.phone) {
        const smsResult = await sendSMS(user.phone, message);
        if (!smsResult.success) {
          console.error('Failed to send SMS:', smsResult.error);
        }
      }
    } catch (error) {
      console.error('SMS sending error:', error);
    }
  }

  res.status(201).json({
    success: true,
    data: notification
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorResponse('Notification not found', 404));
  }

  // Check if user is authorized
  if (notification.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this notification', 403));
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread/count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    user: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    data: { count }
  });
});

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
const getNotificationPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update notification preferences
// @route   PATCH /api/notifications/preferences
// @access  Private
exports.updatePreferences = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  user.notificationPreferences = {
    ...user.notificationPreferences,
    ...req.body
  };

  await user.save();

  res.status(200).json({
    success: true,
    data: user.notificationPreferences
  });
});

module.exports = {
  getUserNotifications,
  markAsRead,
  createNotification,
  deleteNotification,
  getUnreadCount,
  markAllAsRead,
  getNotificationPreferences,
  updatePreferences
}; 