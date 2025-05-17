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
    const { userId } = req.user; 

    const jobPostings = await db('job_postings').where('recruiter_id', userId);
    if (jobPostings.length === 0) {
      return res.status(200).json([]); // Return empty array instead of error
    }

    res.status(200).json(jobPostings);
  } catch (error) {
    next(new BadRequestError('Unable to fetch job postings'));
  }
};

// =================== 4. Recruiter: Close Job Posting ===================
exports.closeJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate job posting
    const job = await db('job_postings').where('job_posting_id', jobId).first();
    if (!job) {
      return next(new NotFoundError('Job posting not found'));
    }

    // Close the job posting
    await db('job_postings')
      .where('job_posting_id', jobId)
      .update({ status: 'Closed', closing_date: new Date() });

    res.status(200).json({ message: 'Job post closed successfully' });
  } catch (error) {
    next(new BadRequestError('Unable to close job post'));
  }
};

// =================== 5. Recruiter: View Candidates ===================
exports.getCandidates = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate job posting
    const job = await db('job_postings').where('job_posting_id', jobId).first();
    if (!job) {
      return next(new NotFoundError('Job posting not found'));
    }

    // Get applicants for this job posting
    const applicants = await db('applications')
      .join('users', 'applications.job_seeker_id', '=', 'users.user_id')
      .where('applications.job_posting_id', jobId)
      .select('users.username', 'applications.status', 'applications.resume_snapshot');

    res.status(200).json(applicants);
  } catch (error) {
    next(new BadRequestError('Unable to fetch candidates'));
  }
};

// =================== 6. Recruiter: Update Candidate Status ===================
exports.updateCandidateStatus = async (req, res, next) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;

    if (!status || !['New', 'Shortlisted', 'UnderReview'].includes(status)) {
      return next(new BadRequestError('Invalid status'));
    }

    // Update candidate status
    await db('applications')
      .where('job_seeker_id', candidateId)
      .update({ status, updated_at: new Date() });

    res.status(200).json({ message: 'Candidate status updated successfully' });
  } catch (error) {
    next(new BadRequestError('Unable to update candidate status'));
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

    // Delete the job posting
    const deletedRows = await db('job_postings')
      .where('job_posting_id', jobId)
      .delete();

    if (deletedRows === 0) {
      return next(new BadRequestError('Failed to delete job posting'));
    }

    res.status(204).send(); // No content for successful deletion
  } catch (error) {
    console.error('Error deleting job posting:', error);
    if (error.code === '23503') { // PostgreSQL foreign key violation
      return next(new BadRequestError('Cannot delete job posting with existing applications'));
    }
    next(new BadRequestError('Unable to delete job posting: ' + error.message));
  }
};