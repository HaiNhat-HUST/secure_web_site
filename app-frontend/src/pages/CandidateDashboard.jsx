import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Corrected path if needed
import { fetchFromAPI } from '../api/serveAPI';
import StatCard from '../components/dashboard/StatCard';
import RecentApplicationsList from '../components/dashboard/RecentApplicationsList';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CandidateDashboard = () => {
  const { currentUser, token, loading: authLoading } = useAuth();
  const [summaryStats, setSummaryStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  // const [trendsData, setTrendsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !token || currentUser.role !== 'JobSeeker') {
      if (!authLoading) setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryRes, recentAppsRes /*, trendsRes*/] = await Promise.allSettled([
          fetchFromAPI('/api/dashboard/my-summary-stats', token),
          fetchFromAPI('/api/dashboard/my-recent-applications?limit=5', token),
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

        // if (trendsRes.status === 'fulfilled' && trendsRes.value) {
        //   setTrendsData(processTrendsForChart(trendsRes.value.data));
        // } else {
        //   const reason = trendsRes.reason || { message: 'Failed to load application trends' };
        //   console.error("Failed to fetch trends data:", reason);
        //   setError(prev => ({ ...prev, trends: reason.message }));
        // }

      } catch (err) {
        console.error('Error fetching candidate dashboard data:', err);
        setError(prev => ({ ...prev, general: err.message || 'An unexpected error occurred.'}));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser, token, authLoading]);

  // const processTrendsForChart = (apiTrends) => { /* ... same as before ... */ };

  if (authLoading || (isLoading && !error)) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading Your Dashboard...</p></div>;
  }

  if (!currentUser || currentUser.role !== 'JobSeeker') {
    // This case should ideally be handled by the parent Dashboard component routing
    return <div className="text-center mt-10"><p>Accessing Candidate Dashboard...</p></div>;
  }

  const renderErrors = () => {
    if (!error || Object.keys(error).length === 0) return null;
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
        <p className="font-bold">Could not load all dashboard data:</p>
        <ul className="list-disc ml-5 mt-2">
          {error.summary && <li>Summary Stats: {error.summary}</li>}
          {error.recent && <li>Recent Applications: {error.recent}</li>}
          {error.trends && <li>Application Trends: {error.trends}</li>}
          {error.general && <li>{error.general}</li>}
        </ul>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">My Job Application Hub</h1>
        <p className="text-lg text-gray-600">
          Hi {currentUser.display_name || currentUser.username}, track your applications and job search progress here.
        </p>
      </header>

      {renderErrors()}

      {/* Summary Statistics */}
      {summaryStats && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
                title="Total Applications Submitted" 
                value={summaryStats.totalApplications ?? '0'} 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} 
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

      {/* Recent Applications */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Recent Activity</h2>
        <RecentApplicationsList applications={recentApplications} userRole="JobSeeker" />
      </section>

      {/* Application Trends Chart (Example) */}
      {/* {trendsData && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Application Trends</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Bar data={trendsData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }} }} />
          </div>
        </section>
      )} */}

      {/* Placeholder for other candidate features */}
      {/* <section className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Profile</h2>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <p>Profile completeness, links to edit profile, etc.</p>
        </div>
      </section> */}
    </div>
  );
};

export default CandidateDashboard;