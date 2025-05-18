// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';

// // Custom debounce function
// const debounce = (func, wait) => {
//   let timeout;
//   return (...args) => {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func(...args), wait);
//   };
// };

// function JobCard({ job }) {
//   return (
//     <div className="bg-white shadow-lg rounded-2xl flex flex-col p-6 hover:shadow-2xl transition-all duration-300 group h-full border border-gray-200">
//       <div className="flex items-center mb-4">
//         <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-green-400 flex items-center justify-center text-white font-bold text-xl mr-3 shadow">
//           {job.title?.charAt(0) || "J"}
//         </div>
//         <div>
//           <Link
//             to={`/jobs/${job.job_posting_id}`}
//             className="block text-lg font-semibold text-blue-700 group-hover:underline transition-colors duration-200"
//           >
//             {job.title}
//           </Link>
//           <div className="text-xs text-gray-500">{job.recruiter_display_name}</div>
//         </div>
//       </div>
//       <p className="line-clamp-3 text-gray-700 text-sm mb-4">{job.description}</p>
//       <div className="flex flex-wrap gap-2 text-xs mb-3">
//         <span className="inline-flex items-center bg-blue-100 px-2 py-1 rounded text-blue-700 font-medium">
//           <svg width="14" height="14" fill="none" className="mr-1"><path d="M7 13s5.5-5.5 5.5-9C12.5 2 10 0 7 0S1.5 2 1.5 4c0 3.5 5.5 9 5.5 9zm0-6a2 2 0 100-4 2 2 0 000 4z" fill="#60A5FA"/></svg>
//           {job.location}
//         </span>
//         <span className="inline-flex items-center bg-green-100 px-2 py-1 rounded text-green-700 capitalize font-medium">
//           {job.job_type?.replace(/([A-Z])/g, ' $1').trim()}
//         </span>
//         <span className="inline-flex items-center bg-gray-100 px-2 py-1 rounded text-gray-700">
//           {job.posting_date ? new Date(job.posting_date).toLocaleDateString() : ""}
//         </span>
//       </div>
//       <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
//         <Link
//           to={`/jobs/${job.job_posting_id}`}
//           className="ml-2 text-blue-600 group-hover:text-blue-900 font-medium rounded transition-colors duration-200"
//         >
//           View Details →
//         </Link>
//       </div>
//     </div>
//   );
// }

// const jobTypes = [
//   { label: "All Types", value: "" },
//   { label: "Full Time", value: "FullTime" },
//   { label: "Part Time", value: "PartTime" },
//   { label: "Contract", value: "Contract" },
// ];

// const JobNewsfeed = () => {
//   const [jobs, setJobs] = useState([]);
//   const [filter, setFilter] = useState({ title: '', location: '', type: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch jobs for current page and filter
//   const fetchJobs = useCallback(async (reset = false, pageOverride = null) => {
//     setLoading(true);
//     setError('');
//     const params = new URLSearchParams();
//     if (filter.title) params.append('title', filter.title);
//     if (filter.location) params.append('location', filter.location);
//     if (filter.type) params.append('type', filter.type);
//     params.append('page', pageOverride !== null ? pageOverride : page);
//     params.append('limit', 12);

//     try {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?${params}`);
//       if (!res.ok) throw new Error('Failed to fetch jobs');
//       const data = await res.json();
//       setJobs(prev => reset ? data.jobs : [...prev, ...data.jobs]);
//       setHasMore(data.pagination.hasMore);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [filter, page]);

//   // Debounced fetch for filter changes
//   const debouncedFetch = useCallback(debounce(() => fetchJobs(true, 1), 300), [fetchJobs]);

//   // When filter changes, reset jobs and page
//   useEffect(() => {
//     setPage(1);
//     debouncedFetch();
//     // eslint-disable-next-line
//   }, [filter]);

//   // When page changes (except first load), fetch more jobs
//   useEffect(() => {
//     if (page === 1) return;
//     fetchJobs(false, page);
//     // eslint-disable-next-line
//   }, [page]);

//   const handleLoadMore = () => {
//     setPage(prev => prev + 1);
//   };

//   return (
//     <div className="dashboard-container min-h-screen py-10 px-2 sm:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
//       <div className="dashboard-header mb-10 text-center">
//         <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
//           Job Newsfeed
//         </h1>
//         <p className="text-gray-600 mt-2 text-base">Discover exciting job opportunities tailored for you.</p>
//       </div>

//       {/* Filter Bar */}
//       <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 mb-10 items-center border border-gray-200">
//         <input
//           className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200 placeholder-gray-400"
//           type="text"
//           placeholder="🔍 Search by job title..."
//           value={filter.title}
//           onChange={(e) => setFilter(f => ({ ...f, title: e.target.value }))}
//         />
//         <input
//           className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200 placeholder-gray-400"
//           type="text"
//           placeholder="📍 Location"
//           value={filter.location}
//           onChange={(e) => setFilter(f => ({ ...f, location: e.target.value }))}
//         />
//         <select
//           className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200"
//           value={filter.type}
//           onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
//         >
//           {jobTypes.map(t => (
//             <option value={t.value} key={t.value}>{t.label}</option>
//           ))}
//         </select>
//         {(filter.title || filter.location || filter.type) && (
//           <button
//             type="button"
//             className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium ml-0 md:ml-3 mt-2 md:mt-0 hover:bg-red-200 transition-colors duration-200"
//             onClick={() => setFilter({ title: '', location: '', type: '' })}
//           >
//             Clear
//           </button>
//         )}
//       </div>

//       {/* Content */}
//       {loading && jobs.length === 0 ? (
//         <div className="flex justify-center items-center py-20">
//           <svg className="animate-spin h-7 w-7 text-blue-400 mr-2" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
//           </svg>
//           <span className="text-blue-500 font-medium">Loading jobs...</span>
//         </div>
//       ) : error ? (
//         <div className="text-center text-red-500 mt-6">{error}</div>
//       ) : (
//         <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {jobs.length === 0 ? (
//             <p className="text-gray-400 py-20 text-center col-span-full">No open job postings found.</p>
//           ) : (
//             jobs.map(job => (
//               <JobCard job={job} key={job.job_posting_id} />
//             ))
//           )}
//         </div>
//       )}
//       {hasMore && !loading && jobs.length > 0 && (
//         <div className="mt-10 text-center">
//           <button
//             onClick={handleLoadMore}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow"
//           >
//             Load More
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobNewsfeed;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  // This function is what gets called when the debounced function is invoked
  const debouncedFunction = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  // Expose a way to cancel the timeout, if needed externally (optional here)
  debouncedFunction.cancel = () => {
    clearTimeout(timeout);
  };
  return debouncedFunction;
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

function Pagination({ currentPage, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const pagesToShowConfig = 5; // Number of page buttons to show (e.g., 1 ... 3 4 5 ... 10)
  const ellipsis = '...';

  if (totalPages <= pagesToShowConfig + 2) { // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1); // Always show first page

    let startPage = Math.max(2, currentPage - Math.floor((pagesToShowConfig - 2) / 2));
    let endPage = Math.min(totalPages - 1, currentPage + Math.floor((pagesToShowConfig - 2) / 2));
    
    // Adjust window if current page is near the start
    if (currentPage - Math.floor((pagesToShowConfig - 2) / 2) < 2 ) {
        endPage = Math.min(totalPages - 1, pagesToShowConfig -1 ); // e.g. pagesToShowConfig = 5 means 1,2,3,4 ... N
        startPage = 2;
    } 
    // Adjust window if current page is near the end
    else if (currentPage + Math.floor((pagesToShowConfig - 2) / 2) > totalPages -1) {
        startPage = Math.max(2, totalPages - (pagesToShowConfig-2)); // e.g. pagesToShowConfig = 5 means 1 ... N-3,N-2,N-1, N
        endPage = totalPages -1;
    }


    if (startPage > 2) {
      pageNumbers.push(ellipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(ellipsis);
    }

    pageNumbers.push(totalPages); // Always show last page
  }

  return (
    <nav aria-label="Job Gazer Pagination" className="mt-10 flex justify-center">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={() => !loading && onPageChange(currentPage - 1)}
            disabled={loading || currentPage === 1}
            className="px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
        </li>
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === ellipsis ? (
              <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">
                {ellipsis}
              </span>
            ) : (
              <button
                onClick={() => !loading && onPageChange(page)}
                disabled={loading && currentPage === page} // Disable only current page if loading to prevent multiple clicks
                className={`px-3 py-2 leading-tight border border-gray-300 ${
                  currentPage === page
                    ? 'text-blue-600 bg-blue-50 border-blue-300 hover:bg-blue-100 hover:text-blue-700 z-10'
                    : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                } ${loading ? 'disabled:opacity-50 disabled:cursor-not-allowed' : ''}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() => !loading && onPageChange(currentPage + 1)}
            disabled={loading || currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}


const JobNewsfeed = () => {
  const [jobs, setJobs] = useState([]);
  // State for filter inputs, updated immediately on input change
  const [filterInput, setFilterInput] = useState({ title: '', location: '', type: '' });
  // State for applied/committed filter, updated after debounce
  const [appliedFilter, setAppliedFilter] = useState({ title: '', location: '', type: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Core fetching function
  const fetchJobs = useCallback(async (pageToFetch, filterToUse) => {
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    if (filterToUse.title) params.append('title', filterToUse.title);
    if (filterToUse.location) params.append('location', filterToUse.location);
    if (filterToUse.type) params.append('type', filterToUse.type);
    params.append('page', pageToFetch);
    params.append('limit', 12); //12 items per page

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.jobs);
      // CRITICAL: API must return totalPages or enough info to calculate it (e.g., totalItems)
      setTotalPages(data.pagination.totalPages || 0); 
      // If API returns currentPage, you might want to sync it: setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      setError(err.message);
      setJobs([]); // Clear jobs on error
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced function to apply filters and reset to page 1
  const debouncedApplyFilters = useCallback(
    debounce((newFilter) => {
      setAppliedFilter(newFilter);
      setCurrentPage(1); // This will trigger the useEffect for fetching
    }, 500),
    [] // setAppliedFilter and setCurrentPage are stable
  );

  // Effect to fetch jobs when currentPage or appliedFilter changes
  useEffect(() => {
    fetchJobs(currentPage, appliedFilter);
    window.scrollTo(0, 0); // Scroll to top on page/filter change
  }, [currentPage, appliedFilter, fetchJobs]);

  // Handler for filter input changes
  const handleFilterInputChange = (field, value) => {
    const newFilterInput = { ...filterInput, [field]: value };
    setFilterInput(newFilterInput);
    debouncedApplyFilters(newFilterInput);
  };
  
  const handleClearFilters = () => {
    const clearedFilters = { title: '', location: '', type: '' };
    setFilterInput(clearedFilters);
    setAppliedFilter(clearedFilters); // Apply immediately
    setCurrentPage(1); // Reset to page 1, triggers fetch via useEffect
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages && pageNumber !== currentPage) {
      setCurrentPage(pageNumber);
    }
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
          value={filterInput.title}
          onChange={(e) => handleFilterInputChange('title', e.target.value)}
          disabled={loading}
        />
        <input
          className="flex-1 min-w-0 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200 placeholder-gray-400"
          type="text"
          placeholder="📍 Location"
          value={filterInput.location}
          onChange={(e) => handleFilterInputChange('location', e.target.value)}
          disabled={loading}
        />
        <select
          className="flex-1 min-w-[140px] px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors duration-200"
          value={filterInput.type}
          onChange={(e) => handleFilterInputChange('type', e.target.value)}
          disabled={loading}
        >
          {jobTypes.map(t => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
        {(filterInput.title || filterInput.location || filterInput.type) && (
          <button
            type="button"
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium ml-0 md:ml-3 mt-2 md:mt-0 hover:bg-red-200 transition-colors duration-200"
            onClick={handleClearFilters}
            disabled={loading}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading && jobs.length === 0 ? ( // Initial loading spinner
        <div className="flex justify-center items-center py-20">
          <svg className="animate-spin h-7 w-7 text-blue-400 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="text-blue-500 font-medium">Loading jobs...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-6 p-4 bg-red-50 rounded-lg border border-red-200">{error}</div>
      ) : (
        <>
          {jobs.length === 0 ? (
            <p className="text-gray-400 py-20 text-center col-span-full">No open job postings found matching your criteria.</p>
          ) : (
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map(job => (
                <JobCard job={job} key={job.job_posting_id} />
              ))}
            </div>
          )}
          {jobs.length > 0 && totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              loading={loading && jobs.length > 0} // Pass loading state for subsequent page loads
            />
          )}
        </>
      )}
    </div>
  );
};

export default JobNewsfeed;