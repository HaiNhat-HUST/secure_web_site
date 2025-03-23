import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
  const { jobId } = useParams(); // Get jobId from the URL parameters
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details from API based on jobId
  useEffect(() => {
    axios
      .get(`https://your-api-url.com/jobs/${jobId}`) // Replace with your actual API URL
      .then((response) => {
        setJob(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch job details.');
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return <p className="text-center text-lg">Loading job details...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  if (!job) {
    return <p className="text-center text-lg text-red-500">Job not found.</p>;
  }

  return (
    <div className="container mx-auto p-5">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-semibold text-center mb-4">{job.title}</h2>
        <p className="text-lg mb-2">Company: {job.company}</p>
        <p className="text-lg mb-2">Type: {job.type}</p>
        <p className="text-lg mb-2">Location: {job.location}</p>
        <p className="text-lg mb-4">Salary: ${job.salary}</p>
        <p className="text-gray-700 mb-6">{job.description}</p>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Submit CV & Apply</h3>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-md mb-4 w-full"
          />
          <button className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 transition-colors">
            Submit CV
          </button>
        </div>

        <div className="social-share mb-8">
          <h3 className="text-xl font-semibold mb-2">Share this job:</h3>
          <div className="flex gap-4">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://your-job-url.com/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Share on Facebook
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=https://your-job-url.com/${job.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>

        <Link to="/" className="block text-center text-blue-600 hover:underline">
          Go Back to Job Feed
        </Link>
      </div>
    </div>
  );
};

export default JobDetail;
