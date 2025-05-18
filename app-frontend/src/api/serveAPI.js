// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL;

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
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important if your backend uses cookies/sessions
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`API Error (${response.status}) on ${endpoint}:`, errorData);
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    // Handle cases where response might be empty (e.g., 204 No Content)
    if (response.status === 204) {
        return null; 
    }
    return response.json();
  } catch (error) {
    console.error(`Network or other error on ${endpoint}:`, error);
    throw error; // Re-throw to be caught by the calling component
  }
};