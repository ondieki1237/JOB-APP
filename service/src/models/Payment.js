const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Payment Schema
const paymentSchema = new Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  payerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The user who made the payment (job seeker)
    required: true,
  },
  payeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The user who is receiving the payment (job poster)
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true, // Phone number of the payer
  },
  transactionReference: {
    type: String, // Unique reference number from M-Pesa
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending', // Default status
  },
  paymentMethod: {
    type: String,
    default: 'M-Pesa', // Payment method used
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  mpesaResponse: {
    type: Object, // This can hold the entire response object from M-Pesa API
  },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
