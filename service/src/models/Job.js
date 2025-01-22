const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  locationName: { type: String },
  budget: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  duration: {
    type: String,
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly', 'Fixed'],
    default: 'Fixed'
  },
  companyDetails: {
    name: { type: String, required: true },
    description: String,
    logo: String
  },
  requirements: {
    experience: String,
    education: String,
    certifications: [String]
  },
  applicationDetails: {
    deadline: Date,
    howToApply: String,
    applicationLink: String
  },
  isRemote: { type: Boolean, default: false },
  numberOfOpenings: { type: Number, default: 1 },
  isConfidential: { type: Boolean, default: false },
  contactInfo: {
    email: String,
    phone: String
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open'
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicationMessage: String,
    rate: Number,
    status: {
      type: String,
      enum: ['Pending', 'Shortlisted', 'Rejected'],
      default: 'Pending'
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  selectedProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Create indexes for better query performance
jobSchema.index({ location: '2dsphere' });
jobSchema.index({ status: 1 });
jobSchema.index({ 'budget.min': 1, 'budget.max': 1 });
jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
