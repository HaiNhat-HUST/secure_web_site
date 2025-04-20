// src/models/jobPosting.model.js
const db = require('../config/database');
const TABLE_NAME = 'job_postings';

module.exports = {
  /**
   * Creates a new job posting.
   * @async
   * @param {object} jobData - Job posting data. Keys should match snake_case column names.
   * @param {number} jobData.recruiter_id - ID of the recruiter creating the post.
   * @param {string} jobData.title
   * @param {string} jobData.description
   * @param {string} [jobData.location] - Optional.
   * @param {('FullTime'|'PartTime'|'Contract')} jobData.job_type
   * @param {('Open'|'Closed'|'Archived')} [jobData.status='Open'] - Optional, defaults to 'Open'.
   * @param {Date | string} [jobData.closing_date] - Optional.
   * @returns {Promise<object | undefined>} The created job posting object or undefined if creation failed.
   * @throws {Error} If database insert fails.
   */
  async create(jobData) {
    jobData.status = jobData.status || 'Open'; // Default status
    // posting_date, created_at, updated_at have DB defaults

    const [result] = await db(TABLE_NAME).insert(jobData).returning('*');
    return result;
  },

  /**
   * Finds a job posting by its ID.
   * @async
   * @param {number} jobPostingId - The ID of the job posting to find.
   * @returns {Promise<object | undefined>} The job posting object or undefined if not found.
   */
  async findById(jobPostingId) {
    return db(TABLE_NAME).where({ job_posting_id: jobPostingId }).first();
  },

  /**
   * Finds all job postings, optionally filtering by status.
   * Consider adding pagination and more filters (location, type) for production.
   * @async
   * @param {object} [filters={}] - Optional filters object.
   * @param {string} [filters.status] - Filter by status (e.g., 'Open').
   * @param {string} [filters.job_type] - Filter by job type.
   * @param {string} [filters.location] - Filter by location (case-insensitive partial match example).
   * @returns {Promise<object[]>} An array of job posting objects matching the filters.
   */
  async findAll(filters = {}) {
     let query = db(TABLE_NAME);

     if (filters.status) {
       query = query.where({ status: filters.status });
     }
     if (filters.job_type) {
        query = query.where({ job_type: filters.job_type });
     }
      if (filters.location) {
        // Example: case-insensitive partial match
        query = query.whereRaw('LOWER(location) LIKE ?', [`%${filters.location.toLowerCase()}%`]);
     }

     // Default ordering
     query = query.orderBy('posting_date', 'desc');

     // Add pagination here later if needed (e.g., using .limit() and .offset())

     return query.select('*');
  },

  /**
   * Finds all job postings created by a specific recruiter.
   * @async
   * @param {number} recruiterId - The ID of the recruiter.
   * @returns {Promise<object[]>} An array of job posting objects.
   */
  async findByRecruiterId(recruiterId) {
    return db(TABLE_NAME)
      .where({ recruiter_id: recruiterId })
      .orderBy('posting_date', 'desc')
      .select('*');
  },

  /**
   * Updates a job posting's details.
   * @async
   * @param {number} jobPostingId - The ID of the job posting to update.
   * @param {object} updateData - Object containing fields to update. Keys should match snake_case column names.
   * @param {string} [updateData.title]
   * @param {string} [updateData.description]
   * @param {string} [updateData.location]
   * @param {('FullTime'|'PartTime'|'Contract')} [updateData.job_type]
   * @param {('Open'|'Closed'|'Archived')} [updateData.status]
   * @param {Date | string | null} [updateData.closing_date] - Pass null to remove the date.
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async update(jobPostingId, updateData) {
     if (Object.keys(updateData).length === 0) {
        return 0; // No data to update
    }
    // recruiter_id should generally not be updated
    delete updateData.recruiter_id;
    updateData.updated_at = new Date();
    return db(TABLE_NAME).where({ job_posting_id: jobPostingId }).update(updateData);
  },

  /**
   * Updates only the status of a job posting.
   * @async
   * @param {number} jobPostingId - The ID of the job posting.
   * @param {('Open'|'Closed'|'Archived')} newStatus - The new status.
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async updateStatus(jobPostingId, newStatus) {
    return db(TABLE_NAME)
      .where({ job_posting_id: jobPostingId })
      .update({
        status: newStatus,
        updated_at: new Date()
      });
  },

  /**
   * Deletes a job posting by its ID.
   * @async
   * @param {number} jobPostingId - The ID of the job posting to delete.
   * @returns {Promise<number>} The number of rows deleted (0 or 1).
   */
  async delete(jobPostingId) {
    return db(TABLE_NAME).where({ job_posting_id: jobPostingId }).del();
  },
};