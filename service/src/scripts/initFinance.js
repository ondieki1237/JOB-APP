const mongoose = require('mongoose');
const Finance = require('../models/Finance');
const User = require('../models/User');
require('dotenv').config();

const initializeFinance = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find();

    // Create finance records for users who don't have one
    for (const user of users) {
      const existingFinance = await Finance.findOne({ userId: user._id });
      
      if (!existingFinance) {
        await Finance.create({
          userId: user._id,
          balance: 0,
          totalEarnings: 0,
          pendingPayments: 0,
          transactions: [{
            type: 'income',
            amount: 0,
            description: 'Account initialized',
            category: 'other',
            date: new Date(),
            status: 'completed'
          }]
        });
        console.log(`Created finance record for user: ${user.email}`);
      }
    }

    console.log('Finance initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing finance:', error);
    process.exit(1);
  }
};

initializeFinance(); 