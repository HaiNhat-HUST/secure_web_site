// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateJWT } = require('../middleware/authMiddleware'); // Assuming you have this

// --- Personal Dashboard Routes ---
// All routes below should be protected by authentication

// Personal summary statistics (total applications, by status)
// Example: GET /api/dashboard/my-summary-stats
router.get(
  '/my-summary-stats',
  authenticateJWT,
  dashboardController.getMySummaryStats
);

// Recent applications relevant to the logged-in user
// Example: GET /api/dashboard/my-recent-applications?limit=5
router.get(
  '/my-recent-applications',
  authenticateJWT,
  dashboardController.getMyRecentApplications
);

// Personal application submission/reception trends over time
// Example: GET /api/dashboard/my-application-trends?period=week
router.get(
  '/my-application-trends',
  authenticateJWT,
  dashboardController.getMyApplicationTrends
);

// --- Recruiter Specific Routes ---

// Statistics for a specific job posting owned by the recruiter
// Example: GET /api/dashboard/my-job-stats/456
router.get(
  '/my-job-stats/:jobPostingId',
  authenticateJWT, // General auth
  // Role check is handled within the controller for this specific logic
  dashboardController.getRecruiterJobStats
);

// Top N most applied-to job postings for the logged-in recruiter
// Example: GET /api/dashboard/my-top-jobs?limit=3
router.get(
  '/my-top-jobs',
  authenticateJWT,
  // Role check is handled within the controller
  dashboardController.getRecruiterTopJobs
);

module.exports = router;