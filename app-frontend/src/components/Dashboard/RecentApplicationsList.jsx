import React from 'react';
import { Link } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'hired': return 'text-green-600 bg-green-100';
    case 'rejected': return 'text-red-600 bg-red-100';
    case 'new': return 'text-blue-600 bg-blue-100';
    case 'underreview': // Note: 'UnderReview' often becomes 'underreview' in URLs or keys
    case 'under review':
      return 'text-yellow-600 bg-yellow-100';
    case 'shortlisted': return 'text-purple-600 bg-purple-100';
    case 'interviewscheduled':
    case 'interview scheduled':
      return 'text-teal-600 bg-teal-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

const RecentApplicationsList = ({ applications, userRole }) => {
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent applications</h3>
        <p className="mt-1 text-sm text-gray-500">
          {userRole === 'JobSeeker' ? "You haven't applied to any jobs recently." : "No new applications have been received recently."}
        </p>
      </div>
    );
  }
  
  // Ensure consistent status field. The dashboard API might return 'application_status'
  // while other parts of your app might use 'status'.
  const getAppStatus = (app) => app.application_status || app.status;


  return (
    // Removed redundant wrapper, assuming parent provides bg-white, shadow, etc.
    // If not, add it back: <div className="bg-white shadow-lg rounded-lg p-6">
    <>
      {/* The parent <section> in RecruiterDashboard already has heading, so this might be redundant */}
      {/* <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {userRole === 'JobSeeker' ? 'My Recent Applications' : 'Recent Applications Received'}
      </h3> */}
      <ul className="divide-y divide-gray-200">
        {applications.map((app) => (
          <li key={app.application_id} className="py-4 hover:bg-gray-50 transition-colors duration-150">
            <Link 
              // For recruiter, link to the list of candidates for that job, potentially highlighting this application
              to={userRole === 'Recruiter' ? `/recruiter/job-postings/${app.job_posting_id}/candidates?app=${app.application_id}` : `/applications/${app.application_id}`} // Or job seeker's application detail page
              className="block no-underline"
            >
              <div className="flex items-center space-x-4">
                {/* Optional: Applicant Avatar or Icon */}
                {/* <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600">
                    {app.job_seeker_display_name ? app.job_seeker_display_name.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div> */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-md font-medium text-indigo-700 truncate group-hover:underline">
                      {app.job_title || `Application for Job ID: ${app.job_posting_id}`}
                    </p>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(app.submission_date).toLocaleDateString()}
                    </p>
                  </div>
                  {userRole === 'Recruiter' && app.job_seeker_display_name && (
                    <p className="text-sm text-gray-600 mt-1">
                      Applicant: <span className="font-semibold">{app.job_seeker_display_name}</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">
                    Status: 
                    <span className={`ml-2 px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(getAppStatus(app))}`}>
                      {getAppStatus(app)}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RecentApplicationsList;