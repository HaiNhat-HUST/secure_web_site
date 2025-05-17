// src/components/Profile/Forms/ProfileDetailsFormModal.jsx
import React, { useState, useEffect, useRef } from 'react';

// Basic Modal Wrapper (same as in ExperienceFormModal, or your own)
const ModalWrapper = ({ children, title, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => { if (event.keyCode === 27) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"> {/* Increased max-w */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="Close modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

function ProfileDetailsFormModal({ isOpen, initialData, onSave, onClose, isUpdating, apiError }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    headline: '',
    summary: '',
    current_location_city: '',
    current_location_country: '',
    profile_picture_url: '', // Store URL, actual upload is more complex
    cover_image_url: '',     // Store URL
    public_email: '',
    phone_number: '',
    website_url: '',
    linkedin_profile_url: '',
    github_profile_url: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Refs for file inputs (if you were to implement actual file uploads)
  const profilePictureInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        headline: initialData.headline || '',
        summary: initialData.summary || '',
        current_location_city: initialData.current_location_city || '',
        current_location_country: initialData.current_location_country || '',
        profile_picture_url: initialData.profile_picture_url || '',
        cover_image_url: initialData.cover_image_url || '',
        public_email: initialData.public_email || '',
        phone_number: initialData.phone_number || '',
        website_url: initialData.website_url || '',
        linkedin_profile_url: initialData.linkedin_profile_url || '',
        github_profile_url: initialData.github_profile_url || ''
      });
    } else {
      // Reset for safety, though this modal is usually for editing existing details
      setFormData({
        first_name: '', last_name: '', headline: '', summary: '',
        current_location_city: '', current_location_country: '',
        profile_picture_url: '', cover_image_url: '',
        public_email: '', phone_number: '', website_url: '',
        linkedin_profile_url: '', github_profile_url: ''
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- Image Handling (Simplified: assumes URLs are entered/pasted) ---
  // For actual file uploads, you'd need:
  // 1. <input type="file">
  // 2. State to hold the File object(s).
  // 3. A function to handle file selection (onChange for file input).
  // 4. Logic in handleSubmit to upload the file (e.g., FormData with multipart/form-data)
  //    to a dedicated backend endpoint. This endpoint would return the URL of the uploaded image.
  // 5. Then, you'd save that URL with the rest of the profile data.
  // This example just allows pasting URLs for simplicity.

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'First name is required.';
    if (!formData.last_name.trim()) errors.last_name = 'Last name is required.';
    if (formData.public_email && !/\S+@\S+\.\S+/.test(formData.public_email)) {
        errors.public_email = 'Invalid email format.';
    }
    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
        errors.website_url = 'Invalid URL format (e.g., http://example.com).';
    }
    // Add more specific validations
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Here, you would handle file uploads if implemented.
    // For this example, we assume formData contains URLs directly.
    await onSave(formData);
  };

  if (!isOpen) return null;

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorClass = "text-red-500 text-xs mt-1";
  const sectionTitleClass = "text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 pt-4 border-t border-gray-200 dark:border-gray-700 first:border-t-0 first:pt-0";


  return (
    <ModalWrapper title="Edit Profile Details" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced space-y */}
        {apiError && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                Error: {apiError}
            </div>
        )}

        <h4 className={sectionTitleClass}>Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className={labelClass}>First Name*</label>
            <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange} className={`${inputClass} ${formErrors.first_name ? 'border-red-500' : ''}`} />
            {formErrors.first_name && <p className={errorClass}>{formErrors.first_name}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className={labelClass}>Last Name*</label>
            <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange} className={`${inputClass} ${formErrors.last_name ? 'border-red-500' : ''}`} />
            {formErrors.last_name && <p className={errorClass}>{formErrors.last_name}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="headline" className={labelClass}>Headline</label>
          <input type="text" name="headline" id="headline" value={formData.headline} onChange={handleChange} className={inputClass} placeholder="e.g., Software Engineer at Acme Corp" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="current_location_city" className={labelClass}>Current City</label>
                <input type="text" name="current_location_city" id="current_location_city" value={formData.current_location_city} onChange={handleChange} className={inputClass} />
            </div>
            <div>
                <label htmlFor="current_location_country" className={labelClass}>Current Country</label>
                <input type="text" name="current_location_country" id="current_location_country" value={formData.current_location_country} onChange={handleChange} className={inputClass} />
            </div>
        </div>

        <h4 className={sectionTitleClass}>About</h4>
        <div>
          <label htmlFor="summary" className={labelClass}>Summary</label>
          <textarea name="summary" id="summary" rows="5" value={formData.summary} onChange={handleChange} className={inputClass}></textarea>
        </div>

        <h4 className={sectionTitleClass}>Profile Images (Enter URLs)</h4>
        <div className="space-y-4">
            <div>
                <label htmlFor="profile_picture_url" className={labelClass}>Profile Picture URL</label>
                <input type="url" name="profile_picture_url" id="profile_picture_url" value={formData.profile_picture_url} onChange={handleChange} className={inputClass} placeholder="https://example.com/avatar.jpg"/>
                {/* For actual file upload: <input type="file" ref={profilePictureInputRef} onChange={handleProfilePictureChange} /> */}
            </div>
            <div>
                <label htmlFor="cover_image_url" className={labelClass}>Cover Image URL</label>
                <input type="url" name="cover_image_url" id="cover_image_url" value={formData.cover_image_url} onChange={handleChange} className={inputClass} placeholder="https://example.com/cover.jpg"/>
            </div>
        </div>

        <h4 className={sectionTitleClass}>Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="public_email" className={labelClass}>Public Email</label>
                <input type="email" name="public_email" id="public_email" value={formData.public_email} onChange={handleChange} className={`${inputClass} ${formErrors.public_email ? 'border-red-500' : ''}`} />
                {formErrors.public_email && <p className={errorClass}>{formErrors.public_email}</p>}
            </div>
            <div>
                <label htmlFor="phone_number" className={labelClass}>Phone Number</label>
                <input type="tel" name="phone_number" id="phone_number" value={formData.phone_number} onChange={handleChange} className={inputClass} />
            </div>
        </div>
        <div>
            <label htmlFor="website_url" className={labelClass}>Website URL</label>
            <input type="url" name="website_url" id="website_url" value={formData.website_url} onChange={handleChange} className={`${inputClass} ${formErrors.website_url ? 'border-red-500' : ''}`} placeholder="https://yourportfolio.com" />
            {formErrors.website_url && <p className={errorClass}>{formErrors.website_url}</p>}
        </div>

        <h4 className={sectionTitleClass}>Social Profiles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="linkedin_profile_url" className={labelClass}>LinkedIn Profile URL</label>
                <input type="url" name="linkedin_profile_url" id="linkedin_profile_url" value={formData.linkedin_profile_url} onChange={handleChange} className={inputClass} placeholder="https://linkedin.com/in/yourprofile" />
            </div>
            <div>
                <label htmlFor="github_profile_url" className={labelClass}>GitHub Profile URL</label>
                <input type="url" name="github_profile_url" id="github_profile_url" value={formData.github_profile_url} onChange={handleChange} className={inputClass} placeholder="https://github.com/yourusername" />
            </div>
        </div>


        <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default ProfileDetailsFormModal;