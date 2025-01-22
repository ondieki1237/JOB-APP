const express = require('express');
const axios = require('axios');
const router = express.Router();

// M-Pesa Config
const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortCode = process.env.MPESA_SHORT_CODE;
const passkey = process.env.MPESA_PASSKEY;

// Generate Access Token
const getMpesaToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` },
  });
  return response.data.access_token;
};

// Initiate Payment (STK Push)
router.post('/mpesa/pay', async (req, res) => {
  try {
    const { amount, phone } = req.body;
    const token = await getMpesaToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
      AccountReference: 'JobApp',
      TransactionDesc: 'Payment for Job Service',
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Callback Route
router.post('/mpesa/callback', (req, res) => {
  console.log('M-Pesa Callback:', req.body);
  res.status(200).send('Callback received');
});

module.exports = router;
