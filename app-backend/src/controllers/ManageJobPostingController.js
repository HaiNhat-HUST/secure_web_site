const { body, param, validationResult } = require('express-validator');
const xss = require('xss');
const validator = require('validator');
const db = require('../config/database'); 
const JobPosting = require('../models/jobPostingModel');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Custom XSS configuration
const xssOptions = {
  whiteList: {},  // No tags allowed
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

// Input sanitization middleware
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return validator.escape(xss(input.trim(), xssOptions));
};

// =================== 1. Recruiter: Create Job Posting ===================
exports.createJob = [
  // Input validation chain
  body('title') // Targets the 'title' field in the request body (req.body.title)
    .isString() 
    .notEmpty() // Validates that 'title' is not an empty string (after default trimming by express-validator).
    .isLength({ min: 3, max: 100 }) 
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/) // Validates that 'title' only contains alphanumeric characters, spaces, and specific punctuation.
    .withMessage('Title must be 3-100 characters and contain only valid characters') // Custom error message if any of the above 'title' validations fail.
    .trim() // Sanitizer: removes leading/trailing whitespace from 'title'.
    .escape(), // Sanitizer: escapes HTML special characters in 'title' (e.g., '<' becomes '<') to prevent XSS.

  body('description') // Targets the 'description' field in the request body.
    .isString() 
    .notEmpty() 
    .isLength({ min: 10, max: 1000 }) 
    .withMessage('Description must be 10-1000 characters') 
    .trim() // Sanitizer: removes leading/trailing whitespace.
    .escape(), // Sanitizer: escapes HTML special characters.

  body('location') // Targets the 'location' field in the request body.
    .isString() // Validates that 'location' is a string.
    .notEmpty() // Validates that 'location' is not an empty string.
    .isLength({ min: 2, max: 100 }) // Validates 'location' length.
    .matches(/^[a-zA-Z0-9\s\-_,()]+$/) // Validates 'location' for allowed characters.
    .withMessage('Location must be 2-100 characters and contain only valid characters') // Custom error message for 'location'.
    .trim() // Sanitizer: removes leading/trailing whitespace.
    .escape(), // Sanitizer: escapes HTML special characters.

  body('job_type') // Targets the 'job_type' field in the request body.
    .isIn(['FullTime', 'PartTime', 'Contract']) 
    .withMessage('Invalid job type') // Custom error message if 'job_type' is not one of the allowed values.
    .trim(), // Sanitizer: removes leading/trailing whitespace. This is important for .isIn to work correctly if " FullTime " is sent.

  // Main function
  async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req); // Collects any validation errors from the chains above.
      if (!errors.isEmpty()) { // Checks if there were any validation errors.
        return next(new BadRequestError(errors.array()[0].msg)); // If errors, pass the first error message to the error handler.
      }

      // Verify user authentication and authorization
      if (!req.user?.user_id || req.user?.role !== 'Recruiter') {
        return next(new BadRequestError('Unauthorized: Only recruiters can create jobs'));
      }

      const jobData = {

        title: req.body.title, // Value is already trimmed and escaped by express-validator
        description: req.body.description, // Value is already trimmed and escaped by express-validator
        location: req.body.location, // Value is already trimmed and escaped by express-validator
        job_type: req.body.job_type, // Value is already trimmed by express-validator
        recruiter_id: req.user.user_id
      };
  

      const newJobPosting = await JobPosting.create(jobData);

      if (!newJobPosting) {
        throw new Error('Failed to create job posting');
      }

      res.status(201).json({
        message: 'Job posting created successfully',
        job: newJobPosting
      });

    } catch (error) {
      console.error('Error creating job posting:', error);
      next(new BadRequestError('Unable to create job posting'));
    }
  }
];

// =================== 2. Recruiter: Update Job Posting by ID ===================
exports.updateJob = [
  // Validate URL parameter
  param('jobId') // Targets the 'jobId' parameter in the URL path (e.g., /jobs/:jobId)
    .isInt({ min: 1 }) // Validates that 'jobId' is an integer and its value is at least 1.
    .withMessage('Invalid job ID') // Custom error message if 'jobId' is not a valid integer >= 1.
    .toInt(), // Sanitizer: converts the validated 'jobId' string from the URL param into an integer.

  // Validate body fields
  body('title')
    .isString()
    .isLength({ min: 3, max: 100 })
    .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
    .withMessage('Title must be 3-100 characters and contain only valid characters')
    .trim()
    .escape(), 

  body('description')
    .isString()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be 10-1000 characters')
    .trim()
    .escape(), 

  body('location')
    .isString()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z0-9\s\-_,()]+$/)
    .withMessage('Location must be 2-100 characters and contain only valid characters')
    .trim()
    .escape(), 

  body('job_type')
    .isIn(['FullTime', 'PartTime', 'Contract'])
    .withMessage('Invalid job type')
    .trim(), 

  async (req, res, next) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
      }

      const { jobId } = req.params; // This is now an integer thanks to .toInt()

      // Corrected authorization logic:
      if (!req.user?.user_id || req.user?.role !== 'Recruiter') {
        return next(new BadRequestError('Unauthorized: Only recruiters can update jobs'));
      }

      const existingJob = await JobPosting.findById(jobId);

      if (!existingJob) {
        return next(new NotFoundError('Job posting not found'));
      }

      if (existingJob.recruiter_id !== req.user.user_id) {
        return next(new BadRequestError('Unauthorized: You can only update your own job postings'));
      }

      // Prepare update data. Values from req.body are already sanitized by express-validator.
      const updateData = {};
      if (req.body.title) updateData.title = req.body.title; // Already trimmed and escaped
      if (req.body.description) updateData.description = req.body.description; // Already trimmed and escaped
      if (req.body.location) updateData.location = req.body.location; // Already trimmed and escaped
      if (req.body.job_type) updateData.job_type = req.body.job_type; // Already trimmed

      // Use model to update
      const updated = await JobPosting.update(jobId, updateData);

      if (!updated) {
        throw new Error('Failed to update job posting'); // Or use a more specific error if update returns 0 rows affected
      }

      res.status(200).json({
        message: 'Job posting updated successfully',
        jobId: jobId
      });

    } catch (error) {
      console.error('Error updating job:', error);
      next(new BadRequestError('Unable to update job posting'));
    }
  }
];

// =================== 3. Recruiter: View Their Job Postings ===================
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    // Use consistent user ID property
    const recruiter_id = req.user.user_id;

    const { status } = req.query;

    // Use the model method for fetching recruiter's jobs
    const jobPostings = await JobPosting.findByRecruiterId(recruiter_id, { status });

    // Always return an array (empty if none)
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    next(new BadRequestError('Unable to fetch recruiter job postings.'));
  }
};

// =================== 4. Recruiter: Close Job Posting ===================
exports.closeJob = async (req, res, next) => {
  try {
    const { jobId: job_posting_id } = req.params;
    if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;

    const job = await jobPostingModel.findById(job_posting_id); // Basic find to check existence
    if (!job || job.recruiter_id !== recruiter_id) { // Check ownership
        return next(new NotFoundError('Job posting not found or you are not authorized to close it.'));
    }
    if (job.status === 'Closed') {
        return res.status(200).json({ message: 'Job posting is already closed.' });
    }

    const updatedCount = await jobPostingModel.updateStatus(job_posting_id, recruiter_id, 'Closed');

    if (updatedCount === 0) {
      // This might happen if the job was deleted/changed by another process between find and update,
      // or if the recruiter_id check in updateStatus failed (though we check ownership above).
      return next(new NotFoundError('Close operation failed. Job may no longer exist or you lack permission.'));
    }
    res.status(200).json({ message: 'Job posting closed successfully.' });
  } catch (error) {
    console.error('Error closing job:', error);
    next(new BadRequestError('Unable to close job posting.'));
  }
};

// =================== 5. Recruiter: View Candidates ===================
exports.getCandidates = async (req, res, next) => {
  try {
    const { jobId: job_posting_id } = req.params;
    if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;

    const job = await jobPostingModel.findById(job_posting_id);
    if (!job || job.recruiter_id !== recruiter_id) {
      return next(new NotFoundError('Job posting not found or you are not authorized to view its candidates.'));
    }

    // Assuming you have an applicationModel.js with findByJobPostingId
    // const applicationModel = require('../models/applicationModel'); // Make sure it's imported
    const applicants = await applicationModel.findByJobPostingId(job_posting_id);
    res.status(200).json(applicants);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    next(new BadRequestError('Unable to fetch candidates.'));
  }
};

// =================== 6. Recruiter: Update Candidate Status ===================
exports.updateCandidateStatus = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;

    const validStatuses = ['New', 'UnderReview', 'Shortlisted', 'Rejected', 'Hired', 'InterviewScheduled'];
    if (!status || !validStatuses.includes(status)) {
      return next(new BadRequestError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`));
    }

    // Verify application exists and belongs to a job managed by this recruiter
    // const applicationModel = require('../models/applicationModel'); // Make sure it's imported
    const applicationToVerify = await applicationModel.findByIdAndRecruiterJob(applicationId, recruiter_id);
    if (!applicationToVerify) {
      return next(new NotFoundError('Application not found or you are not authorized to update its status.'));
    }

    const updatedCount = await applicationModel.updateStatus(applicationId, status);
    if (updatedCount === 0) {
      return next(new BadRequestError('Failed to update candidate status.'));
    }

    res.status(200).json({ message: 'Candidate status updated successfully.' });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    next(new BadRequestError('Unable to update candidate status.'));
    }
};

// =================== 7. Recruiter: Delete Job Posting at DELETE /api/recruiter/job-postings/:jobId ===================
exports.deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.user; 

    // Validate job posting and ownership
    const job = await db('job_postings').where('job_posting_id', jobId).first();
    if (!job) {
      return next(new NotFoundError('Job posting not found'));
    }
    if (job.recruiter_id !== userId) {
      return next(new BadRequestError('Unauthorized: You can only delete your own job postings'));
    }
    const recruiter_id = req.user.userId;

    const deletedRows = await jobPostingModel.delete(job_posting_id, recruiter_id);

    if (deletedRows === 0) {
      return next(new NotFoundError('Job posting not found, you are not authorized to delete it, or delete failed.'));
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job posting:', error);
    if (error.code === '23503') {
      return next(new BadRequestError('Cannot delete job posting due to existing references (e.g., applications).'));
    }
    next(new BadRequestError('Unable to delete job posting: ' + error.message));
  }
};