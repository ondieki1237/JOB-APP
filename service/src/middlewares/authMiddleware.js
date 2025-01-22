const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers);
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No token found');
      return res.status(401).json({ 
        message: 'Authentication required' 
      });
    }

    console.log('Token found:', token);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    console.log('Found user:', user);

    if (!user) {
      console.log('No user found for token');
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    req.user = { 
      _id: user._id,
      role: user.role 
    };

    console.log('User attached to request:', req.user);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};
