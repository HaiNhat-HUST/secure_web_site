// src/components/Dashboard/RecruiterJobPostingsList.js (New or renamed file)
import React from 'react';
import { Link } from 'react-router-dom';

// Example Icons (optional)
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>;
// const TrashIcon = () => ... (if you add a delete button here)


const RecruiterJobPostingsList = ({ jobPostings, onJobAction }) => { 
  // onJobAction could be a function to handle delete/close if done directly, 
  // otherwise, links will navigate.

  if (!jobPostings || jobPostings.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.034 23.034 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Job Postings Found</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't posted any jobs yet. Get started by creating one!
        </p>
        <Link 
            to="/recruiter/job-postings/create" 
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Post a New Job
        </Link>
      </div>
    );
  }

  // Ensure job.application_count or a similar field is available from your getRecruiterJobs controller/model
  // If not, you might need to adjust the backend or remove this display temporarily.
  // The `getRecruiterJobs` controller provided doesn't explicitly add application_count.

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applications
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posted On
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobPostings.map((job) => (
            <tr key={job.job_posting_id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-indigo-600 hover:text-indigo-900">
                  <Link to={`/recruiter/job-postings/${job.job_posting_id}/candidates`}>{job.title}</Link>
                </div>
                <div className="text-xs text-gray-500">{job.location || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  job.status === 'Open' ? 'bg-green-100 text-green-800' :
                  job.status === 'Closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {job.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {/* This needs application_count from backend or a separate fetch per job (less ideal) */}
                {job.application_count !== undefined ? job.application_count : 'N/A'} 
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(job.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                <Link 
                  to={`/recruiter/job-postings/${job.job_posting_id}/candidates`} 
                  className="text-blue-600 hover:text-blue-900"
                  title="View Candidates"
                >
                  <EyeIcon /> Candidates
                </Link>
                <Link 
                  to={`/recruiter/job-postings/edit/${job.job_posting_id}`} 
                  className="text-yellow-600 hover:text-yellow-900"
                  title="Edit Job Posting"
                >
                 <PencilIcon /> Edit
                </Link>
                {/* Delete and Close actions are often better on a dedicated page or with modals.
                    If you implement onJobAction prop:
                <button onClick={() => onJobAction('delete', job.job_posting_id)} className="text-red-600 hover:text-red-900">Delete</button>
                {job.status === 'Open' && 
                    <button onClick={() => onJobAction('close', job.job_posting_id)} className="text-gray-600 hover:text-gray-900">Close</button>
                }
                */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruiterJobPostingsList;