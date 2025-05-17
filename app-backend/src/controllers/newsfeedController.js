const db = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// =================== 1. View Job Postings ===================
exports.getAllJobs = async (req, res, next) => {
  try {
    const { title, location, type } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 100);
    const offset = (page - 1) * limit;

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

    // Filtering (cross-db compatible)
    if (title && title.trim() !== '') {
      jobsQuery = jobsQuery.whereRaw('LOWER(job_postings.title) LIKE ?', [`%${title.trim().toLowerCase()}%`]);
    }
    if (location && location.trim() !== '') {
      jobsQuery = jobsQuery.whereRaw('LOWER(job_postings.location) LIKE ?', [`%${location.trim().toLowerCase()}%`]);
    }
    if (type && type.trim() !== '') {
      jobsQuery = jobsQuery.where('job_postings.job_type', type.trim());
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