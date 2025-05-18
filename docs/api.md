# API Documentation

## Note
- Candidate = Job-seeker
- Job = JobPosting 

## Authentication & Job Seeker Management

### `POST /api/auth/register`
- **Use Case**: UC-S1: Register/Manage Account
- **Description**: Allows a new Job Seeker to create an account.
- **Request Body**:
  ```json
  { "username": "string",
    "email": "string",   
    "password": "string",
  }
  ```
- **Response**:
  - **Success**: 201 Created
  - **Failure**: 400 Bad Request (if missing required fields)

---

### `POST /api/auth/login`
- **Use Case**: UC-S1: Register/Manage Account
- **Description**: Allows an existing user to log in using email and password.
- **Request Body**:
  ```json
  {
    "email": "string", // or "username": "string"
    "password": "string"
  }
  ```
- **Response**:
  - **Success**: 200 OK (with authentication token)
  - **Failure**: 401 Unauthorized (invalid credentials)

---

### `POST /api/auth/logout`
- **Use Case**: UC-S1: Register/Manage Account
- **Description**: Allows user to log out.
- **Response**:
  - **Success**: 200 OK
  - **Failure**: 400 Bad Request (if user is not logged in)

---

### `PUT /api/profile/:userId`
- **Use Case**: UC-S1: Register/Manage Account
- **Description**: Allows a logged-in user to update their profile information (e.g., resume, contact details, skills).
- **Request Body**: differs between Candidate and Recruiter
- **Response**:
  - **Success**: 200 OK
  - **Failure**: 400 Bad Request (missing required fields)

---

###  `GET /api/jobs`
- **Use Case**: UC-S2: Search/View Jobs
- **Description**: Allows users to view all current job postings.
- **Query Parameters**:
  - `title`: (optional) Filter by job title
  - `location`: (optional) Filter by job location
  - `type`: (optional) Filter by job type (`FullTime`, `PartTime`, `Contract`)
  - `page`: (optional) Page number (default: 1)
  - `limit`: (optional) Items per page (default: 12)
- **Response**:
  - **Success**: 200 OK (returns a list of job postings)
  - **Failure**: 400 Bad Request (invalid query parameters)

---

### `GET /api/jobs/:jobId`
- **Use Case**: UC-S2: View Job Detail
- **Description**: Allows users to view details of a specific job posting.
- **Response**:
  - **Success**: 200 OK (returns job detail)
  - **Failure**: 404 Not Found (invalid job posting ID)

---

### `POST /api/jobs/apply/:jobId`
- **Use Case**: UC-S3: Apply for Job
- **Description**: Allows a logged-in Job Seeker to apply for a specific job.
- **Request**: `multipart/form-data`
  - **Fields**:
    - `resume`: file (PDF, DOC, DOCX, max 5MB)
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 201 Created (application submitted successfully)
  - **Failure**: 400 Bad Request (invalid job posting ID or file)

---

## Recruiter Management

### `POST /api/recruiter/job-postings`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to create a new job posting.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "job_type": "FullTime" | "PartTime" | "Contract"
  }
  ```
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 201 Created (job posting created)
  - **Failure**: 400 Bad Request (invalid data)

---

### `GET /api/recruiter/job-postings`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to view their active and inactive job postings.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (returns a list of job postings)
  - **Failure**: 400 Bad Request (if no job postings exist)

---

### `PUT /api/recruiter/job-postings/:jobId`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to edit an existing job posting.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "job_type": "FullTime" | "PartTime" | "Contract"
  }
  ```
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (job posting updated)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `POST /api/recruiter/job-postings/:jobId/close`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to close a job posting.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (job posting closed)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `DELETE /api/recruiter/job-postings/:jobId`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to delete a job posting.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (job posting deleted)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `GET /api/recruiter/job-postings/:jobId/candidates`
- **Use Case**: UC-R2: Screen Candidates
- **Description**: Allows a Recruiter to view the list of applicants for a job posting they manage.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (returns a list of applicants)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `PUT /api/recruiter/applications/:applicationId/status`
- **Use Case**: UC-R2: Screen Candidates
- **Description**: Allows a Recruiter to change the status of a candidate’s application (e.g., New, Under Review, Shortlisted, Rejected).
- **Request Body**:
  ```json
  {
    "status": "string"
  }
  ```
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (status updated)
  - **Failure**: 400 Bad Request (invalid application ID or status)

---

### `POST /api/recruiter/interview`
- **Use Case**: UC-R3: Schedule Interviews
- **Description**: Allows a Recruiter to schedule an interview for a shortlisted candidate.
- **Request Body**:
  ```json
  {
    "candidateId": "string",
    "interviewTime": "string",
    "interviewLocation": "string",
    "interviewer": "string"
  }
  ```
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 201 Created (interview scheduled)
  - **Failure**: 400 Bad Request (invalid data)

---

### `GET /api/recruiter/dashboard`
- **Use Case**: UC-R4: View Recruiter Dashboard
- **Description**: Allows a Recruiter to view a dashboard with their active job postings, applicant count, and scheduled interviews.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (returns dashboard data)
  - **Failure**: 400 Bad Request (if no data available)

---

## Administrator Management

### `GET /api/admin/users`
- **Use Case**: UC-A1: View User Accounts
- **Description**: Allows an Administrator to view the list of existing accounts.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (returns list of recruiters)
  - **Failure**: 400 Bad Request (if no recruiters exist)

### `DELETE /api/admin/users/:userId`
- **Use Case**: UC-A1: Manage Recruiter Accounts
- **Description**: Allows an Administrator to disable or delete a Recruiter account.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Response**:
  - **Success**: 200 OK (account deleted or disabled)
  - **Failure**: 400 Bad Request (invalid recruiter ID)
