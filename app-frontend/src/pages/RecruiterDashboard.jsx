import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../api/serveAPI';
import StatCard from '../components/Dashboard/StatCard';
import RecentApplicationsList from '../components/Dashboard/RecentApplicationsList';
import AllJobPostingsList from '../components/Dashboard/AllJobsPostingList'; // Use the correct component name

// --- Icons ---
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.034 23.034 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const DocumentTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const statusIcons = {
  New: <DocumentTextIcon />,
  UnderReview: <ClockIcon />,
  Shortlisted: <CheckCircleIcon />,
  Hired: <UserGroupIcon/>, // Example, choose a better icon
  Rejected: <UserGroupIcon/>, // Example
  InterviewScheduled: <ClockIcon/> // Example
};
// --- End Icons ---

const RecruiterDashboard = () => {
  const { currentUser, token, loading: authLoading } = useAuth();
  const location = useLocation(); // For success messages from navigation

  const [summaryStats, setSummaryStats] = useState(null);
  const [totalOpenJobs, setTotalOpenJobs] = useState(0);
  const [recentApplications, setRecentApplications] = useState([]);
  const [allMyJobPostings, setAllMyJobPostings] = useState([]); // State for ALL job postings
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Effect for handling success messages passed via navigation state
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Optionally clear the state from location to prevent re-showing on refresh
      // window.history.replaceState({}, document.title); 
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Effect for fetching all dashboard data
  useEffect(() => {
    if (authLoading) {
        setIsLoading(true);
        return;
    }
    if (!currentUser || !token || currentUser.role !== 'Recruiter') {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiRequests = [
          fetchFromAPI('/api/dashboard/my-summary-stats', token),
          fetchFromAPI('/api/dashboard/my-recent-applications?limit=5', token),
          fetchFromAPI('/api/recruiter/job-postings', token) // API to get ALL job postings
        ];

        const results = await Promise.allSettled(apiRequests);
        const [summaryRes, recentAppsRes, allMyJobsRes] = results;

        // Process Summary Stats
        if (summaryRes.status === 'fulfilled' && summaryRes.value?.success && summaryRes.value.data) {
          setSummaryStats(summaryRes.value.data);
          // If backend provides totalOpenJobs in summaryStats:
          // setTotalOpenJobs(summaryRes.value.data.totalOpenJobs || 0);
        } else {
          const reason = summaryRes.reason || { data: { message: 'Failed to load summary stats' } };
          console.error("Failed to fetch summary stats:", reason);
          setError(prev => ({ ...prev, summary: reason.data?.message || reason.message || 'Unknown error' }));
        }

        // Process Recent Applications
        if (recentAppsRes.status === 'fulfilled' && recentAppsRes.value?.success && recentAppsRes.value.data) {
          setRecentApplications(recentAppsRes.value.data);
        } else {
          const reason = recentAppsRes.reason || { data: { message: 'Failed to load recent applications' } };
          console.error("Failed to fetch recent applications:", reason);
          setError(prev => ({ ...prev, recent: reason.data?.message || reason.message || 'Unknown error' }));
        }

        // Process All My Job Postings
        let jobsData = [];
        if (allMyJobsRes.status === 'fulfilled') {
          if (Array.isArray(allMyJobsRes.value)) { // If API returns array directly
            jobsData = allMyJobsRes.value;
          } else if (allMyJobsRes.value?.success && Array.isArray(allMyJobsRes.value.data)) { // If API returns {success, data: []}
            jobsData = allMyJobsRes.value.data;
          } else {
             // Handle unexpected format from /api/recruiter/job-postings
            console.warn("Unexpected data format for job postings:", allMyJobsRes.value);
            setError(prev => ({ ...prev, allJobs: 'Unexpected format for job postings.' }));
          }
          setAllMyJobPostings(jobsData);
          // Calculate totalOpenJobs from this list if not directly from summaryStats
          // This assumes summaryStats might not yet have totalOpenJobs or you prefer calculating it here
          const openJobsCount = jobsData.filter(job => job.status === 'Open').length;
          setTotalOpenJobs(openJobsCount);
        } else {
          const reason = allMyJobsRes.reason || { data: { message: 'Failed to load your job postings' } };
          console.error("Failed to fetch all job postings:", reason);
          setError(prev => ({ ...prev, allJobs: reason.data?.message || reason.message || 'Unknown error' }));
        }

      } catch (err) { // Catch any error not caught by Promise.allSettled (e.g. programming error in processing)
        console.error('Error in fetchData processing:', err);
        setError(prev => ({ ...prev, general: err.message || 'An unexpected error occurred during data processing.' }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, token, authLoading]); // Dependencies for fetching data

  // Loading and Access Denied states
  if (authLoading || (isLoading && !error && currentUser?.role === 'Recruiter')) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading Recruiter Dashboard...</p></div>;
  }

  if (!currentUser || currentUser.role !== 'Recruiter') {
    return (
      <div className="text-center mt-10 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700">You must be logged in as a Recruiter to view this page.</p>
        <Link to="/login" className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          Login as Recruiter
        </Link>
      </div>
    );
  }

  // Error display function
  const renderErrors = () => {
    if (!error || Object.keys(error).length === 0) return null;
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
        <p className="font-bold">Could not load some dashboard data:</p>
        <ul className="list-disc ml-5 mt-2">
          {Object.entries(error).map(([key, message]) => (
            message && <li key={key}>{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${message}`}</li>
          ))}
        </ul>
      </div>
    );
  };

  // Main JSX
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Recruitment Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome, {currentUser.display_name || currentUser.username}! Here's an overview of your recruitment activity.
          </p>
        </div>
        <Link 
          to="/recruiter/job-postings/create" 
          className="mt-4 sm:mt-0 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Post a New Job
        </Link>
      </header>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded animate-fadeIn" role="alert">
          <p className="font-bold">Success!</p>
          <p>{successMessage}</p>
        </div>
      )}
      {renderErrors()}

      {/* Summary Statistics */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">At a Glance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
              title="Active Job Postings" 
              value={totalOpenJobs}
              icon={<BriefcaseIcon />}
              linkTo="/recruiter/job-postings?status=Open" // Optional: Link to a filtered list page
          />
          {summaryStats && (
            <>
              <StatCard 
                  title="Total Applications Received" 
                  value={summaryStats.totalApplications ?? '0'} 
                  icon={<UserGroupIcon />}
                  // Optional: linkTo="/recruiter/all-applications"
              />
              {summaryStats.applicationsByStatus?.map(statusInfo => (
                <StatCard 
                  key={statusInfo.status} 
                  title={`${statusInfo.status} Applications`} 
                  value={statusInfo.count ?? '0'} 
                  icon={statusIcons[statusInfo.status] || <DocumentTextIcon />}
                  // Optional: linkTo={`/recruiter/applications?status=${statusInfo.status}`} 
                />
              ))}
            </>
          )}
        </div>
      </section>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <section className="lg:col-span-1 bg-white shadow-xl rounded-lg p-6"> {/* Adjusted to lg:col-span-1 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Recent Candidate Activity</h2>
          </div>
          <RecentApplicationsList applications={recentApplications} userRole="Recruiter" />
        </section>

        {/* All Job Postings List */}
        <section className="lg:col-span-2 bg-white shadow-xl rounded-lg p-6"> {/* Adjusted to lg:col-span-2 */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Your Job Postings</h2>
            {/* You might add a filter dropdown here later */}
          </div>
          <AllJobPostingsList jobPostings={allMyJobPostings} />
        </section>
      </div>
    </div>
  );
};

export default RecruiterDashboard;