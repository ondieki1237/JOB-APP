const mongoose = require('mongoose');

// Check if the model already exists before defining it
if (mongoose.models.Job) {
  module.exports = mongoose.models.Job;
} else {
  const jobSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contract', 'Temporary']
    },
    budget: {
      min: {
        type: Number,
        required: true
      },
      max: {
        type: Number,
        required: true
      }
    },
    locationName: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Open', 'Closed', 'In Progress'],
      default: 'Open'
    },
    requirements: [{
      type: String
    }],
    responsibilities: [{
      type: String
    }],
    duration: {
      type: String,
      required: true
    },
    skills: [{
      type: String
    }],
    applicants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
      },
      applicationDate: {
        type: Date,
        default: Date.now
      }
    }],
    selectedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }, {
    timestamps: true
  });

  // Indexes
  jobSchema.index({ location: '2dsphere' });
  jobSchema.index({
    title: 'text',
    description: 'text',
    category: 'text',
    skills: 'text'
  });

  const Job = mongoose.model('Job', jobSchema);
  module.exports = Job;
} 