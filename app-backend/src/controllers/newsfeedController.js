const db = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const validator = require('validator');

// =================== 1. View Job Postings ===================
exports.getAllJobs = async (req, res, next) => {
  try {
    // Input validation and sanitization for search parameters
    let { title, location, type } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const offset = (page - 1) * limit;

    // Validate and sanitize title
    if (title && typeof title === 'string') {
      title = validator.trim(title);
      // Only allow letters, numbers, spaces, and basic punctuation
      if (!validator.isLength(title, { min: 0, max: 100 }) ||
          !/^[a-zA-Z0-9\s\-_,.?!()]*$/.test(title)) {
        return next(new BadRequestError('Invalid title search input.'));
      }
      title = validator.escape(title);
    }

    // Validate and sanitize location
    if (location && typeof location === 'string') {
      location = validator.trim(location);
      if (!validator.isLength(location, { min: 0, max: 100 }) ||
          !/^[a-zA-Z0-9\s\-_,()]*$/.test(location)) {
        return next(new BadRequestError('Invalid location search input.'));
      }
      location = validator.escape(location);
    }

    // Validate type
    if (type && typeof type === 'string') {
      type = validator.trim(type);
      if (!['FullTime', 'PartTime', 'Contract', ''].includes(type)) {
        return next(new BadRequestError('Invalid job type.'));
      }
    }

    // Build query
    let jobsQuery = db('job_postings')
      .where({ status: 'Open' })
      .leftJoin('users', 'job_postings.recruiter_id', 'users.user_id')
      .select(
        'job_postings.job_posting_id',
        'job_postings.title',
        'job_postings.description',
        'job_postings.location',
        'job_postings.job_type',
        'job_postings.created_at as posting_date',
        'users.username as recruiter_display_name'
      );

    // Filtering (safe, parameterized)
    if (title) {
      jobsQuery = jobsQuery.whereRaw('LOWER(job_postings.title) LIKE ?', [`%${title.toLowerCase()}%`]);
    }
    if (location) {
      jobsQuery = jobsQuery.whereRaw('LOWER(job_postings.location) LIKE ?', [`%${location.toLowerCase()}%`]);
    }
    if (type) {
      jobsQuery = jobsQuery.where('job_postings.job_type', type);
    }

    // Clone for count
    const countQuery = jobsQuery.clone().clearSelect().clearOrder().count('* as count').first();

    // Main query with pagination
    const jobsResultQuery = jobsQuery
      .orderBy('job_postings.created_at', 'desc')
      .offset(offset)
      .limit(limit);

    // Run both queries in parallel
    const [countResult, jobs] = await Promise.all([countQuery, jobsResultQuery]);
    const total = parseInt(countResult.count, 10);
    const hasMore = offset + jobs.length < total;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      jobs,
      pagination: {
        hasMore,
        total,
        totalPages,
        currentPage: page,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('[getAllJobs] Error:', error);
    next(new BadRequestError('Failed to fetch jobs: ' + error.message));
  }
};


// =================== 2. View specific Job details ===================
exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (isNaN(parseInt(jobId, 10))) {
      return next(new BadRequestError('Invalid Job ID format.'));
    }

    const jobPosting = await db('job_postings')
      .leftJoin('users', 'job_postings.recruiter_id', 'users.user_id')
      .where({
        'job_postings.job_posting_id': jobId,
        'job_postings.status': 'Open'
      })
      .select(
        'job_postings.job_posting_id',
        'job_postings.title',
        'job_postings.description',
        'job_postings.location',
        'job_postings.job_type',
        'job_postings.status',
        'job_postings.created_at as posting_date',
        'job_postings.updated_at',
        'job_postings.closing_date',
        'job_postings.recruiter_id',
        'users.username as recruiter_display_name'
      )
      .first();

    if (!jobPosting) {
      return next(new NotFoundError('Job posting not found or is not currently open.'));
    }

    res.status(200).json(jobPosting);
  } catch (error) {
    console.error('Error fetching job details by ID:', error);
    next(new BadRequestError('An error occurred while fetching job details.'));
  }
};