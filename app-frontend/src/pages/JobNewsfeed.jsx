import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/** JobCard: Modern, clean style */
function JobCard({ job }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl flex flex-col p-5 hover:shadow-2xl transition group h-full overflow-hidden">
      <div className="mb-4">
        <Link
          to={`/jobs/${job.job_posting_id}`}
          className="block text-2xl font-bold text-indigo-700 dark:text-indigo-300 group-hover:underline mb-2 transition"
        >
          {job.title}
        </Link>
        <p className="line-clamp-3 text-gray-700 dark:text-gray-300 text-base">{job.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
        <span className="inline-flex items-center bg-blue-50 dark:bg-gray-900 px-2 py-0.5 rounded">
          <svg width="16" height="16" fill="none" className="mr-1"><path d="M8 14s6-5.686 6-9.333C14 2.343 11.313 0 8 0S2 2.343 2 4.667C2 8.314 8 14 8 14zm0-6a2 2 0 100-4 2 2 0 000 4z" fill="#6366F1"/></svg>
          {job.location}
        </span>
        <span className="inline-flex items-center bg-green-50 dark:bg-gray-900 px-2 py-0.5 rounded capitalize">{job.job_type?.toLowerCase()}</span>
        <span className="inline-flex items-center bg-slate-50 dark:bg-gray-900 px-2 py-0.5 rounded">
          <span className="font-semibold">By</span> {job.recruiter_display_name}
        </span>
      </div>
      <div className="mt-auto pt-3 border-t dark:border-gray-700 flex items-center justify-between text-xs text-gray-400">
        <span>
          {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : ""}
        </span>
        <Link
          to={`/jobs/${job.job_posting_id}`}
          className="ml-2 text-indigo-500 group-hover:text-indigo-800 font-medium rounded transition"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

const jobTypes = [
  { label: "All Types", value: "" },
  { label: "Full Time", value: "FullTime" },
  { label: "Part Time", value: "PartTime" },
  { label: "Contract", value: "Contract" },
];

const JobNewsfeed = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ title: '', location: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch jobs on mount & filter change
  useEffect(() => {
    setLoading(true); setError('');
    const params = new URLSearchParams();
    if (filter.title) params.append('title', filter.title);
    if (filter.location) params.append('location', filter.location);
    if (filter.type) params.append('type', filter.type);
    fetch(`/api/jobs?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      })
      .then(setJobs)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="max-w-7xl mx-auto py-6 px-2 sm:px-6 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 bg-clip-text text-transparent">
        Job Newsfeed
      </h1>

      {/* Filter Bar */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg shadow flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 mb-10 items-center">
        {/* Title Search */}
        <input
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:border-gray-700 transition placeholder-gray-400"
          type="text"
          placeholder="🔍 Search by job title..."
          value={filter.title}
          onChange={(e) => setFilter(f => ({ ...f, title: e.target.value }))}
        />
        {/* Location Filter */}
        <input
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:border-gray-700 transition placeholder-gray-400"
          type="text"
          placeholder="📍 Location"
          value={filter.location}
          onChange={(e) => setFilter(f => ({ ...f, location: e.target.value }))}
        />
        {/* Type Filter */}
        <select
          className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:bg-slate-800 dark:border-gray-700 transition"
          value={filter.type}
          onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
        >
          {jobTypes.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
        {/* Clear Filter Button */}
        {(filter.title || filter.location || filter.type) && (
          <button
            type="button"
            className="px-3 py-1 bg-red-100 dark:bg-red-600 text-red-500 dark:text-white rounded-lg font-medium ml-0 md:ml-3 mt-2 md:mt-0 hover:opacity-80 transition"
            onClick={() => setFilter({ title: '', location: '', type: '' })}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-7 w-7 text-indigo-500 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-indigo-600 font-medium">Loading jobs...</span>
        </div>
      )}
      {error && <div className="text-center text-red-500 mt-6">{error}</div>}
      {!loading && !error && (
        <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 ? (
            <p className="text-gray-400 py-20 text-center col-span-full">No open job postings found.</p>
          ) : (
            jobs.map(job => (
              <JobCard job={job} key={job.job_posting_id} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default JobNewsfeed;
