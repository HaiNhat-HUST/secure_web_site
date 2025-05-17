import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState({ loading: false, error: '', success: '' });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setApplyStatus({ loading: false, error: err.message, success: '' });
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

    const fileError = validateFile(resumeFile);
    if (fileError) {
      setApplyStatus({ loading: false, error: fileError, success: '' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Please login to apply');

      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(`/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error('Application failed');

      setApplyStatus({ loading: false, error: '', success: 'Application submitted successfully!' });
      setApplyModalOpen(false);
      setResumeFile(null);
      setTimeout(() => setApplyStatus({ loading: false, error: '', success: '' }), 3000);
    } catch (err) {
      setApplyStatus({ loading: false, error: err.message, success: '' });
    }
  };

  if (!job) {
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
  
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 min-h-screen bg-blue-50">
      <button
        onClick={() => navigate('/jobs')}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Jobs
      </button>
      <div className="bg-white shadow-md rounded-xl p-6 border border-blue-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{job.title}</h1>
        <p className="text-gray-500 mb-3">{job.recruiter_display_name}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center bg-blue-100 px-2 py-1 rounded text-blue-700">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="inline-flex items-center bg-green-100 px-2 py-1 rounded text-green-700">
            {job.job_type?.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className="inline-flex items-center bg-slate-100 px-2 py-1 rounded text-slate-700">
            Posted: {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <p className="text-gray-700 mb-4">{job.description}</p>
        <button
          onClick={() => setApplyModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Apply Now
        </button>
      </div>
  
      {applyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Apply for {job.title}</h2>
            <form>
              <label className="block text-sm text-gray-700 mb-2">
                Upload Resume (PDF, DOC, DOCX, max 5MB)
              </label>
              <input
                type="file"
                onChange={(e) => setResumeFile(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleApply}
                  disabled={applyStatus.loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {applyStatus.loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
            {applyStatus.error && (
              <p className="mt-3 text-red-600">{applyStatus.error}</p>
            )}
            {applyStatus.success && (
              <p className="mt-3 text-green-600">{applyStatus.success}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;