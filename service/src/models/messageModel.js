const mongoose = require('mongoose');

if (mongoose.models.Message) {
  module.exports = mongoose.models.Message;
} else {
  const messageSchema = new mongoose.Schema({
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text'
    },
    fileUrl: String,
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Index for faster queries
  messageSchema.index({ jobId: 1, sender: 1, receiver: 1, createdAt: -1 });

  module.exports = mongoose.model('Message', messageSchema);
} 