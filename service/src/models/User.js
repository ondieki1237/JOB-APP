const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['job_seeker', 'employer'],
    required: [true, 'Role is required']
  },
  verified: {
    type: Boolean,
    default: false // New accounts are not verified by default
  },
  verificationToken: {
    type: String // Used for email verification
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  profile: {
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    skills: [{
      type: String,
      trim: true
    }],
    avatar: {
      type: String,
      default: '',
    },
    preferredCurrency: {
      type: String,
      default: 'KES',
      enum: ['KES', 'USD', 'EUR', 'GBP']
    }
  }
}, { timestamps: true });

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified

  // Check if the password is already hashed
  if (this.password.startsWith('$2b$')) {
    return next(); // Password is already hashed
  }

  try {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next();
  } catch (err) {
    next(err);
  }
});


// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // Exclude password from the output
  return obj;
};

module.exports = mongoose.model('User', userSchema);
