// src/api/profileApi.js
import axios from 'axios'; // Hoặc import instance axios đã cấu hình từ apiClient.js

// Cấu hình URL API cơ sở - Đặt vào file .env là tốt nhất
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// --- Tạo một instance Axios (Tùy chọn nhưng khuyến nghị) ---
// Giúp cấu hình base URL và interceptors tập trung
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Interceptor để tự động thêm Token vào Header ---
// Nó sẽ chạy trước mỗi request được gửi bởi apiClient
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
    const token = localStorage.getItem('authToken'); // Đảm bảo key lưu trữ là 'authToken' hoặc tương tự
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    config.headers['Content-Type'] = 'application/json'; // Đảm bảo content-type
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor để xử lý lỗi Response (ví dụ: 401 Unauthorized) ---
apiClient.interceptors.response.use(
  (response) => response, // Nếu thành công, trả về response
  (error) => {
    // Xử lý lỗi ở đây nếu cần (ví dụ: tự động logout khi gặp 401)
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized or Token Expired. Logging out.");
      // Gọi hàm logout global hoặc redirect về trang login
      // Ví dụ: window.location.href = '/login'; localStorage.removeItem('authToken');
    }
     // Ném lại lỗi để component có thể bắt và hiển thị thông báo
    return Promise.reject(error.response?.data || error.message || error);
  }
);


/**
 * Lấy thông tin profile của user bằng ID.
 * Token được tự động thêm bởi interceptor.
 * @param {number} userId - ID của user cần lấy profile.
 * @returns {Promise<object>} Dữ liệu user profile từ API (phần user).
 * @throws {object|Error} Lỗi từ API hoặc axios.
 */
export const getUserProfile = async (userId, token) => {

  if (!token) {
    console.error("getUserProfile called without a token.");
    throw new Error("Authentication token is required."); // Hoặc throw lỗi có cấu trúc hơn
  }

  try {
    // Sử dụng apiClient đã cấu hình interceptor
    const response = await apiClient.get(`/api/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}` // <-- Tự thêm header ở đây
      }
    });
    if (response.data && response.data.user) {
      return response.data.user;
    } else {
      throw new Error("Invalid data format received from server.");
    }
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error);
    throw error; // Ném lỗi đã được xử lý (hoặc chưa) bởi interceptor
  }
};

/**
 * Cập nhật thông tin profile của user.
 * Token được tự động thêm bởi interceptor.
 * @param {number} userId - ID của user cần cập nhật.
 * @param {object} updateData - Dữ liệu cần cập nhật (nên là snake_case nếu backend yêu cầu).
 * @returns {Promise<object>} Dữ liệu user profile đã được cập nhật từ API (phần user).
 * @throws {object|Error} Lỗi từ API hoặc axios.
 */
export const updateUserProfile = async (userId, updateData) => {
  try {
     // Sử dụng apiClient đã cấu hình interceptor
    const response = await apiClient.put(`/api/profile/${userId}`, updateData);
     if (response.data && response.data.user) {
       return response.data.user;
     } else if (response.data && response.status === 200 && response.data.message) {
         // Xử lý trường hợp update thành công nhưng chỉ trả về message (không có data user mới)
         // Quyết định: Gọi lại getUserProfile để lấy data mới nhất hoặc chỉ trả về message
         console.warn("Update successful, but no user data returned directly. Refetching might be needed.");
         // return { message: response.data.message }; // Tùy chọn trả về message
         // Hoặc tốt hơn là gọi lại getProfile từ component cha sau khi nhận tín hiệu thành công
         return { message: response.data.message, needsRefetch: true }; // Ví dụ
     } else {
       throw new Error("Invalid data format received after update.");
     }
  } catch (error) {
    console.error(`Error updating profile for user ${userId}:`, error);
    throw error; // Ném lỗi đã được xử lý (hoặc chưa) bởi interceptor
  }
};

// Export các hàm để component có thể import
// (Không cần export apiClient nếu chỉ dùng nội bộ)