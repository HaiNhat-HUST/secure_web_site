const db = require('../config/database');
const TABLE_NAME = 'jobs_posting';

module.exports = {
  /**
   * Creates a new job posting.
   * @async
   * @param {object} jobData - Job posting data. Keys should match snake_case column names.
   * @param {string} jobData.title - Title of the job posting (required).
   * @param {string} jobData.description - Description of the job posting (required).
   * @param {string} [jobData.location] - Location of the job posting (optional).
   * @param {('FullTime'|'PartTime'|'Contract')} jobData.job_type - Type of the job (required).
   * @returns {Promise<object | undefined>} The created job posting object or undefined if creation failed.
   * @throws {Error} If database insert fails.
   */
  async create(jobData) {
    // Automatically set default values for fields not provided
    const newJobData = {
      ...jobData,
      status: 'Open', // Default status
      created_at: new Date(), // Set creation timestamp
      updated_at: new Date(), // Set initial update timestamp
    };

    const [result] = await db(TABLE_NAME).insert(newJobData).returning('*');
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

  async findByRecruiterId(recruiter_id){
    return db(TABLE_NAME).where({ recruiterId: recruiter_id});
  },

  /**
   * Finds all job postings, optionally filtering by status.
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

    return query.select('*');
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
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async update(jobPostingId, updateData) {
    if (Object.keys(updateData).length === 0) {
      return 0; // No data to update
    }

    const updatedData = {
      ...updateData,
      updated_at: new Date(), // Set update timestamp
    };

    return db(TABLE_NAME).where({ job_posting_id: jobPostingId }).update(updatedData);
  },

  /**
   * Updates only the status of a job posting.
   * @async
   * @param {number} jobPostingId - The ID of the job posting.
   * @param {('Open'|'Closed')} newStatus - The new status.
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async updateStatus(jobPostingId, newStatus) {
    return db(TABLE_NAME)
      .where({ job_posting_id: jobPostingId })
      .update({
        status: newStatus,
        updated_at: new Date(), // Set update timestamp
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