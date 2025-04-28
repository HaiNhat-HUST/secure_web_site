import apiClient from './apiClient';

/**
 * Lấy thông tin profile của user bằng ID.
 * Token được tự động thêm bởi interceptor.
 * @param {number} userId - ID của user cần lấy profile.
 * @returns {Promise<object>} Dữ liệu user profile từ API (phần user).
 * @throws {object|Error} Lỗi từ API hoặc axios.
 */
export const getUserProfile = async (userId) => {

  try {
    // Sử dụng apiClient đã cấu hình interceptor
    const response = await apiClient.get(`/api/profile/${userId}`);
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
    const response = await apiClient.patch(`/api/profile/${userId}`, updateData);
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