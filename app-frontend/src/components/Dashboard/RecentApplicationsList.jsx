import React from 'react';
import { Link } from 'react-router-dom'; // If you want to link to job/application details

const RecentApplicationsList = ({ applications, userRole }) => {
  if (!applications || applications.length === 0) {
    return <p className="text-gray-600">No recent applications found.</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {userRole === 'JobSeeker' ? 'My Recent Applications' : 'Recent Applications Received'}
      </h3>
      <ul className="divide-y divide-gray-200">
        {applications.map((app) => (
          <li key={app.application_id} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-indigo-700">
                    {/* Assuming app.job_title is available from backend */}
                    {app.job_title || `Application ID: ${app.application_id}`}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(app.submission_date).toLocaleDateString()}
                  </p>
                </div>
                {userRole === 'Recruiter' && app.seeker_display_name && (
                  <p className="text-sm text-gray-600">
                    Applicant: {app.seeker_display_name}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  Status: <span className={`font-semibold ${
                    app.status === 'Hired' ? 'text-green-600' : 
                    app.status === 'Rejected' ? 'text-red-600' :
                    app.status === 'New' ? 'text-blue-600' :
                    app.status === 'UnderReview' ? 'text-yellow-600' :
                    'text-gray-700'
                  }`}>{app.status || app.application_status}</span> {/* Note: backend uses application_status for recruiter recent */}
                </p>
                {/* Optional: Link to job details or application details */}
                {/* <Link to={`/jobs/${app.job_posting_id}`} className="text-sm text-indigo-600 hover:underline">View Job</Link> */}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentApplicationsList;