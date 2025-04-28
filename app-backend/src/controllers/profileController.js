// src/controllers/profile.controller.js (hoặc user.controller.js)

const UserModel = require('../models/userModel');
// Optional: Import lớp lỗi tùy chỉnh nếu bạn có
// const AppError = require('../utils/AppError');

module.exports = {
  /**
   * Lấy thông tin profile của một user dựa vào userId từ URL.
   * Controller này gọi trực tiếp Model.
   */
  async getUserProfile(req, res, next) {
    try {
      // 1. Lấy userId từ URL parameter
      const requestedUserId = parseInt(req.params.userId, 10);

      // 2. Kiểm tra tính hợp lệ cơ bản của ID (tùy chọn nhưng nên có)
      if (isNaN(requestedUserId)) {
        // Nếu dùng AppError: throw new AppError('Invalid User ID format', 400);
        return res.status(400).json({ message: 'Invalid User ID format' });
      }

      // 3. Gọi trực tiếp hàm findById từ UserModel
      console.log(`Controller fetching profile for userId: ${requestedUserId}`); // Logging
      const userProfile = await UserModel.findById(requestedUserId);

      // 4. Xử lý kết quả từ Model
      if (!userProfile) {
        console.log(`User profile not found for userId: ${requestedUserId}`); // Logging
        // Nếu dùng AppError: throw new AppError('User profile not found', 404);
        return res.status(404).json({ message: 'User profile not found' });
      }

      // 5. Gửi response thành công
      // UserModel.findById đã được thiết kế để không trả về password_hash
      console.log(`Successfully fetched profile for userId: ${requestedUserId}`); // Logging
      res.status(200).json({
        message: 'User profile retrieved successfully',
        user: userProfile
      });

    } catch (error) {
      // 6. Bắt lỗi và chuyển đến middleware xử lý lỗi tập trung
      console.error(`Error fetching profile for userId ${req.params.userId}:`, error); // Logging lỗi
      next(error); // Chuyển lỗi đi
    }
  },

  // --- Hàm updateProfile (cũng gọi model trực tiếp) ---
   async updateUserProfile(req, res, next) {
    try {
      const userIdToUpdate = parseInt(req.params.userId, 10);
      const updateData = req.body;
      const loggedInUser = req.user; // { userId, role } từ verifyToken
      console.log('Get user from request: ', loggedInUser);

      // ---- LOGIC NGHIỆP VỤ (TRỰC TIẾP TRONG CONTROLLER) ----

      // 1. Kiểm tra quyền sở hữu (CỰC KỲ QUAN TRỌNG)
      if (!loggedInUser || loggedInUser.user_id !== userIdToUpdate) {
        console.warn(`Forbidden attempt: User ${loggedInUser?.user_id} trying to update profile ${userIdToUpdate}`);
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile' });
      }

      // 2. Kiểm tra dữ liệu đầu vào cơ bản
      if (!updateData || Object.keys(updateData).length === 0) {
         return res.status(400).json({ message: 'No update data provided' });
      }

      // 3. Lọc các trường được phép cập nhật dựa trên role (Logic này giờ nằm ở đây)
      const allowedFields = {
        JobSeeker: ['display_name', 'contact_details', 'resume_data'],
        Recruiter: ['display_name', 'contact_details'],
      };
      const allowed = allowedFields[loggedInUser.role] || [];
      const filteredDataForDb = {}; // Dùng snake_case cho DB

      for (const key in updateData) {
         // Giả sử bạn cần chuyển đổi camelCase (vd: contactDetails) sang snake_case (contact_details)
         // Bạn cần một hàm helper hoặc thư viện (lodash.snakeCase)
         // const snakeKey = convertToSnakeCase(key); // Tự viết hoặc dùng thư viện
         const snakeKey = key; // TẠM THỜI GIẢ SỬ INPUT ĐÃ LÀ SNAKE_CASE

         if (allowed.includes(snakeKey)) {
           filteredDataForDb[snakeKey] = updateData[key];
         } else {
           console.warn(`User role ${loggedInUser.role} attempted to update forbidden field: ${key} (as ${snakeKey})`);
         }
      }

      if (Object.keys(filteredDataForDb).length === 0) {
        // Nếu dùng AppError: throw new AppError('No valid fields to update for your role or data provided', 400);
        return res.status(400).json({ message: 'No valid fields to update for your role or data provided'});
      }

      // ---- HẾT LOGIC NGHIỆP VỤ ----


      // 4. Gọi trực tiếp hàm update của UserModel
      console.log(`Controller updating profile for userId: ${userIdToUpdate} with data:`, filteredDataForDb);
      const affectedRows = await UserModel.update(userIdToUpdate, filteredDataForDb);

      // 5. Xử lý kết quả update
      if (affectedRows === 0) {
        // Kiểm tra xem user có thực sự tồn tại không (dù đã check ownership)
        const userExists = await UserModel.findById(userIdToUpdate);
        if (!userExists) {
             console.error(`User not found during update (though ownership check passed?) for userId: ${userIdToUpdate}`);
             // Nếu dùng AppError: throw new AppError('User profile not found', 404);
             return res.status(404).json({ message: 'User profile not found'});
        }
        // Nếu user tồn tại mà không update được => không có gì thay đổi hoặc lỗi khác
        console.log(`Update called for user ${userIdToUpdate} but no rows affected.`);
         // Có thể trả về 200 với user hiện tại hoặc lỗi tùy logic
         return res.status(200).json({ message: 'Profile update requested, but no changes were applied.', user: userExists});
      }

      // 6. Lấy lại thông tin user đã cập nhật để trả về
      const updatedUser = await UserModel.findById(userIdToUpdate);
      if (!updatedUser) {
         // Lỗi không mong muốn nếu update thành công mà không tìm lại được
         console.error(`Failed to fetch updated profile for userId: ${userIdToUpdate}`);
         // Nếu dùng AppError: throw new AppError('Could not retrieve updated profile', 500);
          return res.status(500).json({ message: 'Could not retrieve updated profile'});
      }

      console.log(`Successfully updated profile for userId: ${userIdToUpdate}`);
      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser // UserModel.findById đã bỏ hash
      });

    } catch (error) {
      console.error(`Error updating profile for userId ${req.params.userId}:`, error);
      next(error); // Chuyển lỗi đến error handler
    }
  }

  // Thêm các hàm controller khác nếu cần
};