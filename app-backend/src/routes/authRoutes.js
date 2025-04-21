const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_FAILURE_REDIRECT,
    session: true
  }),
  authController.googleCallback
);

// Logout route
router.get('/logout', authController.logout);

// Get current user 
router.get('/me', authController.getCurrentUser);

module.exports = router; 