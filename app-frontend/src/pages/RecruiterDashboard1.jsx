import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 0,
    totalCandidates: 0,
    pendingInterviews: 0,
    hired: 0,
    recentJobs: [],
  });

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/recruiter/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const createNewPost = async () => {
    try {
      await axios.post('http://localhost:3000/api/jobs', newJob);
      alert('Job created successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const updatePost = async (jobId) => {
    try {
      await axios.put(`http://localhost:3000/api/recruiter/job-postings/${jobId}`, {
        title: 'Updated Job Title',
      });
      alert('Job updated successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const closePost = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/api/recruiter/job-postings/${jobId}/close`);
      alert('Job closed successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error closing job:', error);
    }
  };

  const deletePost = async (jobId) => {
    try {
      await axios.delete(`http://localhost:3000/api/recruiter/job-postings/${jobId}`);
      alert('Job deleted successfully!');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="flex-1 p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Tổng bài đăng</h3>
              <p className="text-2xl font-bold">{dashboardData.totalPosts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Ứng viên</h3>
              <p className="text-2xl font-bold">{dashboardData.totalCandidates}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Chờ phỏng vấn</h3>
              <p className="text-2xl font-bold">{dashboardData.pendingInterviews}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold">Đã tuyển</h3>
              <p className="text-2xl font-bold">{dashboardData.hired}</p>
            </div>
          </div>

          {/* Create New Post */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Tạo bài đăng mới</h3>
            <input
              type="text"
              placeholder="Job Title"
              className="border p-2 rounded w-full mb-2"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            />
            <textarea
              placeholder="Job Description"
              className="border p-2 rounded w-full mb-2"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={createNewPost}
            >
              Create New Post
            </button>
          </div>

          {/* Recent Job Posts */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Bài tuyển dụng gần đây</h3>
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Tiêu đề</th>
                  <th className="p-2 border">Ngày đăng</th>
                  <th className="p-2 border">Trạng thái</th>
                  <th className="p-2 border">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentJobs.map((job) => (
                  <tr key={job.id}>
                    <td className="p-2 border">{job.title}</td>
                    <td className="p-2 border">{job.postedDate}</td>
                    <td
                      className={`p-2 border ${
                        job.status === 'Đang mở' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {job.status}
                    </td>
                    <td className="p-2 border">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => updatePost(job.id)}
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                        onClick={() => closePost(job.id)}
                      >
                        Close
                      </button>
                      <button
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                        onClick={() => deletePost(job.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}