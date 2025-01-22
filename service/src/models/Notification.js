const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: {
    type: String,
    enum: ['Job Alert', 'Message', 'Payment', 'Review'],
    required: true
  },
  content: { type: String, default: 'No content provided.' },
  relatedId: mongoose.Schema.Types.ObjectId, // Could be jobId, userId, etc.
  isRead: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Real-Time Updates with Socket.IO
notificationSchema.post('save', async function (doc) {
  const io = require('../server').io; // Access Socket.IO instance
  io.emit(`notification-${doc.userId}`, { notification: doc });
});

// Indexes for Query Optimization
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
