const { body, param, validationResult } = require('express-validator');

// Common validation constants
const VALID_ROLES = ['job_seeker', 'employer', 'admin']; // Add roles as needed

// Signup validation
exports.validateSignup = [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(VALID_ROLES).withMessage('Invalid role. Allowed roles: ' + VALID_ROLES.join(', ')),
  body('phoneNumber')
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  validate,
];

// Login validation
exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Profile update validation
exports.validateProfileUpdate = [
  body('profile.name').optional().isString().withMessage('Name must be a string'),
  body('profile.age').optional().isInt({ min: 18, max: 120 }).withMessage('Age must be between 18 and 120'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('phoneNumber')
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/).withMessage('Please provide a valid phone number'),
  body('preferredCurrency')
    .optional()
    .isIn(['KES', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency selected'),
  validate,
];

// Job creation validation
exports.validateJobCreation = [
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('skillsRequired').isArray({ min: 1 }).withMessage('At least one skill is required'),
  validate,
];

// Job application validation
exports.validateJobApplication = [
  param('jobId').isMongoId().withMessage('The provided job ID is not valid'),
  body('pitch').notEmpty().withMessage('Pitch is required'),
  body('rate').isNumeric().withMessage('Rate must be a valid number'),
  validate,
];

// Job selection validation
exports.validateJobSelection = [
  body('jobId').isMongoId().withMessage('The provided job ID is not valid'),
  body('providerId').isMongoId().withMessage('The provider ID is not valid'),
  validate,
];

// Review validation
exports.validateReview = [
  body('jobId').isMongoId().withMessage('The provided job ID is not valid'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString().withMessage('Comment must be a valid string'),
  validate,
];

// Common validation handler
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}