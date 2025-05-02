import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job posts from the backend API
  const fetchJobPostings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/jobs'); // Backend API
      setJobs(response.data); // Set the fetched jobs to state
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch job data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobPostings(); // Call the function on component mount
  }, []);

  if (loading) {
    return <p className="text-center text-lg">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">Job Feed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/job/${job.id}`} className="block">
              <h3 className="text-xl font-bold text-blue-600 mb-3 hover:underline">
                {job.title}
              </h3>
            </Link>
            <div className="text-gray-600">
              <p className="mb-2">
                <span className="font-semibold">Company:</span> {job.company || 'N/A'}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Location:</span> {job.location || 'N/A'}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Type:</span>{' '}
                {job.salary ? `$${job.job_type}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Posted:</span> {job.postedDate || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;