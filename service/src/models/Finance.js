const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['job_payment', 'withdrawal', 'service_fee', 'bonus', 'other'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  }
});

const financeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  pendingPayments: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['bank', 'mobile_money', 'paypal'],
      required: true
    },
    details: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      phoneNumber: String,
      email: String
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Create single index for userId (removed duplicate)
financeSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Finance', financeSchema); 