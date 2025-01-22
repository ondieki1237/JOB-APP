const jwt = require('jsonwebtoken');

// Read the secret key and token expiration from the environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is defined in your .env file
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; // Default to 1 day if not provided

const generateToken = (user) => {
  // Define the payload with minimal user information
  const payload = {
    id: user._id,         // User ID
    email: user.email,    // User email
    role: user.role || 'user', // Default role is 'user'
  };

  // Generate a signed JWT
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return token;
};

module.exports = generateToken;
