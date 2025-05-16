const knex = require('knex');
const multer = require('multer');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const jobPostingModel = require('../models/jobPostingModel');
const applicationModel = require('../models/applicationModel');

// Setup multer for file uploads (CV)
const upload = multer({ dest: 'uploads/' });

// Export middleware for file uploads
exports.uploadResume = upload.single('resume');

// =================== 1. View all Job Postings (Public Newsfeed) ===================
exports.getAllJobs = async (req, res, next) => {
  try {
    const { title, location, type: job_type } = req.query;
    const filters = { title, location, job_type };
    // Remove undefined/null filters before passing to model
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    // Use the model method for fetching job summaries
    const jobPostings = await jobPostingModel.findAllOpenWithSummary(filters);
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Detailed error fetching jobs:', error.message, error.stack);
    next(new BadRequestError(`Unable to fetch job postings: ${error.message}`));
  }
};

// =================== 2. View specific Job details ===================
exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate jobId format (basic validation)
    if (isNaN(parseInt(jobId, 10))) {
        return next(new BadRequestError('Invalid Job ID format.'));
    }

    // Use the new model method
    const jobPosting = await jobPostingModel.findOpenJobDetailsById(jobId);

    if (!jobPosting) {
      // The model method already filters for 'Open' status.
      return next(new NotFoundError('Job posting not found or is not currently open.'));
    }

    res.status(200).json(jobPosting);
  } catch (error) {
    console.error('Error fetching job details by ID:', error);
    next(new BadRequestError('An error occurred while fetching job details.'));
  }
};

// =================== 3. Recruiter: Create Job Posting (with Spam Check) ===================
exports.createJob = async (req, res, next) => {
  try {
    const { title, description, location, job_type } = req.body; // Use job_type consistently
    // const jobType = req.body.job_type || req.body.type; // Keep if frontend might send 'type'
    
    // Authentication and role check should be handled by middleware before this controller action
    if (!req.user || !req.user.userId) {
      // This check is a safeguard, middleware should catch it first
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;
    if (!title || !description || !location || !job_type) {
      return next(new BadRequestError('All fields are required: title, description, location, and job_type.'));
    }

    // Normalize or trim inputs if necessary before checking for duplicates
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim(); // Basic trim, consider more advanced normalization

    // Check for existing identical job by this recruiter
    const existingJob = await jobPostingModel.findExistingJobByContent(
      normalizedTitle,
      normalizedDescription,
      recruiter_id
    );

    if (existingJob) {
      return next(new BadRequestError(
        'You have already posted an identical job (same title and description). Please post a new unique job or update the existing one.'
      ));
    }

    const jobData = {
      title: normalizedTitle,
      description: normalizedDescription,
        location, 
      job_type, // Use the consistent field name
      recruiter_id,
      // status: 'Open', // Model's create method handles default status
      // created_at, updated_at, posting_date are handled by model's create method
};

    const newJobPosting = await jobPostingModel.create(jobData);

    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error('Error creating job posting:', error);
    next(new BadRequestError('Unable to create job posting: ' + error.message));
  }
};

// =================== 4. Recruiter: View Their Job Postings ===================
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;
    const { status } = req.query; // Allow filtering by status

    const jobPostings = await jobPostingModel.findByRecruiterId(recruiter_id, { status });
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Error fetching recruiter jobs:', error);
    next(new BadRequestError('Unable to fetch recruiter job postings.'));
  }
};

// =================== 5. Recruiter: Edit Job Posting ===================
exports.updateJob = async (req, res, next) => {
  try {
    const { jobId: job_posting_id } = req.params;
    const { title, description, location, job_type } = req.body;
     if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
    }
    const recruiter_id = req.user.userId;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (location !== undefined) updateFields.location = location;
    if (job_type !== undefined) updateFields.job_type = job_type;


    if (Object.keys(updateFields).length === 0) {
      return next(new BadRequestError('No fields provided for update.'));
    }

    // Optional: If title/description are being updated, check if the new combination
    // would create a duplicate with *another* existing job by this recruiter.
    // This is more complex and might be overkill depending on requirements.
    // For now, we only prevent creating a new job that's identical to an existing one.

    const updatedCount = await jobPostingModel.update(job_posting_id, recruiter_id, updateFields);

    if (updatedCount === 0) {
      return next(new NotFoundError('Job posting not found, you are not authorized to edit it, or update failed.'));
    }
    res.status(200).json({ message: 'Job posting updated successfully.' });
  } catch (error) {
    console.error('Error updating job:', error);
    next(new BadRequestError('Unable to update job posting: ' + error.message));
    }
};

// =================== 6. Recruiter: Close Job Posting ===================
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

// =================== 7. Recruiter: View Candidates ===================
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

// =================== 8. Recruiter: Update Candidate Status ===================
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

// =================== 9. Recruiter: Delete Job Posting ===================
exports.deleteJob = async (req, res, next) => {
  try {
    const { jobId: job_posting_id } = req.params;
    if (!req.user || !req.user.userId) {
      return next(new BadRequestError('User authentication required.'));
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