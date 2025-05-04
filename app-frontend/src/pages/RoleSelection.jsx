import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { selectRole } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelection = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!selectedRole) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      const result = await selectRole(selectedRole);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Failed to select role');
      }
    } catch (err) {
      setError('An error occurred while selecting role');
      console.error('Role selection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Select Your Role</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleRoleSelection}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedRole('JobSeeker')}>
              <input
                type="radio"
                id="jobSeeker"
                name="role"
                value="JobSeeker"
                checked={selectedRole === 'JobSeeker'}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mr-3"
              />
              <label htmlFor="jobSeeker" className="flex-1 cursor-pointer">
                <h3 className="font-medium">Job Seeker</h3>
                <p className="text-sm text-gray-600">Looking for job opportunities</p>
              </label>
            </div>

            <div className="flex items-center p-4 border rounded hover:bg-gray-50 cursor-pointer"
                 onClick={() => setSelectedRole('Recruiter')}>
              <input
                type="radio"
                id="recruiter"
                name="role"
                value="Recruiter"
                checked={selectedRole === 'Recruiter'}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mr-3"
              />
              <label htmlFor="recruiter" className="flex-1 cursor-pointer">
                <h3 className="font-medium">Recruiter</h3>
                <p className="text-sm text-gray-600">Posting job opportunities</p>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedRole}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoleSelection; 