const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // All finance routes require authentication

router.get('/details', financeController.getFinanceDetails);
router.post('/transaction', financeController.addTransaction);
router.post('/payment-method', financeController.addPaymentMethod);

module.exports = router; 