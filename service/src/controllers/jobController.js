const Job = require('../models/Job');

// Create a Job
exports.createJob = async (req, res) => {
  try {
    console.log('Received job creation request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    const job = new Job({
      ...req.body,
      postedBy: req.user.id
    });

    console.log('Created job document:', job);

    await job.save();
    console.log('Job saved successfully');

    await job.populate('postedBy', 'username email');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(400).json({
      message: 'Failed to create job',
      error: error.message,
      stack: error.stack
    });
  }
};

// Get Jobs with Filtering and Pagination
exports.getJobs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      minBudget,
      maxBudget,
      duration,
      location,
      skills,
      status,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      // Handle array of statuses
      filter.status = Array.isArray(status) ? { $in: status } : status;
    }

    if (minBudget) filter['budget.min'] = { $gte: Number(minBudget) };
    if (maxBudget) filter['budget.max'] = { $lte: Number(maxBudget) };
    if (duration) filter.duration = duration;
    if (skills) filter.skillsRequired = { $in: skills.split(',') };

    const jobs = await Job.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('postedBy', 'username');

    const totalJobs = await Job.countDocuments(filter);

    res.json({
      jobs,
      pagination: {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(400).json({ 
      message: 'Failed to fetch jobs', 
      error: error.message 
    });
  }
};

// Apply to a Job
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { applicationMessage, rate } = req.body;

    const job = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: {
          applicants: { userId: req.user.userId, applicationMessage, rate },
        },
      },
      { new: true, runValidators: true }
    );

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ message: 'Application submitted successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to apply to job', error: error.message });
  }
};

// Select a Job Provider
exports.selectProvider = async (req, res) => {
  try {
    const { jobId, providerId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.postedBy.toString() !== req.user.userId)
      return res.status(403).json({ message: 'You are not authorized to select a provider for this job' });

    job.selectedProvider = providerId;
    await job.save();

    res.json({ message: 'Provider selected successfully', job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to select provider', error: error.message });
  }
};

// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'username email')
      .populate('applicants.userId', 'username email');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch job details', error: error.message });
  }
};
