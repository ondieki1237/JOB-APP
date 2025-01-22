const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // All routes here require authentication

router.get('/', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);

module.exports = router;