import React from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiUsers } from 'react-icons/fi';

const PostItem = ({ post, isRecruiter = false }) => {
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'status-badge status-badge-active';
      case 'closed':
        return 'status-badge status-badge-closed';
      default:
        return 'status-badge bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
          <span className={getStatusBadgeClass(post.status)}>
            {post.status}
          </span>
        </div>
        <p className="text-sm text-gray-600">{post.company}</p>
      </div>
      <div className="post-content">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-500">
            <FiBriefcase className="mr-2" />
            {post.jobType}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiMapPin className="mr-2" />
            {post.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiClock className="mr-2" />
            {post.postedDate}
          </div>
          {isRecruiter && (
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="mr-2" />
              {post.applicantsCount} Applicants
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-600 line-clamp-3">
          {post.description}
        </p>
      </div>

      <div className="post-footer">
        {isRecruiter ? (
          <div className="flex space-x-2">
            <button className="action-button bg-blue-600">
              View Applications
            </button>
            <button className="action-button bg-gray-600">
              Edit Post
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button className="action-button">
              Apply Now
            </button>
            <button className="action-button bg-gray-600">
              Save Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostItem;
