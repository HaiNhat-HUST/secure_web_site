const applicationModel = require('../models/applicationModel');
const jobPostingModel = require('../models/jobPostingModel');



const handleError = (res, error, message = "An error occurred") => {
  console.error(message, error);
  res.status(500).json({create: false, message, error: error.message});

};


module.exports = {
  /**
   * @desc Get personal dashboard summary statistics (total applications, by status)
   * @route GET /api/dashboard/my-summary-stats
   * @access Private (JobSeeker, Recruiter)
   */
  getMySummaryStats: async (req, res) => {
    try {
      const userId = req.user.user_id; // Assuming your auth middleware sets req.user.user_id
      const userRole = req.user.role;  // And req.user.role

      let totalApplications;
      let applicationsByStatus;

      if (userRole === 'JobSeeker') {
        totalApplications = await applicationModel.countAllForSeeker(userId);
        applicationsByStatus = await applicationModel.countByStatusForSeeker(userId);
      } else if (userRole === 'Recruiter') {
        totalApplications = await applicationModel.countAllForRecruiter(userId);
        applicationsByStatus = await applicationModel.countByStatusForRecruiter(userId);
      } else {
        return res.status(403).json({ success: false, message: "User role not supported for this dashboard." });
      }

      res.json({
        success: true,
        data: {
          totalApplications,
          applicationsByStatus,
        },
      });
    } catch (error) {
      handleError(res, error, "Failed to fetch personal summary stats.");
    }
  },
  /**
   * @desc Get recent applications relevant to the logged-in user
   * @route GET /api/dashboard/my-recent-applications
   * @access Private (JobSeeker, Recruiter)
   * @queryparam limit - Number of recent applications (default: 5)
   */
  getMyRecentApplications: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const userRole = req.user.role;
      const limit = parseInt(req.query.limit, 10) || 5;
      let recentApplications;

      if (userRole === 'JobSeeker') {
        recentApplications = await applicationModel.getRecentApplicationsForSeeker(userId, limit);
      } else if (userRole === 'Recruiter') {
        recentApplications = await applicationModel.getRecentApplicationsForRecruiter(userId, limit);
      } else {
        return res.status(403).json({ success: false, message: "User role not supported." });
      }
      res.json({ success: true, data: recentApplications });
    } catch (error) {
      handleError(res, error, "Failed to fetch recent personal applications.");
    }
  },

  /**
   * @desc Get personal application submission/reception trends over time
   * @route GET /api/dashboard/my-application-trends
   * @access Private (JobSeeker, Recruiter)
   * @queryparam period - 'day', 'week', 'month' (default: 'day')
   */
  getMyApplicationTrends: async (req, res) => {
    try {
      const userId = req.user.user_id;
      const userRole = req.user.role;
      const period = req.query.period || 'day';
      const validPeriods = ['day', 'week', 'month'];

      if (!validPeriods.includes(period.toLowerCase())) {
        return res.status(400).json({ success: false, message: "Invalid period. Use 'day', 'week', or 'month'." });
      }

      let trends;
      if (userRole === 'JobSeeker') {
        trends = await applicationModel.getApplicationStatsOverTimeForSeeker(userId, period);
      } else if (userRole === 'Recruiter') {
        trends = await applicationModel.getApplicationStatsOverTimeForRecruiter(userId, period);
      } else {
        return res.status(403).json({ success: false, message: "User role not supported." });
      }
      res.json({ success: true, data: trends });
    } catch (error) {
      handleError(res, error, "Failed to fetch personal application trends.");
    }
  },

  // --- Recruiter Specific ---
  /**
   * @desc Get application statistics for a specific job posting owned by the recruiter
   * @route GET /api/dashboard/my-job-stats/:jobPostingId
   * @access Private (Recruiter only)
   */
  getRecruiterJobStats: async (req, res) => {
    try {
      if (req.user.role !== 'Recruiter') {
        return res.status(403).json({ success: false, message: "Access denied. Recruiter role required." });
      }

      const recruiterId = req.user.user_id;
      const jobPostingId = parseInt(req.params.jobPostingId, 10);

      if (isNaN(jobPostingId)) {
        return res.status(400).json({ success: false, message: "Invalid job posting ID." });
      }

      // Verify the recruiter owns this job posting
      const jobPosting = await jobPostingModel.findById(jobPostingId); // Assumes jobPostingModel.findById exists
      if (!jobPosting) {
        return res.status(404).json({ success: false, message: "Job posting not found." });
      }
      if (jobPosting.recruiter_id !== recruiterId) {
        return res.status(403).json({ success: false, message: "You do not own this job posting." });
      }

      const applicationsByStatus = await applicationModel.countByStatusForJobPosting(jobPostingId);
      
      res.json({
        success: true,
        data: {
          jobPostingId,
          jobTitle: jobPosting.title,
          applicationsByStatus,
        },
      });
    } catch (error) {
      handleError(res, error, "Failed to fetch recruiter job posting stats.");
    }
  },

  /**
   * @desc Get top N most applied-to job postings for the logged-in recruiter
   * @route GET /api/dashboard/my-top-jobs
   * @access Private (Recruiter only)
   * @queryparam limit - Number of top jobs (default: 5)
   */
  getRecruiterTopJobs: async (req, res) => {
    try {
      if (req.user.role !== 'Recruiter') {
        return res.status(403).json({ success: false, message: "Access denied. Recruiter role required." });
      }
      const recruiterId = req.user.user_id;
      const limit = parseInt(req.query.limit, 10) || 5;
      const topJobs = await applicationModel.getTopAppliedJobsForRecruiter(recruiterId, limit);
      res.json({ success: true, data: topJobs });
    } catch (error) {
      handleError(res, error, "Failed to fetch recruiter's top applied jobs.");
    }
  },
};
