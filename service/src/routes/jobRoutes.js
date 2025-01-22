const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const { Job } = require('../models');

// Public routes
router.get('/', jobController.getJobs);
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email')
      .select('-__v');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected routes
router.post('/create', authMiddleware, jobController.createJob);
router.post('/:jobId/apply', authMiddleware, jobController.applyToJob);
router.post('/select-provider', authMiddleware, jobController.selectProvider);

module.exports = router;