import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The token handling is done in the AuthContext useEffect
        // If isAuthenticated becomes true, we can redirect
        if (isAuthenticated) {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
      }
    };

    handleCallback();
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback; 