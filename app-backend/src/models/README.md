# Database Models (Data Access Layer)

This directory contains modules responsible for direct interaction with the PostgreSQL database tables using Knex.

## Conventions

*   Models interact with tables using `snake_case` column names.
*   Functions generally return Promises.
*   Input data objects passed to create/update functions should have keys matching the `snake_case` column names.

## Models

### `user.model.js`

*   **Table:** `users`
*   **Purpose:** Manages user data (all roles: JobSeeker, Recruiter, Admin).
*   **Key Functions:**
    *   `create(userData)`: Creates a new user. Expects `username`, `email`, `password_hash`, `role`, etc. with snake_case keys if applicable. Returns the created user object.
    *   `findById(userId)`: Finds a user by ID. Returns user object or `undefined`.
    *   `findByUsername(username)`: Finds a user by username. Returns user object or `undefined`.
    *   `findByEmail(email)`: Finds a user by email. Returns user object or `undefined`.
    *   `update(userId, updateData)`: Updates user details. Returns number of affected rows.

### `jobPosting.model.js`

*   **Table:** `job_postings`
*   **Purpose:** Manages job posting data.
*   **Key Functions:**
    *   `create(jobData)`: Creates a new job posting. Expects `recruiter_id`, `title`, `description`, etc. Returns the created job object.
    *   `findById(jobPostingId)`: Finds a job posting by ID.
    *   `findAllOpen()`: Finds all job postings with 'Open' status.
    *   `findByRecruiterId(recruiterId)`: Finds all postings by a specific recruiter.
    *   `update(jobPostingId, updateData)`: Updates job posting details.
    *   `updateStatus(jobPostingId, newStatus)`: Updates only the status.

### `application.model.js`

*   **Table:** `applications`
*   **Purpose:** Manages job application data.
*   **Key Functions:**
    *   `create(applicationData)`: Creates a new application. Expects `job_seeker_id`, `job_posting_id`, etc. Returns the created application object.
    *   `findById(applicationId)`: Finds an application by ID.
    *   `findByJobPostingId(jobPostingId)`: Finds all applications for a job.
    *   `findByJobSeekerId(jobSeekerId)`: Finds all applications by a seeker.
    *   `updateStatus(applicationId, newStatus)`: Updates the application status. Returns number of affected rows.