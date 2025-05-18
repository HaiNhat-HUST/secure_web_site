// src/pages/Recruiter/CreateJobPostingPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromAPI } from '../api/serveAPI';
import { useAuth } from '../context/AuthContext';

const CreateJobPostingPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    job_type: 'FullTime',
    closing_date: '', // Added
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Frontend Validation Examples (align with backend)
    if (!formData.title.trim() || formData.title.trim().length < 3 || formData.title.trim().length > 100) {
      setError('Title is required and must be between 3 and 100 characters.');
      setIsLoading(false);
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 10 || formData.description.trim().length > 1000) {
      setError('Description is required and must be between 10 and 1000 characters.');
      setIsLoading(false);
      return;
    }
    if (formData.location.trim() && (formData.location.trim().length < 2 || formData.location.trim().length > 100)) {
        setError('Location, if provided, must be between 2 and 100 characters.');
        setIsLoading(false);
        return;
    }
    if (!formData.job_type) { // Should not happen with a select, but good practice
      setError('Job Type is required.');
      setIsLoading(false);
      return;
    }
    
    // Prepare data to send, ensuring empty optional fields are handled correctly
    const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        job_type: formData.job_type,
        location: formData.location.trim() || null, // Send null if empty for optional fields
        closing_date: formData.closing_date || null, // Send null if empty
    };
    // Remove null fields if backend expects them to be absent rather than null
    Object.keys(payload).forEach(key => (payload[key] === null || payload[key] === '') && delete payload[key]);


    try {
      const response = await fetchFromAPI('/api/recruiter/job-postings', token, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      
      navigate('/dashboard', { 
        state: { successMessage: `Job posting "${response.job?.title || formData.title}" created successfully!` } 
      });

    } catch (err) {
      console.error("Failed to create job posting:", err);
      setError(err.data?.message || err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Job Posting</h1>
        <p className="text-md text-gray-600">Fill in the details to publish a new job opportunity.</p>
      </header>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text" name="title" id="title" value={formData.title} onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., Senior Software Engineer" maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">3-100 characters. Allowed: letters, numbers, spaces, -_.,!?()</p>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description" id="description" value={formData.description} onChange={handleChange}
            rows="6" maxLength={1000}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Describe the role, responsibilities, and qualifications..."
          ></textarea>
           <p className="text-xs text-gray-500 mt-1">10-1000 characters.</p>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <input
            type="text" name="location" id="location" value={formData.location} onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g., New York, NY or Remote" maxLength={100}
          />
           <p className="text-xs text-gray-500 mt-1">2-100 characters if provided. Allowed: letters, numbers, spaces, -_,()</p>
        </div>

        {/* Job Type */}
        <div className="mb-4">
          <label htmlFor="job_type" className="block text-gray-700 text-sm font-bold mb-2">
            Job Type <span className="text-red-500">*</span>
          </label>
          <select
            name="job_type" id="job_type" value={formData.job_type} onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="FullTime">Full-Time</option>
            <option value="PartTime">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Closing Date (Optional) */}
        <div className="mb-6">
          <label htmlFor="closing_date" className="block text-gray-700 text-sm font-bold mb-2">
            Application Closing Date (Optional)
          </label>
          <input
            type="date" name="closing_date" id="closing_date" value={formData.closing_date} onChange={handleChange}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        {/* Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-4">
          <button type="button" onClick={() => navigate('/recruiter/dashboard')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline"
            disabled={isLoading} >
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50" >
            {isLoading ? 'Creating...' : 'Create Job Posting'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPostingPage;