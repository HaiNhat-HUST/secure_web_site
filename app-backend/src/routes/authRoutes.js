const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { authenticateJWT, hasRoleAssigned } = require('../middleware/authMiddleware');
const {loginLimiter} = require('../utils/passwordUtils');
const csrfTokenGenerator = require('../utils/csrfTokenGenerator');
const csrf = require('csurf');

const router = express.Router();



// Authentication
router.post('/register', csrf(), authController.register);
router.post('/login', loginLimiter, csrf(), authController.login);

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


router.get(
  '/login',
  csrfProtection, // Apply CSRF protection here
  (req, res) => {
    // After csrfProtection runs, req.csrfToken() is available
    res.json({ csrfToken: req.csrfToken() });
  }
);

// Register route
router.post(
  '/register',
  csrfProtection, // Apply CSRF protection for validation
  authController.register
);

// Login route
// csrfProtection will now validate the incoming X-CSRF-Token header
router.post(
  '/login',
  csrfProtection, // Apply CSRF protection for validation
  authController.login
);

module.exports = router; 