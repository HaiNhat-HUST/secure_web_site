// routes/jobRoutes.js
const express = require('express');
const jobController = require('../controllers/ManageJobPostingController');

const router = express.Router();


// POST /api/jobs - Create a new job posting
router.post('/jobs', jobController.createJob);

// GET /api/recruiter/job-postings - Get postings for the logged-in recruiter
router.get('/recruiter/job-postings', jobController.getRecruiterJobs);

// PUT /api/recruiter/job-postings/:jobId - Update a specific job posting 
router.put('/recruiter/job-postings/:jobId', jobController.updateJob);

// DELETE /api/recruiter/job-postings/:jobId/close - Close a specific job posting
router.delete('/recruiter/job-postings/:jobId/close', jobController.closeJob);

module.exports = router;