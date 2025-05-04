import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify'; // For sanitizing data to prevent XSS

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  // Function to fetch CSRF token
  const fetchCsrfToken = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/csrf-token');
      setCsrfToken(response.data.csrfToken);
      
      // Set the CSRF token for all axios requests
      axios.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      setError('Security initialization failed. Please refresh the page.');
    }
  }, []);

  // Configure axios defaults
  useEffect(() => {
    // Set withCredentials to true for all requests to include cookies
    axios.defaults.withCredentials = true;
    
    // Fetch CSRF token on component mount
    fetchCsrfToken();
  }, [fetchCsrfToken]);

  // Fetch job posts from the backend API
  const fetchJobPostings = useCallback(async () => {
    if (!csrfToken) return; // Don't fetch jobs until we have CSRF token
    
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/jobs', {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      });
      
      // Sanitize data to prevent XSS before setting to state
      const sanitizedJobs = response.data.map(job => ({
        ...job,
        title: DOMPurify.sanitize(job.title),
        company: job.company ? DOMPurify.sanitize(job.company) : 'N/A',
        location: job.location ? DOMPurify.sanitize(job.location) : 'N/A',
        job_type: job.job_type ? DOMPurify.sanitize(job.job_type) : 'N/A',
        postedDate: job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'
      }));
      
      setJobs(sanitizedJobs);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch job data');
      setLoading(false);
    }
  }, [csrfToken]);

  useEffect(() => {
    if (csrfToken) {
      fetchJobPostings();
    }
  }, [csrfToken, fetchJobPostings]);

  // Error handling for failed API requests
  const handleRetry = () => {
    setError(null);
    fetchJobPostings();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner-border text-blue-500" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="ml-2 text-lg">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-red-500 mb-4">Error: {error}</p>
        <button 
          onClick={handleRetry}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">Job Feed</h2>
      
      {jobs.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No jobs available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <Link 
                to={`/job/${job.id}`} 
                className="block"
                // Use data attribute instead of risky title attribute
                data-job-id={job.id}
              >
                <h3 className="text-xl font-bold text-blue-600 mb-3 hover:underline">
                  {/* Sanitized in state creation */}
                  {job.title}
                </h3>
              </Link>
              <div className="text-gray-600">
                <p className="mb-2">
                  <span className="font-semibold">Company:</span> {job.company}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Location:</span> {job.location}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Type:</span> {job.job_type}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Posted:</span> {job.postedDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobFeed;