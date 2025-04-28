import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Interceptor để tự động thêm Token ---
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Lấy token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Thêm header
    }
    // Luôn đặt Content-Type cho các request có body (PUT, POST, PATCH)
    if (['put', 'post', 'patch'].includes(config.method)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('Interceptor adding token:', token ? 'Yes' : 'No'); // Log để debug
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor xử lý lỗi response (vẫn hữu ích) ---
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // ... xử lý lỗi 401 ...
    return Promise.reject(error.response?.data || error.message || error);
  }
);

export default apiClient; // Export instance đã cấu hình