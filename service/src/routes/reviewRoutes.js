const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateReview } = require('../middlewares/validateMiddleware');

router.use(authMiddleware); // All routes here require authentication

router.post('/add', validateReview, reviewController.addReview);
router.get('/user/:userId', reviewController.getReviewsForUser);

module.exports = router;