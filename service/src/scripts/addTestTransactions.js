const mongoose = require('mongoose');
const Finance = require('../models/Finance');
const User = require('../models/User');
require('dotenv').config();

const addTestTransactions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Find a user first
    const user = await User.findOne();
    if (!user) {
      console.log('No users found. Please create a user first.');
      process.exit(1);
    }

    // Find or create finance record for this user
    let finance = await Finance.findOne({ userId: user._id });
    if (!finance) {
      finance = await Finance.create({
        userId: user._id,
        balance: 0,
        totalEarnings: 0,
        pendingPayments: 0,
        transactions: []
      });
      console.log('Created new finance record for user:', user.email);
    }

    // Add test transactions
    finance.transactions.push(
      {
        type: 'income',
        amount: 1000,
        description: 'Job payment',
        category: 'job_payment',
        date: new Date(),
        status: 'completed'
      },
      {
        type: 'expense',
        amount: 50,
        description: 'Service fee',
        category: 'service_fee',
        date: new Date(),
        status: 'completed'
      }
    );

    // Update balances
    finance.balance += 950;
    finance.totalEarnings += 1000;
    await finance.save();

    console.log('Added test transactions for user:', user.email);
    console.log('New balance:', finance.balance);
    console.log('Total earnings:', finance.totalEarnings);
    process.exit(0);
  } catch (error) {
    console.error('Error adding test transactions:', error);
    process.exit(1);
  }
};

addTestTransactions(); 