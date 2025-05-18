import React from 'react';
import { Link } from 'react-router-dom';

const TopJobsList = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return <p className="text-gray-600">No job application data available yet.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Applied Jobs</h3>
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job.job_posting_id} className="py-3">
            <div className="flex items-center justify-between">
              <Link to={`/jobs/${job.job_posting_id}`} className="text-md font-medium text-indigo-700 hover:underline">
                {job.job_title}
              </Link>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{job.application_count}</span> Applications
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopJobsList;