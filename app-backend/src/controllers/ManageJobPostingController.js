const knex = require('knex');
const multer = require('multer');
const { BadRequestError, NotFoundError } = require('../utils/errors'); // Custom error handlers

const db = require('../config/database');

// Setup multer for file uploads (CV)
const upload = multer({ dest: 'uploads/' });

// Export middleware for file uploads
exports.uploadResume = upload.single('resume');

// =================== 1. View/Search Job Postings ===================
exports.getAllJobs = async (req, res, next) => {
  try {
    const { title, location, type } = req.query;
    let query = db('job_postings').where('status', 'Open'); 

    if (title) query = query.where('title', 'ILIKE', `%${title}%`);
    if (location) query = query.where('location', 'ILIKE', `%${location}%`);
    if (type) query = query.where('job_type', '=', type);

    const jobPostings = await query;
    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Detailed error fetching jobs:', error.message, error.stack);
    next(new BadRequestError(`Unable to fetch job postings: ${error.message}`));
  }
};


// =================== 2. View specific Job details (Optimized for Frontend) ===================
exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Validate jobId format (basic validation)
    if (isNaN(parseInt(jobId, 10))) {
        return next(new BadRequestError('Invalid Job ID format.'));
    }

    const jobPosting = await db('job_postings')
      .leftJoin('users as recruiter_users', 'job_postings.recruiter_id', 'recruiter_users.user_id') // Join with users table for recruiter info
      .where({
        'job_postings.job_posting_id': jobId,
        // For public view, only 'Open' jobs are shown.
        'job_postings.status': 'Open'
      })
      .select(
        'job_postings.job_posting_id',
        'job_postings.title',
        'job_postings.description',
        'job_postings.location',
        'job_postings.job_type',
        'job_postings.status',
        'job_postings.created_at',
        'job_postings.updated_at',
        'job_postings.closing_date',
        'job_postings.recruiter_id', 
      )
      .first(); // Since we expect only one job or none

    if (!jobPosting) {
      // It's important to let the frontend know if the job is not found OR not 'Open' for public view
      return next(new NotFoundError('Job posting not found or is not currently open.'));
    }


    res.status(200).json(jobPosting);
  } catch (error) {
    console.error('Error fetching job details by ID:', error);
    next(new BadRequestError('An error occurred while fetching job details.'));
  }
};


// =================== 3. Recruiter: Create Job Posting ===================
exports.createJob = async (req, res, next) => {
  try {
    // Extract fields from request body
    const { title, description, location } = req.body;
    
    // Handle the job type field - could be sent as either "job_type" or "type"
    const jobType = req.body.job_type || req.body.type;

    // Validate required fields
    if (!title || !description || !location || !jobType) {
      return next(new BadRequestError('All fields are required: title, description, location, and job type'));
    }

    // Insert the new job posting - ensure job_type field name matches the database column
    const [newJobPosting] = await db('job_postings').insert({
      title,
      description,
      location,
      job_type: jobType, // Map to job_type column in database
      recruiter_id: req.user, 
      status: 'Open',
      created_at: new Date(),
      updated_at: new Date(),
    }).returning('*');

    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error('Error creating job posting:', error);
    next(new BadRequestError('Unable to create job posting: ' + error.message));
  }
};

// =================== 4. Recruiter: View Their Job Postings ===================
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

// =================== 5. Recruiter: Edit Job Posting ===================
exports.updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { title, description, location } = req.body;
    
    // Handle the job type field - could be sent as either "job_type" or "type"
    const jobType = req.body.job_type || req.body.type;

    // Validate job posting
    const job = await db('job_postings').where('job_posting_id', jobId).first();
    if (!job) {
      return next(new NotFoundError('Job posting not found'));
    }

    // Update the job posting
    await db('job_postings')
      .where('job_posting_id', jobId)
      .update({ 
        title, 
        description, 
        location, 
        job_type: jobType, // Ensure job_type field name matches database column
        updated_at: new Date() 
      });

    res.status(200).json({ message: 'Job posting updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    next(new BadRequestError('Unable to update job posting: ' + error.message));
  }
};

// =================== 6. Recruiter: Close Job Posting ===================
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

// =================== 7. Recruiter: View Candidates ===================
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

// =================== 8. Recruiter: Update Candidate Status ===================
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

// =================== 9. Recruiter: Delete Job Posting at DELETE /api/recruiter/job-postings/:jobId ===================
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