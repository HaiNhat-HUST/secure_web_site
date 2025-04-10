# API Documentation

Nhìn chung thì phần dữ liệu JSON có gì sẽ do các attributes của tables tương ứng trong database quyết định, nên mn đừng quan tâm quá đến request body ở đây nha.

## Thống nhất tên gọi:
- Candidate là Job-seeker
- Job là JobPosting trong class.md của Duy hiện tại, là 1 tin tuyển dụng xác định bởi jobId
## Authentication & Job Seeker Management

### `POST /api/auth/register`
- **Use Case**: UC-S1: Register/Manage Account
- **Description**: Allows a new Job Seeker to create an account.
- **Request Body**:
  ```json
  { "username": "string",
    "email": "string",   
    "password": "string",
     "role": "Candidate"/"Recruiter"
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
    "email"/"username": "string", // tuy code
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

### `PUT /api/profile/userId`
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
  - `type`: (optional) Filter by job type (e.g., full-time, part-time)
- **Response**:
  - **Success**: 200 OK (returns a list of job postings)
  - **Failure**: 400 Bad Request (invalid query parameters)

---

### ` GET /api/jobs/apply/{jobId}`
- **Use Case**: UC-S3: Apply for Job
- **Description**: Allows a logged-in Job Seeker to apply for a specific job.
- **Request Body**:
  ```json
  {
    "jobId": "string",  //should it be a long integer?
    "resume": "file" //CV
  }
  ```
- **Response**:
  - **Success**: 201 Created (application submitted successfully)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

## Recruiter Management

### `POST /api/jobs`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to create a new job posting.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "requirements":"string",
    "type": "string", 
    "salary": "string"
  }
  ```
- **Response**:
  - **Success**: 201 Created (job posting created)
  - **Failure**: 400 Bad Request (invalid data)

---

### `GET /api/recruiter/job-postings`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to view their active and inactive job postings.
- **Response**:
  - **Success**: 200 OK (returns a list of job postings)
  - **Failure**: 400 Bad Request (if no job postings exist)

---

### `PUT /api/recruiter/job-postings/{jobId}`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to edit an existing job posting.
- **Request Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "location": "string",
    "type": "string",
    "salary": "string"
  }
  ```
- **Response**:
  - **Success**: 200 OK (job posting updated)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `DELETE /api/recruiter/job-postings/{jobId}/close`
- **Use Case**: UC-R1: Manage Job Postings
- **Description**: Allows a Recruiter to delete a job posting.
- **Response**:
  - **Success**: 200 OK (job posting closed)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `GET /api/recruiter/{jobId}/candidates`
- **Use Case**: UC-R2: Screen Candidates
- **Description**: Allows a Recruiter to view the list of applicants for a job posting they manage.
- **Query Parameters**:
  - `jobId`: The ID of the job posting for which the recruiter wants to see applicants.
- **Response**:
  - **Success**: 200 OK (returns a list of applicants)
  - **Failure**: 400 Bad Request (invalid job posting ID)

---

### `PUT /api/recruiter/candidates/{candidateId}/status`
- **Use Case**: UC-R2: Screen Candidates
- **Description**: Allows a Recruiter to change the status of a candidate’s application (e.g., New, Under Review, Shortlisted, Rejected).
- **Request Body**:
  ```json
  {
    "status": "string"
  }
  ```
- **Response**:
  - **Success**: 200 OK (status updated)
  - **Failure**: 400 Bad Request (invalid candidate ID or status)

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
- **Response**:
  - **Success**: 201 Created (interview scheduled)
  - **Failure**: 400 Bad Request (invalid data)

---

### `GET /api/recruiter/dashboard`
- **Use Case**: UC-R4: View Recruiter Dashboard
- **Description**: Allows a Recruiter to view a dashboard with their active job postings, applicant count, and scheduled interviews.
- **Response**:
  - **Success**: 200 OK (returns dashboard data)
  - **Failure**: 400 Bad Request (if no data available)

---

## Administrator Management

### `GET /api/admin/users`
- **Use Case**: UC-A1: View User Accounts
- **Description**: Allows an Administrator to view the list of existing accounts.
- **Response**:
  - **Success**: 200 OK (returns list of recruiters)
  - **Failure**: 400 Bad Request (if no recruiters exist)


### `DELETE /api/admin/users/{userId}`
- **Use Case**: UC-A1: Manage Recruiter Accounts
- **Description**: Allows an Administrator to disable or delete a Recruiter account.
- **Response**:
  - **Success**: 200 OK (account deleted or disabled)
  - **Failure**: 400 Bad Request (invalid recruiter ID)
