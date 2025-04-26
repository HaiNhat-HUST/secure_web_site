// src/components/Profile/ProfileUpdateForm.jsx
import React, { useState, useEffect } from 'react';

function ProfileUpdateForm({ initialData, onSubmit, isUpdating }) { // Nhận isUpdating từ cha
  const [formData, setFormData] = useState({
    username: '', email: '', contact_details: '', skills: [], resume_data: '', department: ''
  });

  // Điền dữ liệu ban đầu vào form
  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '',
        contact_details: initialData.contact_details || '',
        skills: initialData.skills || [],
        resume_data: initialData.resume_data || '',
        department: initialData.department || ''
      });
    }
  }, [initialData]); // Chạy khi initialData thay đổi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prevState => ({ ...prevState, skills: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lọc payload dựa trên role từ initialData (vì form này không biết role hiện tại là gì)
    const updatePayload = {
        username: formData.username,
        email: formData.email,
        contact_details: formData.contact_details,
    };

    if (initialData?.role === 'JobSeeker') {
        updatePayload.skills = formData.skills;
        updatePayload.resume_data = formData.resume_data;
    } else if (initialData?.role === 'Recruiter') {
        updatePayload.department = formData.department;
    }
    // Admin role needs specific handling if allowed to change more fields

    // Gọi hàm onSubmit được truyền từ cha
    if (onSubmit) {
       await onSubmit(updatePayload); // Chờ xử lý xong ở component cha
    }
  };

  // --- JSX Render ---
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 md:p-8">
           <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Edit Your Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
               <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username:</label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"/>
              </div>
              {/* Email */}
               <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"/>
              </div>
              {/* Contact Details */}
               <div>
                <label htmlFor="contact_details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Details:</label>
                <textarea id="contact_details" name="contact_details" value={formData.contact_details} onChange={handleChange} rows="3" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"></textarea>
              </div>

              {/* Trường chỉ dành cho JobSeeker */}
               {initialData?.role === 'JobSeeker' && (
                 <>
                   <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills (comma-separated):</label>
                    <input type="text" id="skills" name="skills" value={formData.skills.join(', ')} onChange={handleSkillsChange} placeholder="e.g., React, Node.js" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"/>
                  </div>
                  <div>
                    <label htmlFor="resume_data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resume Link/Identifier:</label>
                    <input type="text" id="resume_data" name="resume_data" value={formData.resume_data} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"/>
                  </div>
                 </>
               )}

                {/* Trường chỉ dành cho Recruiter */}
               {initialData?.role === 'Recruiter' && (
                 <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department:</label>
                  <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"/>
                </div>
               )}

              {/* Nút Submit */}
              <div className="pt-2">
                  <button type="submit" disabled={isUpdating} className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
              </div>
            </form>
       </div>
    </div>
  );
}

export default ProfileUpdateForm; // Export component con