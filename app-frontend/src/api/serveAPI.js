// api/serveAPI.js (example structure)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchFromAPI = async (endpoint, token, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      // Throw an error object that includes status and message for better handling
      const error = new Error(errorData.message || `API Error: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    // For DELETE 204 No Content, response.json() will fail
    if (response.status === 204) {
        return { data: null, message: "Operation successful (No Content)" };
    }
    return response.json(); // Assumes API always returns JSON
  } catch (error) {
    console.error(`Error fetching from API endpoint ${endpoint}:`, error);
    throw error; // Re-throw to be caught by the calling component
  }
};