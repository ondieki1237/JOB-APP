const express = require('express');
const router = express.Router();
const { validateSignup, validateLogin } = require('../middlewares/validateMiddleware');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Signup route - validates the input and then calls the signup controller
router.post('/signup', validateSignup, authController.signup);

// Email verification route
router.get('/verify-email', authController.verifyEmail);

// Login route - validates the input and then handles user login
router.post('/login', validateLogin, authController.login);

// Example of a protected route (accessible only with a valid token)
router.get('/profile', authMiddleware, async (req, res) => {
  res.status(200).json({
    message: 'Access to profile granted!',
    user: req.user, // Contains the user info from the middleware
  });
});

module.exports = router;
