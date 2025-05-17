// src/components/Profile/Forms/EducationFormModal.jsx
import React, { useState, useEffect } from 'react';

// Basic Modal Wrapper (same as before, or your own)
const ModalWrapper = ({ children, title, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => { if (event.keyCode === 27) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
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


function EducationFormModal({ isOpen, initialData, onSave, onClose, isUpdating, apiError }) {
  const [formData, setFormData] = useState({
    school_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_current_study: false, // Helper for UI, backend might not need it if end_date is null
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        school_name: initialData.school_name || '',
        degree: initialData.degree || '',
        field_of_study: initialData.field_of_study || '',
        start_date: initialData.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
        end_date: initialData.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
        is_current_study: !initialData.end_date && !!initialData.start_date, // Infer if currently studying
        description: initialData.description || ''
      });
    } else {
      // Reset for 'add new'
      setFormData({
        school_name: '', degree: '', field_of_study: '',
        start_date: '', end_date: '', is_current_study: false, description: ''
      });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleCurrentStudyChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      is_current_study: checked,
      end_date: checked ? '' : prev.end_date
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.school_name.trim()) errors.school_name = 'School name is required.';
    // Degree and Field of Study might be optional depending on requirements
    // if (!formData.degree.trim()) errors.degree = 'Degree is required.';
    // if (!formData.field_of_study.trim()) errors.field_of_study = 'Field of study is required.';

    if (formData.start_date && formData.end_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      errors.end_date = 'End date cannot be before start date.';
    }
    // If not currently studying and start date is present, end date might be required
    if (!formData.is_current_study && formData.start_date && !formData.end_date) {
        // errors.end_date = 'End date is required if not currently studying.';
        // This validation can be subjective. Sometimes users list education without exact end dates.
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      end_date: formData.is_current_study || !formData.end_date ? null : formData.end_date,
    };
    // Remove the UI-only helper field if backend doesn't expect it
    delete payload.is_current_study;

    await onSave(payload);
  };

  if (!isOpen) return null;

  const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <ModalWrapper title={initialData ? 'Edit Education' : 'Add Education'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {apiError && (
            <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded">
                Error: {apiError}
            </div>
        )}

        <div>
          <label htmlFor="school_name" className={labelClass}>School Name*</label>
          <input type="text" name="school_name" id="school_name" value={formData.school_name} onChange={handleChange} className={`${inputClass} ${formErrors.school_name ? 'border-red-500' : ''}`} />
          {formErrors.school_name && <p className={errorClass}>{formErrors.school_name}</p>}
        </div>

        <div>
          <label htmlFor="degree" className={labelClass}>Degree</label>
          <input type="text" name="degree" id="degree" value={formData.degree} onChange={handleChange} className={`${inputClass} ${formErrors.degree ? 'border-red-500' : ''}`} placeholder="e.g., Bachelor of Science"/>
          {formErrors.degree && <p className={errorClass}>{formErrors.degree}</p>}
        </div>

        <div>
          <label htmlFor="field_of_study" className={labelClass}>Field of Study</label>
          <input type="text" name="field_of_study" id="field_of_study" value={formData.field_of_study} onChange={handleChange} className={`${inputClass} ${formErrors.field_of_study ? 'border-red-500' : ''}`} placeholder="e.g., Computer Science" />
          {formErrors.field_of_study && <p className={errorClass}>{formErrors.field_of_study}</p>}
        </div>

        <div className="flex items-center">
          <input type="checkbox" name="is_current_study" id="is_current_study" checked={formData.is_current_study} onChange={handleCurrentStudyChange} className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500" />
          <label htmlFor="is_current_study" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">I am currently studying here</label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="start_date" className={labelClass}>Start Date</label>
            <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} className={`${inputClass} ${formErrors.start_date ? 'border-red-500' : ''}`} />
            {formErrors.start_date && <p className={errorClass}>{formErrors.start_date}</p>}
          </div>
          {!formData.is_current_study && (
            <div>
              <label htmlFor="end_date" className={labelClass}>End Date</label>
              <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} className={`${inputClass} ${formErrors.end_date ? 'border-red-500' : ''}`} disabled={formData.is_current_study} />
              {formErrors.end_date && <p className={errorClass}>{formErrors.end_date}</p>}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description (Optional)</label>
          <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} className={inputClass} placeholder="e.g., Activities, societies, honors, GPA (if desired)"></textarea>
        </div>

        <div className="pt-2 flex justify-end space-x-3">
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
            {isUpdating ? (initialData ? 'Saving...' : 'Adding...') : (initialData ? 'Save Changes' : 'Add Education')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

export default EducationFormModal;