import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiUsers, FiBarChart, FiTrendingUp, FiClock } from 'react-icons/fi';
import PostItem from '../components/Dashboard/PostItem';
import '../styles/dashboard.css';

const RecruiterDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiringRate: 0,
  });

  useEffect(() => {
    // Fetch posts and stats from your API
    fetchPosts();
    fetchStats();
  }, []);

  const fetchPosts = async () => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/recruiter/posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Replace with your actual API call
    setStats({
      activeJobs: 15,
      totalApplications: 124,
      interviewsScheduled: 45,
      hiringRate: 68,
    });
  };

  const handleCreatePost = () => {
    // Implement post creation logic
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    return matchesSearch && post.status === filter;
  });
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="dashboard-title">Recruiter Dashboard</h1>
            <p className="dashboard-subtitle">Manage your job postings and applications</p>
          </div>
          <button
            onClick={handleCreatePost}
            className="action-button"
          >
            <FiPlus className="mr-2" />
            Create New Post
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FiBarChart className="text-blue-500 mb-2" size={24} />
          <span className="stat-title">Active Jobs</span>
          <div className="stat-value">{stats.activeJobs}</div>
        </div>
        <div className="stat-card">
          <FiUsers className="text-green-500 mb-2" size={24} />
          <span className="stat-title">Total Applications</span>
          <div className="stat-value">{stats.totalApplications}</div>
        </div>
        <div className="stat-card">
          <FiClock className="text-purple-500 mb-2" size={24} />
          <span className="stat-title">Interviews Scheduled</span>
          <div className="stat-value">{stats.interviewsScheduled}</div>
        </div>
        <div className="stat-card">
          <FiTrendingUp className="text-orange-500 mb-2" size={24} />
          <span className="stat-title">Hiring Rate</span>
          <div className="stat-value">{stats.hiringRate}%</div>
        </div>
      </div>
  
      <div className="search-filter-section">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
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
          <option value="all">All Posts</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
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
          {filteredPosts.map((post) => (
            <PostItem key={post.id} post={post} isRecruiter={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
