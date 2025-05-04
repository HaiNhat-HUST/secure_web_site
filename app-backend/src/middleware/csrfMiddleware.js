// middleware/csrfMiddleware.js
const csrf = require('csurf');
const logger = require('../utils/logger');

// Configure CSRF protection
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict', // Restrict to same site to prevent CSRF
  }
});

// Error handler for CSRF token validation
const handleCSRFError = (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    logger.warn('CSRF attack detected', { 
      ip: req.ip,
      path: req.path,
      method: req.method,
      headers: req.headers
    });
    return res.status(403).json({ error: 'Invalid or missing CSRF token' });
  }
  next(err);
};

module.exports = { 
  csrfProtection,
  handleCSRFError
};