import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function JobCard({ job }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl flex flex-col p-6 hover:shadow-2xl transition-all duration-300 group h-full border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-xl mr-3 shadow">
          {job.title?.charAt(0) || "J"}
        </div>
        <div>
          <Link
            to={`/jobs/${job.job_posting_id}`}
            className="block text-lg font-semibold text-blue-700 group-hover:underline transition-colors duration-200"
          >
            {job.title}
          </Link>
          <div className="text-xs text-gray-500">{job.recruiter_display_name}</div>
        </div>
      </div>
      <p className="line-clamp-3 text-gray-700 text-sm mb-4">{job.description}</p>
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        <span className="inline-flex items-center bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">
          <svg width="14" height="14" fill="none" className="mr-1"><path d="M7 13s5.5-5.5 5.5-9C12.5 2 10 0 7 0S1.5 2 1.5 4c0 3.5 5.5 9 5.5 9zm0-6a2 2 0 100-4 2 2 0 000 4z" fill="#60A5FA"/></svg>
          {job.location}
        </span>
        <span className="inline-flex items-center bg-green-100 px-2 py-1 rounded text-green-700 capitalize font-medium">
          {job.job_type?.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-gray-700">
          {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : ""}
        </span>
      </div>
      <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <Link
          to={`/jobs/${job.job_posting_id}`}
          className="ml-2 text-blue-600 group-hover:text-blue-900 font-medium rounded transition-colors duration-200"
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch jobs for current page and filter
  const fetchJobs = useCallback(async (reset = false, pageOverride = null) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (filter.title) params.append('title', filter.title);
    if (filter.location) params.append('location', filter.location);
    if (filter.type) params.append('type', filter.type);
    params.append('page', pageOverride !== null ? pageOverride : page);
    params.append('limit', 12);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(prev => reset ? data.jobs : [...prev, ...data.jobs]);
      setHasMore(data.pagination.hasMore);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  // Debounced fetch for filter changes
  const debouncedFetch = useCallback(debounce(() => fetchJobs(true, 1), 300), [fetchJobs]);

  // When filter changes, reset jobs and page
  useEffect(() => {
    setPage(1);
    debouncedFetch();
    // eslint-disable-next-line
  }, [filter]);

  // When page changes (except first load), fetch more jobs
  useEffect(() => {
    if (page === 1) return;
    fetchJobs(false, page);
    // eslint-disable-next-line
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="dashboard-container min-h-screen py-10 px-2 sm:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="dashboard-header mb-10 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
          Job Newsfeed
        </h1>
        <p className="text-gray-600 mt-2 text-base">Discover exciting job opportunities tailored for you.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 mb-10 items-center border border-gray-200">
        <input
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200 placeholder-gray-400"
          type="text"
          placeholder="🔍 Search by job title..."
          value={filter.title}
          onChange={(e) => setFilter(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200 placeholder-gray-400"
          type="text"
          placeholder="📍 Location"
          value={filter.location}
          onChange={(e) => setFilter(f => ({ ...f, location: e.target.value }))}
        />
        <select
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200"
          value={filter.type}
          onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
        >
          {jobTypes.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
        {(filter.title || filter.location || filter.type) && (
          <button
            type="button"
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium ml-0 md:ml-3 mt-2 md:mt-0 hover:bg-red-200 transition-colors duration-200"
            onClick={() => setFilter({ title: '', location: '', type: '' })}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading && jobs.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-7 w-7 text-blue-400 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-blue-500 font-medium">Loading jobs...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-6">{error}</div>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.length === 0 ? (
            <p className="text-gray-400 py-20 text-center col-span-full">No open job postings found.</p>
          ) : (
            jobs.map(job => (
              <JobCard job={job} key={job.job_posting_id} />
            ))
          )}
        </div>
      )}
      {hasMore && !loading && jobs.length > 0 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default JobNewsfeed;