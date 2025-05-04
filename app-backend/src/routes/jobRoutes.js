// routes/jobRoutes.js
const express = require('express');
const jobController = require('../controllers/ManageJobPostingController');
const { csrfProtection } = require('../middleware/csrfMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Apply CSRF protection to all routes that modify data
// Apply rate limiting to prevent brute force attacks

// Public routes
// GET /api/jobs/:jobId - Get details of a specific job posting
router.get('/jobs/:jobId', rateLimiter.standard, jobController.getJobDetails);

// Protected routes - require authentication
// POST /api/jobs - Create a new job posting
router.post(
  '/jobs', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('recruiter', 'admin'),
  csrfProtection,
  rateLimiter.medium,
  jobController.validateJobInput,
  jobController.createJob
);

// GET /api/recruiter/job-postings - Get postings for the logged-in recruiter
router.get(
  '/recruiter/job-postings', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('recruiter', 'admin'),
  rateLimiter.standard,
  jobController.getRecruiterJobs
);

// PUT /api/recruiter/job-postings/:jobId - Update a specific job posting 
router.put(
  '/recruiter/job-postings/:jobId', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('recruiter', 'admin'),
  csrfProtection,
  rateLimiter.medium,
  jobController.validateJobInput,
  jobController.updateJob
);

// DELETE /api/recruiter/job-postings/:jobId/close - Close a specific job posting
router.delete(
  '/recruiter/job-postings/:jobId/close', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('recruiter', 'admin'),
  csrfProtection,
  rateLimiter.medium,
  jobController.closeJob
);

// POST /api/jobs/:jobId/apply - Apply for a job
router.post(
  '/jobs/:jobId/apply', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('job_seeker'),
  csrfProtection,
  rateLimiter.medium,
  jobController.applyForJob
);

module.exports = router;