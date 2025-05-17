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
    <div className="bg-white shadow-md rounded-xl flex flex-col p-6 hover:shadow-xl transition-all duration-300 group h-full border border-blue-100">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-200 to-green-200 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-sm">
          {job.title?.charAt(0) || "J"}
        </div>
        <div>
          <Link
            to={`/jobs/${job.job_posting_id}`}
            className="block text-lg font-semibold text-blue-600 group-hover:underline transition-colors duration-200"
          >
            {job.title}
          </Link>
          <div className="text-xs text-gray-500">{job.recruiter_display_name}</div>
        </div>
      </div>
      <p className="line-clamp-3 text-gray-600 text-sm mb-4">{job.description}</p>
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        <span className="inline-flex items-center bg-blue-50 px-2 py-1 rounded text-blue-600 font-medium">
          <svg width="14" height="14" fill="none" className="mr-1"><path d="M7 13s5.5-5.5 5.5-9C12.5 2 10 0 7 0S1.5 2 1.5 4c0 3.5 5.5 9 5.5 9zm0-6a2 2 0 100-4 2 2 0 000 4z" fill="#60A5FA"/></svg>
          {job.location}
        </span>
        <span className="inline-flex items-center bg-green-50 px-2 py-1 rounded text-green-600 capitalize font-medium">
          {job.job_type?.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <span className="inline-flex items-center bg-gray-50 px-2 py-1 rounded text-gray-600">
          {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : ""}
        </span>
      </div>
      <div className="mt-auto pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-gray-500">
        <Link
          to={`/jobs/${job.job_posting_id}`}
          className="ml-2 text-blue-500 group-hover:text-blue-600 font-medium rounded transition-colors duration-200"
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

  const fetchJobs = useCallback(async (reset = false) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (filter.title) params.append('title', filter.title);
    if (filter.location) params.append('location', filter.location);
    if (filter.type) params.append('type', filter.type);
    params.append('page', reset ? 1 : page);
    params.append('limit', 12);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(prev => reset ? data.jobs : [...prev, ...data.jobs]);
      setHasMore(data.pagination.hasMore);
      if (reset) setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filter, page]);

  const debouncedFetch = useCallback(debounce(fetchJobs, 300), [fetchJobs]);

  useEffect(() => {
    debouncedFetch(true);
  }, [filter, debouncedFetch]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    fetchJobs();
  };

  return (
    <div className="dashboard-container bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen py-8 px-4 sm:px-8">
      <div className="dashboard-header mb-8 text-center">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-green-300 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
          Job Newsfeed
        </h1>
        <p className="text-gray-500 mt-2 text-sm">Discover exciting job opportunities tailored for you.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 mb-10 items-center border border-blue-100">
        <input
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors duration-200 placeholder-gray-400"
          type="text"
          placeholder="🔍 Search by job title..."
          value={filter.title}
          onChange={(e) => setFilter(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors duration-200 placeholder-gray-400"
          type="text"
          placeholder="📍 Location"
          value={filter.location}
          onChange={(e) => setFilter(f => ({ ...f, location: e.target.value }))}
        />
        <select
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-blue-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-colors duration-200"
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
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium ml-0 md:ml-3 mt-2 md:mt-0 hover:bg-red-100 transition-colors duration-200"
            onClick={() => setFilter({ title: '', location: '', type: '' })}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading && jobs.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-6 w-6 text-blue-400 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-blue-500 font-medium">Loading jobs...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-6">{error}</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-5 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default JobNewsfeed;