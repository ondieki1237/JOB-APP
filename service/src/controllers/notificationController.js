const Notification = require('../models/Notification');

/**
 * Fetch Notifications for the Logged-In User
 */
exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, isRead, startDate, endDate, type } = req.query;

    // Build the filter object
    const filter = { userId: req.user.userId };
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Query the database
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 }) // Most recent notifications first
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalNotifications = await Notification.countDocuments(filter);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        totalNotifications,
        totalPages: Math.ceil(totalNotifications / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
  }
};

/**
 * Mark a Single Notification as Read
 */
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Validate the notification ID
    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: req.user.userId }, // Ensure the user owns the notification
      { isRead: true },
      { new: true, runValidators: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Real-time update via Socket.IO
    req.app.get('io').emit(`notification-updated-${req.user.userId}`, updatedNotification);

    res.json({ success: true, message: 'Notification marked as read', data: updatedNotification });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
  }
};

/**
 * Delete a Notification
 */
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Validate the notification ID
    if (!notificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid notification ID' });
    }

    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      userId: req.user.userId, // Ensure the user owns the notification
    });

    if (!deletedNotification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    // Real-time update via Socket.IO
    req.app.get('io').emit(`notification-deleted-${req.user.userId}`, notificationId);

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to delete notification', error: error.message });
  }
};

/**
 * Mark All Notifications as Read
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.userId, isRead: false },
      { isRead: true }
    );

    // Real-time update via Socket.IO
    req.app.get('io').emit(`notifications-read-${req.user.userId}`, { success: true });

    res.json({
      success: true,
      message: `${result.nModified} notifications marked as read`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to mark all notifications as read', error: error.message });
  }
};

/**
 * Create Notification and Emit Real-Time Update
 */
exports.createNotification = async (notificationData, io) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    // Emit real-time notification to the specific user
    io.emit(`new-notification-${notification.userId}`, notification);
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
