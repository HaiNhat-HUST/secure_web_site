import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading, token, currentUser, logout } = useAuth();
  const location = useLocation();

  // Check for token expiration
  useEffect(() => {
    if (token) {
      try {
        // Check if token is expired (JWT has 3 parts separated by dots)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('Invalid token format');
          logout();
          return;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();

        if (expirationTime < currentTime) {
          console.log('Token expired, logging out');
          logout();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        logout();
      }
    }
  }, [token, logout]);

  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // Check if user has a role assigned
  if (currentUser && currentUser.role === null) {
    return <Navigate to="/select-role" state={{ from: location.pathname }} />;
  }

  // Render the protected content
  return <Outlet />;
};

export default ProtectedRoute; 