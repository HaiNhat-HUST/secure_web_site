const rateLimit = require('express-rate-limit');

// For resume uploads during job applications
exports.uploadLimiter = rateLimit({
  windowMs: 12 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 uploads per 12 hours
  message: {
    status: 429,
    message: 'You have exceeded the file upload limit. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.user_id || req.ip,
  skipFailedRequests: true // Don't count failed uploads against limit
});


// Application submission limiter (includes resume upload)
exports.applicationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 applications per day
  message: {
    status: 429,
    message: 'Daily application limit reached. Please try again tomorrow.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.user_id
});