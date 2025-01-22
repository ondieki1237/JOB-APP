const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

if (mongoose.models.User) {
  module.exports = mongoose.models.User;
} else {
  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['worker', 'employer', 'admin'],
      default: 'worker'
    },
    avatar: {
      type: String,
      default: ''
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    skills: [{
      type: String
    }],
    bio: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    completedJobs: {
      type: Number,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    wallet: {
      balance: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'KES'
      }
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }, {
    timestamps: true
  });

  // Index for location-based queries
  userSchema.index({ location: '2dsphere' });
  userSchema.index({ email: 1 }, { unique: true });

  // Hash password before saving
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Method to compare password
  userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };

  // Method to get public profile (exclude sensitive data)
  userSchema.methods.getPublicProfile = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.verificationToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    return userObject;
  };

  module.exports = mongoose.model('User', userSchema);
} 