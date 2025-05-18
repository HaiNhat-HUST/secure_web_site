import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../api/serveAPI';
import StatCard from '../components/Dashboard/StatCard';
import RecentApplicationsList from '../components/Dashboard/RecentApplicationsList';
import TopJobsList from '../components/Dashboard/TopJobsList';

const RecruiterDashboard = () => {
  const { currentUser, token, loading: authLoading } = useAuth();
  const [summaryStats, setSummaryStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  // const [trendsData, setTrendsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !token || currentUser.role !== 'Recruiter') {
      if (!authLoading) setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryRes, recentAppsRes, topJobsRes /*, trendsRes*/] = await Promise.allSettled([
          fetchFromAPI('/api/dashboard/my-summary-stats', token),
          fetchFromAPI('/api/dashboard/my-recent-applications?limit=5', token),
          fetchFromAPI('/api/dashboard/my-top-jobs?limit=5', token),
          // fetchFromAPI('/api/dashboard/my-application-trends?period=day', token),
        ]);

        if (summaryRes.status === 'fulfilled' && summaryRes.value) {
          setSummaryStats(summaryRes.value.data);
        } else {
          const reason = summaryRes.reason || { message: 'Failed to load summary stats' };
          console.error("Failed to fetch summary stats:", reason);
          setError(prev => ({ ...prev, summary: reason.message }));
        }

        if (recentAppsRes.status === 'fulfilled' && recentAppsRes.value) {
          setRecentApplications(recentAppsRes.value.data);
        } else {
          const reason = recentAppsRes.reason || { message: 'Failed to load recent applications' };
          console.error("Failed to fetch recent applications:", reason);
          setError(prev => ({ ...prev, recent: reason.message }));
        }

        if (topJobsRes.status === 'fulfilled' && topJobsRes.value) {
          setTopJobs(topJobsRes.value.data);
        } else {
          const reason = topJobsRes.reason || { message: 'Failed to load top jobs' };
          console.error("Failed to fetch top jobs:", reason);
          setError(prev => ({ ...prev, topJobs: reason.message }));
        }

        // if (trendsRes.status === 'fulfilled' && trendsRes.value) {
        //   setTrendsData(processTrendsForChart(trendsRes.value.data));
        // } else {
        //   const reason = trendsRes.reason || { message: 'Failed to load application trends' };
        //   console.error("Failed to fetch trends data:", reason);
        //   setError(prev => ({ ...prev, trends: reason.message }));
        // }

      } catch (err) {
        console.error('Error fetching recruiter dashboard data:', err);
        setError(prev => ({ ...prev, general: err.message || 'An unexpected error occurred.' }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, token, authLoading]);

  // const processTrendsForChart = (apiTrends) => { /* ... same as before ... */ };

  if (authLoading || (isLoading && !error)) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading Recruiter Dashboard...</p></div>;
  }

  if (!currentUser || currentUser.role !== 'Recruiter') {
    return <div className="text-center mt-10"><p>Accessing Recruiter Dashboard...</p></div>;
  }

  const renderErrors = () => {
    if (!error || Object.keys(error).length === 0) return null;
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
        <p className="font-bold">Could not load all dashboard data:</p>
        <ul className="list-disc ml-5 mt-2">
          {error.summary && <li>Summary Stats: {error.summary}</li>}
          {error.recent && <li>Recent Applications: {error.recent}</li>}
          {error.topJobs && <li>Top Jobs: {error.topJobs}</li>}
          {error.trends && <li>Application Trends: {error.trends}</li>}
          {error.general && <li>{error.general}</li>}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Recruitment Dashboard</h1>
        <p className="text-lg text-gray-600">
          Welcome, {currentUser.display_name || currentUser.username}! Manage your job postings and applications.
        </p>
      </header>

      {renderErrors()}

      {/* Summary Statistics */}
      {summaryStats && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Applications Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
                title="Total Applications Received" 
                value={summaryStats.totalApplications ?? '0'} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
            />
            {summaryStats.applicationsByStatus?.map(status => (
              <StatCard 
                key={status.status} 
                title={`${status.status} Applications`} 
                value={status.count ?? '0'} 
                // Add icons based on status
              />
            ))}
          </div>
        </section>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications - taking more space */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Candidate Activity</h2>
          <RecentApplicationsList applications={recentApplications} userRole="Recruiter" />
        </section>

        {/* Top Jobs List */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Top Performing Jobs</h2>
          <TopJobsList jobs={topJobs} />
          {/* Placeholder for links to manage jobs or create new one */}
          <div className="mt-6">
             {/* <Link to="/recruiter/jobs/new" className="text-indigo-600 hover:text-indigo-800 font-semibold">Post a New Job →</Link> */}
          </div>
        </section>
      </div>

      {/* Application Trends Chart (Example) */}
      {/* {trendsData && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Application Volume Trends</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Bar data={trendsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: true, position: 'top' }} }} />
          </div>
        </section>
      )} */}
    </div>
  );
};

export default RecruiterDashboard;