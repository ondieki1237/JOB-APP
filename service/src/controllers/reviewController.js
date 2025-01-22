const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const review = new Review({
      ...req.body,
      reviewer: req.user.userId, // Assuming the reviewer is authenticated
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId });
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};