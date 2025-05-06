const knex = require('knex');
const multer = require('multer');
const { BadRequestError, NotFoundError } = require('../utils/errors'); // Custom error handlers

const db = knex({ client: 'pg', connection: process.env.DATABASE_URL });

// Setup multer for file uploads (CV)
const upload = multer({ dest: 'uploads/' });

// Export middleware for file uploads
exports.uploadResume = upload.single('resume');

// =================== 1. View/Search Job Postings ===================
exports.getAllJobs = async (req, res, next) => {
  try {
    const { title, location, type } = req.query;

    // Build the query dynamically based on filters
    let query = db('job_postings').where('status', 'Open'); // Ensure open jobs only

    if (title) query = query.where('title', 'ILIKE', `%${title}%`);
    if (location) query = query.where('location', 'ILIKE', `%${location}%`);
    if (type) query = query.where('job_type', '=', type);

    const jobPostings = await query;

    res.status(200).json(jobPostings);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    next(new BadRequestError('Invalid query parameters or unable to fetch job postings'));
  }
};

// =================== 2. Apply for a Job ===================
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.user; // Assume user is authenticated (middleware for user context)
    const resume = req.file;

    if (!resume) {
      return next(new BadRequestError('Resume file is required'));
    }

    // Validate jobId
    const job = await db('job_postings').where('job_posting_id', jobId).first();
    if (!job) {
      return next(new NotFoundError('Job posting not found'));
    }

    // Insert application
    await db('applications').insert({
      job_seeker_id: userId,
      job_posting_id: jobId,
      resume_snapshot: resume.path, // Store file path or handle file storage as needed
      status: 'New',
      submission_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    next(new BadRequestError('Invalid job posting ID or unable to apply'));
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
      recruiter_id: req.user?.userId || 1, // Default for testing
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
    const { userId } = req.user; // Assume the recruiter is authenticated

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
      .update({ status: 'Closed', updated_at: new Date() });

    res.status(200).json({ message: 'Job posting closed successfully' });
  } catch (error) {
    next(new BadRequestError('Unable to close job posting'));
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

