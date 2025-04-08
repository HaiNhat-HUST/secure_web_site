# Class Diagram

### **Các Lớp (Classes) Chính:**

1.  **`User` (Lớp trừu tượng hoặc cơ sở):**
    *   `userId` (string/int - Khóa chính)
    *   `username` (string)
    *   `passwordHash` (string)
    *   `email` (string)
    *   `role` (enum: JobSeeker, Recruiter, Administrator)
    *   `isActive` (boolean)
    *   `login()`
    *   `logout()`
    *   `updateProfile()` (có thể được ghi đè ở lớp con)

2.  **`JobSeeker` (Kế thừa từ `User`):**
    *   `contactDetails` (string)
    *   `skills` (list<string>)
    *   `resumeData` (string/blob/link)
    *   `viewApplicationHistory()`
    *   `applyForJob(JobPosting)`
    *   `updateProfile()`

3.  **`Recruiter` (Kế thừa từ `User`):**
    *   `department` (string - tùy chọn)
    *   `createJobPosting(...)`
    *   `editJobPosting(JobPosting)`
    *   `viewManagedPostings()`
    *   `viewApplicants(JobPosting)`
    *   `updateApplicationStatus(Application, status)` // Dùng để cập nhật trạng thái, bao gồm cả giai đoạn phỏng vấn
    *   `viewDashboardData()`

4.  **`Administrator` (Kế thừa từ `User`):**
    *   `createRecruiterAccount(...)`
    *   `manageRecruiterAccount(Recruiter, action)`

5.  **`JobPosting`:**
    *   `jobPostingId` (string/int - Khóa chính)
    *   `title` (string)
    *   `description` (string)
    *   `location` (string)
    *   `jobType` (enum: FullTime, PartTime, Contract)
    *   `status` (enum: Open, Closed, Archived)
    *   `postingDate` (date)
    *   `closingDate` (date - tùy chọn)
    *   `changeStatus(newStatus)`
    *   `getApplicants()`

6.  **`Application`:**
    *   `applicationId` (string/int - Khóa chính)
    *   `submissionDate` (date)
    *   `status` (enum: New, UnderReview, Shortlisted, Rejected, Hired, *InterviewScheduled* - có thể thêm trạng thái này)
    *   `resumeSnapshot` (string/blob/link)
    *   `updateStatus(newStatus)` // Phương thức này sẽ được Recruiter gọi


### **Mối Quan Hệ Chính (Relationships):**

*   **Inheritance:**
    *   `JobSeeker` ---|> `User`
    *   `Recruiter` ---|> `User`
    *   `Administrator` ---|> `User`
*   **Association:**
    *   `JobSeeker` (1) -- 0..* `Application` (Một Job Seeker có thể có nhiều Application)
    *   `JobPosting` (1) -- 0..* `Application` (Một Job Posting có thể có nhiều Application)
    *   `Application` (1) -- 1 `JobSeeker` (Mỗi Application thuộc về một Job Seeker)
    *   `Application` (1) -- 1 `JobPosting` (Mỗi Application ứng tuyển cho một Job Posting)
    *   `Recruiter` (1) -- 0..* `JobPosting` (Một Recruiter quản lý nhiều Job Posting)
    *   `JobPosting` (1) -- 1 `Recruiter` (Một Job Posting được quản lý bởi một Recruiter - Giả định)
    *   `Administrator` (1) -- 0..* `Recruiter` (Một Admin quản lý nhiều Recruiter)
    *   *(Ghi chú: Recruiter tương tác với Application thông qua JobPosting mình quản lý)*
