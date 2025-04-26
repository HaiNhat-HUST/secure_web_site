import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          setError('No authentication token received');
          setProcessing(false);
          return;
        }

        // Token handling is done in the AuthContext useEffect
        // Wait for isAuthenticated to become true
        if (isAuthenticated) {
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        setProcessing(false);
      }
    };

    handleCallback();
  }, [isAuthenticated, navigate]);

  // If still processing after 5 seconds, show a message
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (processing) {
        setError('Taking longer than expected. Please wait or try again.');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [processing]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">{error}</div>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      ) : (
        <>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600 mb-2">Completing authentication...</p>
          <p className="text-sm text-gray-500">You will be redirected automatically</p>
        </>
      )}
    </div>
  );
};

export default AuthCallback; 