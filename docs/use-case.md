# Simplified Use Cases for Recruitment Management System (RMS)

*(Remember: Login/Authentication is typically treated as a **precondition** for most role-specific actions below, rather than being listed as a separate primary use case on diagrams, to maintain clarity.)*

---

## 1. For the Job Seeker

### UC-S1: Register/Manage Account
- **Description:** Allows a new Job Seeker to create an account. Allows existing Job Seekers to log in, log out, and update their profile information (e.g., resume, contact details, skills). Also includes viewing their own application history and status.
- **Simplification:** Combines registration, login/logout functionality, profile management, and application tracking view into one user-centric management use case.

### UC-S2: Search/View Jobs
- **Description:** Allows Job Seekers (potentially including those not logged in) to browse, search (using filters like title, location, type), and view the detailed descriptions of open job postings.

### UC-S3: Apply for Job
- **Description:** Allows a logged-in Job Seeker to submit an application for a specific job posting, typically by attaching their profile information and/or resume.
- **Precondition:** Job Seeker is logged in. Job posting exists and is open.


---

## 2. For the Recruiter

### UC-R1: Manage Job Postings
- **Description:** Allows the Recruiter to create new job postings, view their own active/inactive postings, edit the details of postings they manage, and change the status (e.g., open, closed, archived).
- **Simplification:** Combines `CRUD` (Create, Read, Update, Delete/Close) operations for the job postings associated with the Recruiter.
- **Precondition:** Recruiter is logged in.

### UC-R2: Screen Candidates
- **Description:** Allows the Recruiter to view the list of applicants for specific job postings they manage. They can review individual applications (profile, resume) and change the application status (e.g., New, Under Review, Shortlisted, Rejected).
- **Precondition:** Recruiter is logged in. Applications exist for job postings managed by the Recruiter.

### UC-R3: Schedule Interviews
- **Description:** Allows the Recruiter to select shortlisted candidates for a specific job and propose interview times/details. (For simplicity, may assume the Recruiter schedules for themselves or assigns a predefined interviewer).
- **Precondition:** Recruiter is logged in. Candidate's application status is 'Shortlisted'.

### UC-R4: View Recruiter Dashboard (Optional)
- **Description:** Provides the logged-in Recruiter with a summary view or dashboard showing key information like their active job postings, count of new applicants, upcoming scheduled interviews, and potentially quick links to common tasks.
- **Precondition:** Recruiter is logged in.

---

## 3. For the Administrator

### UC-A1: Manage Recruiter Accounts
- **Description:** Allows the Administrator to create new user accounts with the 'Recruiter' role, view a list of existing Recruiter accounts, and enable/disable or modify these accounts as needed.
- **Precondition:** Administrator is logged in.

---
