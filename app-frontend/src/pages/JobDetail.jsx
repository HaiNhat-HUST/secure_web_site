import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState({ loading: false, error: '', success: '' });
  const [isLoadingJob, setIsLoadingJob] = useState(true); // For job loading state

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoadingJob(true); // Start loading
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to fetch job details' }));
          throw new Error(errorData.message || 'Failed to fetch job details');
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setApplyStatus({ loading: false, error: err.message, success: '' }); // Use applyStatus for general errors too
      } finally {
        setIsLoadingJob(false); // Stop loading
      }
    };
    fetchJobDetails();
  }, [jobId]);

  const validateFile = useCallback((file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!file) return 'Please select a file';
    if (!allowedTypes.includes(file.type)) return 'Invalid file type. Only PDF, DOC, DOCX allowed';
    if (file.size > maxSize) return 'File too large. Maximum 5MB allowed';
    return null;
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyStatus({ loading: true, error: '', success: '' });

    const token = localStorage.getItem('token');
    if (!token) {
      setApplyStatus({ loading: false, error: 'You are not logged in. Please login to apply.', success: '' });
      // Redirect to login if token is missing locally
      setTimeout(() => navigate('/login'), 3000); // Give user time to see message
      return;
    }

    const fileError = validateFile(resumeFile);
    if (fileError) {
      setApplyStatus({ loading: false, error: fileError, success: '' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      // Corrected API URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' is automatically set by browser with boundary for FormData
        },
        body: formData,
      });

      const responseData = await response.json(); // Attempt to parse JSON for all responses

      if (!response.ok) {
        if (response.status === 401) { // Unauthorized from backend (e.g. token expired, invalid)
          localStorage.removeItem('authToken'); // Clear invalid token
          setApplyStatus({ loading: false, error: responseData.message || 'Session expired or invalid. Please login again.', success: '' });
          setTimeout(() => navigate('/login'), 1500); // Redirect to login
        } else {
          // For other errors (400, 403, 404, 429, 500 etc.)
          setApplyStatus({ loading: false, error: responseData.message || `Application failed with status: ${response.status}`, success: '' });
        }
        return; // Important: stop further processing
      }

      // Success
      setApplyStatus({ loading: false, error: '', success: responseData.message || 'Application submitted successfully!' });
      setApplyModalOpen(false);
      setResumeFile(null);
      // Optionally, clear the success message after a few seconds
      setTimeout(() => setApplyStatus(prev => ({ ...prev, success: '' })), 3000);

    } catch (err) {
      // Catches network errors or errors from await response.json() if response wasn't JSON
      console.error("Application submission error:", err);
      setApplyStatus({ loading: false, error: err.message || 'An unexpected error occurred during application.', success: '' });
    }
  };

  if (isLoadingJob) { // Use specific loading state for job details
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg className="animate-spin h-6 w-6 text-indigo-500 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <span className="text-gray-600 dark:text-gray-400">Loading job details...</span>
      </div>
    );
  }

  if (applyStatus.error && !job) { // If there was an error fetching job and job is null
      return (
          <div className="flex flex-col justify-center items-center min-h-screen text-red-500">
              <p>Error loading job details: {applyStatus.error}</p>
              <button
                  onClick={() => navigate('/jobs')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                  Back to Jobs
              </button>
          </div>
      );
  }
  
  if (!job) { // Fallback if still no job after loading and no specific error shown above
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
            <p>Job not found or could not be loaded.</p>
            <button
                onClick={() => navigate('/jobs')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Back to Jobs
            </button>
        </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 min-h-screen bg-blue-50">
      <button
        onClick={() => navigate(-1)} // More generic back navigation
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h1>
        <p className="text-gray-500 mb-3">{job.recruiter_display_name || job.recruiter?.company_name || 'Company Confidential'}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center bg-blue-100 px-2 py-1 rounded text-blue-700">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location || "N/A"}
          </span>
          <span className="inline-flex items-center bg-green-100 px-2 py-1 rounded text-green-700">
            {job.job_type?.replace(/([A-Z])/g, ' $1').trim() || "N/A"}
          </span>
          <span className="inline-flex items-center bg-slate-100 px-2 py-1 rounded text-slate-700">
            Posted: {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{job.description || "No description available."}</p> {/* Added whitespace-pre-wrap */}
        <button
          onClick={() => setApplyModalOpen(true)}
          disabled={job.status !== 'Open'} // Disable if job is not open
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {job.status === 'Open' ? 'Apply Now' : `Status: ${job.status}`}
        </button>
      </div>
  
      {applyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"> {/* Added z-index */}
          <div className="bg-white rounded-xl p-5 w-full max-w-md"> {/* Increased max-w */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-900">Apply for {job.title}</h2>
              <button onClick={() => setApplyModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleApply}> {/* Use onSubmit on form for better accessibility */}
              <div className="mb-4">
                <label htmlFor="resumeFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume
                </label>
                <input
                  id="resumeFile"
                  type="file"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required // Make file input required by form
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX. Max 5MB.</p>
              </div>
              
              {applyStatus.error && (
                <p className="my-2 text-sm text-red-600 bg-red-100 p-2 rounded">{applyStatus.error}</p>
              )}
              {applyStatus.success && (
                <p className="my-2 text-sm text-green-600 bg-green-100 p-2 rounded">{applyStatus.success}</p>
              )}

              <div className="flex justify-end mt-5 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setApplyModalOpen(false);
                    setApplyStatus({loading: false, error: '', success: ''}); // Reset status on cancel
                    setResumeFile(null); // Reset file on cancel
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit" // Submit button for the form
                  disabled={applyStatus.loading || !resumeFile} // Disable if loading or no file
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applyStatus.loading ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                    </>
                  ) : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;