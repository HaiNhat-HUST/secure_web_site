import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const JobDetail = () => {
  const { jobID } = useParams(); // Get jobID from URL params
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job details from the backend based on jobID
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`/api/jobs/${jobID}`); // Backend API endpoint
        setJob(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch job details.');
        setLoading(false);
      }
    };
    fetchJobDetails();
  }, [jobID]);

  // Handle loading state
  if (loading) {
    return <p className="text-center text-lg">Loading job details...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  // Handle missing job data
  if (!job) {
    return <p className="text-center text-lg text-red-500">Job not found.</p>;
  }

  // Render job details
  return (
    <div className="container mx-auto py-8 px-4 lg:px-20">
      <div className="bg-white p-10 rounded-lg shadow-md">
        {/* Job Title */}
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-5">
          {job.title}
        </h1>

        {/* Job Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-lg font-medium">
              <strong>Location:</strong> {job.location}
            </p>
            <p className="text-lg font-medium">
              <strong>Posted By:</strong> {job.postedBy}
            </p>
            <p className="text-lg font-medium">
              <strong>Date Posted:</strong> {new Date(job.postedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Description</h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* Job Requirements */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Requirements</h3>
          <p className="text-gray-600 leading-relaxed">{job.requirements}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Salary</h3>
          <p className="text-gray-600 leading-relaxed">{job.salary}</p>
        </div>

        {/* Apply Section */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Apply?</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Implement applyForJob logic here
              alert('Your application has been submitted!');
            }}
            encType="multipart/form-data"
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all"
            >
              Submit Your Application
            </button>
          </form>
        </div>

        {/* Back to Job Feed Link */}
        <Link
          to="/"
          className="block text-center text-lg font-medium text-blue-600 hover:underline"
        >
          ← Back to Job Feed
        </Link>
      </div>
    </div>
  );
};

export default JobDetail;
