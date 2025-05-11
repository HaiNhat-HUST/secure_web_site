const express = require('express');
const jobController = require('../controllers/ManageJobPostingController');

const router = express.Router();

// POST /api/jobs - Create a new job posting
router.post('/jobs', jobController.createJob);

// GET /api/jobs - Get all job postings with optional filters
router.get('/jobs', jobController.getAllJobs);

// GET /api/recruiter/job-postings - Get postings for the logged-in recruiter
router.get('/recruiter/job-postings', jobController.getRecruiterJobs);

// PUT /api/recruiter/job-postings/:jobId - Update a specific job posting
router.put('/recruiter/job-postings/:jobId', jobController.updateJob);

// POST /api/recruiter/job-postings/:jobId/close - Close a specific job posting
router.post('/recruiter/job-postings/:jobId/close', jobController.closeJob);

// DELETE /api/recruiter/job-postings/:jobId - Delete a specific job posting
router.delete('/recruiter/job-postings/:jobId', jobController.deleteJob);

// POST /api/jobs/apply/:jobId - Apply for a job
router.post('/jobs/apply/:jobId', jobController.uploadResume, jobController.applyForJob);

// GET /api/recruiter/:jobId/candidates - Get all applicants for a job posting
router.get('/recruiter/:jobId/candidates', jobController.getCandidates);

// PUT /api/recruiter/candidates/:candidateId/status - Update candidate status
router.put('/recruiter/candidates/:candidateId/status', jobController.updateCandidateStatus);

module.exports = router;

