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
      .orderBy('submission_date', 'asc') // Or desc?
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
  }
};