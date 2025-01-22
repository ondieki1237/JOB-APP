const mongoose = require('mongoose');

if (mongoose.models.Message) {
  module.exports = mongoose.models.Message;
} else {
  const messageSchema = new mongoose.Schema({
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text'
    },
    fileUrl: String,
    read: {
      type: Boolean,
      default: false,
      index: true
    }
  }, {
    timestamps: true
  });

  // Compound index for faster queries
  messageSchema.index({ jobId: 1, sender: 1, receiver: 1, createdAt: -1 });

  module.exports = mongoose.model('Message', messageSchema);
} 