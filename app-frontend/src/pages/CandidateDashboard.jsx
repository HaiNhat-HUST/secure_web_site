import React, { useState, useEffect } from 'react';
import { FiSearch, FiBriefcase, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import PostItem from '../components/Dashboard/PostItem';
import '../styles/dashboard.css';

const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
  });

  useEffect(() => {
    // Fetch jobs and stats from your API
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/jobs');
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Replace with your actual API call
    setStats({
      totalApplications: 25,
      pendingApplications: 10,
      acceptedApplications: 8,
      rejectedApplications: 7,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && job.status === filter;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Candidate Dashboard</h1>
        <p className="dashboard-subtitle">Track your job applications and discover new opportunities</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-title">Total Applications</span>
          <div className="stat-value">{stats.totalApplications}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Pending</span>
          <div className="stat-value">{stats.pendingApplications}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Accepted</span>
          <div className="stat-value">{stats.acceptedApplications}</div>
        </div>
        <div className="stat-card">
          <span className="stat-title">Rejected</span>
          <div className="stat-value">{stats.rejectedApplications}</div>
        </div>
      </div>

      <div className="search-filter-section">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="search-input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Jobs</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="posts-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="post-card">
              <div className="h-48 loading-skeleton" />
            </div>
          ))}
        </div>
      ) : (
        <div className="posts-grid">
          {filteredJobs.map((job) => (
            <PostItem key={job.id} post={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
