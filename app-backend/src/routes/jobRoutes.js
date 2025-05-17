const express = require('express');
const jobController = require('../controllers/ManageJobPostingController');
const newsfeedController = require('../controllers/newsfeedController');
const applyController = require('../controllers/applyController'); 
const { authenticateJWT, hasRole } = require('../middleware/authMiddleware');
const { applicationLimiter, uploadLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

// PUBLIC: Anyone can see job listings
router.get('/jobs', newsfeedController.getAllJobs);

// PUBLIC: Anyone can view job detail
router.get('/jobs/:jobId', newsfeedController.getJobById);

// PROTECTED: Only authenticated JobSeekers can apply
router.post(
  '/jobs/apply/:jobId',
  authenticateJWT,
  hasRole(['JobSeeker']),
  applicationLimiter, // application rate limiting
  uploadLimiter,     // upload rate limiting
  applyController.uploadResume,
  applyController.applyForJob
);

// PROTECTED: Only authenticated Recruiters can perform job management
router.post(
  '/recruiter/job-postings',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.createJob
);

router.get(
  '/recruiter/job-postings',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.getRecruiterJobs
);

router.put(
  '/recruiter/job-postings/:jobId',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.updateJob
);
router.post(
  '/recruiter/job-postings/:jobId/close',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.closeJob
);
router.delete(
  '/recruiter/job-postings/:jobId',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.deleteJob
);
router.get(
  '/recruiter/job-postings/:jobId/candidates',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.getCandidates
);

router.put(
  '/recruiter/applications/:applicationId/status',
  authenticateJWT,
  hasRole(['Recruiter']),
  jobController.updateCandidateStatus
);

module.exports = router;

