const db = require('../config/database');
const TABLE_NAME = 'job_postings';
const USERS_TABLE = 'users'; // For joining to get recruiter info

module.exports = {
  /**
   * Creates a new job posting.
   * @async
   * @param {object} jobData - Job posting data. Keys should match snake_case column names.
   * @returns {Promise<object | undefined>} The created job posting object or undefined if creation failed.
   */
  async create(jobData) {
    const newJobData = {
      ...jobData, // Expects recruiter_id, title, description, job_type
      status: jobData.status || 'Open',
      posting_date: jobData.posting_date || new Date(), // Add posting_date if it's a separate field
      created_at: new Date(),
      updated_at: new Date(),
    };
    const [result] = await db(TABLE_NAME).insert(newJobData).returning('*');
    return result;
  },

  /**
   * Finds a job posting by its ID (basic find).
   * @async
   * @param {number} jobPostingId - The ID of the job posting to find.
   * @returns {Promise<object | undefined>} The job posting object or undefined if not found.
   */
  async findById(jobPostingId) {
    return db(TABLE_NAME).where({ job_posting_id: jobPostingId }).first();
  },

  /**
   * Finds an OPEN job posting by its ID along with recruiter details for public display.
   * @async
   * @param {number} jobPostingId - The ID of the job posting to find.
   * @returns {Promise<object | undefined>} The detailed job posting object or undefined if not found or not open.
   */
  async findOpenJobDetailsById(jobPostingId) {
    return db(TABLE_NAME)
      .leftJoin(USERS_TABLE, `${TABLE_NAME}.recruiter_id`, `${USERS_TABLE}.user_id`)
      .where({
        [`${TABLE_NAME}.job_posting_id`]: jobPostingId,
        [`${TABLE_NAME}.status`]: 'Open' // Only fetch 'Open' jobs for public view
      })
      .select(
        `${TABLE_NAME}.job_posting_id`,
        `${TABLE_NAME}.title`,
        `${TABLE_NAME}.description`,
        `${TABLE_NAME}.location`,
        `${TABLE_NAME}.job_type`,
        `${TABLE_NAME}.status`,
        `${TABLE_NAME}.posting_date`, // Or use created_at if posting_date is not explicitly set
        `${TABLE_NAME}.created_at`,
        `${TABLE_NAME}.updated_at`,
        `${TABLE_NAME}.closing_date`,
        `${TABLE_NAME}.recruiter_id`,
        `${USERS_TABLE}.display_name as recruiter_display_name`,
        `${USERS_TABLE}.email as recruiter_email` 
      )
      .first();
  },

  async findByRecruiterId(recruiter_id, filters = {}) { // Added filters and corrected recruiterId to recruiter_id
    let query = db(TABLE_NAME).where({ recruiter_id: recruiter_id });
     if (filters.status) {
        query = query.where({ status: filters.status });
    }
    return query.orderBy('created_at', 'desc').select('*');
  },

  /**
   * Finds all job postings, optionally filtering. For public newsfeed, selects summary fields.
   * @async
   * @param {object} [filters={}] - Optional filters object.
   * @returns {Promise<object[]>} An array of job posting summary objects.
   */
  async findAllOpenWithSummary(filters = {}) { // Later used for Recruiter dashboard
    let query = db(TABLE_NAME)
      .leftJoin(USERS_TABLE, `${TABLE_NAME}.recruiter_id`, `${USERS_TABLE}.user_id`)
      .where({ [`${TABLE_NAME}.status`]: 'Open' });

    // Efficient, simple search by title (ILIKE for PostgreSQL, case-insensitive, substring match)
    if (filters.title) {
      query = query.where(`${TABLE_NAME}.title`, 'ILIKE', `%${filters.title}%`);
    }

    // Exact type match for job_type (enum: FullTime, PartTime, Contract)
    if (filters.type || filters.job_type) { // support both frontend param 'type' or backend 'job_type'
      const t = filters.type || filters.job_type;
      query = query.where(`${TABLE_NAME}.job_type`, t);
    }

    // Simple substring search for location (case-insensitive)
    if (filters.location) {
      query = query.whereRaw(`LOWER(${TABLE_NAME}.location) LIKE ?`, [`%${filters.location.toLowerCase()}%`]);
    }

    query = query.orderBy(`${TABLE_NAME}.posting_date`, 'desc'); // Or created_at

    return query.select(
        `${TABLE_NAME}.job_posting_id`,
        `${TABLE_NAME}.title`,
        `${TABLE_NAME}.description`, // Frontend will truncate
        `${TABLE_NAME}.location`,
        `${TABLE_NAME}.job_type`,
        `${TABLE_NAME}.posting_date`, // Or created_at
        `${USERS_TABLE}.display_name as recruiter_display_name`
    );
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
  async update(jobPostingId, recruiter_id, updateData) { // Added recruiter_id for ownership check
    if (Object.keys(updateData).length === 0) {
      return 0; // No data to update
    }
    const dataToUpdate = {
      ...updateData,
      updated_at: new Date(), // Set update timestamp
    };
    return db(TABLE_NAME)
      .where({ job_posting_id: jobPostingId, recruiter_id: recruiter_id }) // Enforce ownership
      .update(dataToUpdate);
  },

  /**
   * Updates only the status of a job posting.
   * @async
   * @param {number} jobPostingId - The ID of the job posting.
   * @param {('Open'|'Closed')} newStatus - The new status.
   * @returns {Promise<number>} The number of rows updated (0 or 1).
   */
  async updateStatus(jobPostingId, recruiter_id, newStatus) { // Added recruiter_id
    const updatePayload = {
      status: newStatus,
      updated_at: new Date(), // Set update timestamp
    };
    if (newStatus === 'Closed') {
      updatePayload.closing_date = new Date();
    }
    return db(TABLE_NAME)
      .where({ job_posting_id: jobPostingId, recruiter_id: recruiter_id }) // Enforce ownership
      .update(updatePayload);
  },

  /**
   * Deletes a job posting by its ID.
   * @async
   * @param {number} jobPostingId - The ID of the job posting to delete.
   * @returns {Promise<number>} The number of rows deleted (0 or 1).
   */
  async delete(jobPostingId, recruiter_id) { // Added recruiter_id
    return db(TABLE_NAME)
        .where({ job_posting_id: jobPostingId, recruiter_id: recruiter_id }) // Enforce ownership
        .del();
  },

  /**
   * Checks if a job with the same title and description already exists for a specific recruiter.
   * This helps prevent spamming identical job posts.
   * @async
   * @param {string} title - The title of the job.
   * @param {string} description - The description of the job.
   * @param {number} recruiter_id - The ID of the recruiter.
   * @returns {Promise<object | undefined>} The existing job posting if found, otherwise undefined.
   */
  async findExistingJobByContent(title, description, recruiter_id) {
    return db(TABLE_NAME)
      .where({
        title: title,
        // Note: Comparing long description texts directly can be tricky.
        // For very long descriptions, you might consider hashing the description
        // and storing/comparing hashes, or using a more sophisticated text similarity check.
        // For now, a direct comparison is implemented.
        description: description,
        recruiter_id: recruiter_id,
        status: 'Open' // Optional: Only consider 'Open' jobs as duplicates, or all jobs by this recruiter
      })
      .first();
  },

  // For Dashboard Stats
  async countByRecruiterAndStatus(recruiter_id, status) {
    const result = await db(TABLE_NAME)
      .where({ recruiter_id: recruiter_id, status: status })
      .count('job_posting_id as count')
      .first();
    return result ? parseInt(result.count, 10) : 0;
  },
};
