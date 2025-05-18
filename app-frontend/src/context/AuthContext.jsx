import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch CSRF token
  const fetchCsrfToken = async (endpoint) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} for ${endpoint}`);
      }
      const data = await response.json();
      if (!data.csrfToken) {
        throw new Error(`CSRF token not found in ${endpoint} response`);
      }
      return data.csrfToken;
    } catch (error) {
      console.error(`Failed to fetch CSRF token from ${endpoint}:`, error);
      throw new Error('Unable to fetch CSRF token');
    }
  };

  // Fetch with CSRF token
  const fetchWithCsrf = async (url, options = {}) => {
    try {
      const csrfToken = await fetchCsrfToken('/auth/login');
      const headers = {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        ...options.headers,
      };
  
      return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    } catch (error) {
      console.error('CSRF fetch error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }

    const query = new URLSearchParams(window.location.search);
    const urlToken = query.get('token');
    
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      setToken(urlToken);
      fetchCurrentUser(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchCurrentUser = async (authToken) => {
    console.log("fetchCurrentUser called with token:", authToken);
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Get user data: ", userData);
        setCurrentUser(userData);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      setLoading(true);
      const response = await fetchWithCsrf(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetchWithCsrf(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      navigate('/login');
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const selectRole = async (role) => {
    try {
      setLoading(true);
      const response = await fetchWithCsrf(`${import.meta.env.VITE_API_URL}/auth/select-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to select role');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Role selection error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    login,
    logout,
    register,
    loginWithGoogle,
    selectRole,
    isAuthenticated: !!currentUser,
    setCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;