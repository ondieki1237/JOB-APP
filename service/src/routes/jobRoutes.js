const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const { Job } = require('../models');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', jobController.getJobById);

// Protected routes
router.use(authMiddleware); // Apply auth middleware to all routes below

// The full path will be /api/jobs/create
router.post('/create', jobController.createJob);
router.post('/:jobId/apply', jobController.applyToJob);
router.post('/select-provider', jobController.selectProvider);
router.get('/my-posted-jobs', jobController.getMyPostedJobs);

module.exports = router;