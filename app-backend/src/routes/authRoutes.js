const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateJWT, hasRoleAssigned } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Role selection
router.post('/select-role', authenticateJWT, authController.selectRole);

// Google OAuth routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Handle google OAuth redirect
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.CLIENT_FAILURE_REDIRECT,
    session: true
  }),
  authController.googleCallback
);

// Logout route
router.get('/logout', authController.logout);
// Get current user (using JWT token)
router.get('/user', authenticateJWT, authController.getCurrentUser);

// Get current user (using session - backward compatibility)
router.get('/me', authController.getCurrentUser);

module.exports = router; 