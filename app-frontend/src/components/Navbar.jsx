import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated, loading } = useAuth();

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          {import.meta.env.VITE_APP_NAME || 'Secure Job Site'}
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Public links */}
          <Link to="/newfeed" className="hover:text-gray-300">
            New Feed
          </Link>
          
          {/* Auth-dependent links */}
          {loading ? (
            <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/profile" className="hover:text-gray-300">
                Profile
              </Link>
              <div className="flex items-center ml-4">
                {currentUser?.profile_picture && (
                  <img 
                    src={currentUser.profile_picture} 
                    alt="Profile" 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <span className="mr-2">
                  {currentUser?.display_name || currentUser?.username}
                </span>
                <button 
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 