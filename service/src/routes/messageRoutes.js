const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Get messages for a job
router.get('/job/:jobId', messageController.getMessages);

// Send a message
router.post('/send', upload.single('file'), messageController.sendMessage);

// Mark message as read
router.patch('/:messageId/read', messageController.markAsRead);

module.exports = router; 