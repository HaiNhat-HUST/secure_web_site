const express = require('express');
const postsRoutes = require('./postsRoutes');
const { ensureAuth, ensureRole, attachUserToResponse } = require('../middleware/auth');

// Conditionally import admin and recruiter routes to avoid errors if files don't exist
let adminRoutes, recruiterRoutes;
try {
  adminRoutes = require('./adminRoutes');
  recruiterRoutes = require('./recruiterRoutes');
} catch (error) {
  // Create empty router if the files don't exist
  adminRoutes = express.Router();
  adminRoutes.get('*', (req, res) => res.status(501).json({ message: 'Admin routes not implemented yet' }));
  
  recruiterRoutes = express.Router();
  recruiterRoutes.get('*', (req, res) => res.status(501).json({ message: 'Recruiter routes not implemented yet' }));
}

const router = express.Router();

// Attach authentication info to all API responses
router.use(attachUserToResponse);

// Protected routes - require authentication
router.use('/posts', ensureAuth, postsRoutes);

// Routes that require specific roles
router.use('/admin', ensureRole('Administrator'), adminRoutes);
router.use('/recruiter', ensureRole(['Recruiter', 'Administrator']), recruiterRoutes);

// Home route for API - Public
router.get('/', (req, res) => {
  res.success(
    { 
      name: 'Job Portal API',
      version: '1.0.0',
      documentation: '/api/docs' 
    }, 
    'Welcome to the API'
  );
});

// User profile route - Protected
router.get('/profile', ensureAuth, (req, res) => {
  // Filter out sensitive data
  const { password_hash, ...safeUserData } = req.user;
  res.success({ user: safeUserData });
});

module.exports = router;
