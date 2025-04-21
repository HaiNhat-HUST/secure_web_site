const express = require('express');
const passport = require('passport');
const router = express.Router();

// Auth status route - Check if user is authenticated
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  }
  return res.status(200).json({ isAuthenticated: false });
});

// Google OAuth login route
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_SUCCESS_REDIRECT || '/',
    failureRedirect: process.env.CLIENT_FAILURE_REDIRECT || '/login'
  })
);

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect(process.env.CLIENT_LOGOUT_REDIRECT || '/');
  });
});

module.exports = router; 