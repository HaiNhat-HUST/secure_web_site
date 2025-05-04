import React from 'react';
import { FiBriefcase, FiMapPin, FiClock, FiDollarSign, FiUsers } from 'react-icons/fi';

const PostDetail = ({ post, isRecruiter = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
            <p className="text-lg text-gray-600">{post.company}</p>
          </div>
          <span className={`status-badge ${post.status === 'active' ? 'status-badge-active' : 'status-badge-closed'}`}>
            {post.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-gray-600">
            <FiBriefcase className="mr-2" />
            <span>{post.jobType}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiMapPin className="mr-2" />
            <span>{post.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiDollarSign className="mr-2" />
            <span>{post.salary}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiClock className="mr-2" />
            <span>Posted {post.postedDate}</span>
          </div>
        </div>

        {isRecruiter && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiUsers className="text-blue-500 mr-2" />
                <span className="text-blue-700 font-medium">
                  {post.applicantsCount} Total Applicants
                </span>
              </div>
              <button className="action-button">
                View All Applications
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
          <p className="text-gray-600 whitespace-pre-line">{post.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {post.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            {post.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>

        {!isRecruiter && (
          <div className="mt-8 flex justify-center">
            <button className="action-button px-8 py-3 text-base">
              Apply for this Position
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
