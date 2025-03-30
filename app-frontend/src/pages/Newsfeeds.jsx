import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job posts from MongoDB (viewJobPostings)
  const viewJobPostings = async () => {
    try {
      const response = await axios.get('/api/jobs'); 
      setJobs(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch job data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    viewJobPostings(); // Call the function on component mount
  }, []);

  const applyForJob = async (jobID, applicant, resume) => {
    try {
      const formData = new FormData();
      formData.append('jobID', jobID);
      formData.append('applicant', JSON.stringify(applicant)); // Pass applicant object as JSON
      formData.append('resume', resume);

      await axios.post('/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted successfully!');
    } catch (err) {
      alert(`Failed to submit application: ${err.message}`);
    }
  };

  if (loading) {
    return <p className="text-center text-lg">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-4xl font-semibold text-center mb-8">Job Feed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-lg rounded-lg p-5 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <Link to={`/job/${job.id}`} className="block">
              <h3 className="text-xl font-bold text-blue-600 mb-2">{job.title}</h3>
            </Link>
            <div className="text-gray-600">
              <p>Company: {job.company}</p>
              <p>Location: {job.location}</p>
              <p>Salary: ${job.salary}</p>
              <button
                onClick={() => applyForJob(job.id, { name: 'John Doe', email: 'john@example.com' }, 'resume.pdf')} // Example values
                className="mt-3 p-2 bg-blue-500 text-white rounded"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;
