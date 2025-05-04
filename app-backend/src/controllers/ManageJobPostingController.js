// controllers/jobController.js
const jobPostingModel = require('../models/jobPostingModel');
const applicationModel = require('../models/applicationModel'); // Added missing model
const { body, validationResult } = require('express-validator'); // For input validation
const xss = require('xss'); // For XSS protection
const logger = require('../utils/logger'); // For secure logging

/**
 * Input validators
 */
exports.validateJobInput = [
  body('title')
    .trim()
    .notEmpty()
    .customSanitizer((value) => xss(value))
    .withMessage('Title is required'),
  body('description').trim().notEmpty().customSanitizer((value) => xss(value)).withMessage('Description is required'),
  body('location').trim().notEmpty().customSanitizer((value) => xss(value)).withMessage('Location is required'),
  body('type').trim().notEmpty().isIn(['Full-time', 'Part-time', 'Contract']).withMessage('Valid job type is required')
];

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private
 */
const createJob = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, location, type } = req.body;
  
  try {
    // Sanitize inputs to prevent XSS attacks
    const jobData = {
      title: xss(title),
      description: xss(description),
      location: xss(location),
      job_type: xss(type),
      recruiter_id: req.user ? req.user.id : 1, // In production, always use req.user.id
      status: 'Open',
    };
    
    const newJob = await jobPostingModel.create(jobData);
    res.status(201).json({
      id: newJob.id,
      title: newJob.title,
      status: newJob.status
    });
  } catch (error) {
    logger.error('Error creating job posting:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
};

/**
 * @desc    Get details of a specific job
 * @route   GET /api/jobs/:jobId
 * @access  Public
 */
const getJobDetails = async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }

  try {
    const job = await jobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    logger.error(`Error fetching job details for jobId ${jobId}:`, error);
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
};

/**
 * @desc    Get all job postings for the recruiter
 * @route   GET /api/recruiter/job-postings
 * @access  Private
 */
const getRecruiterJobs = async (req, res) => {
  // In production, this should come from req.user.id after authentication
  const recruiterId = req.user ? req.user.id : parseInt(req.query.recruiter_id, 10) || 1;
  
  if (isNaN(recruiterId) || recruiterId <= 0) {
    return res.status(400).json({ error: 'Invalid recruiter ID' });
  }

  try {
    const jobPostings = await jobPostingModel.findByRecruiterId(recruiterId);
    
    if (!jobPostings || jobPostings.length === 0) {
      return res.status(404).json({ message: 'No job postings found for this recruiter' });
    }
    
    res.status(200).json(jobPostings);
  } catch (error) {
    logger.error("Error retrieving recruiter job postings:", error);
    res.status(500).json({ error: 'Failed to retrieve job postings' });
  }
};

/**
 * @desc    Update an existing job posting
 * @route   PUT /api/recruiter/job-postings/:jobId
 * @access  Private
 */
const updateJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }
  
  // Check validation results if validation middleware is used
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, location, type } = req.body;

  // Check if at least one field is being updated
  if (title === undefined && description === undefined && location === undefined && type === undefined) {
    return res.status(400).json({ error: 'At least one field (title, description, location, type) is required to update' });
  }

  try {
    // First check if job exists and get its current data
    const existingJob = await jobPostingModel.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    
    // In production, use middleware to verify ownership
    const recruiterId = req.user ? req.user.id : 1;
    if (existingJob.recruiter_id !== recruiterId) {
      return res.status(403).json({ error: 'Unauthorized to update this job posting' });
    }

    // Construct update data only with provided fields and sanitize
    const updateData = {};
    if (title !== undefined) updateData.title = xss(title);
    if (description !== undefined) updateData.description = xss(description);
    if (location !== undefined) updateData.location = xss(location);
    if (type !== undefined) updateData.job_type = xss(type);

    const rowsUpdated = await jobPostingModel.update(jobId, updateData);

    if (rowsUpdated === 0) {
      return res.status(400).json({ error: 'No changes were made to the job posting' });
    }

    res.status(200).json({ message: 'Job posting updated successfully' });
  } catch (error) {
    logger.error(`Error updating job posting ${jobId}:`, error);
    res.status(500).json({ error: 'Failed to update job posting' });
  }
};

/**
 * @desc    Apply for a job
 * @route   POST /api/jobs/:jobId/apply
 * @access  Private
 */
const applyForJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }
  
  // In production, get job seeker ID from authenticated user
  const jobSeekerId = req.user ? req.user.id : parseInt(req.body.jobSeekerId, 10);
  const { resume } = req.body;

  if (isNaN(jobSeekerId) || jobSeekerId <= 0 || !resume) {
    return res.status(400).json({ error: 'Valid job seeker ID and resume are required' });
  }

  try {
    const job = await jobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ error: 'This job is no longer accepting applications' });
    }

    // Check if already applied
    const existingApplication = await applicationModel.findByJobAndSeeker(jobId, jobSeekerId);
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const applicationData = {
      job_seeker_id: jobSeekerId,
      job_posting_id: jobId,
      resume_snapshot: xss(resume), // Sanitize resume content
      status: 'New',
    };

    const application = await applicationModel.create(applicationData);
    res.status(201).json({ 
      message: 'Application submitted successfully',
      application_id: application.id
    });
  } catch (error) {
    logger.error(`Error applying for job ${jobId}:`, error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

/**
 * @desc    Close (mark as inactive) a job posting
 * @route   DELETE /api/recruiter/job-postings/:jobId/close
 * @access  Private
 */
const closeJob = async (req, res) => {
  const jobId = parseInt(req.params.jobId, 10);
  
  if (isNaN(jobId) || jobId <= 0) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }

  try {
    // First check if job exists
    const existingJob = await jobPostingModel.findById(jobId);
    if (!existingJob) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    
    // In production, use middleware to verify ownership
    const recruiterId = req.user ? req.user.id : 1;
    if (existingJob.recruiter_id !== recruiterId) {
      return res.status(403).json({ error: 'Unauthorized to close this job posting' });
    }

    const rowsUpdated = await jobPostingModel.updateStatus(jobId, 'Closed');

    if (rowsUpdated === 0) {
      return res.status(400).json({ error: 'Failed to close job posting' });
    }
    res.status(200).json({ message: 'Job posting closed successfully' });
  } catch (error) {
    logger.error(`Error closing job posting ${jobId}:`, error);
    res.status(500).json({ error: 'Failed to close job posting' });
  }
};

module.exports = {
  createJob,
  getJobDetails,
  getRecruiterJobs,
  updateJob,
  closeJob,
  applyForJob,
  validateJobInput
};