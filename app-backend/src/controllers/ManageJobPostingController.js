// controllers/jobController.js
const jobPostingModel = require('../models/jobPostingModel');

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Public (Will be Private after middleware implementation)
 */
const createJob = async (req, res) => {
    const { title, description, location, type } = req.body;
  
    if (!title || !description || !type || !location) {
      return res.status(400).json({ error: 'Title, description, type, and location are required.' });
    }
  
    try {
      const jobData = {
        title,
        description,
        location,
        job_type: type,
        recruiter_id: req.body.recruiter_id || 1, // Default recruiter ID for testing
        status: 'Open',
      };
      const newJob = await jobPostingModel.create(jobData);
      res.status(201).json(newJob);
    } catch (error) {
      console.error('Error creating job posting:', error);
      res.status(500).json({ error: 'Failed to create job posting due to a server error.' });
    }
  };

const getJobDetails = async (req, res) => {
    const { jobId } = req.params;
  
    try {
      const job = await jobPostingModel.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found.' });
      }
  
      res.status(200).json(job);
    } catch (error) {
      console.error(`Error fetching job details for jobId ${jobId}:`, error);
      res.status(500).json({ error: 'Failed to fetch job details due to a server error.' });
    }
  };


/**
 * @desc    Get all job postings for the recruiter
 * @route   GET /api/recruiter/job-postings
 * @access  Public (Will be Private after middleware implementation)
 */
const getRecruiterJobs = async (req, res) => {
    // TEMPORARY: For testing without auth middleware
    // In production, this would come from req.user.id
    const recruiterId = req.query.recruiter_id || 1; // Use query param or default to 1 for testing

    try {
        const jobPostings = await jobPostingModel.findByRecruiterId(recruiterId);
        
        if (!jobPostings || jobPostings.length === 0) {
            return res.status(400).json({ error: 'No job postings found for this recruiter.' });
        }
        
        res.status(200).json(jobPostings);
    } catch (error) {
        console.error("Error retrieving recruiter job postings:", error);
        res.status(500).json({ error: 'Failed to retrieve job postings due to a server error.' });
    }
};

/**
 * @desc    Update an existing job posting
 * @route   PUT /api/recruiter/job-postings/:jobId
 * @access  Public (Will be Private after middleware implementation)
 */

const updateJob = async (req, res) => {
    const { jobId } = req.params;
    const { title, description, location, type } = req.body;

    // TEMPORARY: For testing without ownership middleware
    // In production, checkJobOwnership middleware would verify this
    
    // Check if at least one field is being updated
    if (title === undefined && description === undefined && location === undefined && type === undefined) {
        return res.status(400).json({ error: 'At least one field (title, description, location, type) is required to update.' });
    }

    try {
        // First check if job exists and get its current data
        const existingJob = await jobPostingModel.findById(jobId);
        if (!existingJob) {
            return res.status(400).json({ error: 'Invalid job posting ID.' });
        }
        
        // TEMPORARY: For testing - would be handled by middleware
        // Would check user ID against job's recruiter_id
        // const recruiterId = req.query.recruiter_id || 1;
        // if (existingJob.recruiter_id !== recruiterId) {
        //     return res.status(403).json({ error: 'You do not have permission to update this job posting.' });
        // }

        // Construct update data only with provided fields
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (location !== undefined) updateData.location = location;
        if (type !== undefined) updateData.job_type = type;

        const rowsUpdated = await jobPostingModel.update(jobId, updateData);

        if (rowsUpdated === 0) {
            return res.status(400).json({ error: 'Failed to update job posting.' });
        }

        res.status(200).json({ message: 'Job posting updated successfully.' });
    } catch (error) {
        console.error(`Error updating job posting ${jobId}:`, error);
        res.status(500).json({ error: 'Failed to update job posting due to a server error.' });
    }
};


const applyForJob = async (req, res) => {
  const { jobId } = req.params;
  const { jobSeekerId, resume } = req.body;

  if (!jobSeekerId || !resume) {
    return res.status(400).json({ error: 'Job seeker ID and resume are required.' });
  }

  try {
    const job = await jobPostingModel.findById(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const applicationData = {
      job_seeker_id: jobSeekerId,
      job_posting_id: jobId,
      resume_snapshot: resume,
      status: 'New',
    };

    const application = await applicationModel.create(applicationData);
    res.status(201).json({ message: 'Application submitted successfully.', application });
  } catch (error) {
    console.error(`Error applying for job ${jobId}:`, error);
    res.status(500).json({ error: 'Failed to submit application due to a server error.' });
  }
};

/**
 * @desc    Close (mark as inactive) a job posting
 * @route   DELETE /api/recruiter/job-postings/:jobId/close
 * @access  Public (Will be Private after middleware implementation)
 */
const closeJob = async (req, res) => {
    const { jobId } = req.params;

    try {
        // First check if job exists
        const existingJob = await jobPostingModel.findById(jobId);
        if (!existingJob) {
            return res.status(400).json({ error: 'Invalid job posting ID.' });
        }
        
        // TEMPORARY: For testing - would be handled by middleware
        // Would check user ID against job's recruiter_id
        // const recruiterId = req.query.recruiter_id || 1;
        // if (existingJob.recruiter_id !== recruiterId) {
        //     return res.status(403).json({ error: 'You do not have permission to close this job posting.' });
        // }

        const rowsUpdated = await jobPostingModel.updateStatus(jobId, 'Closed');

        if (rowsUpdated === 0) {
            return res.status(400).json({ error: 'Failed to close job posting.' });
        }
        res.status(200).json({ message: 'Job posting closed successfully.' });
    } catch (error) {
        console.error(`Error closing job posting ${jobId}:`, error);
        res.status(500).json({ error: 'Failed to close job posting due to a server error.' });
    }
};

module.exports = {
    createJob,
    getRecruiterJobs,
    updateJob,
    closeJob
};