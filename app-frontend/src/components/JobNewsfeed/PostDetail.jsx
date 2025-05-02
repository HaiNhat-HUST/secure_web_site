import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/jobs/${jobId}`);
        setJob(response.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const applyForJob = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/api/jobs/${jobId}/apply`, {
        jobSeekerId: 1, // Replace with the logged-in user's ID
        resume,
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error applying for job:', error);
      setMessage('Failed to apply for the job.');
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-gray-700">{job.description}</p>
      <p className="text-gray-700">Location: {job.location}</p>
      <p className="text-gray-700">Type: {job.job_type}</p>
      <p className="text-gray-700">Status: {job.status}</p>

      <div className="mt-4">
        <textarea
          placeholder="Paste your resume here"
          className="border p-2 rounded w-full mb-2"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={applyForJob}
        >
          Apply
        </button>
      </div>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}