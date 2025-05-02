// routes/jobRoutes.js
const express = require('express');
const jobController = require('../controllers/ManageJobPostingController');

const router = express.Router();


// POST /api/jobs - Create a new job posting
router.post('/jobs', jobController.createJob);

// GET /api/jobs/:jobId - Get details of a specific job posting
router.get('/jobs/:jobId', jobController.getJobDetails);

// GET /api/recruiter/job-postings - Get postings for the logged-in recruiter
router.get('/recruiter/job-postings', jobController.getRecruiterJobs);

// PUT /api/recruiter/job-postings/:jobId - Update a specific job posting 
router.put('/recruiter/job-postings/:jobId', jobController.updateJob);

// DELETE /api/recruiter/job-postings/:jobId/close - Close a specific job posting
router.delete('/recruiter/job-postings/:jobId/close', jobController.closeJob);

// POST /api/jobs/:jobId/apply - Apply for a job
router.post('/jobs/:jobId/apply', jobController.applyForJob);

module.exports = router;
