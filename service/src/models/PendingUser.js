const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  verificationToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }, // Automatically deletes unverified users after 1 hour
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
