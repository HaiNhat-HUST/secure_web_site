import { useState, useEffect, useCallback } from 'react';
import { FiSearch, FiPlus, FiUsers, FiBarChart, FiTrendingUp, FiClock } from 'react-icons/fi';
import PostItem from '../components/Dashboard/PostItem'; // Assuming this component is correctly set up
import '../styles/dashboard.css'; // Assuming styles are appropriate

// Placeholder for your actual auth token retrieval
// Replace this with your application's authentication logic (e.g., from localStorage, context, or a state management store)
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
    if (!token) {
    console.warn("Auth token not found in localStorage. API calls might fail.");
  }
  return token;
  };

const RecruiterDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'Open', 'Closed'
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewsScheduled: 0,
    hiringRate: 0,
  });

  // Generic API fetching function
  const fetchApi = useCallback(async (url, setterFunction, setLoadingStateFunction, entityNameForError) => {
    setLoadingStateFunction(true);
    const token = getAuthToken();

    if (!token) {
      setError(`Authentication token not found. Please log in to view ${entityNameForError}.`);
      setLoadingStateFunction(false);
      setterFunction(entityNameForError === 'posts' ? [] : { activeJobs: 0, totalApplications: 0, interviewsScheduled: 0, hiringRate: 0 });
      return;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching ${entityNameForError}: HTTP ${response.status}`, errorText);
        setError(`Failed to fetch ${entityNameForError}. Server responded with ${response.status}.`);
        setterFunction(entityNameForError === 'posts' ? [] : { activeJobs: 0, totalApplications: 0, interviewsScheduled: 0, hiringRate: 0 });
        return;
      }

      const data = await response.json();
      setterFunction(data || (entityNameForError === 'posts' ? [] : {}));
    } catch (e) {
      console.error(`Error processing ${entityNameForError} data:`, e);
      setError(e.message || `An unexpected error occurred while fetching ${entityNameForError}.`);
      setterFunction(entityNameForError === 'posts' ? [] : { activeJobs: 0, totalApplications: 0, interviewsScheduled: 0, hiringRate: 0 });
    } finally {
      setLoadingStateFunction(false);
    }
  }, []);
  const fetchPosts = useCallback(() => {
    fetchApi('/api/recruiter/job-postings', setPosts, setLoadingPosts, 'posts');
  }, [fetchApi]);

  const fetchStats = useCallback(() => {
    fetchApi('/api/recruiter/dashboard', (data) => {
      setStats({
        activeJobs: data.activeJobPostingsCount || 0,
        totalApplications: data.applicantCount || 0,
        interviewsScheduled: data.scheduledInterviewsCount || 0,
        hiringRate: data.hiringRate || 0,
      });
    }, setLoadingStats, 'dashboard stats');
  }, [fetchApi]);

  useEffect(() => {
    setError(null);
    fetchPosts();
    fetchStats();
  }, [fetchPosts, fetchStats]);
  const handleCreatePost = () => {
    console.log('Navigate to create post page or open modal.');
};

  const filteredPosts = posts.filter(post => {
    const titleMatch = post.title && typeof post.title === 'string'
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    if (filter === 'all') {
      return titleMatch;
    }
    return titleMatch && post.status === filter;
  });

  if (error && !loadingPosts && !loadingStats) {
    return (
      <div className="dashboard-container error-message p-4">
        <p className="text-red-700 font-semibold">Error:</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchPosts();
            fetchStats();
          }}
          className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
    </div>
    );
  }

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
            className="action-button bg-blue-500 hover:bg-blue-600 text-white"
          >
            <FiPlus className="mr-2" />
            Create New Post
          </button>
        </div>
      </div>

      {loadingStats ? (
         <div className="stats-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="stat-card h-24 loading-skeleton" />
            ))}
        </div>
      ) : (
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
      )}
  
      <div className="search-filter-section my-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts by title..."
            className="search-input pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="filter-dropdown ml-4"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Posts</option>
          <option value="Open">Active</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {loadingPosts ? (
        <div className="posts-grid">
          {[1, 2, 3].map((n) => (
            <div key={n} className="post-card">
              <div className="h-48 loading-skeleton" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <PostItem key={post.job_posting_id || post.id} post={post} isRecruiter={true} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No job postings found matching your criteria.</p>
      )}
    </div>
  );
};
export default RecruiterDashboard;