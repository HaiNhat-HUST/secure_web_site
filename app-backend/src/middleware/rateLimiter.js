const rateLimit = require('express-rate-limit');

exports.applicationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // limit each user to 10 applications per day
  message: 'Too many applications submitted. Please try again in 24 hours.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.userId || req.ip, // Rate limit by user ID if authenticated, IP otherwise
  skip: (req) => req.user?.role === 'Recruiter' // Skip rate limiting for recruiters
});

exports.uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 file uploads per hour
  message: 'Too many file uploads. Please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false
});