import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [applyStatus, setApplyStatus] = useState({ loading: false, error: '', success: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Fetch job details by jobId
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        setJob(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const validateFile = useCallback((file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!file) return 'Please select a file';
    if (!allowedTypes.includes(file.type)) return 'Invalid file type. Only PDF, DOC, DOCX allowed';
    if (file.size > maxSize) return 'File too large. Maximum 5MB allowed';
    return null;
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyStatus({ loading: true, error: '', success: '' });

    const fileError = validateFile(resumeFile);
    if (fileError) {
      setApplyStatus({ loading: false, error: fileError, success: '' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Please login to apply');

      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await fetch(`/api/jobs/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (!response.ok) throw new Error('Application failed');
      
      setApplyStatus({ loading: false, error: '', success: 'Application submitted successfully!' });
      setApplyModalOpen(false);
      setResumeFile(null);
    } catch (err) {
      setApplyStatus({ loading: false, error: err.message, success: '' });
    } finally {
      setUploadProgress(0);
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.description}</p>
      <button onClick={() => setApplyModalOpen(true)}>Apply Now</button>

      {applyModalOpen && (
        <div className="modal">
          <h2>Apply for {job.title}</h2>
          <form onSubmit={handleApply}>
            <input 
              type="file" 
              onChange={(e) => setResumeFile(e.target.files[0])} 
              accept=".pdf,.doc,.docx"
            />
            <button type="submit" disabled={applyStatus.loading}>
              {applyStatus.loading ? `Uploading ${uploadProgress}%` : 'Submit Application'}
            </button>
            {applyStatus.error && <p className="error">{applyStatus.error}</p>}
            {applyStatus.success && <p className="success">{applyStatus.success}</p>}
          </form>
          <button onClick={() => setApplyModalOpen(false)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default JobDetail;