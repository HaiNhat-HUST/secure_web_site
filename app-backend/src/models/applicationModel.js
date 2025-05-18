// src/models/application.model.js
const db = require('../config/database');
const TABLE_NAME = 'applications';

module.exports = {
  /**
   * Creates a new job application.
   * @async
   * @param {object} applicationData - Application data. Keys should match snake_case column names.
   * @param {number} applicationData.job_seeker_id - ID of the applicant.
   * @param {number} applicationData.job_posting_id - ID of the job being applied to.
   * @param {string} [applicationData.resume_snapshot] - Optional. Link/text/base64 snapshot.
   * @param {('New'|'UnderReview'|'Shortlisted'|'Rejected'|'Hired'|'InterviewScheduled')} [applicationData.status='New'] - Optional, defaults to 'New'.
   * @returns {Promise<object | undefined>} The created application object or undefined if creation failed.
   * @throws {Error} If database insert fails (e.g., unique constraint violation).
   */
  async create(applicationData) {
    applicationData.status = applicationData.status || 'New'; // Default status
    // submission_date, created_at, updated_at have DB defaults

    const [result] = await db(TABLE_NAME).insert(applicationData).returning('*');
    return result;
  },

  /**
   * Finds an application by its ID.
   * @async
   * @param {number} applicationId - The ID of the application to find.
   * @returns {Promise<object | undefined>} The application object or undefined if not found.
   */
  async findById(applicationId) {
    return db(TABLE_NAME).where({ application_id: applicationId }).first();
  },

  /**
   * Finds all applications for a specific job posting.
   * Consider joining with users table here or in service layer to get seeker info.
   * @async
   * @param {number} jobPostingId - The ID of the job posting.
   * @returns {Promise<object[]>} An array of application objects for the specified job.
   */
  async findByJobPostingId(jobPostingId) {
    return db(TABLE_NAME)
      .where({ job_posting_id: jobPostingId })
      .orderBy('submission_date', 'desc') 
      .select('*');
  },

  /**
   * Finds all applications submitted by a specific job seeker.
   * Consider joining with job_postings table here or in service layer to get job info.
   * @async
   * @param {number} jobSeekerId - The ID of the job seeker.
   * @returns {Promise<object[]>} An array of application objects submitted by the seeker.
   */
  async findByJobSeekerId(jobSeekerId) {
    return db(TABLE_NAME)
      .where({ job_seeker_id: jobSeekerId })
      .orderBy('submission_date', 'desc')
      .select('*');
  },

   /**
   * Finds a specific application by job seeker and job posting ID (checks if already applied).
   * @async
   * @param {number} jobSeekerId - The ID of the job seeker.
   * @param {number} jobPostingId - The ID of the job posting.
   * @returns {Promise<object | undefined>} The application object if found, otherwise undefined.
   */
   async findBySeekerAndJob(jobSeekerId, jobPostingId) {
    return db(TABLE_NAME)
      .where({
        job_seeker_id: jobSeekerId,
        job_posting_id: jobPostingId
      })
      .first();
  },


  /**
   * Updates the status of an application.
   * @async
   * @param {number} applicationId - The ID of the application to update.
   * @param {('New'|'UnderReview'|'Shortlisted'|'Rejected'|'Hired'|'InterviewScheduled')} newStatus - The new status.
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async updateStatus(applicationId, newStatus) {
    return db(TABLE_NAME)
      .where({ application_id: applicationId })
      .update({
        status: newStatus,
        updated_at: new Date()
      });
  },

  /**
   * Deletes an application by its ID.
   * Use with caution. Might be better to just mark as 'Withdrawn' or similar.
   * @async
   * @param {number} applicationId - The ID of the application to delete.
   * @returns {Promise<number>} The number of rows deleted (0 or 1).
   */
  async delete(applicationId) {
    return db(TABLE_NAME).where({ application_id: applicationId }).del();
  },

// --- PERSONAL DASHBOARD FUNCTIONS ---

  // --- For Job Seeker ---
  /**
   * Counts total applications for a specific job seeker.
   */
  async countAllForSeeker(jobSeekerId) {
    const result = await db(TABLE_NAME)
      .where({ job_seeker_id: jobSeekerId })
      .count('* as total')
      .first();
    return parseInt(result.total, 10);
  },

  /**
   * Counts applications by status for a specific job seeker.
   */
  async countByStatusForSeeker(jobSeekerId) {
    return db(TABLE_NAME)
      .where({ job_seeker_id: jobSeekerId })
      .groupBy('status')
      .select('status', db.raw('COUNT(*) as count'))
      .orderBy('count', 'desc');
  },

  /**
   * Gets recent applications for a specific job seeker with job details.
   */
  async getRecentApplicationsForSeeker(jobSeekerId, limit = 5) {
    return db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .where({ 'applications.job_seeker_id': jobSeekerId })
      .select(
        'applications.application_id',
        'applications.submission_date',
        'applications.status',
        'job_postings.job_posting_id',
        'job_postings.title as job_title',
        'job_postings.location as job_location' // Added location
      )
      .orderBy('applications.submission_date', 'desc')
      .limit(limit);
  },

  /**
   * Gets application trends over time for a specific job seeker.
   * (Date grouping logic same as before, adapt db.raw for your specific DB)
   */
  async getApplicationStatsOverTimeForSeeker(jobSeekerId, period = 'day') {
    let dateGroupClause;
    // --- IMPORTANT: Adapt this for your database (PostgreSQL, MySQL, SQLite) ---
    const client = db.client.config.client;
    if (client === 'pg') {
        dateGroupClause = `DATE_TRUNC('${period}', applications.submission_date)`;
    } else if (client === 'mysql' || client === 'mysql2') {
        if (period === 'day') dateGroupClause = `DATE(applications.submission_date)`;
        else if (period === 'week') dateGroupClause = `DATE_FORMAT(applications.submission_date, '%x-%v')`; // Year-week
        else if (period === 'month') dateGroupClause = `DATE_FORMAT(applications.submission_date, '%Y-%m-01')`;
        else dateGroupClause = `DATE(applications.submission_date)`; // Default to day
    } else { // SQLite or default
        if (period === 'day') dateGroupClause = `strftime('%Y-%m-%d', applications.submission_date)`;
        else if (period === 'week') dateGroupClause = `strftime('%Y-%W', applications.submission_date)`; // Year-WeekNumber
        else if (period === 'month') dateGroupClause = `strftime('%Y-%m', applications.submission_date)`; // Year-Month
        else dateGroupClause = `strftime('%Y-%m-%d', applications.submission_date)`; // Default to day
    }
    // --- End of DB specific part ---

    return db(TABLE_NAME)
      .where({ 'applications.job_seeker_id': jobSeekerId })
      .select(db.raw(`${dateGroupClause} as period_start`), db.raw('COUNT(*) as count'))
      .groupByRaw(dateGroupClause) // Use groupByRaw for expressions
      .orderBy('period_start', 'asc');
  },

  // --- For Recruiter ---
  /**
   * Counts total applications for a specific recruiter's job postings.
   */
  async countAllForRecruiter(recruiterId) {
    const result = await db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .where('job_postings.recruiter_id', recruiterId)
      .count('applications.application_id as total')
      .first();
    return parseInt(result.total, 10);
  },

  /**
   * Counts applications by status for a specific recruiter's job postings.
   */
  async countByStatusForRecruiter(recruiterId) {
    return db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .where('job_postings.recruiter_id', recruiterId)
      .groupBy('applications.status')
      .select('applications.status', db.raw('COUNT(applications.application_id) as count'))
      .orderBy('count', 'desc');
  },

  /**
   * Gets recent applications for a specific recruiter's job postings with seeker and job details.
   */
  async getRecentApplicationsForRecruiter(recruiterId, limit = 5) {
    return db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .join('users as seeker', 'applications.job_seeker_id', 'seeker.user_id')
      .where('job_postings.recruiter_id', recruiterId)
      .select(
        'applications.application_id',
        'applications.submission_date',
        'applications.status as application_status',
        'job_postings.job_posting_id',
        'job_postings.title as job_title',
        'seeker.user_id as seeker_id',
        // 'seeker.username as seeker_username', // Choose what PII to expose
        'seeker.display_name as seeker_display_name'
      )
      .orderBy('applications.submission_date', 'desc')
      .limit(limit);
  },

  /**
   * Counts applications by status for a specific job posting (owned by a recruiter).
   */
  async countByStatusForJobPosting(jobPostingId) { // This one is general, can be reused
    return db(TABLE_NAME)
      .where('job_posting_id', jobPostingId)
      .groupBy('status')
      .select('status', db.raw('COUNT(*) as count'))
      .orderBy('count', 'desc');
  },

  /**
   * Gets the top N most applied-to job postings for a specific recruiter.
   */
  async getTopAppliedJobsForRecruiter(recruiterId, limit = 5) {
    return db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .where('job_postings.recruiter_id', recruiterId)
      .select(
        'job_postings.job_posting_id',
        'job_postings.title as job_title'
      )
      .count('applications.application_id as application_count')
      .groupBy('job_postings.job_posting_id', 'job_postings.title')
      .orderBy('application_count', 'desc')
      .limit(limit);
  },

  /**
   * Gets application trends over time for a specific recruiter's job postings.
   * (Date grouping logic same as before, adapt db.raw for your specific DB)
   */
  async getApplicationStatsOverTimeForRecruiter(recruiterId, period = 'day') {
    let dateGroupClause;
    // --- IMPORTANT: Adapt this for your database (PostgreSQL, MySQL, SQLite) ---
    const client = db.client.config.client;
    if (client === 'pg') {
        dateGroupClause = `DATE_TRUNC('${period}', applications.submission_date)`;
    } else if (client === 'mysql' || client === 'mysql2') {
        if (period === 'day') dateGroupClause = `DATE(applications.submission_date)`;
        else if (period === 'week') dateGroupClause = `DATE_FORMAT(applications.submission_date, '%x-%v')`;
        else if (period === 'month') dateGroupClause = `DATE_FORMAT(applications.submission_date, '%Y-%m-01')`;
        else dateGroupClause = `DATE(applications.submission_date)`;
    } else { // SQLite or default
        if (period === 'day') dateGroupClause = `strftime('%Y-%m-%d', applications.submission_date)`;
        else if (period === 'week') dateGroupClause = `strftime('%Y-%W', applications.submission_date)`;
        else if (period === 'month') dateGroupClause = `strftime('%Y-%m', applications.submission_date)`;
        else dateGroupClause = `strftime('%Y-%m-%d', applications.submission_date)`;
    }
    // --- End of DB specific part ---

    return db(TABLE_NAME)
      .join('job_postings', 'applications.job_posting_id', 'job_postings.job_posting_id')
      .where('job_postings.recruiter_id', recruiterId)
      .select(db.raw(`${dateGroupClause} as period_start`), db.raw('COUNT(applications.application_id) as count'))
      .groupByRaw(dateGroupClause) // Use groupByRaw for expressions
      .orderBy('period_start', 'asc');
  },
   // Knex instance for direct use if needed (e.g. by controller for one-off queries)
   dbInstance: db,
};