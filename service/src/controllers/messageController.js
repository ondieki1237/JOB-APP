const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Job = require('../models/jobModel');
const { uploadToCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

exports.sendMessage = async (req, res) => {
  try {
    const { jobId, receiverId, content, type } = req.body;
    const senderId = req.user._id;

    // Get job to verify receiver
    const job = await Job.findById(jobId).populate('employer');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Use job's employer ID if receiverId is not provided or invalid
    const actualReceiverId = mongoose.Types.ObjectId.isValid(receiverId) 
      ? receiverId 
      : job.employer._id;

    let messageData = {
      jobId,
      sender: senderId,
      receiver: actualReceiverId,
      content: content.trim(),
      type
    };

    // Handle file upload if message type is image
    if (type === 'image' && req.file) {
      const result = await uploadToCloudinary(req.file.path);
      messageData.fileUrl = result.secure_url;
    }

    const message = await Message.create(messageData);

    // Populate sender and receiver details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: populatedMessage
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    // Get all messages for this job where user is either sender or receiver
    const messages = await Message.find({
      jobId,
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ data: messages });

  } catch (error) {
    console.error('Error in getMessages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findOneAndUpdate(
      { 
        _id: messageId,
        receiver: userId,
        read: false
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found or already read' });
    }

    res.json({ message: 'Message marked as read' });

  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ message: 'Error marking message as read' });
  }
}; 