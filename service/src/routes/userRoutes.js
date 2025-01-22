const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateProfileUpdate } = require('../middlewares/validateMiddleware');

// Middleware for authenticating all routes in this file
router.use(authMiddleware);

// Route to update user profile
router.put('/profile', validateProfileUpdate, userController.updateProfile);

// Route to get a user's profile by userId
router.get('/profile/:userId', userController.getUserProfile);

module.exports = router;
