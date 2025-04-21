const express = require('express');
const passport = require('passport');
const router = express.Router();
const { attachUserToResponse } = require('../middleware/auth');

// Attach authentication info to all auth responses
router.use(attachUserToResponse);

// Auth status route - Check if user is authenticated
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    // Return sanitized user object without sensitive data
    const { password_hash, ...sanitizedUser } = req.user;
    return res.success({
      user: sanitizedUser
    }, 'User is authenticated');
  }
  return res.success({ 
    isAuthenticated: false 
  }, 'User is not authenticated');
});

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.CLIENT_FAILURE_REDIRECT || '/login' 
  }),
  (req, res) => {
    // For API response when used by mobile apps or SPA that expect JSON
    if (req.headers.accept === 'application/json') {
      const { password_hash, ...sanitizedUser } = req.user;
      return res.success({ 
        user: sanitizedUser
      }, 'Authentication successful');
    }
    
    // Regular browser redirect for web applications
    res.redirect(process.env.CLIENT_SUCCESS_REDIRECT || '/');
  }
);

// Logout route - Compatible with both fetch API and regular browser requests
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    
    // For API response (fetch/axios from React)
    if (req.headers.accept === 'application/json') {
      return res.success(
        null, 
        'Logged out successfully'
      );
    }
    
    // Regular browser redirect
    res.redirect(process.env.CLIENT_LOGOUT_REDIRECT || '/');
  });
});

// Session refresh route - Useful for SPA to easily refresh session info
router.get('/refresh', (req, res) => {
  if (req.isAuthenticated()) {
    const { password_hash, ...sanitizedUser } = req.user;
    return res.success({
      user: sanitizedUser
    }, 'Session is valid');
  }
  return res.unauthorized('Session expired or invalid');
});

module.exports = router; 