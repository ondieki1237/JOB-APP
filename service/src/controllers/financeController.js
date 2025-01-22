const Finance = require('../models/Finance');

exports.getFinanceDetails = async (req, res) => {
  try {
    let finance = await Finance.findOne({ userId: req.user.id });
    
    if (!finance) {
      // Create new finance record if it doesn't exist
      finance = await Finance.create({
        userId: req.user.id,
        balance: 0,
        totalEarnings: 0,
        pendingPayments: 0,
        transactions: []
      });
    }

    res.json({ finance });
  } catch (error) {
    console.error('Error fetching finance details:', error);
    res.status(400).json({
      message: 'Failed to fetch finance details',
      error: error.message
    });
  }
};

exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, description, category } = req.body;

    const finance = await Finance.findOne({ userId: req.user.id });
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }

    // Add transaction
    finance.transactions.push({
      type,
      amount,
      description,
      category
    });

    // Update balances
    if (type === 'income') {
      finance.balance += amount;
      finance.totalEarnings += amount;
    } else if (type === 'expense') {
      finance.balance -= amount;
    }

    await finance.save();
    res.json({ finance });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to add transaction',
      error: error.message
    });
  }
};

exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, details, isDefault } = req.body;

    const finance = await Finance.findOne({ userId: req.user.id });
    if (!finance) {
      return res.status(404).json({ message: 'Finance record not found' });
    }

    if (isDefault) {
      // Remove default from other payment methods
      finance.paymentMethods.forEach(method => {
        method.isDefault = false;
      });
    }

    finance.paymentMethods.push({
      type,
      details,
      isDefault
    });

    await finance.save();
    res.json({ finance });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to add payment method',
      error: error.message
    });
  }
}; 